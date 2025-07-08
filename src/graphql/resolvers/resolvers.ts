import User from "@/models/User";

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
            }: { email: string; username: string; password: string }
        ) => {
            // Check if a user already exists with the email or username
            const existingUserByEmail = await User.findOne({ email });
            const existingUserByUsername = await User.findOne({ username });

            // Throw error if email already registered with account
            if (existingUserByEmail) {
                throw new Error("Email already registered.");
            }

            if (existingUserByUsername) {
                throw new Error("Username already registered.");
            }

            // Add new user and return details
            const user = new User({ email, username, password });
            await user.save();
            return user;
        },
    },
};
