import nodemailer from "nodemailer";

// Where adoption applications are delivered.
export const SHELTER_EMAIL = "jeromos.egyesulet@gmail.com";

// Build a transporter from environment configuration.
// Simplest setup: put the shelter's Gmail + an "app password" in .env.local:
//   GMAIL_USER=jeromos.egyesulet@gmail.com
//   GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx   (Google account → App passwords)
// Or a generic SMTP server via SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS.
export function getTransport(): nodemailer.Transporter | null {
  const user = process.env.GMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  if (!user || !pass) return null;

  const host = process.env.SMTP_HOST;
  if (host) {
    const port = Number(process.env.SMTP_PORT || 587);
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
}

export function mailFrom(): string {
  return process.env.GMAIL_USER || process.env.SMTP_USER || SHELTER_EMAIL;
}
