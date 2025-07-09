import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongod: MongoMemoryServer;

beforeAll(async () => {
    // Set JWT_SECRET to handle tests
    process.env.JWT_SECRET = "secret";

    mongod = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongod.getUri();

    // Connect mongoose to in-memory mongo
    await mongoose.connect(process.env.MONGO_URI!);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

afterEach(async () => {
    // Clean database between tests
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});
