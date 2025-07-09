import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { mergedTypeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers/resolvers";
import dbConnect from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

// Create Apollo Server instance with schema and resolvers
const apolloServer = new ApolloServer<{
    req: NextApiRequest;
    res: NextApiResponse;
}>({
    typeDefs: mergedTypeDefs,
    resolvers,
});

export default startServerAndCreateNextHandler(apolloServer, {
    context: async (req, res) => {
        await dbConnect();

        return {
            req,
            res,
        };
    },
});
