// Allowed toastTypes which correspond with icons on toast element
export type ToastTypes = "success" | "error" | "warning";

export type Toast = {
    id: string;
    toastType: ToastTypes;
    title?: string;
    content: string;
};
