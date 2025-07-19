import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";

import FileElement from "./navbar/FileElement";
import NavElement from "./navbar/NavElement";
import {
    PlusSquareIcon,
    SquaresFourIcon,
    ListDashesIcon,
    BookmarksSimpleIcon,
    TrashIcon,
} from "@phosphor-icons/react";
import { useToastElementStore } from "@/zustand/toastStore";
import { useUserStore } from "@/zustand/userStore";

// GQL query to add user account
const ADD_NOTE = gql`
    mutation CreateNote(
        $noteId: String!
        $ownerId: String!
        $ownerUsername: String!
        $createdDate: String!
        $lastEditedDate: String!
    ) {
        createNote(
            noteId: $noteId
            ownerId: $ownerId
            ownerUsername: $ownerUsername
            createdDate: $createdDate
            lastEditedDate: $lastEditedDate
        ) {
            noteId
            ownerId
            ownerUsername
            createdDate
            lastEditedDate
        }
    }
`;

// Get current formatted date. Returns date in day month year and hours:min format. E.g., 19 July 2025, 21:55 PM
const getDate = (): string => {
    const date = new Date();

    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const timeModifier = Number(hours) < 12 ? "AM" : "PM";

    return `${day} ${month} ${year}, ${hours}:${minutes} ${timeModifier}`;
};

/**
 * Navbar component to be used in Layout component
 */
export default function Navbar() {
    const router = useRouter();
    const createToast = useToastElementStore(
        (state) => state.createToastElement
    );
    const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state of button click of add new note

    const [addNote] = useMutation(ADD_NOTE); // GQL mutation to add new note
    const user = useUserStore((state) => state.user); // Get user information from zustand

    return (
        <nav className="flex h-full w-48 flex-col border-r border-border bg-surface">
            <div className="flex h-16 w-full items-center gap-3 border-b border-border px-5">
                <Image
                    src="/icon_black.png"
                    alt="Notilo logo"
                    width={24}
                    height={24}
                />
                <p className="font-heading text-2xl font-semibold text-primary">
                    Notilo
                </p>
            </div>
            <div className="flex grow flex-col gap-1 p-3">
                <NavElement
                    navElementName="New Note"
                    icon={PlusSquareIcon}
                    isLoading={isLoading}
                    clickAction={async () => {
                        setIsLoading(true); // Set isLoading to be true to show loading spinner

                        try {
                            // Throw error if no user specified in zustand state
                            if (!user) {
                                throw new Error(
                                    "No user information stored in state"
                                );
                            }

                            // Create new markdown document in S3
                            const res = await fetch("/api/notes/create", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ user: user.id }),
                            });
                            const data = await res.json();

                            if (data.success) {
                                // Create document in mongodb database using GQL
                                await addNote({
                                    variables: {
                                        noteId: data.noteId,
                                        ownerId: user.id,
                                        ownerUsername: user.username,
                                        createdDate: getDate(),
                                        lastEditedDate: getDate(),
                                    },
                                });

                                // Show success toast and navigate to new page
                                createToast(
                                    "success",
                                    "Created new note successfully."
                                );
                                router.push(`/note/${data.noteId}`);
                            } else {
                                // Throw error if unable to create S3 document
                                throw new Error(
                                    "Error creating new S3 document"
                                );
                            }
                        } catch {
                            // Disable loading spinner if error caught
                            setIsLoading(false);

                            // Show error toast if error caught
                            createToast(
                                "error",
                                "Failed to crete new note. Please try again."
                            );
                        }
                    }}
                />
                <NavElement
                    navElementName="Dashboard"
                    icon={SquaresFourIcon}
                    path="/"
                />
                <NavElement
                    navElementName="Notes List"
                    icon={ListDashesIcon}
                    path="/list"
                />
                <NavElement
                    navElementName="Favourites"
                    icon={BookmarksSimpleIcon}
                    path="/favourites"
                />
                <NavElement
                    navElementName="Recently Deleted"
                    icon={TrashIcon}
                    path="/deleted"
                />
                <hr className="my-2" />
                <FileElement noteName="Test Note 1" />
                <FileElement noteName="Test Note 2" />
                <FileElement noteName="Test Note 3" />
            </div>
        </nav>
    );
}
