import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

let databaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "SUPABASE_DATABASE_URL or DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Handle double-encoded URLs (common when copying from Supabase dashboard)
// If the URL starts with encoded characters, decode it once
if (databaseUrl.includes('%3A%2F%2F')) {
  try {
    databaseUrl = decodeURIComponent(databaseUrl);
  } catch (e) {
    // If decoding fails, URL is already in correct format
  }
}

export const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

export const db = drizzle(pool, { schema });
