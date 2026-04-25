import mongoose from "mongoose";
import { logger } from "./logger";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI && process.env.NODE_ENV === 'production') {
  logger.error("Wait, the MONGODB_URI is missing in production! We need this to talk to our database.");
}

// We're caching the connection so we don't keep opening new ones every time
// a serverless function runs. It's a bit of a pattern, but it's essential for performance.
type MongoConnectionCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // Using 'var' here because it's the only way to attach something to 'global' in TS
  // that survives hot reloads during development.
  // eslint-disable-next-line no-var
  var _mongoose: MongoConnectionCache | undefined;
}

const globalWithMongoose = global as unknown as { _mongoose?: MongoConnectionCache };

let connectionCache = globalWithMongoose._mongoose;

if (!connectionCache) {
  connectionCache = { conn: null, promise: null };
  globalWithMongoose._mongoose = connectionCache;
}

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("I can't connect to the database without a URI. Check your .env file!");
  }

  // If we already have a connection, let's just use it. No need to overcomplicate things.
  if (connectionCache?.conn) {
    return connectionCache.conn;
  }

  // If a connection is already in the works, we'll wait for that one instead of starting a new one.
  if (!connectionCache?.promise) {
    const connectionOptions = {
      dbName: process.env.MONGODB_DB || "darbartech",
      bufferCommands: false, // We want to know immediately if something goes wrong.
    };

    logger.info("Starting a fresh connection to MongoDB...");
    
    connectionCache!.promise = mongoose.connect(MONGODB_URI, connectionOptions).then((mongooseInstance) => {
      logger.info("We're in! Successfully connected to MongoDB.");
      return mongooseInstance;
    }).catch((error) => {
      logger.error("Ouch, something went wrong while connecting to MongoDB:", error);
      connectionCache!.promise = null; // Reset so we can try again later.
      throw error;
    });
  }

  try {
    connectionCache!.conn = await connectionCache!.promise;
  } catch (err) {
    connectionCache!.promise = null;
    throw err;
  }

  return connectionCache!.conn;
}

// Keeping an eye on the connection lifecycle.
mongoose.connection.on('disconnected', () => {
  logger.warn('The MongoDB connection just dropped. Hopefully it reconnects soon.');
});

mongoose.connection.on('error', (err) => {
  logger.error('The database is throwing an error:', err);
});
