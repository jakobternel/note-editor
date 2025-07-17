import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Paths that should be checked for authenticated user
const noLoginRequired = ["/login", "/register"]; // Redirect to "/" if user already logged in and attempts to access these pages

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

    // Determine if path being accessed is listed as a public route for non-logged in users only
    const isPublicRoute = noLoginRequired.includes(path);

    // Get JWT and validate
    const jwtPayload = token ? await validateJWT(token) : null;

    // Redirect user if logged in and trying to access a page which is for non-logged in users
    if (jwtPayload && isPublicRoute) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Redirect user if not logged in and trying to access a page which is for logged in users
    if (!jwtPayload && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

// Matcher to apply middleware to all routes
export const config = {
    matcher: "/:path*",
};
