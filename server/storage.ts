import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  users, applications, releases, tracks, releaseDsps, dsps,
  tickets, ticketMessages, payoutMethodApplications, payoutRequests,
  earnings, platformSettings,
  type User, type Release, type Track, type Application, type DSP,
  type ReleaseDSP, type PayoutMethodApplication, type PayoutRequest,
  type Earning, type Ticket, type TicketMessage, type PlatformSetting,
} from "@shared/schema";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);

type SafeUser = Omit<User, "password">;

function stripPassword(user: User): SafeUser {
  const { password, ...safe } = user;
  return safe;
}

export class DatabaseStorage {
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
  async getAllApplications(): Promise<(Application & { user?: SafeUser })[]> {
    const apps = await db.select().from(applications).orderBy(desc(applications.createdAt));
    const result = [];
    for (const app of apps) {
      const user = await this.getUser(app.userId);
      result.push({ ...app, user: user ? stripPassword(user) : undefined });
    }
    return result;
  }
  async updateApplication(id: number, data: Partial<Application>): Promise<Application | undefined> {
    const [app] = await db.update(applications).set(data).where(eq(applications.id, id)).returning();
    return app;
  }

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
  async deleteRelease(id: number): Promise<void> {
    await db.delete(releases).where(eq(releases.id, id));
  }

  async createTrack(data: Omit<Track, "id">): Promise<Track> {
    const [track] = await db.insert(tracks).values(data).returning();
    return track;
  }
  async getTracksByRelease(releaseId: number): Promise<Track[]> {
    return db.select().from(tracks).where(eq(tracks.releaseId, releaseId)).orderBy(tracks.trackNumber);
  }
  async updateTrack(id: number, data: Partial<Track>): Promise<Track | undefined> {
    const [track] = await db.update(tracks).set(data).where(eq(tracks.id, id)).returning();
    return track;
  }
  async deleteTrack(id: number): Promise<void> {
    await db.delete(tracks).where(eq(tracks.id, id));
  }
  async deleteTracksByRelease(releaseId: number): Promise<void> {
    await db.delete(tracks).where(eq(tracks.releaseId, releaseId));
  }

  async getDsps(): Promise<DSP[]> {
    return db.select().from(dsps).orderBy(dsps.name);
  }
  async getEnabledDsps(): Promise<DSP[]> {
    return db.select().from(dsps).where(eq(dsps.enabled, true)).orderBy(dsps.name);
  }
  async updateDsp(id: number, data: Partial<DSP>): Promise<DSP | undefined> {
    const [dsp] = await db.update(dsps).set(data).where(eq(dsps.id, id)).returning();
    return dsp;
  }

  async setReleaseDsps(releaseId: number, dspIds: number[]): Promise<void> {
    await db.delete(releaseDsps).where(eq(releaseDsps.releaseId, releaseId));
    if (dspIds.length > 0) {
      await db.insert(releaseDsps).values(dspIds.map(dspId => ({ releaseId, dspId })));
    }
  }
  async getReleaseDspIds(releaseId: number): Promise<number[]> {
    const rows = await db.select().from(releaseDsps).where(eq(releaseDsps.releaseId, releaseId));
    return rows.map(r => r.dspId);
  }

  async createPayoutMethod(data: Omit<PayoutMethodApplication, "id" | "createdAt" | "status" | "rejectionReason" | "reviewedAt">): Promise<PayoutMethodApplication> {
    const [method] = await db.insert(payoutMethodApplications).values(data).returning();
    return method;
  }
  async getPayoutMethod(id: number): Promise<PayoutMethodApplication | undefined> {
    const [method] = await db.select().from(payoutMethodApplications).where(eq(payoutMethodApplications.id, id));
    return method;
  }
  async getPayoutMethodsByUser(userId: number): Promise<PayoutMethodApplication[]> {
    return db.select().from(payoutMethodApplications).where(eq(payoutMethodApplications.userId, userId)).orderBy(desc(payoutMethodApplications.createdAt));
  }
  async getAllPayoutMethods(): Promise<(PayoutMethodApplication & { user?: SafeUser })[]> {
    const methods = await db.select().from(payoutMethodApplications).orderBy(desc(payoutMethodApplications.createdAt));
    const result = [];
    for (const m of methods) {
      const user = await this.getUser(m.userId);
      result.push({ ...m, user: user ? stripPassword(user) : undefined });
    }
    return result;
  }
  async updatePayoutMethod(id: number, data: Partial<PayoutMethodApplication>): Promise<PayoutMethodApplication | undefined> {
    const [method] = await db.update(payoutMethodApplications).set(data).where(eq(payoutMethodApplications.id, id)).returning();
    return method;
  }

