import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let cached: NeonQueryFunction<false, false> | null = null;

function client(): NeonQueryFunction<false, false> {
  if (!cached) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL is not set (add the Neon Postgres integration on Vercel, or run `vercel env pull`)."
      );
    }
    cached = neon(process.env.DATABASE_URL);
  }
  return cached;
}

// Lazy tagged-template proxy: `sql` only touches DATABASE_URL when a query
// actually runs, so importing this module (e.g. Next's build-time page data
// collection) never fails just because the env var isn't set yet.
export const sql: NeonQueryFunction<false, false> = ((...args: Parameters<NeonQueryFunction<false, false>>) =>
  client()(...args)) as NeonQueryFunction<false, false>;
