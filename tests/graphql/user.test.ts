import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-micro";

import { mergedTypeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers/resolvers";
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
        typeDefs: mergedTypeDefs,
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
            mutation CreateUser($email: String!, $username: String!, $password: String!) {
                createUser(email: $email, username: $username, password: $password) {
                    _id
                    email
                    username
                    password
                }
            }
        `;

        const res = await server.executeOperation({
            query: CREATE_USER,
            variables: {
                email: "test@test.com",
                username: "testuser",
                password: "testpass",
            },
        });

        expect(res.errors).toBeUndefined();
        expect(res.data?.createUser.username).toBe("testuser");
    });

    it("fetches all users", async () => {
        // Pre-insert user directly via model for testing fetch
        await User.create({
            email: "user1@test.com",
            username: "user1",
            password: "pass1",
        });

        const GET_USERS = `
            query {
                users {
                    _id
                    email
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
            email: "user2@test.com",
            username: "user2",
            password: "pass2",
        });

        const GET_USER = `
            query GetUser($id: ID!) {
                userById(id: $id) {
                    _id
                    email
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
        expect(res.data?.userById.username).toBe("user2");
        expect(res.data?.userById.email).toBe("user2@test.com");
    });

    it("fetches a user by email", async () => {
        await User.create({
            email: "user3@test.com",
            username: "user3",
            password: "pass3",
        });

        const GET_USER = `
            query GetUser($email: String!) {
                userByEmail(email: $email) {
                    _id
                    email
                    username
                    password
                }
            }
        `;

        const res = await server.executeOperation({
            query: GET_USER,
            variables: { email: "user3@test.com" },
        });

        expect(res.errors).toBeUndefined();
        expect(res.data?.userByEmail.username).toBe("user3");
        expect(res.data?.userByEmail.email).toBe("user3@test.com");
    });
});
