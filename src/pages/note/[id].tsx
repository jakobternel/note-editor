import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { gql, useLazyQuery } from "@apollo/client";

import Note from "@/components/Note";
import { useToastElementStore } from "@/zustand/toastStore";
import { useCurrentNoteStore } from "@/zustand/currentNoteStore";

// GQL query to get note by ID
const NOTE = gql`
    query GetNote($noteId: String!) {
        noteById(noteId: $noteId) {
            noteId
            ownerId
            ownerUsername
            createdDate
            lastEditedDate
            tags
            noteTitle
        }
    }
`;

export default function NotePage() {
    const [fetchNote, { data, error }] = useLazyQuery(NOTE); // Run GQL lazily when called after note ID detected

    // Zustand state for handling toast notifications
    const createToast = useToastElementStore(
        (state) => state.createToastElement
    );

    // Zustand state for currently selected note
    const addNoteDetails = useCurrentNoteStore(
        (note) => note.changeCurrentNote
    );
    const note = useCurrentNoteStore((state) => state.note);

    // Get note ID from router
    const router = useRouter();
    const { id } = router.query;

    // Create toast error and navigate to homepage/dashboard if error encountered
    const showErrorToastAndRedirect = useCallback(() => {
        createToast(
            "error",
            "There was a problem loading note. Please try again."
        );
        router.push("/");
    }, [createToast, router]);

    // Get note information when note page loaded
    useEffect(() => {
        if (!router.isReady) return; // Return if router is not ready

        // Create toast error if no ID specified in router parameters
        if (!id) {
            showErrorToastAndRedirect();
        }

        // Run GQL query
        const fetchData = async () => {
            await fetchNote({ variables: { noteId: id } });
        };

        try {
            if (typeof id === "string") {
                fetchData();
            }
        } catch {
            showErrorToastAndRedirect();
        }
    }, [id, router.isReady, showErrorToastAndRedirect, fetchNote]);

    // Show toast error and redirect if error encountered with GQL query
    useEffect(() => {
        if (error) {
            showErrorToastAndRedirect();
        }
    }, [error, showErrorToastAndRedirect]);

    // Update zustand state when data returned from GQL query
    useEffect(() => {
        if (data) {
            const extractedData = data.noteById;

            addNoteDetails(
                extractedData.noteId,
                extractedData.ownerId,
                extractedData.ownerUsername,
                extractedData.createdDate,
                extractedData.lastEditedDate,
                extractedData.noteTitle
            );
        }
    }, [data, showErrorToastAndRedirect, addNoteDetails]);

    return (
        <>
            <Head>
                <title>
                    {note?.noteTitle ? `${note.noteTitle} - Notilo` : "Notilo"}
                </title>
                <link rel="icon" href="/icon_white.png" />
            </Head>
            <div className="size-full p-5">
                <Note />
            </div>
        </>
    );
}
