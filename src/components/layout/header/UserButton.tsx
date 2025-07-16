import { useState } from "react";
import UserDropdown from "./UserDropdown";

/**
 * UserButton component to be used in Header component
 */
export default function UserButton() {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    return (
        <div className="relative flex items-center gap-5">
            <div>
                <p className="text-sm text-textSecondary">test-1234</p>
            </div>
            <div
                className="relative flex size-8 cursor-pointer items-center justify-center rounded-full border border-green-400 bg-green-200"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* <div className="relative"> */}
                <p className="text-xs font-semibold">TE</p>
                {isHovered && (
                    <div className="absolute right-0 top-7 cursor-default pt-3">
                        <UserDropdown />
                    </div>
                )}
            </div>
        </div>
    );
}
