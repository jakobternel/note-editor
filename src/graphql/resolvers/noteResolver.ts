import Note from "@/models/Note";

export const noteResolvers = {
    Query: {
        // Get all notes from single user
        notes: async (_: unknown, { ownerId }: { ownerId: string }) =>
            await Note.find({ ownerId }),

        // Get details of specific note by noteId
        noteById: async (_: unknown, { noteId }: { noteId: string }) => {
            await Note.findOne({ noteId });
        },
    },
    Mutation: {
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
    },
};
