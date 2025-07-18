import { MagnifyingGlassIcon, CommandIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

/**
 * SearchBar component to be used in Header component
 */
export default function SearchBar() {
    const inputRef = useRef<HTMLInputElement>(null); // Ref for input field
    const [isMac, setIsMac] = useState<boolean>(false);

    // Add event listener for keypresses
    useEffect(() => {
        const isMacDevice = /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent); // Detect if the user is using an Apple device
        setIsMac(isMacDevice);

        const handleKeyDown = (e: KeyboardEvent) => {
            const modifier = isMacDevice ? e.metaKey : e.ctrlKey; // Define modifier based on OS

            if (modifier && e.key.toLowerCase() === "k") {
                e.preventDefault();
                inputRef.current?.focus(); // Focus to search input if user clicks Cmd/Ctrl + K
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                placeholder="Search by Keyword"
                className="w-64 rounded-lg border border-border bg-formInputBackground px-8 py-2 font-main text-xs focus:border-formInputFocus focus:outline-none"
            />
            <MagnifyingGlassIcon
                size={16}
                weight="bold"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-textSecondary"
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
                {/* Conditionally render Apple Command symbol or Ctrl depending on user OS */}
                {isMac ? (
                    <CommandIcon size={16} className="text-textSecondary" />
                ) : (
                    <p className="font-sans text-xs text-textSecondary">
                        Ctrl +
                    </p>
                )}
                <p className="font-sans text-xs text-textSecondary">K</p>
            </div>
        </div>
    );
}
