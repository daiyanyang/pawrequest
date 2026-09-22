// One-off script to apply db/schema.sql against the database.
// Run with: npm run db:init
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { Client } from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schema = readFileSync(path.join(__dirname, "../db/schema.sql"), "utf8");

// Migrations use a direct (non-pooled) connection, per Neon's guidance.
const connectionString =
  process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set. Check your .env.local file.");
  process.exit(1);
}

const client = new Client({ connectionString });

try {
  await client.connect();
  await client.query(schema);
  console.log("Schema applied successfully.");
} finally {
  await client.end();
}
