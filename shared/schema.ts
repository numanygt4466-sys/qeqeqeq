import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, serial, numeric } from "drizzle-orm/pg-core";
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
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

export const dsps = pgTable("dsps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  region: text("region").notNull().default("global"),
  enabled: boolean("enabled").notNull().default(true),
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
  upc: text("upc"),
  catalogNumber: text("catalog_number"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  releaseId: integer("release_id").notNull().references(() => releases.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  trackNumber: integer("track_number").notNull(),
  isExplicit: boolean("is_explicit").notNull().default(false),
  audioUrl: text("audio_url"),
  audioFileName: text("audio_file_name"),
  duration: text("duration"),
  isrc: text("isrc"),
});

export const releaseDsps = pgTable("release_dsps", {
  id: serial("id").primaryKey(),
  releaseId: integer("release_id").notNull().references(() => releases.id, { onDelete: "cascade" }),
  dspId: integer("dsp_id").notNull().references(() => dsps.id),
});

export const payoutMethodApplications = pgTable("payout_method_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  details: text("details").notNull(),
  status: text("status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

export const payoutRequests = pgTable("payout_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  methodId: integer("method_id").notNull().references(() => payoutMethodApplications.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

export const earnings = pgTable("earnings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  releaseId: integer("release_id").references(() => releases.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  subject: text("subject").notNull(),
  status: text("status").notNull().default("open"),
  priority: text("priority").notNull().default("normal"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const ticketMessages = pgTable("ticket_messages", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").notNull().references(() => tickets.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const platformSettings = pgTable("platform_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

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
  title: z.string().min(1, "Title is required"),
  version: z.string().optional(),
  primaryArtist: z.string().min(1, "Primary artist is required"),
  releaseType: z.string().min(1, "Release type is required"),
  genre: z.string().min(1, "Genre is required"),
  language: z.string().min(1, "Language is required"),
  releaseDate: z.string().min(1, "Release date is required"),
  coverArtUrl: z.string().min(1, "Cover art is required"),
  upc: z.string().optional(),
  catalogNumber: z.string().optional(),
  dspIds: z.array(z.number()).min(1, "At least 1 DSP must be selected"),
  tracks: z.array(z.object({
    title: z.string().min(1, "Track title is required"),
    trackNumber: z.number().int().positive(),
    isExplicit: z.boolean().default(false),
    audioUrl: z.string().min(1, "Audio file is required"),
    audioFileName: z.string().min(1, "Audio file name is required"),
    duration: z.string().optional(),
    isrc: z.string().optional(),
  })).min(1, "At least 1 track is required"),
});

export const insertTicketSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  priority: z.string().optional(),
});

export const insertTicketMessageSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const insertPayoutMethodSchema = z.object({
  type: z.enum(["crypto", "bank_transfer"], { required_error: "Payment type is required" }),
  details: z.string().min(1, "Payment details are required"),
});

export const insertPayoutRequestSchema = z.object({
  methodId: z.number().int().positive(),
  amount: z.number().min(50, "Minimum payout amount is $50"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof registerSchema>;
export type Release = typeof releases.$inferSelect;
export type Track = typeof tracks.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type DSP = typeof dsps.$inferSelect;
export type ReleaseDSP = typeof releaseDsps.$inferSelect;
export type PayoutMethodApplication = typeof payoutMethodApplications.$inferSelect;
export type PayoutRequest = typeof payoutRequests.$inferSelect;
export type Earning = typeof earnings.$inferSelect;
export type Ticket = typeof tickets.$inferSelect;
export type TicketMessage = typeof ticketMessages.$inferSelect;
export type PlatformSetting = typeof platformSettings.$inferSelect;
