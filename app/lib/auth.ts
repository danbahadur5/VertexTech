import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { sendMail } from "./email";

const mongoUri = process.env.MONGODB_URI || "";
const client = mongoUri ? new MongoClient(mongoUri) : (undefined as any);
const db = client ? client.db(process.env.MONGODB_DB || "darbartech") : (undefined as any);

// We're using Better Auth here because it handles the heavy lifting of session management
// while still giving us enough control to keep things personal. 
// I've tweaked the settings to prioritize security and a smooth user experience.
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  session: {
    // 7 days feels like a good balance between convenience and security.
    // Users don't want to log in every single day, but we don't want sessions
    // hanging around forever if they're not active.
    expiresIn: 60 * 60 * 24 * 7, 
    updateAge: 60 * 60 * 24, // Refresh the session daily if they're active
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60, // 1 hour cache to keep things snappy
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: process.env.NODE_ENV === "production",
    // 10 characters minimum. It's a bit more than the standard 8, but 
    // in today's world, those extra 2 characters make a real difference.
    minPasswordLength: 10, 
    sendResetPassword: async ({ user, url }) => {
      const resetEmailHtml = `
        <div style="font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #2563eb; margin-bottom: 24px;">Need a new password?</h2>
          <p>Hi ${user.name || "there"},</p>
          <p>We received a request to reset your password for your DarbarTech account. No worries—it happens to the best of us!</p>
          <div style="margin: 32px 0;">
            <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">Reset My Password</a>
          </div>
          <p style="font-size: 14px; color: #666;">If you didn't ask for this, you can just ignore this email. Your password will stay exactly as it is.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="font-size: 12px; color: #999;">This link is valid for the next hour. After that, you'll need to request a new one.</p>
        </div>
      `;
      await sendMail({ 
        to: user.email, 
        subject: "Reset your DarbarTech password", 
        html: resetEmailHtml 
      });
    },
    password: {
      hash: async (password) => {
        const bcrypt = await import("bcrypt");
        // 12 rounds is our sweet spot. It's slow enough to thwart brute-force 
        // attempts but fast enough that it won't bog down our servers.
        const WORK_FACTOR = 12; 
        const hashedPassword = await bcrypt.hash(password, WORK_FACTOR);
        return hashedPassword;
      },
      verify: async ({ hash, password }) => {
        const bcrypt = await import("bcrypt");
        return bcrypt.compare(password, hash);
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const welcomeEmailHtml = `
        <div style="font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #2563eb; margin-bottom: 24px;">Welcome to DarbarTech!</h2>
          <p>Hi ${user.name || "there"},</p>
          <p>We're thrilled to have you join us. Before we get started, we just need to make sure this email address belongs to you.</p>
          <div style="margin: 32px 0;">
            <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">Confirm My Email</a>
          </div>
          <p>Once you've confirmed, you'll have full access to everything DarbarTech has to offer.</p>
          <p>See you on the inside!</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="font-size: 12px; color: #999;">If you didn't sign up for an account, you can safely ignore this email.</p>
        </div>
      `;
      await sendMail({ 
        to: user.email, 
        subject: "Welcome! Please verify your email", 
        html: welcomeEmailHtml 
      });
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
