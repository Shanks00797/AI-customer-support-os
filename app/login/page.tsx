
"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail || !password) {
            setError("Enter your email address and password.");
            return;
        }

        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email: normalizedEmail,
                password,
                redirect: false,
                redirectTo: "/dashboard",
            });

            if (!result || result.error) {
                setError("Invalid email or password. Please try again.");
                return;
            }

            router.push("/dashboard");
        } catch {
            setError("Unable to sign in right now. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-12 text-white">
            <div className="w-full max-w-md">
                <Link href="/" className="mb-8 flex items-center justify-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500 text-lg font-bold">
                        A
                    </span>
                    <span className="text-xl font-semibold tracking-tight">
                        AI Support OS
                    </span>
                </Link>

                <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-7 shadow-2xl shadow-black/20 sm:p-9">
                    <div className="mb-8">
                        <p className="text-sm font-medium text-indigo-300">
                            Welcome back
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                            Sign in to your workspace
                        </h1>
                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            Enter your account details to continue to your support workspace.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                maxLength={254}
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="you@company.com"
                                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                            />
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-200"
                                >
                                    Password
                                </label>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                maxLength={72}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Enter your password"
                                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                            />
                        </div>

                        {error && (
                            <p
                                role="alert"
                                className="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
                            >
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full items-center justify-center rounded-xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-slate-400">
                        Setting up your company?{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-indigo-300 transition hover:text-indigo-200"
                        >
                            Register your workspace
                        </Link>
                    </p>
                </section>

                <p className="mt-6 text-center text-xs leading-5 text-slate-500">
                    Your workspace is protected by server-side authentication and
                    role-based access controls.
                </p>
            </div>
        </main>
    );
}
