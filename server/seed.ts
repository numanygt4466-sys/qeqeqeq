import bcrypt from "bcryptjs";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { users, applications, releases, tracks, releaseDsps, dsps, tickets, ticketMessages, payoutMethodApplications, payoutRequests, earnings, platformSettings } from "@shared/schema";
import { sql } from "drizzle-orm";

const DSP_LIST = [
  { name: "Spotify", region: "global" },
  { name: "Apple Music", region: "global" },
  { name: "Amazon Music", region: "global" },
  { name: "YouTube Music", region: "global" },
  { name: "Deezer", region: "global" },
  { name: "Tidal", region: "global" },
  { name: "Pandora", region: "north_america" },
  { name: "iHeartRadio", region: "north_america" },
  { name: "SoundCloud", region: "global" },
  { name: "Napster", region: "global" },
  { name: "Audiomack", region: "global" },
  { name: "Boomplay", region: "africa" },
  { name: "Anghami", region: "middle_east" },
  { name: "JioSaavn", region: "india" },
  { name: "Gaana", region: "india" },
  { name: "Wynk Music", region: "india" },
  { name: "Resso", region: "asia" },
  { name: "NetEase Cloud Music", region: "china" },
  { name: "QQ Music", region: "china" },
  { name: "Kugou Music", region: "china" },
  { name: "Kuwo Music", region: "china" },
  { name: "Melon", region: "south_korea" },
  { name: "Genie Music", region: "south_korea" },
  { name: "Bugs!", region: "south_korea" },
  { name: "FLO", region: "south_korea" },
  { name: "LINE Music", region: "japan" },
  { name: "AWA", region: "japan" },
  { name: "Rakuten Music", region: "japan" },
  { name: "KKBOX", region: "asia" },
  { name: "Yandex Music", region: "russia" },
  { name: "VK Music", region: "russia" },
  { name: "Zvuk (Sber)", region: "russia" },
  { name: "Claro Música", region: "latin_america" },
  { name: "TikTok / Resso", region: "global" },
  { name: "Instagram / Facebook", region: "global" },
  { name: "Snap / Snapchat", region: "global" },
  { name: "Triller", region: "global" },
  { name: "Peloton", region: "north_america" },
  { name: "Trebel", region: "latin_america" },
  { name: "MediaNet", region: "global" },
  { name: "Shazam", region: "global" },
  { name: "7digital", region: "europe" },
  { name: "Beatport", region: "global" },
  { name: "Traxsource", region: "global" },
  { name: "Juno Download", region: "europe" },
  { name: "Gracenote", region: "global" },
  { name: "Adaptr", region: "global" },
  { name: "Joox", region: "asia" },
  { name: "Hungama", region: "india" },
  { name: "Saavn", region: "india" },
  { name: "Mdundo", region: "africa" },
  { name: "UMA (United Music Agency)", region: "global" },
  { name: "Qobuz", region: "europe" },
  { name: "Nuuday (YouSee)", region: "europe" },
  { name: "Fizy", region: "turkey" },
  { name: "Muud", region: "turkey" },
  { name: "Spinlet", region: "africa" },
  { name: "Simfy Africa", region: "africa" },
  { name: "KKBox Taiwan", region: "asia" },
  { name: "Tencent Music", region: "china" },
];

async function seed() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log("Wiping existing data...");
  await db.execute(sql`TRUNCATE TABLE ticket_messages, tickets, payout_requests, payout_method_applications, earnings, release_dsps, tracks, releases, applications, dsps, platform_settings, users RESTART IDENTITY CASCADE`);

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

  console.log("Seeding DSPs...");
  for (const dsp of DSP_LIST) {
    await db.insert(dsps).values(dsp);
  }

  console.log("Seeding platform settings...");
  await db.insert(platformSettings).values([
    { key: "minimum_payout", value: "50" },
    { key: "allowed_payout_methods", value: "crypto,bank_transfer" },
  ]);

  console.log(`Seed complete. Admin user: admin / 123. ${DSP_LIST.length} DSPs seeded.`);
  await pool.end();
}

seed().catch(console.error);
