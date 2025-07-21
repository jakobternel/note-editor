import Note from "@/models/Note";

export const noteResolvers = {
    Query: {
        // Get all notes from single user
        notes: async (_: unknown, { ownerId }: { ownerId: string }) =>
            await Note.find({ ownerId }),

        // Get details of specific note by noteId
        noteById: async (_: unknown, { noteId }: { noteId: string }) => {
            const note = await Note.findOne({ noteId });

            // Throw error if no note found
            if (!note) {
                throw new Error("Note not found");
            }

            return note;
        },
    },
    Mutation: {
        // Add note to database
        createNote: async (
            _: unknown,
            {
                noteId,
                ownerId,
                ownerUsername,
                createdDate,
                lastEditedDate,
            }: {
                noteId: string;
                ownerId: string;
                ownerUsername: string;
                createdDate: string;
                lastEditedDate: string;
            }
        ) => {
            // Add new note and return details
            const note = new Note({
                noteId,
                ownerId,
                ownerUsername,
                createdDate,
                lastEditedDate,
            });
            await note.save();

            return note.toObject();
        },

        // Query to update note title
        editTitle: async (
            _: unknown,
            { noteId, noteTitle }: { noteId: string; noteTitle: string }
        ) => {
            try {
                const updatedNote = await Note.findOneAndUpdate(
                    { noteId },
                    { noteTitle, lastEditedDate: new Date().toISOString() },
                    { new: true }
                );

                return updatedNote.toObject();
            } catch {
                throw new Error("Error editing title");
            }
        },
    },
};
