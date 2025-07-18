import { FileIcon } from "@phosphor-icons/react";

/**
 * FileElement component to be rendered on Navbar
 *
 * @param noteName String of file name
 */
export default function FileElement({ noteName }: { noteName: string }) {
    return (
        <div className="flex w-full cursor-pointer items-center gap-2 rounded-lg p-2 transition-all hover:bg-accent">
            <FileIcon size={20} weight="bold" />
            <p className="text-sm">{noteName}</p>
        </div>
    );
}
