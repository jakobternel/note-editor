import { create } from "zustand";
import { nanoid } from "nanoid";

import { Toast, ToastTypes } from "@/types/toast";

type ToastElementStore = {
    toasts: Toast[];
    createToastElement: (
        toastType: ToastTypes,
        content: string,
        title?: string
    ) => void;
    deleteToastElement: (id: string) => void;
};

export const useToastElementStore = create<ToastElementStore>((set) => ({
    // Initialize toasts state with empty array
    toasts: [],

    // Create toast element in state array
    createToastElement: (
        toastType: ToastTypes,
        content: string,
        title?: string
    ) => {
        const id = nanoid();
        const newToast: Toast = { id, toastType, title, content };

        set((state) => ({ toasts: [...state.toasts, newToast] }));

        // Automatically delete toast element after 5 seconds
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter((toast) => toast.id !== id),
            }));
        }, 5000);
    },

    // Delete toast element using id
    deleteToastElement: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
}));
