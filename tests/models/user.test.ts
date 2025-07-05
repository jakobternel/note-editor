import mongoose from "mongoose";
import User from "@/models/User";
import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { MongoServerError } from "mongodb";

describe("User Model Tests", () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI!);
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
            username: "testuser",
            password: "testpass",
        });

        const savedUser = await validUser.save();

        expect(savedUser._id).toBeDefined();
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

    it("should not allow duplicate usernames", async () => {
        const user1 = new User({ username: "dupuser", password: "pass1" });
        await user1.save();

        const user2 = new User({ username: "dupuser", password: "pass2" });
        let err: MongoServerError | null = null;

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

    it("should find a user by username", async () => {
        const user = new User({ username: "findme", password: "secret" });
        await user.save();

        const foundUser = await User.findOne({ username: "findme" });
        expect(foundUser).not.toBeNull();
        expect(foundUser!.username).toBe("findme");
    });
});
