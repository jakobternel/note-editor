import { ApolloServer } from "apollo-server-micro";
import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers";
import dbConnect from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

// Create Apollo Server instance with schema and resolvers
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});

// Start Apollo Server (returns a promise)
const startServer = apolloServer.start();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await startServer; // Ensure server is started before handling requests
    await dbConnect(); // Connect to MongoDB

    // Delegate handling to Apollo Server's handler for the /api/graphql path
    return apolloServer.createHandler({
        path: "/api/graphql",
    })(req, res);
}

// Disable Next.js body parser so Apollo can handle the request body
export const config = {
    api: {
        bodyParser: false,
    },
};
