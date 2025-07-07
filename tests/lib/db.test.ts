import dbConnect from "@/lib/db";
import { describe, it, expect } from "vitest";

describe("Database Connection Tests", () => {
    it("connects successfully", async () => {
        const conn = await dbConnect();
        expect(conn.connection.readyState).toBe(1);
    });

    it("caches connection and reuses it", async () => {
        const conn1 = await dbConnect();
        const conn2 = await dbConnect();
        expect(conn1).toBe(conn2);
    });
});
