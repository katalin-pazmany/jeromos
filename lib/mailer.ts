import nodemailer from "nodemailer";
import { Resend } from "resend";

// Where adoption applications and help requests are delivered.
export const SHELTER_EMAIL = "jeromos.egyesulet@gmail.com";

interface MailArgs {
  replyTo: string;
  subject: string;
  text: string;
}

// Preferred path: Resend, configured with just RESEND_API_KEY. Sends from
// Resend's shared sandbox address, so no access to the shelter's Gmail
// account is needed at all — Gmail is only ever the recipient here.
async function sendViaResend(args: MailArgs): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Jeromos Egyesület <onboarding@resend.dev>",
      to: SHELTER_EMAIL,
      replyTo: args.replyTo,
      subject: args.subject,
      text: args.text,
    });
    return !error;
  } catch {
    return false;
  }
}

// Fallback path, if the shelter ever gets its own send credentials:
// GMAIL_USER + GMAIL_APP_PASSWORD (Google Account → App passwords), or a
// generic SMTP server via SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS.
function getTransport(): nodemailer.Transporter | null {
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

function mailFrom(): string {
  return process.env.GMAIL_USER || process.env.SMTP_USER || SHELTER_EMAIL;
}

async function sendViaNodemailer(args: MailArgs): Promise<boolean> {
  const transport = getTransport();
  if (!transport) return false;
  try {
    await transport.sendMail({
      from: mailFrom(),
      to: SHELTER_EMAIL,
      replyTo: args.replyTo,
      subject: args.subject,
      text: args.text,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Tries Resend first, then Gmail/SMTP if configured. Returns whether the
 * email was actually delivered — callers fall back to a mailto: link when
 * this returns false.
 */
export async function sendMail(args: MailArgs): Promise<boolean> {
  if (await sendViaResend(args)) return true;
  return sendViaNodemailer(args);
}
