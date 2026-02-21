import bcrypt from "bcryptjs";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { users, applications, releases, tracks, tickets, ticketMessages } from "@shared/schema";
import { sql } from "drizzle-orm";

async function seed() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log("Wiping existing data...");
  await db.delete(ticketMessages);
  await db.delete(tickets);
  await db.delete(tracks);
  await db.delete(releases);
  await db.delete(applications);
  await db.delete(users);

  console.log("Creating admin user...");
  const hashedPassword = await bcrypt.hash("123", 10);
  await db.insert(users).values({
    username: "admin",
    email: "admin@rawarchives.com",
    password: hashedPassword,
    fullName: "Platform Administrator",
    labelName: "RAW ARCHIVES",
    role: "admin",
    isApproved: true,
    country: "us",
    timezone: "utc",
  });

  console.log("Seed complete. Admin user: admin / 123");
  await pool.end();
}

seed().catch(console.error);
