import NoteInformation from "./note/NoteInformation";

/**
 * Note page component for displaying information and editor for notes
 */
export default function Note() {
    return (
        <div className="flex size-full flex-col gap-10 rounded-xl border border-border bg-surface p-10">
            <NoteInformation />
        </div>
    );
}
