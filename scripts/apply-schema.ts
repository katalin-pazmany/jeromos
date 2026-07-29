// One-off script: applies scripts/schema.sql against DATABASE_URL.
// Run with: npx tsx scripts/apply-schema.ts

import { config } from "dotenv";
config({ path: ".env.local" });

import { readFile } from "fs/promises";
import path from "path";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  const text = await readFile(path.join(process.cwd(), "scripts", "schema.sql"), "utf8");
  const statements = text
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await sql.query(statement);
    console.log(`ran: ${statement.slice(0, 60)}...`);
  }
}

main()
  .then(() => console.log("schema applied"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
