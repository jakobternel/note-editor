import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";

import { ExportIcon, StarIcon, TrashIcon, XIcon } from "@phosphor-icons/react";
import { useCurrentNoteStore } from "@/zustand/currentNoteStore";
import { useToastElementStore } from "@/zustand/toastStore";

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

// GQL query to update note title
const UPDATE_NOTE_TITLE = gql`
    mutation EditNote($noteId: String!, $noteTitle: String) {
        editTitle(noteId: $noteId, noteTitle: $noteTitle) {
            noteId
            ownerId
            ownerUsername
            createdDate
            lastEditedDate
            noteTitle
        }
    }
`;

/**
 * NoteInformation component to be used on Note component. Allows the user to edit title, complete note actions (favourite, delete, export, and view information) as well as showing information about creator, edit dates and tags.
 */
export default function NoteInformation() {
    const [noteTitle, setNoteTitle] = useState<string>(""); // Input state of note title
    const [updateNoteTitle] = useMutation(UPDATE_NOTE_TITLE); // Mutation for updating note title

    // Zustand state for currently selected note
    const addNoteDetails = useCurrentNoteStore(
        (note) => note.changeCurrentNote
    );
    const note = useCurrentNoteStore((state) => state.note);

    // Zustand state for handling toast notifications
    const createToast = useToastElementStore(
        (state) => state.createToastElement
    );

    // Set note title input based on note state loaded from Zustand on [id].tsx component
    useEffect(() => {
        if (!note) {
            return;
        }

        setNoteTitle(note?.noteTitle ? note.noteTitle : "");
    }, [note]);

    // Function triggered onBlur for updating the name of the note in database
    const updateTitle = async () => {
        if (!note?.noteId) {
            return;
        }

        try {
            // Update note title in database and return the new note
            const noteData = await updateNoteTitle({
                variables: {
                    noteId: note.noteId,
                    noteTitle: noteTitle ?? "",
                },
            });

            const extractedData = noteData.data.editTitle;

            // Update zustand note state
            addNoteDetails(
                extractedData.noteId,
                extractedData.ownerId,
                extractedData.ownerUsername,
                extractedData.createdDate,
                extractedData.lastEditedDate,
                extractedData.noteTitle
            );
        } catch {
            createToast(
                "error",
                "There was a problem changing title. Please try again."
            );
        }
    };

    // Get current formatted date. Returns date in day month year and hours:min format. E.g., 19 July 2025, 21:55 PM
    const getDate = (inputDate: string): string => {
        const date = new Date(inputDate);

        const day = date.getDate();
        const month = date.toLocaleString("en-GB", { month: "long" });
        const year = date.getFullYear();

        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        const timeModifier = Number(hours) < 12 ? "AM" : "PM";

        return `${day} ${month} ${year}, ${hours}:${minutes} ${timeModifier}`;
    };

    return (
        <div className="flex w-full flex-col gap-5">
            <div className="flex gap-5">
                <input
                    type="text"
                    placeholder="New Note"
                    value={noteTitle}
                    onChange={(e) => {
                        setNoteTitle(e.target.value);
                    }}
                    onBlur={async () => {
                        // Call updateTitle function if note name input has changed from what is stored in the zustand state
                        if (noteTitle !== note?.noteTitle) {
                            await updateTitle();
                        }
                    }}
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
                            {note?.createdDate
                                ? getDate(note?.createdDate)
                                : ""}
                        </p>
                        <p className="flex h-8 items-center">
                            {note?.lastEditedDate
                                ? getDate(note?.lastEditedDate)
                                : ""}
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
