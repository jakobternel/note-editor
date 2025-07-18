import { create } from "zustand";
import { persist } from "zustand/middleware";

import { User } from "@/types/user";

type UserStore = {
    user: User | null;
    addUserDetails: (
        id: string,
        username: string,
        email: string,
        name?: string
    ) => void;
    clearUserDetails: () => void;
};

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            addUserDetails: (id, username, email, name) => {
                set({
                    user: { id, username, email, name },
                });
            },
            clearUserDetails: () => {
                set({ user: null });
            },
        }),
        {
            name: "user-storage",
        }
    )
);
