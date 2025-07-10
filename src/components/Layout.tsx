import React, { ReactNode } from "react";
import Navbar from "./layout/Navbar";
import Header from "./layout/Header";

/**
 * Layout component to be applied by default to all pages
 *
 * @param children ReactNode of child component to be rendered on page
 */
export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="h-screen w-screen overflow-hidden">
            <div className="flex size-full">
                <div>
                    <Navbar />
                </div>
                <div className="grow">
                    <Header />
                    <main>{children}</main>
                </div>
            </div>
        </div>
    );
}
