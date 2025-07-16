import router from "next/router";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";

import {
    BugIcon,
    GearSixIcon,
    SignOutIcon,
    UserIcon,
} from "@phosphor-icons/react";
import Dialog from "../Dialog";

const LOGOUT = gql`
    mutation Logout {
        logoutUser
    }
`;

/**
 * UserDropdown component to be used in UserButton component
 */
export default function UserDropdown() {
    const [dialogActive, setDialogActive] = useState<boolean>(false);
    const [logout] = useMutation(LOGOUT);

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    return (
        <div className="flex w-48 flex-col gap-3 rounded-md border border-border bg-surface p-3 shadow-sm">
            {dialogActive && (
                <Dialog
                    title="Confirm Log Out"
                    content="Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Deserunt quae sit sint hic accusantium explicabo delectus
                    iure illo aliquid excepturi!"
                    buttons={[
                        <p
                            key="cancel"
                            onClick={() => setDialogActive(false)}
                            className="cursor-pointer rounded-md border border-border px-5 py-2 text-sm transition-all hover:bg-black/5"
                        >
                            Cancel
                        </p>,
                        <p
                            key="logout"
                            onClick={handleLogout}
                            className="cursor-pointer rounded-md border border-red-500 px-5 py-2 text-sm font-semibold text-red-500 transition-all hover:bg-red-500/10"
                        >
                            Log Out
                        </p>,
                    ]}
                    onClose={() => setDialogActive(false)}
                />
            )}
            <p className="text-xs text-textSecondary">@user20</p>
            <hr className="bg-border" />
            <div className="flex flex-col gap-1">
                <div className="flex cursor-pointer items-center gap-2 rounded-md p-2 transition-all hover:bg-accent">
                    <UserIcon size={16} weight="bold" />
                    <p className="text-sm">Profile</p>
                </div>
                <div className="flex cursor-pointer items-center gap-2 rounded-md p-2 transition-all hover:bg-accent">
                    <GearSixIcon size={16} weight="bold" />
                    <p className="text-sm">Settings</p>
                </div>
                <div className="flex cursor-pointer items-center gap-2 rounded-md p-2 transition-all hover:bg-accent">
                    <BugIcon size={16} weight="bold" />
                    <p className="text-sm">Report a Bug</p>
                </div>
            </div>
            <div
                className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-red-500 p-2 transition-all hover:bg-red-100"
                onClick={() => setDialogActive(true)}
            >
                <p className="text-xs font-semibold">Sign Out</p>
                <SignOutIcon size={16} weight="bold" />
            </div>
        </div>
    );
}
