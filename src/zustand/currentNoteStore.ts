import { create } from "zustand";
import { persist } from "zustand/middleware";

type CurrentNoteStore = {
    note: {
        noteId: string;
        ownerId: string;
        ownerUsername: string;
        createdDate: string;
        lastEditedDate: string;
        noteTitle: string;
    } | null;
    changeCurrentNote: (
        noteId: string,
        ownerId: string,
        ownerUsername: string,
        createdDate: string,
        lastEditedDate: string,
        noteTitle: string
    ) => void;
};

export const useCurrentNoteStore = create<CurrentNoteStore>()(
    persist(
        (set) => ({
            note: null,

            // Update state of current note
            changeCurrentNote: (
                noteId,
                ownerId,
                ownerUsername,
                createdDate,
                lastEditedDate,
                noteTitle
            ) => {
                set({
                    note: {
                        noteId,
                        ownerId,
                        ownerUsername,
                        createdDate,
                        lastEditedDate,
                        noteTitle,
                    },
                });
            },
        }),
        {
            name: "user-storage",
        }
    )
);
