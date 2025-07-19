import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

import { IconProps, SpinnerGapIcon } from "@phosphor-icons/react";

/**
 * NavElement component to be rendered on Navbar
 *
 * @param navElementName String of nav element name
 * @param icon Icon element to be displayed
 * @param path String path of the path to visit when nav element clicked
 */
export default function FileElement({
    navElementName,
    icon: Icon,
    path,
    isLoading,
    clickAction,
}: {
    navElementName: string;
    icon: React.ComponentType<IconProps>;
    isLoading?: boolean;
    path?: string;
    clickAction?: () => void;
}) {
    const router = useRouter();
    const active = usePathname() === path;

    return (
        <div
            className={`flex w-full cursor-pointer items-center gap-2 rounded-lg p-2 transition-all ${active ? "bg-primary hover:bg-buttonHover" : "hover:bg-accent"}`}
            onClick={() => {
                if (clickAction) {
                    clickAction();
                }

                if (path) {
                    router.push(path);
                }
            }}
        >
            {isLoading ? (
                <SpinnerGapIcon
                    size={20}
                    weight="bold"
                    className="animate-spin"
                />
            ) : (
                <Icon
                    size={20}
                    weight="bold"
                    className={`${active ? "text-textInverse" : ""}`}
                />
            )}
            <p className={`text-sm ${active ? "text-textInverse" : ""}`}>
                {navElementName}
            </p>
        </div>
    );
}
