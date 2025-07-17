import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apolloClient";
import type { AppProps } from "next/app";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";

import "@/styles/globals.css";
import { Sora, Inter, IBM_Plex_Mono } from "next/font/google";

import Layout from "@/components/Layout";

// Import Sora font from https://fonts.google.com/specimen/Sora
const heading = Sora({
    subsets: ["latin"],
    variable: "--font-heading",
    display: "swap",
});

// Import Inter font from https://fonts.google.com/specimen/Inter
const main = Inter({
    subsets: ["latin"],
    variable: "--font-main",
    display: "swap",
});

// Import IBM Plex Mono font from https://fonts.google.com/specimen/IBM+Plex+Mono
const code = IBM_Plex_Mono({
    subsets: ["latin"],
    variable: "--font-code",
    display: "swap",
    weight: ["100", "200", "300", "400", "500", "600", "700"],
});

// Extend NextPage to include optional getLayout
export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

// Extend AppProps to include new optional layout
type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    // Apply component's getLayout function, otherwise apply default Layout
    const getLayout =
        Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

    return (
        <ApolloProvider client={client}>
            <main
                className={`${heading.variable} ${main.variable} ${code.variable}`}
            >
                {getLayout(<Component {...pageProps} />)}
            </main>
        </ApolloProvider>
    );
}
