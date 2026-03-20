import nodemailer from "nodemailer";

export function createTransport() {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT || "587");
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!host || !user || !pass) {
    throw new Error("Email env not set");
  }
  const secure = port === 465;
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function sendMail(opts: { to: string; subject: string; html: string }) {
  const from = process.env.EMAIL_FROM || "no-reply@darbartech.com";
  const transport = createTransport();
  const info = await transport.sendMail({ from, ...opts });
  return info.messageId;
}

