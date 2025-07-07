import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apolloClient";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { Sora, Inter, IBM_Plex_Mono } from "next/font/google";

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

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={client}>
            <main
                className={`${heading.variable} ${main.variable} ${code.variable}`}
            >
                <Component {...pageProps} />
            </main>
        </ApolloProvider>
    );
}
