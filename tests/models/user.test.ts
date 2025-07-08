import mongoose from "mongoose";
import User from "@/models/User";
import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { MongoServerError } from "mongodb";

describe("User Model Tests", () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI!);
        await User.syncIndexes();
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    it("should create & save a user successfully", async () => {
        const validUser = new User({
            email: "test@test.com",
            username: "testuser",
            password: "testpass",
        });

        const savedUser = await validUser.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.email).toBe("test@test.com");
        expect(savedUser.username).toBe("testuser");
        expect(savedUser.password).toBe("testpass");
    });

    it("should not save user without required fields", async () => {
        const userWithoutUsername = new User({ password: "testpass" });
        let err: mongoose.Error.ValidationError | null = null;

        try {
            await userWithoutUsername.save();
        } catch (error: unknown) {
            if (error instanceof mongoose.Error.ValidationError) {
                err = error;
            }
        }

        expect(err).toBeDefined();
        expect(err?.errors.username).toBeDefined();
    });

    it("should not allow duplicate emails", async () => {
        const user1 = new User({
            email: "test@test.com",
            username: "user1",
            password: "pass1",
        });
        await user1.save();

        const user2 = new User({
            email: "test@test.com",
            username: "user2",
            password: "pass2",
        });

        let err: MongoServerError | undefined = undefined;

        try {
            await user2.save();
        } catch (error: unknown) {
            if (error instanceof MongoServerError) {
                err = error;
            }
        }

        expect(err).toBeDefined();
        expect(err?.code).toBe(11000); // Mongo duplicate key error code
    });

    it("should not allow duplicate usernames", async () => {
        const user1 = new User({
            email: "test1@test.com",
            username: "dupuser",
            password: "pass1",
        });
        await user1.save();

        const user2 = new User({
            email: "test2@test.com",
            username: "dupuser",
            password: "pass2",
        });

        let err: MongoServerError | undefined = undefined;

        try {
            await user2.save();
        } catch (error: unknown) {
            if (error instanceof MongoServerError) {
                err = error;
            }
        }

        expect(err).toBeDefined();
        expect(err?.code).toBe(11000); // Mongo duplicate key error code
    });

    it("should find a user by email", async () => {
        const user = new User({
            email: "test@test.com",
            username: "findme",
            password: "secret",
        });
        await user.save();

        const foundUser = await User.findOne({ email: "test@test.com" });
        expect(foundUser).not.toBeNull();
        expect(foundUser!.email).toBe("test@test.com");
        expect(foundUser!.username).toBe("findme");
    });

    it("should find a user by username", async () => {
        const user = new User({
            email: "test@test.com",
            username: "findme",
            password: "secret",
        });
        await user.save();

        const foundUser = await User.findOne({ username: "findme" });
        expect(foundUser).not.toBeNull();
        expect(foundUser!.email).toBe("test@test.com");
        expect(foundUser!.username).toBe("findme");
    });
});
