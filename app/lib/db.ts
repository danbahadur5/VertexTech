import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

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
  if (cached?.conn) return cached.conn;
  if (!cached?.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB || "vertextech",
    });
  }
  cached!.conn = await cached!.promise;
  return cached!.conn;
}
