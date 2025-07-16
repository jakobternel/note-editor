import router from "next/router";

import {
    BugIcon,
    GearSixIcon,
    SignOutIcon,
    UserIcon,
} from "@phosphor-icons/react";

import { gql, useMutation } from "@apollo/client";

const LOGOUT = gql`
    mutation Logout {
        logoutUser
    }
`;

/**
 * UserDropdown component to be used in UserButton component
 */
export default function UserDropdown() {
    const [logout] = useMutation(LOGOUT);

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    return (
        <div className="flex w-48 flex-col gap-3 rounded-md border border-border bg-surface p-3 shadow-sm">
            <p className="text-xs text-textSecondary">@user20</p>
            <hr className="bg-border" />
            <div className="flex flex-col gap-1">
                <div className="flex cursor-pointer items-center gap-2 rounded-md bg-opacity-25 p-2 transition-all hover:bg-accent">
                    <UserIcon size={16} weight="bold" />
                    <p className="text-sm">Profile</p>
                </div>
                <div className="flex cursor-pointer items-center gap-2 rounded-md bg-opacity-25 p-2 transition-all hover:bg-accent">
                    <GearSixIcon size={16} weight="bold" />
                    <p className="text-sm">Settings</p>
                </div>
                <div className="flex cursor-pointer items-center gap-2 rounded-md bg-opacity-25 p-2 transition-all hover:bg-accent">
                    <BugIcon size={16} weight="bold" />
                    <p className="text-sm">Report a Bug</p>
                </div>
            </div>
            <div
                className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-red-500 p-2 transition-all hover:bg-red-100"
                onClick={handleLogout}
            >
                <p className="text-xs font-semibold">Sign Out</p>
                <SignOutIcon size={16} weight="bold" />
            </div>
        </div>
    );
}
