import { models, model, Schema } from "mongoose";

export interface INote {
    noteId: string;
    ownerId: string;
    ownerUsername: string;
    createdDate: string;
    lastEditedDate: string;
    tags: string[];
}

const NoteSchema = new Schema<INote>({
    noteId: { type: String, required: true, unique: true },
    ownerId: { type: String, required: true },
    ownerUsername: { type: String, required: true },
    createdDate: { type: String, required: true },
    lastEditedDate: { type: String, required: true },
    tags: { type: [String], required: true },
});

const Note = models.Note || model<INote>("Note", NoteSchema);
export default Note;
