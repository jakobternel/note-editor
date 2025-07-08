import mongoose from "mongoose";
import User from "@/models/User";
import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { MongoServerError } from "mongodb";
import bcrypt from "bcrypt";

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
            username: "user",
            password: "password",
        });

        const response = await validUser.save();

        expect(response._id).toBeDefined();
        expect(response.email).toBe("test@test.com");
        expect(response.username).toBe("user");
    });

    it("should not save user without required fields", async () => {
        const userWithoutUsername = new User({ password: "password" });
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
            password: "password",
        });
        await user1.save();

        const user2 = new User({
            email: "test@test.com",
            username: "user2",
            password: "password",
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
            username: "user",
            password: "password",
        });
        await user1.save();

        const user2 = new User({
            email: "test2@test.com",
            username: "user",
            password: "password",
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

    it("hashes password before saving a user", async () => {
        const user = new User({
            email: "test@test.com",
            username: "username",
            password: "password",
        });

        await user.save();

        expect(user.password).not.toBe("password");
        const isMatch = await bcrypt.compare("password", user.password);
        expect(isMatch).toBe(true);
    });

    it("does not rehash password if not modified", async () => {
        const user = new User({
            email: "test@test.com",
            username: "test",
            password: "password",
        });

        await user.save();
        const oldHashedPassword = user.password;

        user.username = "test2";
        await user.save();

        expect(user.password).toBe(oldHashedPassword);
    });

    it("correctly compares password hashes", async () => {
        const user = new User({
            email: "test@test.com",
            username: "compareuser",
            password: "password",
        });

        await user.save();

        const isValid = await bcrypt.compare("password", user.password);
        expect(isValid).toBe(true);

        const isInvalid = await bcrypt.compare("wrongpassword", user.password);
        expect(isInvalid).toBe(false);
    });

    it("should find a user by email", async () => {
        const user = new User({
            email: "test@test.com",
            username: "user",
            password: "password",
        });
        await user.save();

        const response = await User.findOne({ email: "test@test.com" });

        expect(response).not.toBeNull();
        expect(response!.email).toBe("test@test.com");
        expect(response!.username).toBe("user");
    });

    it("should find a user by username", async () => {
        const user = new User({
            email: "test@test.com",
            username: "user",
            password: "password",
        });
        await user.save();

        const response = await User.findOne({ username: "user" });

        expect(response).not.toBeNull();
        expect(response!.email).toBe("test@test.com");
        expect(response!.username).toBe("user");
    });
});
