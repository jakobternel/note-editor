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
            const user = new User({ email, username, password });
            await user.save();
            return user;
        },
    },
};
