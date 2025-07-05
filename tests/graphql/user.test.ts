import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-micro";

import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers";
import User from "@/models/User";
import { MongoMemoryServer } from "mongodb-memory-server";

let server: ApolloServer;
let mongod: MongoMemoryServer;

beforeAll(async () => {
    // Start in-memory MongoDB and connect mongoose
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    process.env.MONGO_URI = uri;

    // Create Apollo Server for testing
    server = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await server.start();
});

// Close connection after all tests
afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
    if (server) await server.stop();
});

// Clean db between tests
afterEach(async () => {
    await User.deleteMany({});
});

describe("GraphQL User Resolvers", () => {
    it("creates a user", async () => {
        const CREATE_USER = `
            mutation CreateUser($username: String!, $password: String!) {
                createUser(username: $username, password: $password) {
                    _id
                    username
                    password
                }
            }
        `;

        const res = await server.executeOperation({
            query: CREATE_USER,
            variables: { username: "testuser", password: "testpass" },
        });

        expect(res.errors).toBeUndefined();
        expect(res.data?.createUser.username).toBe("testuser");
    });

    it("fetches all users", async () => {
        // Pre-insert user directly via model for testing fetch
        await User.create({ username: "user1", password: "pass1" });

        const GET_USERS = `
            query {
                users {
                    _id
                    username
                    password
                }
            }
        `;

        const res = await server.executeOperation({ query: GET_USERS });

        expect(res.errors).toBeUndefined();
        expect(res.data?.users.length).toBe(1);
        expect(res.data?.users[0].username).toBe("user1");
    });

    it("fetches a user by id", async () => {
        const user = await User.create({
            username: "user2",
            password: "pass2",
        });

        const GET_USER = `
            query GetUser($id: ID!) {
                user(id: $id) {
                    _id
                    username
                    password
                }
            }
        `;

        const res = await server.executeOperation({
            query: GET_USER,
            variables: { id: user._id.toString() },
        });

        expect(res.errors).toBeUndefined();
        expect(res.data?.user.username).toBe("user2");
    });
});