  async createPayoutRequest(data: Omit<PayoutRequest, "id" | "createdAt" | "status" | "rejectionReason" | "reviewedAt">): Promise<PayoutRequest> {
    const [req] = await db.insert(payoutRequests).values(data).returning();
    return req;
  }
  async getPayoutRequestsByUser(userId: number): Promise<PayoutRequest[]> {
    return db.select().from(payoutRequests).where(eq(payoutRequests.userId, userId)).orderBy(desc(payoutRequests.createdAt));
  }
  async getAllPayoutRequests(): Promise<(PayoutRequest & { user?: SafeUser })[]> {
    const reqs = await db.select().from(payoutRequests).orderBy(desc(payoutRequests.createdAt));
    const result = [];
    for (const r of reqs) {
      const user = await this.getUser(r.userId);
      result.push({ ...r, user: user ? stripPassword(user) : undefined });
    }
    return result;
  }
  async updatePayoutRequest(id: number, data: Partial<PayoutRequest>): Promise<PayoutRequest | undefined> {
    const [req] = await db.update(payoutRequests).set(data).where(eq(payoutRequests.id, id)).returning();
    return req;
  }

  async getEarningsByUser(userId: number): Promise<Earning[]> {
    return db.select().from(earnings).where(eq(earnings.userId, userId)).orderBy(desc(earnings.createdAt));
  }
  async getUserBalance(userId: number): Promise<number> {
    const result = await db.select({ total: sql<string>`COALESCE(SUM(${earnings.amount}), 0)` }).from(earnings).where(eq(earnings.userId, userId));
    const earned = parseFloat(result[0]?.total || "0");
    const paidOut = await db.select({ total: sql<string>`COALESCE(SUM(${payoutRequests.amount}), 0)` }).from(payoutRequests).where(and(eq(payoutRequests.userId, userId), eq(payoutRequests.status, "approved")));
    const paid = parseFloat(paidOut[0]?.total || "0");
    return earned - paid;
  }
  async createEarning(data: Omit<Earning, "id" | "createdAt">): Promise<Earning> {
    const [earning] = await db.insert(earnings).values(data).returning();
    return earning;
  }

  async createTicket(data: { userId: number; subject: string; priority?: string }): Promise<Ticket> {
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
  async getAllTickets(): Promise<(Ticket & { user?: SafeUser })[]> {
    const allTickets = await db.select().from(tickets).orderBy(desc(tickets.createdAt));
    const result = [];
    for (const t of allTickets) {
      const user = await this.getUser(t.userId);
      result.push({ ...t, user: user ? stripPassword(user) : undefined });
    }
    return result;
  }
  async updateTicket(id: number, data: Partial<Ticket>): Promise<Ticket | undefined> {
    const [ticket] = await db.update(tickets).set(data).where(eq(tickets.id, id)).returning();
    return ticket;
  }

  async createTicketMessage(data: { ticketId: number; userId: number; message: string }): Promise<TicketMessage> {
    const [msg] = await db.insert(ticketMessages).values(data).returning();
    return msg;
  }
  async getMessagesByTicket(ticketId: number): Promise<(TicketMessage & { user?: SafeUser })[]> {
    const msgs = await db.select().from(ticketMessages).where(eq(ticketMessages.ticketId, ticketId)).orderBy(ticketMessages.createdAt);
    const result = [];
    for (const msg of msgs) {
      const user = await this.getUser(msg.userId);
      result.push({ ...msg, user: user ? stripPassword(user) : undefined });
    }
    return result;
  }

  async getSetting(key: string): Promise<string | undefined> {
    const [setting] = await db.select().from(platformSettings).where(eq(platformSettings.key, key));
    return setting?.value;
  }
  async setSetting(key: string, value: string): Promise<void> {
    const existing = await this.getSetting(key);
    if (existing !== undefined) {
      await db.update(platformSettings).set({ value }).where(eq(platformSettings.key, key));
    } else {
      await db.insert(platformSettings).values({ key, value });
    }
  }
  async getAllSettings(): Promise<PlatformSetting[]> {
    return db.select().from(platformSettings);
  }
}

export const storage = new DatabaseStorage();
