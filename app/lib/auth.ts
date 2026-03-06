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
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: process.env.NODE_ENV === "production",
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      const html = `<p>Hello ${user.name || ""}</p><p>Reset your password:</p><p><a href="${url}">Reset Password</a></p>`;
      await sendMail({ to: user.email, subject: "Reset your password", html });
    },
    password: {
      hash: async (password) => {
        const bcrypt = await import("bcrypt");
        const saltRounds = 10;
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
      const html = `<p>Hello ${user.name || ""}</p><p>Verify your email:</p><p><a href="${url}">Verify Email</a></p>`;
      await sendMail({ to: user.email, subject: "Verify your email", html });
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
