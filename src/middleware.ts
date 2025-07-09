import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Paths that should be checked for authenticated user
const noLoginRequired = ["/login", "/register"]; // Redirect to "/" if user already logged in and attempts to access these pages
const loginRequired = ["/"]; // Redirect to "/login" if user not logged in and authenticated

// Validate JWT
async function validateJWT(token: string) {
    try {
        const encodedSecret = new TextEncoder().encode(process.env.JWT_SECRET!); // Create encoded secret
        const { payload } = await jwtVerify(token, encodedSecret); // Verify JWT using encoded secret
        return payload;
    } catch {
        return null;
    }
}

// Handle route middleware
export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value; // Get token from cookies
    const path = req.nextUrl.pathname; // Path the user has tried to access

    const isNoLoginRequired = noLoginRequired.includes(path); // Boolean to see if the user is trying to access a path that is not allowed for logged in users
    const isLoginRequired = loginRequired.includes(path); // Boolean to see if the user is trying to access a path that requires JWT

    const jwtPayload = token ? await validateJWT(token) : null;

    // Redirect user if logged in and trying to access a page which is for non-logged in users
    if (jwtPayload && isNoLoginRequired) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Redirect user if not logged in and trying to access a page which is for logged in users
    if (!jwtPayload && isLoginRequired) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

// List of routes to use middleware on
export const config = {
    matcher: ["/login", "/register", "/"],
};
