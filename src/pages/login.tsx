import Head from "next/head";

import { EnvelopeSimpleIcon, LockKeyIcon } from "@phosphor-icons/react";

export default function LoginPage() {
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
                                <span className="cursor-pointer font-semibold text-primary">
                                    Register
                                </span>
                            </p>
                        </div>
                        {/* Login form */}
                        <form className="flex w-full flex-col gap-5">
                            <span className="relative">
                                {/* Icon on form input */}
                                <EnvelopeSimpleIcon
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary"
                                    size={20}
                                />
                                <input
                                    type="email"
                                    required
                                    placeholder="Email Address"
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
                                    required
                                    placeholder="Password"
                                    className="input !pl-10 font-code"
                                />
                            </span>
                            <button type="submit" className="button">
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}
