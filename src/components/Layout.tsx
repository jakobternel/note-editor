import React, { ReactNode } from "react";
import Navbar from "./layout/Navbar";
import Header from "./layout/Header";
import Toast from "./layout/Toast";

/**
 * Layout component to be applied by default to all pages
 *
 * @param children ReactNode of child component to be rendered on page
 */
export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="h-screen w-screen">
            <Toast />
            <div className="flex size-full">
                <div>
                    <Navbar />
                </div>
                <div className="flex grow flex-col">
                    <div className="shrink-0">
                        <Header />
                    </div>
                    <main className="grow !overflow-auto">{children}</main>
                </div>
            </div>
        </div>
    );
}
