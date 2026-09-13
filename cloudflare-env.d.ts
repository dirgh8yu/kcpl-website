declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    STAFF_EMAILS?: string;
    SITE_ORIGIN?: string;
    RATE_LIMIT_SECRET?: string;
  }
}
