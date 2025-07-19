import Head from "next/head";

import Note from "@/components/Note";

export default function NotePage() {
    return (
        <>
            <Head>
                <title>New Note - Notilo</title>
                <link rel="icon" href="/icon_white.png" />
            </Head>
            <div className="size-full p-5">
                <Note />
            </div>
        </>
    );
}
