import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { sendMail } from "./email";

const mongoUri = process.env.MONGODB_URI || "";
const client = mongoUri ? new MongoClient(mongoUri) : (undefined as any);
const db = client ? client.db(process.env.MONGODB_DB || "vertextech") : (undefined as any);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60, // 1 hour
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: process.env.NODE_ENV === "production",
    minPasswordLength: 10, // Increased for better security
    sendResetPassword: async ({ user, url }) => {
      const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Reset Your Password</h2>
          <p>Hello ${user.name || "there"},</p>
          <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
          <p><a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
          <p>This link will expire in 1 hour.</p>
        </div>
      `;
      await sendMail({ to: user.email, subject: "Reset your password - DarbarTech", html });
    },
    password: {
      hash: async (password) => {
        const bcrypt = await import("bcrypt");
        const saltRounds = 12; // Increased rounds for better security
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
      },
      verify: async ({ hash, password }) => {
        const bcrypt = await import("bcrypt");
        return bcrypt.compare(password, hash);
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Verify Your Email</h2>
          <p>Hello ${user.name || "there"},</p>
          <p>Welcome to DarbarTech! Please verify your email to complete your registration.</p>
          <p><a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
        </div>
      `;
      await sendMail({ to: user.email, subject: "Verify your email - DarbarTech", html });
    },
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
      : undefined,
    github: process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          clientId: process.env.GITHUB_CLIENT_ID as string,
          clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }
      : undefined,
  },
  database: db ? mongodbAdapter(db, { client }) : (undefined as any),
  experimental: { joins: true },
  plugins: [nextCookies()],
});
