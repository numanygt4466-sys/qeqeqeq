import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";
import { storage } from "./storage";
import { registerSchema, loginSchema, insertReleaseSchema, insertTicketSchema, insertTicketMessageSchema, insertPayoutMethodSchema, insertPayoutRequestSchema, insertNewsPostSchema } from "@shared/schema";
import { z } from "zod";
import connectPgSimple from "connect-pg-simple";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

function paramId(param: string | string[]): number {
  return parseInt(Array.isArray(param) ? param[0] : param);
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
    if (!user || user.role !== "label_manager") {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  });
}

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(path.join(uploadDir, "audio"))) fs.mkdirSync(path.join(uploadDir, "audio"), { recursive: true });
if (!fs.existsSync(path.join(uploadDir, "covers"))) fs.mkdirSync(path.join(uploadDir, "covers"), { recursive: true });

const audioUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.join(uploadDir, "audio")),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  fileFilter: (_req, file, cb) => {
    const allowed = [".wav"];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
  limits: { fileSize: 200 * 1024 * 1024 },
});

const coverUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.join(uploadDir, "covers")),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
  limits: { fileSize: 20 * 1024 * 1024 },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.set("trust proxy", 1);

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
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  }));

  app.use("/uploads", express.static(uploadDir));

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
      await storage.createApplication(user.id, {
        spotifyLink: data.spotifyLink,
        catalogSize: data.catalogSize,
        currentRevenue: data.currentRevenue,
      });
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
      if (!user) return res.status(401).json({ message: "Incorrect username or password" });
      const validPassword = await bcrypt.compare(data.password, user.password);
      if (!validPassword) return res.status(401).json({ message: "Incorrect username or password" });

      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) return res.status(500).json({ message: "Session error" });
        const { password, ...safeUser } = user;
        res.json({ user: safeUser });
      });
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

  // ==================== FILE UPLOADS ====================
  app.post("/api/upload/audio", requireApproved, audioUpload.single("audio"), (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ message: "No audio file uploaded or invalid format. WAV files only (16-bit, 44.1kHz)." });
    res.json({ url: `/uploads/audio/${req.file.filename}`, fileName: req.file.originalname });
  });

  app.post("/api/upload/cover", requireApproved, coverUpload.single("cover"), (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ message: "No cover image uploaded or invalid format. Use JPG or PNG." });
    res.json({ url: `/uploads/covers/${req.file.filename}`, fileName: req.file.originalname });
  });

  // ==================== DSPs ====================
  app.get("/api/dsps", requireApproved, async (_req: Request, res: Response) => {
    const dspList = await storage.getEnabledDsps();
    res.json(dspList);
  });

  app.get("/api/admin/dsps", requireAdmin, async (_req: Request, res: Response) => {
    const dspList = await storage.getDsps();
    res.json(dspList);
  });

  app.patch("/api/admin/dsps/:id", requireAdmin, async (req: Request, res: Response) => {
    const { enabled } = req.body;
    if (typeof enabled !== "boolean") return res.status(400).json({ message: "enabled must be boolean" });
    const dsp = await storage.updateDsp(paramId(req.params.id), { enabled });
    res.json(dsp);
  });

  // ==================== RELEASES ====================
  app.get("/api/releases", requireApproved, async (req: Request, res: Response) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) return res.status(401).json({ message: "Not found" });
    const rels = user.role === "label_manager" || user.role === "ar"
      ? await storage.getAllReleases()
      : await storage.getReleasesByUser(user.id);
    const result = [];
    for (const r of rels) {
      const dspIds = await storage.getReleaseDspIds(r.id);
      const trackList = await storage.getTracksByRelease(r.id);
      result.push({ ...r, dspIds, trackCount: trackList.length });
    }
    res.json(result);
  });

  app.get("/api/releases/:id", requireApproved, async (req: Request, res: Response) => {
    const release = await storage.getRelease(paramId(req.params.id));
    if (!release) return res.status(404).json({ message: "Not found" });
    const user = await storage.getUser(req.session.userId!);
    if (user!.role === "artist" && release.userId !== user!.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    const relTracks = await storage.getTracksByRelease(release.id);
    const dspIds = await storage.getReleaseDspIds(release.id);
    res.json({ ...release, tracks: relTracks, dspIds });
  });

  app.post("/api/releases", requireApproved, async (req: Request, res: Response) => {
    try {
      const data = insertReleaseSchema.parse(req.body);
      if (!data.coverArtUrl) return res.status(400).json({ message: "Cover art is required" });
      for (const t of data.tracks) {
        if (!t.audioUrl) return res.status(400).json({ message: `Audio file required for track: ${t.title}` });
      }
      const release = await storage.createRelease({
        userId: req.session.userId!,
        title: data.title,
        version: data.version || null,
        primaryArtist: data.primaryArtist,
        releaseType: data.releaseType,
        genre: data.genre,
        language: data.language,
        releaseDate: data.releaseDate,
        coverArtUrl: data.coverArtUrl,
        upc: data.upc || null,
        catalogNumber: data.catalogNumber || null,
      });
      for (const t of data.tracks) {
        await storage.createTrack({
          releaseId: release.id,
          title: t.title,
          trackNumber: t.trackNumber,
          isExplicit: t.isExplicit,
          audioUrl: t.audioUrl,
          audioFileName: t.audioFileName,
          duration: t.duration || null,
          isrc: t.isrc || null,
        });
      }
      await storage.setReleaseDsps(release.id, data.dspIds);
      res.json(release);
    } catch (e: any) {
      if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors[0].message });
      res.status(500).json({ message: e.message });
    }
  });

  // ==================== APPLICATIONS (Admin) ====================
  app.get("/api/admin/applications", requireAdmin, async (_req: Request, res: Response) => {
    const apps = await storage.getAllApplications();
    res.json(apps);
  });

  app.patch("/api/admin/applications/:id", requireAdmin, async (req: Request, res: Response) => {
    const { status, rejectionReason, notes } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (status === "rejected" && !rejectionReason) {
      return res.status(400).json({ message: "Rejection reason required" });
    }
    const application = await storage.getApplication(paramId(req.params.id));
    if (!application) return res.status(404).json({ message: "Not found" });

    await storage.updateApplication(application.id, {
      status,
      rejectionReason: status === "rejected" ? rejectionReason : null,
      notes: notes || null,
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
    const { role, isApproved, fullName, email, labelName, country, timezone } = req.body;
    const updates: any = {};
    if (role) updates.role = role;
    if (typeof isApproved === "boolean") updates.isApproved = isApproved;
    if (fullName) updates.fullName = fullName;
    if (email) updates.email = email;
    if (labelName !== undefined) updates.labelName = labelName;
    if (country !== undefined) updates.country = country;
    if (timezone !== undefined) updates.timezone = timezone;
    const user = await storage.updateUser(paramId(req.params.id), updates);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { password, ...safeUser } = user;
    res.json(safeUser);
  });

  app.post("/api/admin/users/:id/reset-password", requireAdmin, async (req: Request, res: Response) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 3) return res.status(400).json({ message: "Password must be at least 3 characters" });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await storage.updateUser(paramId(req.params.id), { password: hashedPassword });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Password reset successfully" });
  });

  app.delete("/api/admin/users/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.deleteUser(paramId(req.params.id));
    res.json({ message: "User deleted" });
  });

  // ==================== ADMIN RELEASES ====================
  app.get("/api/admin/releases", requireAdmin, async (_req: Request, res: Response) => {
    const rels = await storage.getAllReleases();
    const result = [];
    for (const r of rels) {
      const dspIds = await storage.getReleaseDspIds(r.id);
      const trackList = await storage.getTracksByRelease(r.id);
      const user = await storage.getUser(r.userId);
      result.push({ ...r, dspIds, tracks: trackList, user: user ? (() => { const { password, ...s } = user; return s; })() : undefined });
    }
    res.json(result);
  });

  app.put("/api/admin/releases/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = paramId(req.params.id);
      const release = await storage.getRelease(id);
      if (!release) return res.status(404).json({ message: "Release not found" });
      const { title, primaryArtist, releaseType, genre, language, releaseDate, coverArtUrl, version, status, rejectionReason, upc, catalogNumber, tracks: trackData, dspIds } = req.body;
      const updates: any = {};
      if (title) updates.title = title;
      if (primaryArtist) updates.primaryArtist = primaryArtist;
      if (releaseType) updates.releaseType = releaseType;
      if (genre) updates.genre = genre;
      if (language) updates.language = language;
      if (releaseDate) updates.releaseDate = releaseDate;
      if (coverArtUrl) updates.coverArtUrl = coverArtUrl;
      if (version !== undefined) updates.version = version;
      if (status) updates.status = status;
      if (rejectionReason !== undefined) updates.rejectionReason = rejectionReason;
      if (upc !== undefined) updates.upc = upc;
      if (catalogNumber !== undefined) updates.catalogNumber = catalogNumber;

      if (status === "rejected" && !rejectionReason) {
        return res.status(400).json({ message: "Rejection reason required" });
      }

      const updated = await storage.updateRelease(id, updates);
      if (dspIds && Array.isArray(dspIds)) {
        await storage.setReleaseDsps(id, dspIds);
      }
      if (trackData && Array.isArray(trackData)) {
        await storage.deleteTracksByRelease(id);
        for (const t of trackData) {
          await storage.createTrack({
            releaseId: id,
            title: t.title,
            trackNumber: t.trackNumber,
            isExplicit: t.isExplicit || false,
            audioUrl: t.audioUrl || null,
            audioFileName: t.audioFileName || null,
            duration: t.duration || null,
            isrc: t.isrc || null,
          });
        }
      }
      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.patch("/api/admin/releases/:id", requireAdmin, async (req: Request, res: Response) => {
    const { status, rejectionReason } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (status === "rejected" && !rejectionReason) {
      return res.status(400).json({ message: "Rejection reason required" });
    }
    const release = await storage.updateRelease(paramId(req.params.id), {
      status,
      rejectionReason: rejectionReason || null,
    });
    res.json(release);
  });

  // ==================== PAYOUTS ====================
  app.get("/api/payout-methods", requireApproved, async (req: Request, res: Response) => {
    const methods = await storage.getPayoutMethodsByUser(req.session.userId!);
    res.json(methods);
  });

  app.post("/api/payout-methods", requireApproved, async (req: Request, res: Response) => {
    try {
      const data = insertPayoutMethodSchema.parse(req.body);
      const method = await storage.createPayoutMethod({
        userId: req.session.userId!,
        type: data.type,
        details: data.details,
      });
      res.json(method);
    } catch (e: any) {
      if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors[0].message });
      res.status(500).json({ message: e.message });
    }
  });

  app.get("/api/payouts", requireApproved, async (req: Request, res: Response) => {
    const requests = await storage.getPayoutRequestsByUser(req.session.userId!);
    res.json(requests);
  });

  app.post("/api/payouts", requireApproved, async (req: Request, res: Response) => {
    try {
      const data = insertPayoutRequestSchema.parse(req.body);
      const method = await storage.getPayoutMethod(data.methodId);
      if (!method || method.userId !== req.session.userId!) {
        return res.status(400).json({ message: "Invalid payout method" });
      }
      if (method.status !== "approved") {
        return res.status(400).json({ message: "Payout method not yet approved" });
      }
      const balance = await storage.getUserBalance(req.session.userId!);
      if (balance < 50) {
        return res.status(400).json({ message: "Minimum payout amount is $50" });
      }
      if (data.amount > balance) {
        return res.status(400).json({ message: `Insufficient balance. Available: $${balance.toFixed(2)}` });
      }
      const payout = await storage.createPayoutRequest({
        userId: req.session.userId!,
        methodId: data.methodId,
        amount: data.amount.toString(),
      });
      res.json(payout);
    } catch (e: any) {
      if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors[0].message });
      res.status(500).json({ message: e.message });
    }
  });

  app.get("/api/balance", requireApproved, async (req: Request, res: Response) => {
    const balance = await storage.getUserBalance(req.session.userId!);
    res.json({ balance });
  });

  app.get("/api/earnings", requireApproved, async (req: Request, res: Response) => {
    const earningsList = await storage.getEarningsByUser(req.session.userId!);
    res.json(earningsList);
  });

  // ==================== ADMIN PAYOUTS ====================
  app.get("/api/admin/payout-methods", requireAdmin, async (_req: Request, res: Response) => {
    const methods = await storage.getAllPayoutMethods();
    res.json(methods);
  });

  app.patch("/api/admin/payout-methods/:id", requireAdmin, async (req: Request, res: Response) => {
    const { status, rejectionReason } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (status === "rejected" && !rejectionReason) {
      return res.status(400).json({ message: "Rejection reason required" });
    }
    const method = await storage.updatePayoutMethod(paramId(req.params.id), {
      status,
      rejectionReason: status === "rejected" ? rejectionReason : null,
      reviewedAt: new Date(),
    });
    res.json(method);
  });

  app.get("/api/admin/payouts", requireAdmin, async (_req: Request, res: Response) => {
    const requests = await storage.getAllPayoutRequests();
    res.json(requests);
  });

  app.patch("/api/admin/payouts/:id", requireAdmin, async (req: Request, res: Response) => {
    const { status, rejectionReason } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (status === "rejected" && !rejectionReason) {
      return res.status(400).json({ message: "Rejection reason required" });
    }
    const payout = await storage.updatePayoutRequest(paramId(req.params.id), {
      status,
      rejectionReason: status === "rejected" ? rejectionReason : null,
      reviewedAt: new Date(),
    });
    res.json(payout);
  });

  // ==================== ADMIN SETTINGS ====================
  app.get("/api/admin/settings", requireAdmin, async (_req: Request, res: Response) => {
    const settings = await storage.getAllSettings();
    res.json(settings);
  });

  app.put("/api/admin/settings", requireAdmin, async (req: Request, res: Response) => {
    const { key, value } = req.body;
    if (!key || !value) return res.status(400).json({ message: "Key and value required" });
    await storage.setSetting(key, value);
    res.json({ message: "Setting updated" });
  });

  // ==================== TICKETS ====================
  app.get("/api/tickets", requireApproved, async (req: Request, res: Response) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) return res.status(401).json({ message: "Not found" });
    const tix = user.role === "label_manager"
      ? await storage.getAllTickets()
      : await storage.getTicketsByUser(user.id);
    res.json(tix);
  });

  app.post("/api/tickets", requireApproved, async (req: Request, res: Response) => {
    try {
      const data = insertTicketSchema.parse(req.body);
      const ticket = await storage.createTicket({ userId: req.session.userId!, subject: data.subject, priority: data.priority || "normal" });
      await storage.createTicketMessage({ ticketId: ticket.id, userId: req.session.userId!, message: data.message });
      res.json(ticket);
    } catch (e: any) {
      if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors[0].message });
      res.status(500).json({ message: e.message });
    }
  });

  app.get("/api/tickets/:id", requireApproved, async (req: Request, res: Response) => {
    const ticket = await storage.getTicket(paramId(req.params.id));
    if (!ticket) return res.status(404).json({ message: "Not found" });
    const user = await storage.getUser(req.session.userId!);
    if (user!.role !== "label_manager" && ticket.userId !== user!.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    const messages = await storage.getMessagesByTicket(ticket.id);
    res.json({ ...ticket, messages });
  });

  app.post("/api/tickets/:id/messages", requireApproved, async (req: Request, res: Response) => {
    try {
      const data = insertTicketMessageSchema.parse(req.body);
      const ticket = await storage.getTicket(paramId(req.params.id));
      if (!ticket) return res.status(404).json({ message: "Not found" });
      const user = await storage.getUser(req.session.userId!);
      if (user!.role !== "label_manager" && ticket.userId !== user!.id) {
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
    const ticket = await storage.updateTicket(paramId(req.params.id), { status, updatedAt: new Date() });
    res.json(ticket);
  });

  app.get("/api/admin/tickets", requireAdmin, async (_req: Request, res: Response) => {
    const tix = await storage.getAllTickets();
    res.json(tix);
  });

  // ==================== NEWS POSTS ====================
  app.get("/api/news", async (_req: Request, res: Response) => {
    const posts = await storage.getPublishedNewsPosts();
    res.json(posts);
  });

  app.get("/api/admin/news", requireAdmin, async (_req: Request, res: Response) => {
    const posts = await storage.getAllNewsPosts();
    res.json(posts);
  });

  app.get("/api/admin/news/:id", requireAdmin, async (req: Request, res: Response) => {
    const post = await storage.getNewsPost(paramId(req.params.id));
    if (!post) return res.status(404).json({ message: "Not found" });
    res.json(post);
  });

  app.post("/api/admin/news", requireAdmin, async (req: Request, res: Response) => {
    try {
      const data = insertNewsPostSchema.parse(req.body);
      const post = await storage.createNewsPost({
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || null,
        status: data.status || "draft",
        authorId: req.session.userId!,
      });
      res.json(post);
    } catch (e: any) {
      if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors[0].message });
      res.status(500).json({ message: e.message });
    }
  });

  app.put("/api/admin/news/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const data = insertNewsPostSchema.parse(req.body);
      const post = await storage.updateNewsPost(paramId(req.params.id), {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || null,
        status: data.status || "draft",
      });
      if (!post) return res.status(404).json({ message: "Not found" });
      res.json(post);
    } catch (e: any) {
      if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors[0].message });
      res.status(500).json({ message: e.message });
    }
  });

  app.delete("/api/admin/news/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.deleteNewsPost(paramId(req.params.id));
    res.json({ message: "Post deleted" });
  });

  return httpServer;
}
