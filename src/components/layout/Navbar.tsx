import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

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

/**
 * Navbar component to be used in Layout component
 */
export default function Navbar() {
    const router = useRouter();
    const createToast = useToastElementStore(
        (state) => state.createToastElement
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
                        setIsLoading(true);
                        const res = await fetch("/api/notes/create", {
                            method: "POST",
                        });

                        const data = await res.json();

                        if (data.success) {
                            createToast(
                                "success",
                                "Created new note successfully."
                            );
                            router.push(`/note/${data.noteId}`);
                        } else {
                            createToast(
                                "error",
                                "Failed to crete new note. Please try again."
                            );
                        }

                        setIsLoading(false);
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
