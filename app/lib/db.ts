import mongoose from "mongoose";
import { logger } from "./logger";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI && process.env.NODE_ENV === 'production') {
  logger.error("MONGODB_URI is not set in production!");
}

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: Cached | undefined;
}

const globalWithMongoose = global as unknown as { _mongoose?: Cached };

let cached = globalWithMongoose._mongoose;
if (!cached) {
  cached = { conn: null, promise: null };
  globalWithMongoose._mongoose = cached;
}

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      dbName: process.env.MONGODB_DB || "vertextech",
      bufferCommands: false, // For faster error detection
    };

    logger.info("Establishing new MongoDB connection...");
    
    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      logger.info("Successfully connected to MongoDB");
      return mongoose;
    }).catch((err) => {
      logger.error("MongoDB connection error:", err);
      cached!.promise = null; // Clear promise on error to retry next time
      throw err;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

// Connection events
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB error event:', err);
});
