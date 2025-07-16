import User from "@/models/User";
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { NextApiResponse } from "next";

const generateToken = (userId: string, email: string) => {
    const JWT_SECRET = process.env.JWT_SECRET;

    // Throw error if no JWT declared
    if (!JWT_SECRET) {
        console.error("No JWT specified");
        throw new Error("There was an issue. Please try again.");
    }

    // Return generated JWT token
    return jwt.sign({ userId, email }, JWT_SECRET, {
        expiresIn: "7d",
    });
};

export const resolvers = {
    Query: {
        // Return all users
        users: async () => await User.find(),

        // Return single user by ID
        userById: async (_: unknown, { id }: { id: string }) =>
            await User.findById(id),

        // Return single user by email
        userByEmail: async (_: unknown, { email }: { email: string }) => {
            return await User.findOne({ email });
        },

        // Return single user by username
        userByUsername: async (
            _: unknown,
            { username }: { username: string }
        ) => {
            return await User.findOne({ username });
        },
    },
    Mutation: {
        // Create and save a new user. Return the user details after save
        createUser: async (
            _: unknown,
            {
                email,
                username,
                password,
            }: { email: string; username: string; password: string },
            context: { res: NextApiResponse }
        ) => {
            // Check if a user already exists with the email or username
            const existingUserByEmail = await User.findOne({ email });
            const existingUserByUsername = await User.findOne({ username });

            // Throw error if email already registered with account
            if (existingUserByEmail || existingUserByUsername) {
                throw new Error("Account already registered.");
            }

            // Add new user and return details
            const user = new User({ email, username, password });
            await user.save();

            // Generate JWT token
            const token = generateToken(user._id, user.email);

            // Set as cookie if not being run from gql test
            if (!context?.res?.setHeader) {
                console.warn("No setHeader found in context. Skipping cookies"); // Do not set header if test run from gql tests
            } else {
                context.res.setHeader(
                    "Set-Cookie",
                    `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Strict`
                );
            }

            // Return user
            return user;
        },

        // Handle login of user
        loginUser: async (
            _: unknown,
            { email, password }: { email: string; password: string },
            context: { res: NextApiResponse }
        ) => {
            const user = await User.findOne({ email });

            // Throw error if no user found with username
            if (!user) {
                throw new Error("Invalid email or password");
            }

            // Check if password input matches hashed password
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                throw new Error("Invalid email or password");
            }

            // Generate JWT token
            const token = generateToken(user._id, user.email);

            // Set as cookie if not being run from gql test
            if (!context?.res?.setHeader) {
                console.warn("No setHeader found in context. Skipping cookies"); // Do not set header if test run from gql tests
            } else {
                context.res.setHeader(
                    "Set-Cookie",
                    `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Strict`
                );
            }

            // Return user details
            return user;
        },

        // Handle logout of user
        logoutUser: async (
            _: unknown,
            __: unknown,
            context: { res: NextApiResponse }
        ) => {
            // Expire cookie when GQL query called
            context.res.setHeader(
                "Set-Cookie",
                serialize("token", "", {
                    httpOnly: true,
                    path: "/",
                    sameSite: "lax",
                    expires: new Date(0),
                })
            );

            return true;
        },
    },
};
