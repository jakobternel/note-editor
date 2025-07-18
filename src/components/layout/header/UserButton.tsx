import { useState } from "react";
import UserDropdown from "./UserDropdown";

import { useUserStore } from "@/zustand/userStore";

/**
 * UserButton component to be used in Header component
 */
export default function UserButton() {
    const user = useUserStore((state) => state.user);

    const [isHovered, setIsHovered] = useState<boolean>(false);

    return (
        <div className="relative flex items-center gap-5">
            <div>
                <p className="text-sm text-textSecondary">{user?.name}</p>
            </div>
            <div
                className="relative flex size-8 cursor-pointer items-center justify-center rounded-full border border-green-400 bg-green-200"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <p className="text-xs font-semibold text-black">TE</p>
                {/* Only display userDropdown if user image is hovered */}
                {isHovered && (
                    <div className="absolute right-0 top-7 cursor-default pt-3">
                        <UserDropdown />
                    </div>
                )}
            </div>
        </div>
    );
}
