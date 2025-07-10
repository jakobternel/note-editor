import { IconProps } from "@phosphor-icons/react";

/**
 * NavElement component to be rendered on Navbar
 *
 * @param navElementName String of nav element name
 * @param icon Icon element to be displayed
 * @param active Boolean of if the nav element should be highlighted as active
 */
export default function FileElement({
    navElementName,
    icon: Icon,
    active,
}: {
    navElementName: string;
    icon: React.ComponentType<IconProps>;
    active?: boolean;
}) {
    return (
        <div
            className={`flex w-full cursor-pointer items-center gap-2 rounded-lg p-2 transition-all ${active ? "bg-primary hover:bg-buttonHover" : "hover:bg-accent"}`}
        >
            <Icon
                size={20}
                weight="bold"
                className={`${active ? "text-textInverse" : ""}`}
            />
            <p className={`text-sm ${active ? "text-textInverse" : ""}`}>
                {navElementName}
            </p>
        </div>
    );
}
