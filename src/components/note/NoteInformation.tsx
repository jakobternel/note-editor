import { ExportIcon, StarIcon, TrashIcon, XIcon } from "@phosphor-icons/react";

/**
 * Tag component to be rendered for each note tag
 *
 * @param tagName String of the tag name to be displayed
 */
function NoteTag({ tagName }: { tagName: string }) {
    return (
        <div className="group relative flex cursor-pointer items-center gap-2 rounded-sm bg-border px-3 py-1">
            <p>{tagName}</p>
            <XIcon
                size={12}
                weight="bold"
                className="-mr-1 hidden hover:text-red-500 group-hover:block"
            />
        </div>
    );
}

/**
 * NoteInformation component to be used on Note component. Allows the user to edit title, complete note actions (favourite, delete, export, and view information) as well as showing information about creator, edit dates and tags.
 */
export default function NoteInformation() {
    return (
        <div className="flex w-full flex-col gap-5">
            <div className="flex gap-5">
                <input
                    type="text"
                    placeholder="New Note"
                    className="grow bg-surface font-heading text-3xl font-semibold focus:outline-none"
                />
                <div className="flex gap-1">
                    <div className="cursor-pointer rounded-md p-2 transition-all hover:bg-yellow-500/30 hover:text-yellow-500">
                        <StarIcon size={24} weight="bold" />
                    </div>
                    <div className="cursor-pointer rounded-md p-2 transition-all hover:bg-green-500/30 hover:text-green-500">
                        <ExportIcon size={24} weight="bold" />
                    </div>
                    <div className="cursor-pointer rounded-md p-2 transition-all hover:bg-red-500/30 hover:text-red-500">
                        <TrashIcon size={24} weight="bold" />
                    </div>
                </div>
            </div>
            <div className="flex gap-5">
                <div className="flex w-full gap-5 text-sm">
                    <div className="flex flex-col gap-2">
                        <p className="flex h-8 items-center text-textSecondary">
                            Created By
                        </p>
                        <p className="flex h-8 items-center text-textSecondary">
                            Note Created
                        </p>
                        <p className="flex h-8 items-center text-textSecondary">
                            Last Modified
                        </p>
                        <p className="flex h-8 items-center text-textSecondary">
                            Tags
                        </p>
                    </div>
                    <div className="flex h-full grow flex-col gap-2">
                        <p className="flex h-8 items-center">Test Account</p>
                        <p className="flex h-8 items-center">
                            19 July 2025, 15:32 PM
                        </p>
                        <p className="flex h-8 items-center">
                            19 July 2025, 15:32 PM
                        </p>
                        <div className="flex h-8 items-center gap-2">
                            <NoteTag tagName="Tag 1" />
                            <NoteTag tagName="Tag 2" />
                            <NoteTag tagName="Tag 3" />
                            <div className="cursor-pointer rounded-sm bg-border px-3 py-1 transition-all hover:bg-primary">
                                <p>+ Add Tag</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
