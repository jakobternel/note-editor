import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { JWTPayload, SignJWT } from "jose";

import { middleware } from "@/middleware";

const JWT_SECRET = new TextEncoder().encode("secret");

function createJWTToken(
    payload: JWTPayload,
    incorrectJWT?: Uint8Array<ArrayBufferLike>
) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(incorrectJWT ? incorrectJWT : JWT_SECRET);
}

function simulateRequest(path: string, token?: string): NextRequest {
    const headers: HeadersInit = token
        ? {
              cookie: `token=${token}`,
          }
        : {};

    const req = {
        url: `http://localhost${path}`,
        nextUrl: new URL(`http://localhost${path}`),
        cookies: {
            get: (name: string) => {
                if (name === "token" && token) {
                    return { name, value: token };
                }
                return undefined;
            },
        },
        headers,
    };

    return req as unknown as NextRequest;
}

describe("middleware auth logic", () => {
    it("redirects unauthenticated user trying to access /", async () => {
        const req = simulateRequest("/");
        const res = await middleware(req);

        expect(new URL(res.headers.get("location")!).pathname).toBe("/login");
    });

    it("allows authenticated user to access /", async () => {
        const token = await createJWTToken({
            userId: "user",
            email: "test@test.com",
        });
        const req = simulateRequest("/", token);
        const res = await middleware(req);

        expect(res.status).toBe(200);
        expect(res.headers.get("location")).toBeNull();
    });

    it("redirects logged-in user from /login", async () => {
        const token = await createJWTToken({
            userId: "user",
            email: "test@test.com",
        });
        const req = simulateRequest("/login", token);
        const res = await middleware(req);

        expect(res.status).toBe(307);
        expect(new URL(res.headers.get("location")!).pathname).toBe("/");
    });

    it("lets unauthenticated user visit /login", async () => {
        const req = simulateRequest("/login");
        const res = await middleware(req);

        expect(res.status).toBe(200);
        expect(res.headers.get("location")).toBeNull();
    });

    it("redirects logged-in user from /register", async () => {
        const token = await createJWTToken({
            userId: "user",
            email: "test@test.com",
        });
        const req = simulateRequest("/register", token);
        const res = await middleware(req);

        expect(res.status).toBe(307);
        expect(new URL(res.headers.get("location")!).pathname).toBe("/");
    });

    it("lets unauthenticated user visit /register", async () => {
        const req = simulateRequest("/register");
        const res = await middleware(req);

        expect(res.status).toBe(200);
        expect(res.headers.get("location")).toBeNull();
    });

    it("redirects user from / with invalid token", async () => {
        const incorrectToken = await createJWTToken(
            {
                userId: "user",
                email: "test@test.com",
            },
            new TextEncoder().encode("wrongsecret")
        );

        const req = simulateRequest("/", incorrectToken);
        const res = await middleware(req);

        expect(res.status).toBe(307);
        expect(new URL(res.headers.get("location")!).pathname).toBe("/login");
    });

    it("allows user with invalid token to access /login", async () => {
        const incorrectToken = await createJWTToken(
            {
                userId: "user",
                email: "test@test.com",
            },
            new TextEncoder().encode("wrongsecret")
        );

        const req = simulateRequest("/login", incorrectToken);
        const res = await middleware(req);

        expect(res.status).toBe(200);
        expect(res.headers.get("location")).toBeNull();
    });

    it("allows user with invalid token to access /register", async () => {
        const incorrectToken = await createJWTToken(
            {
                userId: "user",
                email: "test@test.com",
            },
            new TextEncoder().encode("wrongsecret")
        );

        const req = simulateRequest("/register", incorrectToken);
        const res = await middleware(req);

        expect(res.status).toBe(200);
        expect(res.headers.get("location")).toBeNull();
    });
});
