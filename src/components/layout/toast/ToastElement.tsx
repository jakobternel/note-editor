import {
    CheckCircleIcon,
    WarningCircleIcon,
    XCircleIcon,
} from "@phosphor-icons/react";

import type { Toast } from "@/types/toast";
import { useToastElementStore } from "@/zustand/toastStore";

// List of icons that can be displayed based on toastType
const ERROR_TYPES = {
    error: <XCircleIcon size={16} weight="bold" className="text-red-500" />,
    warning: (
        <WarningCircleIcon
            size={16}
            weight="bold"
            className="text-orange-500"
        />
    ),
    success: (
        <CheckCircleIcon size={16} weight="bold" className="text-green-500" />
    ),
};

export default function ToastElement({ data }: { data: Toast }) {
    const deleteToast = useToastElementStore(
        (state) => state.deleteToastElement
    );

    return (
        <div
            className="flex w-80 cursor-pointer gap-2 rounded-lg border border-border bg-surface p-3 shadow-sm"
            onClick={() => deleteToast(data.id)} // Delete toast item when clicked on
        >
            <div className="flex h-5 items-center">
                {ERROR_TYPES[data.toastType]}
            </div>
            <div className="text-sm">
                {/* Show title if specified on toast element. Otherwise, capitalise first letter in error type. E.g., error -> Error */}
                <p>
                    {data.title ??
                        data.toastType.charAt(0).toUpperCase() +
                            data.toastType.slice(1)}
                </p>
                <p className="text-textSecondary">{data.content}</p>
            </div>
        </div>
    );
}
