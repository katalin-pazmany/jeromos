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

// Lazy proxy: only touches DATABASE_URL when a query actually runs (as a
// tagged template, or via sql.query()/sql.unsafe()), so importing this
// module — e.g. Next's build-time page data collection — never fails just
// because the env var isn't set yet.
export const sql: NeonQueryFunction<false, false> = new Proxy(
  (() => {}) as unknown as NeonQueryFunction<false, false>,
  {
    apply(_target, _thisArg, args) {
      const real = client() as unknown as (...a: unknown[]) => unknown;
      return real(...args);
    },
    get(_target, prop, receiver) {
      const real = client();
      const value = Reflect.get(real as object, prop, receiver);
      return typeof value === "function" ? value.bind(real) : value;
    },
  }
) as NeonQueryFunction<false, false>;
