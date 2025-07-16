import ToastElement from "./toast/ToastElement";

import type { Toast } from "@/types/toast";
import { useToastElementStore } from "@/zustand/toastStore";

export default function Toast() {
    const toasts = useToastElementStore((state) => state.toasts); // Get toast elements from zustand store

    return (
        <div className="absolute bottom-0 right-0 flex flex-col gap-3 p-5">
            {/* Crete toast element for each item in zustand store */}
            {toasts.map((toast: Toast) => {
                return <ToastElement key={toast.id} data={toast} />;
            })}
        </div>
    );
}
