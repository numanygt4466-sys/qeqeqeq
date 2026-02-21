import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  users, applications, releases, tracks, tickets, ticketMessages,
  type User, type Release, type Track, type Application, type Ticket, type TicketMessage,
} from "@shared/schema";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(data: Omit<User, "id" | "createdAt" | "isApproved">): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<void>;
  getAllUsers(): Promise<User[]>;

  // Applications
  createApplication(userId: number): Promise<Application>;
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationByUserId(userId: number): Promise<Application | undefined>;
  getAllApplications(): Promise<(Application & { user?: User })[]>;
  updateApplication(id: number, data: Partial<Application>): Promise<Application | undefined>;

  // Releases
  createRelease(data: Omit<Release, "id" | "createdAt" | "status" | "rejectionReason">): Promise<Release>;
  getRelease(id: number): Promise<Release | undefined>;
  getReleasesByUser(userId: number): Promise<Release[]>;
  getAllReleases(): Promise<Release[]>;
  updateRelease(id: number, data: Partial<Release>): Promise<Release | undefined>;

  // Tracks
  createTrack(data: Omit<Track, "id">): Promise<Track>;
  getTracksByRelease(releaseId: number): Promise<Track[]>;

  // Tickets
  createTicket(data: { userId: number; subject: string }): Promise<Ticket>;
  getTicket(id: number): Promise<Ticket | undefined>;
  getTicketsByUser(userId: number): Promise<Ticket[]>;
  getAllTickets(): Promise<(Ticket & { user?: User })[]>;
  updateTicket(id: number, data: Partial<Ticket>): Promise<Ticket | undefined>;

  // Ticket Messages
  createTicketMessage(data: { ticketId: number; userId: number; message: string }): Promise<TicketMessage>;
  getMessagesByTicket(ticketId: number): Promise<(TicketMessage & { user?: User })[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  async createUser(data: Omit<User, "id" | "createdAt" | "isApproved">): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }
  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }
  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  // Applications
  async createApplication(userId: number): Promise<Application> {
    const [app] = await db.insert(applications).values({ userId }).returning();
    return app;
  }
  async getApplication(id: number): Promise<Application | undefined> {
    const [app] = await db.select().from(applications).where(eq(applications.id, id));
    return app;
  }
  async getApplicationByUserId(userId: number): Promise<Application | undefined> {
    const [app] = await db.select().from(applications).where(eq(applications.userId, userId));
    return app;
  }
  async getAllApplications(): Promise<(Application & { user?: Omit<User, "password"> })[]> {
    const apps = await db.select().from(applications).orderBy(desc(applications.createdAt));
    const result = [];
    for (const app of apps) {
      const user = await this.getUser(app.userId);
      if (user) {
        const { password, ...safeUser } = user;
        result.push({ ...app, user: safeUser });
      } else {
        result.push({ ...app });
      }
    }
    return result;
  }
  async updateApplication(id: number, data: Partial<Application>): Promise<Application | undefined> {
    const [app] = await db.update(applications).set(data).where(eq(applications.id, id)).returning();
    return app;
  }

  // Releases
  async createRelease(data: Omit<Release, "id" | "createdAt" | "status" | "rejectionReason">): Promise<Release> {
    const [release] = await db.insert(releases).values(data).returning();
    return release;
  }
  async getRelease(id: number): Promise<Release | undefined> {
    const [release] = await db.select().from(releases).where(eq(releases.id, id));
    return release;
  }
  async getReleasesByUser(userId: number): Promise<Release[]> {
    return db.select().from(releases).where(eq(releases.userId, userId)).orderBy(desc(releases.createdAt));
  }
  async getAllReleases(): Promise<Release[]> {
    return db.select().from(releases).orderBy(desc(releases.createdAt));
  }
  async updateRelease(id: number, data: Partial<Release>): Promise<Release | undefined> {
    const [release] = await db.update(releases).set(data).where(eq(releases.id, id)).returning();
    return release;
  }

  // Tracks
  async createTrack(data: Omit<Track, "id">): Promise<Track> {
    const [track] = await db.insert(tracks).values(data).returning();
    return track;
  }
  async getTracksByRelease(releaseId: number): Promise<Track[]> {
    return db.select().from(tracks).where(eq(tracks.releaseId, releaseId));
  }

  // Tickets
  async createTicket(data: { userId: number; subject: string }): Promise<Ticket> {
    const [ticket] = await db.insert(tickets).values(data).returning();
    return ticket;
  }
  async getTicket(id: number): Promise<Ticket | undefined> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    return ticket;
  }
  async getTicketsByUser(userId: number): Promise<Ticket[]> {
    return db.select().from(tickets).where(eq(tickets.userId, userId)).orderBy(desc(tickets.createdAt));
  }
  async getAllTickets(): Promise<(Ticket & { user?: Omit<User, "password"> })[]> {
    const allTickets = await db.select().from(tickets).orderBy(desc(tickets.createdAt));
    const result = [];
    for (const t of allTickets) {
      const user = await this.getUser(t.userId);
      if (user) {
        const { password, ...safeUser } = user;
        result.push({ ...t, user: safeUser });
      } else {
        result.push({ ...t });
      }
    }
    return result;
  }
  async updateTicket(id: number, data: Partial<Ticket>): Promise<Ticket | undefined> {
    const [ticket] = await db.update(tickets).set(data).where(eq(tickets.id, id)).returning();
    return ticket;
  }

  // Ticket Messages
  async createTicketMessage(data: { ticketId: number; userId: number; message: string }): Promise<TicketMessage> {
    const [msg] = await db.insert(ticketMessages).values(data).returning();
    return msg;
  }
  async getMessagesByTicket(ticketId: number): Promise<(TicketMessage & { user?: Omit<User, "password"> })[]> {
    const msgs = await db.select().from(ticketMessages).where(eq(ticketMessages.ticketId, ticketId)).orderBy(ticketMessages.createdAt);
    const result = [];
    for (const msg of msgs) {
      const user = await this.getUser(msg.userId);
      if (user) {
        const { password, ...safeUser } = user;
        result.push({ ...msg, user: safeUser });
      } else {
        result.push({ ...msg });
      }
    }
    return result;
  }
}

export const storage = new DatabaseStorage();
