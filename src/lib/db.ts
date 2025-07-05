import mongoose from "mongoose";

// Extend the global object to cache the MongoDB connection across hot reloads
declare global {
    // eslint-disable-next-line no-var
    var mongoose: {
        conn: typeof import("mongoose") | null; // Cached mongoose connection
        promise: Promise<typeof import("mongoose")> | null; // Cached connection promise
    };
}

// Use existing cached connection if available, otherwise initialize cache
const cached =
    global.mongoose || (global.mongoose = { conn: null, promise: null });

/**
 * Connect to MongoDB using Mongoose.
 * Reuses existing connection in development to avoid multiple connections during hot reloads.
 */
async function dbConnect() {
    // Get MongoDB connection URI from .env file
    const MONGO_URI = process.env.MONGO_URI!;

    // Throw error if no connection URI set
    if (!MONGO_URI) throw new Error("Please define the MONGO_URI in .env");

    // If a connection already exists, return it
    if (cached.conn) {
        console.log("Using existing MongoDB connection");
        return cached.conn;
    }

    // If no connection promise exists, create and store it
    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGO_URI, {
                bufferCommands: false, // Prevent mongoose from buffering commands when not connected
            })
            .then((mongooseInstance) => {
                console.log("Successfully connected to MongoDB");
                return mongooseInstance;
            })
            .catch((err) => {
                console.error("MongoDB connection error:", err);
                throw err;
            });
    }

    // Wait for the connection promise to resolve and cache it
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;
