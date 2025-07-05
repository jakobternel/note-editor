import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../lib/db";
import User from "../../models/User";

// API route handler for /api/user
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Ensure database connection is established before handling requests
    await dbConnect();

    // Handle GET request: fetch all users
    if (req.method === "GET") {
        const users = await User.find({});
        return res.status(200).json({ users });
    }

    // Handle POST request: create a new user
    if (req.method === "POST") {
        const { username, password } = req.body;

        // Create and save a new user document in the database
        const user = await User.create({ username, password });
        return res.status(201).json({ user });
    }

    // Throw error if unsupported method called
    return res.status(405).json({ error: "Method not allowed" });
}
