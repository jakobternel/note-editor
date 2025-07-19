import { ListBucketsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

import s3 from "@/lib/s3";

describe("AWS S3 Connection", () => {
    test("should list S3 buckets successfully", async () => {
        try {
            const buckets = await s3.send(new ListBucketsCommand());

            expect(buckets.Buckets).toBeDefined();
            expect(Array.isArray(buckets.Buckets)).toBe(true);
        } catch (error) {
            console.error("S3 listBuckets error:", error);
            throw error;
        }
    }, 20000);
});
