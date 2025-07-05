import User from "@/models/User";

export const resolvers = {
    Query: {
        // Return all users
        users: async () => await User.find(),

        // Return single user by ID
        user: async (_: unknown, { id }: { id: string }) =>
            await User.findById(id),
    },
    Mutation: {
        // Create and save a new user. Return the user details after save
        createUser: async (
            _: unknown,
            { username, password }: { username: string; password: string }
        ) => {
            const user = new User({ username, password });
            await user.save();
            return user;
        },
    },
};
