import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { ApolloError, gql, useMutation } from "@apollo/client";

import {
    EnvelopeSimpleIcon,
    InfoIcon,
    LockKeyIcon,
} from "@phosphor-icons/react";

// GQL query to add user account
const ADD_USER = gql`
    mutation CreateUser(
        $email: String!
        $username: String!
        $password: String!
    ) {
        createUser(email: $email, username: $username, password: $password) {
            _id
            email
            username
        }
    }
`;

export default function RegisterPage() {
    const [registerError, setRegisterError] = useState<string>(""); // Displays error to show user if registration attempt fails
    const [submissionLoading, setSubmissionLoading] = useState<boolean>(false); // Loading state to disable button and show loading effect
    const router = useRouter();
    const [addUser] = useMutation(ADD_USER);

    // Logic for handling registration form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmissionLoading(true); // Set loading state to disable button
        setRegisterError(""); // Clear register error

        try {
            // Get form inputs
            const form = new FormData(e.currentTarget as HTMLFormElement);
            const email = form.get("email") as string;
            const password = form.get("password") as string;

            await addUser({
                variables: {
                    email,
                    password,
                    username: `${email.split("@")[0]}-${Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000}`, // Generate username in format user-1234. user comes from email address e.g., user@test.com
                },
            });

            // Redirect on successful registration
            router.push("/");
        } catch (err: unknown) {
            // Parse GraphQL error message
            if (err instanceof ApolloError) {
                const message =
                    err.graphQLErrors?.[0]?.message ||
                    "An error occurred. Please try again.";
                setRegisterError(message);
            } else {
                setRegisterError("An unexpected error occurred.");
            }
        } finally {
            setSubmissionLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Register - Notilo</title>
                <link rel="icon" href="/icon_white.png" />
            </Head>
            <main>
                <div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
                    <div className="flex w-96 flex-col items-center gap-10 rounded-xl border border-border bg-surface px-5 py-8 shadow-md">
                        {/* Welcome section */}
                        <div className="flex flex-col items-center gap-3">
                            <h1 className="text-2xl font-semibold">
                                Unlock Your Productivity
                            </h1>
                            <p className="text-center text-sm text-textSecondary">
                                Join today and start organizing your notes in
                                one place.
                            </p>
                        </div>
                        {/* Login form */}
                        <form
                            method="POST"
                            className="flex w-full flex-col gap-5"
                            onSubmit={handleSubmit}
                        >
                            {/* Error notification if registration attempt failed */}
                            {registerError && (
                                <span className="flex flex-row gap-2 border border-red-500 bg-red-500/25 p-2">
                                    <InfoIcon className="text-red-500" />
                                    <p className="text-xs text-red-500">
                                        {registerError}
                                    </p>
                                </span>
                            )}
                            <span className="relative">
                                {/* Icon on form input */}
                                <EnvelopeSimpleIcon
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary"
                                    size={20}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="Email Address"
                                    disabled={submissionLoading}
                                    className="input !pl-10 font-code"
                                />
                            </span>
                            <span className="relative">
                                {/* Icon on form input */}
                                <LockKeyIcon
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary"
                                    size={20}
                                />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    placeholder="Password"
                                    disabled={submissionLoading}
                                    className="input !pl-10 font-code"
                                />
                            </span>
                            <button
                                type="submit"
                                className="button disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={submissionLoading}
                            >
                                {submissionLoading
                                    ? "Creating account..."
                                    : "Register"}
                            </button>
                        </form>
                        <p className="text-sm text-textSecondary">
                            Already have an account?{" "}
                            <span
                                className="cursor-pointer font-semibold text-primary"
                                onClick={() => router.push("/login")}
                            >
                                Login
                            </span>
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}
