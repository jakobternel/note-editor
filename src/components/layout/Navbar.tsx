import Image from "next/image";
import FileElement from "./navbar/FileElement";
import NavElement from "./navbar/NavElement";
import {
    PlusSquareIcon,
    SquaresFourIcon,
    ListDashesIcon,
    BookmarksSimpleIcon,
    TrashIcon,
} from "@phosphor-icons/react";

/**
 * Navbar component to be used in Layout component
 */
export default function Navbar() {
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
                    path="/new"
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
