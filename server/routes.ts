import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { registerSchema, loginSchema, insertReleaseSchema, insertTicketSchema, insertTicketMessageSchema } from "@shared/schema";
import { z } from "zod";
import connectPgSimple from "connect-pg-simple";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

function requireApproved(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  storage.getUser(req.session.userId).then(user => {
    if (!user || !user.isApproved) {
      return res.status(403).json({ message: "Account not approved" });
    }
    next();
  });
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  storage.getUser(req.session.userId).then(user => {
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const PgStore = connectPgSimple(session);
  app.use(session({
    store: new PgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "raw-archives-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  }));

  // ==================== AUTH ====================
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const data = registerSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(data.username);
      if (existingUser) return res.status(400).json({ message: "Username already taken" });
      const existingEmail = await storage.getUserByEmail(data.email);
      if (existingEmail) return res.status(400).json({ message: "Email already registered" });

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await storage.createUser({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        fullName: data.fullName,
        labelName: data.labelName || null,
        role: "artist",
        country: data.country || null,
        timezone: data.timezone || null,
      });
      await storage.createApplication(user.id);
      res.json({ message: "Application submitted. Awaiting admin approval." });
    } catch (e: any) {
      if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors[0].message });
      res.status(500).json({ message: e.message });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const data = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(data.username);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      const validPassword = await bcrypt.compare(data.password, user.password);
      if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

      req.session.userId = user.id;
      const { password, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (e: any) {
      if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors[0].message });
      res.status(500).json({ message: e.message });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    if (!req.session.userId) return res.status(401).json({ message: "Not authenticated" });
    const user = await storage.getUser(req.session.userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    const { password, ...safeUser } = user;
    res.json({ user: safeUser });
  });

  // ==================== RELEASES ====================
  app.get("/api/releases", requireApproved, async (req: Request, res: Response) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) return res.status(401).json({ message: "Not found" });
    const rels = user.role === "admin" || user.role === "label_manager"
      ? await storage.getAllReleases()
      : await storage.getReleasesByUser(user.id);
    res.json(rels);
  });

  app.get("/api/releases/:id", requireApproved, async (req: Request, res: Response) => {
    const release = await storage.getRelease(parseInt(req.params.id));
    if (!release) return res.status(404).json({ message: "Not found" });
    const user = await storage.getUser(req.session.userId!);
    if (user!.role === "artist" && release.userId !== user!.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    const relTracks = await storage.getTracksByRelease(release.id);
    res.json({ ...release, tracks: relTracks });
  });

  app.post("/api/releases", requireApproved, async (req: Request, res: Response) => {
    try {
      const data = insertReleaseSchema.parse(req.body);
      const release = await storage.createRelease({
        userId: req.session.userId!,
        title: data.title,
        version: data.version || null,
        primaryArtist: data.primaryArtist,
        releaseType: data.releaseType,
        genre: data.genre,
        language: data.language,
        releaseDate: data.releaseDate,
        coverArtUrl: data.coverArtUrl || null,
        dsps: data.dsps,
      });
      for (const t of data.tracks) {
        await storage.createTrack({
          releaseId: release.id,
          title: t.title,
          trackNumber: t.trackNumber,
          isExplicit: t.isExplicit,
          audioFileName: t.audioFileName,
          duration: t.duration || null,
        });
      }
      res.json(release);
    } catch (e: any) {
      if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors[0].message });
      res.status(500).json({ message: e.message });
    }
  });

  // Admin: approve/reject releases
  app.patch("/api/admin/releases/:id", requireAdmin, async (req: Request, res: Response) => {
    const { status, rejectionReason } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (status === "rejected" && !rejectionReason) {
      return res.status(400).json({ message: "Rejection reason required" });
    }
    const release = await storage.updateRelease(parseInt(req.params.id), {
      status,
      rejectionReason: rejectionReason || null,
    });
    res.json(release);
  });

  // ==================== APPLICATIONS (Admin) ====================
  app.get("/api/admin/applications", requireAdmin, async (_req: Request, res: Response) => {
    const apps = await storage.getAllApplications();
    res.json(apps);
  });

  app.patch("/api/admin/applications/:id", requireAdmin, async (req: Request, res: Response) => {
    const { status, rejectionReason } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const application = await storage.getApplication(parseInt(req.params.id));
    if (!application) return res.status(404).json({ message: "Not found" });

    await storage.updateApplication(application.id, {
      status,
      rejectionReason: status === "rejected" ? rejectionReason : null,
      reviewedAt: new Date(),
    });

    if (status === "approved") {
      await storage.updateUser(application.userId, { isApproved: true });
    }
    res.json({ message: `Application ${status}` });
  });

  // ==================== USERS (Admin) ====================
  app.get("/api/admin/users", requireAdmin, async (_req: Request, res: Response) => {
    const allUsers = await storage.getAllUsers();
    const safeUsers = allUsers.map(({ password, ...u }) => u);
    res.json(safeUsers);
  });

  app.patch("/api/admin/users/:id", requireAdmin, async (req: Request, res: Response) => {
    const { role, isApproved } = req.body;
    const updates: any = {};
    if (role) updates.role = role;
    if (typeof isApproved === "boolean") updates.isApproved = isApproved;
    const user = await storage.updateUser(parseInt(req.params.id), updates);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { password, ...safeUser } = user;
    res.json(safeUser);
  });

  app.delete("/api/admin/users/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.deleteUser(parseInt(req.params.id));
    res.json({ message: "User deleted" });
  });

  // ==================== TICKETS ====================
  app.get("/api/tickets", requireApproved, async (req: Request, res: Response) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) return res.status(401).json({ message: "Not found" });
    const tix = user.role === "admin"
      ? await storage.getAllTickets()
      : await storage.getTicketsByUser(user.id);
    res.json(tix);
  });

  app.post("/api/tickets", requireApproved, async (req: Request, res: Response) => {
    try {
      const data = insertTicketSchema.parse(req.body);
      const ticket = await storage.createTicket({ userId: req.session.userId!, subject: data.subject });
      await storage.createTicketMessage({ ticketId: ticket.id, userId: req.session.userId!, message: data.message });
      res.json(ticket);
    } catch (e: any) {
      if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors[0].message });
      res.status(500).json({ message: e.message });
    }
  });

  app.get("/api/tickets/:id", requireApproved, async (req: Request, res: Response) => {
    const ticket = await storage.getTicket(parseInt(req.params.id));
    if (!ticket) return res.status(404).json({ message: "Not found" });
    const user = await storage.getUser(req.session.userId!);
    if (user!.role !== "admin" && ticket.userId !== user!.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    const messages = await storage.getMessagesByTicket(ticket.id);
    res.json({ ...ticket, messages });
  });

  app.post("/api/tickets/:id/messages", requireApproved, async (req: Request, res: Response) => {
    try {
      const data = insertTicketMessageSchema.parse(req.body);
      const ticket = await storage.getTicket(parseInt(req.params.id));
      if (!ticket) return res.status(404).json({ message: "Not found" });
      const user = await storage.getUser(req.session.userId!);
      if (user!.role !== "admin" && ticket.userId !== user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      const msg = await storage.createTicketMessage({ ticketId: ticket.id, userId: req.session.userId!, message: data.message });
      res.json(msg);
    } catch (e: any) {
      if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors[0].message });
      res.status(500).json({ message: e.message });
    }
  });

  app.patch("/api/admin/tickets/:id", requireAdmin, async (req: Request, res: Response) => {
    const { status } = req.body;
    if (!["open", "in_progress", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const ticket = await storage.updateTicket(parseInt(req.params.id), { status });
    res.json(ticket);
  });

  // ==================== ADMIN: ALL RELEASES ====================
  app.get("/api/admin/releases", requireAdmin, async (_req: Request, res: Response) => {
    const rels = await storage.getAllReleases();
    res.json(rels);
  });

  return httpServer;
}
