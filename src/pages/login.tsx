import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { ApolloError, gql, useLazyQuery, useMutation } from "@apollo/client";

import {
    EnvelopeSimpleIcon,
    LockKeyIcon,
    InfoIcon,
} from "@phosphor-icons/react";

// GQL query to check user account
const GET_USER_BY_EMAIL = gql`
    query GetUserByEmail($email: String!) {
        userByEmail(email: $email) {
            email
        }
    }
`;

// GQL query to log user in
const LOGIN_USER = gql`
    mutation LoginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
            _id
            email
            username
        }
    }
`;

export default function LoginPage() {
    const [loginError, setLoginError] = useState<string>(""); // Displays error to show user if login attempt fails
    const [submissionLoading, setSubmissionLoading] = useState<boolean>(false); // Loading state to disable button and show loading effect
    const router = useRouter();
    const [getUser] = useLazyQuery(GET_USER_BY_EMAIL);
    const [loginUser] = useMutation(LOGIN_USER);

    // Logic for handling login form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmissionLoading(true); // Set loading state to disable button
        setLoginError(""); // Clear login error

        try {
            // Get form inputs
            const form = new FormData(e.currentTarget as HTMLFormElement);
            const email = form.get("email") as string;
            const password = form.get("password") as string;

            // Check email and password are set
            if (!email || !password) {
                setLoginError("Email and password are required.");
                return;
            }

            // Run GQL query
            const response = await getUser({ variables: { email } });
            const user = response.data?.userByEmail;

            // Check to see if user with email exists
            if (!user) {
                setLoginError("Invalid email or password");
                setSubmissionLoading(false);
                return;
            }

            // Attempt login
            await loginUser({
                variables: {
                    email,
                    password,
                },
            });

            // Redirect user on login
            router.push("/");
        } catch (err: unknown) {
            // Parse GraphQL error message
            if (err instanceof ApolloError) {
                const message =
                    err.graphQLErrors?.[0]?.message ||
                    "Something went wrong. Please try again.";
                setLoginError(message);
            } else {
                setLoginError("Unexpected error occurred.");
            }
        } finally {
            setSubmissionLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Login - Notilo</title>
                <link rel="icon" href="/icon_white.png" />
            </Head>
            <main>
                <div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
                    <div className="flex w-96 flex-col items-center gap-10 rounded-xl border border-border bg-surface px-5 py-8 shadow-md">
                        {/* Welcome section */}
                        <div className="flex flex-col items-center gap-3">
                            <h1 className="text-2xl font-semibold">
                                Welcome Back
                            </h1>
                            <p className="text-sm text-textSecondary">
                                New to Notilo?{" "}
                                <span
                                    className="cursor-pointer font-semibold text-primary"
                                    onClick={() => router.push("/register")}
                                >
                                    Register
                                </span>
                            </p>
                        </div>
                        {/* Login form */}
                        <form
                            method="POST"
                            className="flex w-full flex-col gap-5"
                            onSubmit={handleSubmit}
                        >
                            {/* Error notification if login attempt failed */}
                            {loginError && (
                                <span className="flex flex-row gap-2 border border-red-500 bg-red-500/25 p-2">
                                    <InfoIcon className="text-red-500" />
                                    <p className="text-xs text-red-500">
                                        {loginError}
                                    </p>
                                </span>
                            )}

                            {/* Email form input */}
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

                            {/* Password form input */}
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

                            {/* Login button */}
                            <button
                                type="submit"
                                className="button disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={submissionLoading}
                            >
                                {submissionLoading ? "Logging in..." : "Login"}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}
