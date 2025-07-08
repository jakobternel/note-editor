import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-micro";
import bcrypt from "bcrypt";
import { MongoMemoryServer } from "mongodb-memory-server";

import { mergedTypeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers/resolvers";
import User from "@/models/User";

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
                }
            }
        `;

        const response = await server.executeOperation({
            query: CREATE_USER,
            variables: {
                email: "test@test.com",
                username: "user",
                password: "password",
            },
        });

        expect(response.errors).toBeUndefined();
        expect(response.data?.createUser.username).toBe("user");
    });

    it("fails to create user if email is missing", async () => {
        const CREATE_USER = `
            mutation CreateUser($username: String!, $password: String!) {
                createUser(username: $username, password: $password) {
                    _id
                    email
                    username
                }
            }
        `;

        const response = await server.executeOperation({
            query: CREATE_USER,
            variables: {
                username: "user",
                password: "password",
            },
        });

        expect(response.errors).toBeDefined();
    });

    it("fails to create user if username is missing", async () => {
        const CREATE_USER = `
            mutation CreateUser($username: String!, $password: String!) {
                createUser(username: $username, password: $password) {
                    _id
                    email
                    username
                }
            }
        `;

        const response = await server.executeOperation({
            query: CREATE_USER,
            variables: {
                email: "test@test.com",
                password: "password",
            },
        });

        expect(response.errors).toBeDefined();
    });

    it("fails to create user if password is missing", async () => {
        const CREATE_USER = `
            mutation CreateUser($username: String!, $password: String!) {
                createUser(username: $username, password: $password) {
                    _id
                    email
                    username
                }
            }
        `;

        const response = await server.executeOperation({
            query: CREATE_USER,
            variables: {
                email: "test@test.com",
                username: "user",
            },
        });

        expect(response.errors).toBeDefined();
    });

    it("returns GraphQL error if email already exists", async () => {
        await User.create({
            email: "test@test.com",
            username: "user1",
            password: "password",
        });

        const CREATE_USER = `
            mutation CreateUser($email: String!, $username: String!, $password: String!) {
                createUser(email: $email, username: $username, password: $password) {
                    _id
                    email
                }
            }
        `;

        const response = await server.executeOperation({
            query: CREATE_USER,
            variables: {
                email: "test@test.com",
                username: "user2",
                password: "password",
            },
        });

        expect(response.errors).toBeDefined();
        expect(response.errors?.[0].message).toMatch(
            "Email already registered."
        );
    });

    it("returns GraphQL error if username already exists", async () => {
        await User.create({
            email: "test1@test.com",
            username: "user",
            password: "password",
        });

        const CREATE_USER = `
            mutation CreateUser($email: String!, $username: String!, $password: String!) {
                createUser(email: $email, username: $username, password: $password) {
                    _id
                    email
                }
            }
        `;

        const response = await server.executeOperation({
            query: CREATE_USER,
            variables: {
                email: "test2@test.com",
                username: "user",
                password: "password",
            },
        });

        expect(response.errors).toBeDefined();
        expect(response.errors?.[0].message).toMatch(
            "Username already registered."
        );
    });

    it("hashes password on createUser", async () => {
        const CREATE_USER = `
            mutation CreateUser($email: String!, $username: String!, $password: String!) {
                createUser(email: $email, username: $username, password: $password) {
                    _id
                    email
                    username
                }
            }
        `;

        const response = await server.executeOperation({
            query: CREATE_USER,
            variables: {
                email: "test@test.com",
                username: "user",
                password: "password",
            },
        });

        expect(response.errors).toBeUndefined();

        const user = await User.findOne({ email: "test@test.com" });
        expect(user).not.toBeNull();
        expect(user!.password).not.toBe("password");

        const isMatch = await bcrypt.compare("password", user!.password);
        expect(isMatch).toBe(true);
    });

    it("fails loginUser if password is incorrect", async () => {
        const user = new User({
            email: "test@test.com",
            username: "user",
            password: "password",
        });
        await user.save();

        const LOGIN_USER = `
            mutation LoginUser($email: String!, $password: String!) {
                loginUser(email: $email, password: $password) {
                    _id
                    email
                    username
                }
            }
        `;

        const response = await server.executeOperation({
            query: LOGIN_USER,
            variables: {
                email: "loginfail@test.com",
                password: "wrongpassword",
            },
        });

        expect(response.errors).toBeDefined();
    });

    it("logs in user successfully with correct password", async () => {
        const user = new User({
            email: "test@test.com",
            username: "user",
            password: "password",
        });
        await user.save();

        const LOGIN_USER = `
            mutation LoginUser($email: String!, $password: String!) {
                loginUser(email: $email, password: $password) {
                    _id
                    email
                    username
                }
            }
        `;

        const res = await server.executeOperation({
            query: LOGIN_USER,
            variables: {
                email: "test@test.com",
                password: "password",
            },
        });

        expect(res.errors).toBeUndefined();
        expect(res.data?.loginUser.email).toBe("test@test.com");
        expect(res.data?.loginUser.username).toBe("user");
    });

    it("fetches all users", async () => {
        // Pre-insert user directly via model for testing fetch
        await User.create({
            email: "test@test.com",
            username: "user",
            password: "password",
        });

        const GET_USERS = `
            query {
                users {
                    _id
                    email
                    username
                }
            }
        `;

        const response = await server.executeOperation({ query: GET_USERS });

        expect(response.errors).toBeUndefined();
        expect(response.data?.users.length).toBe(1);
        expect(response.data?.users[0].username).toBe("user");
    });

    it("fetches a user by id", async () => {
        const user = await User.create({
            email: "test@test.com",
            username: "user",
            password: "password",
        });

        const GET_USER = `
            query GetUser($id: ID!) {
                userById(id: $id) {
                    _id
                    email
                    username
                }
            }
        `;

        const response = await server.executeOperation({
            query: GET_USER,
            variables: { id: user._id.toString() },
        });

        expect(response.errors).toBeUndefined();
        expect(response.data?.userById.username).toBe("user");
        expect(response.data?.userById.email).toBe("test@test.com");
    });

    it("fetches a user by email", async () => {
        await User.create({
            email: "test@test.com",
            username: "user",
            password: "password",
        });

        const GET_USER = `
            query GetUser($email: String!) {
                userByEmail(email: $email) {
                    _id
                    email
                    username
                }
            }
        `;

        const response = await server.executeOperation({
            query: GET_USER,
            variables: { email: "test@test.com" },
        });

        expect(response.errors).toBeUndefined();
        expect(response.data?.userByEmail.username).toBe("user");
        expect(response.data?.userByEmail.email).toBe("test@test.com");
    });

    it("fetches a user by username", async () => {
        await User.create({
            email: "test@test.com",
            username: "user",
            password: "password",
        });

        const GET_USER = `
            query GetUser($username: String!) {
                userByUsername(username: $username) {
                    _id
                    email
                    username
                }
            }
        `;

        const response = await server.executeOperation({
            query: GET_USER,
            variables: { username: "user" },
        });

        expect(response.errors).toBeUndefined();
        expect(response.data?.userByUsername.username).toBe("user");
        expect(response.data?.userByUsername.email).toBe("test@test.com");
    });
});
