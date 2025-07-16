import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { XIcon } from "@phosphor-icons/react";

/**
 * Dialog component to appear to confirm user action
 *
 * @param title Title of dialog box
 * @param content Text content to be displayed on dialog box
 * @param buttons Array of elements representing buttons to be displayed at bottom right of dialog box
 * @param onClose Function to be called when dialog box is closed when background or the X button clicked
 */
export default function Dialog({
    title,
    content,
    buttons,
    onClose,
}: {
    title: string;
    content: string;
    buttons: React.ReactNode[];
    onClose: () => void;
}) {
    const [mounted, setMounted] = useState<boolean>(false);

    // Set mounted state after render to ensure createPortal works as intended
    useEffect(() => {
        setMounted(true);
    }, []);

    // Do nothing if component not rendered
    if (!mounted) return null;

    return createPortal(
        <div
            className="absolute left-0 top-0 z-50 h-screen w-screen bg-black/50"
            onClick={onClose} // Close dialog component if user clicks on black background
        >
            <div
                className="absolute left-1/2 top-1/2 flex w-[30rem] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 rounded-lg border border-border bg-surface p-5"
                onClick={(e) => e.stopPropagation()} // Override onClick of parent element to ensure dialog is not closed if box is clicked
            >
                <div className="flex items-center justify-between">
                    <p className="font-heading text-xl font-semibold">
                        {title}
                    </p>
                    <XIcon
                        size={16}
                        weight="bold"
                        className="cursor-pointer text-textSecondary transition-all hover:text-primary"
                        onClick={onClose} // Close dialog box if X icon clicked
                    />
                </div>
                <p className="text-sm text-textSecondary">{content}</p>
                <div className="flex justify-end gap-3">
                    {/* Display component buttons */}
                    {buttons.map((button) => {
                        return button;
                    })}
                </div>
            </div>
        </div>,
        document.body
    );
}
