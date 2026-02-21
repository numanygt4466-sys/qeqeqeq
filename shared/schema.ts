import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  labelName: text("label_name"),
  role: text("role").notNull().default("artist"),
  isApproved: boolean("is_approved").notNull().default(false),
  country: text("country"),
  timezone: text("timezone"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

export const releases = pgTable("releases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  version: text("version"),
  primaryArtist: text("primary_artist").notNull(),
  releaseType: text("release_type").notNull(),
  genre: text("genre").notNull(),
  language: text("language").notNull(),
  releaseDate: text("release_date").notNull(),
  status: text("status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  coverArtUrl: text("cover_art_url"),
  dsps: text("dsps").array().notNull().default(sql`'{}'::text[]`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  releaseId: integer("release_id").notNull().references(() => releases.id),
  title: text("title").notNull(),
  trackNumber: integer("track_number").notNull(),
  isExplicit: boolean("is_explicit").notNull().default(false),
  audioFileName: text("audio_file_name").notNull(),
  duration: text("duration"),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  subject: text("subject").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const ticketMessages = pgTable("ticket_messages", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").notNull().references(() => tickets.id),
  userId: integer("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, isApproved: true });
export const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
  labelName: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
});
export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const insertReleaseSchema = z.object({
  title: z.string().min(1),
  version: z.string().optional(),
  primaryArtist: z.string().min(1),
  releaseType: z.string().min(1),
  genre: z.string().min(1),
  language: z.string().min(1),
  releaseDate: z.string().min(1),
  coverArtUrl: z.string().optional(),
  dsps: z.array(z.string()).min(1),
  tracks: z.array(z.object({
    title: z.string().min(1),
    trackNumber: z.number().int().positive(),
    isExplicit: z.boolean().default(false),
    audioFileName: z.string().min(1),
    duration: z.string().optional(),
  })).min(1),
});

export const insertTicketSchema = z.object({
  subject: z.string().min(1),
  message: z.string().min(1),
});

export const insertTicketMessageSchema = z.object({
  message: z.string().min(1),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof registerSchema>;
export type Release = typeof releases.$inferSelect;
export type Track = typeof tracks.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Ticket = typeof tickets.$inferSelect;
export type TicketMessage = typeof ticketMessages.$inferSelect;
