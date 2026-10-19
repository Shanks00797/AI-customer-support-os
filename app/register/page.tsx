
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const normalizedEmail = email.trim().toLowerCase();

        if (!name.trim() || !companyName.trim() || !normalizedEmail || !password) {
            setError("Please complete all fields.");
            return;
        }

        if (password.length < 12) {
            setError("Your password must contain at least 12 characters.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    companyName: companyName.trim(),
                    email: normalizedEmail,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.error || "Registration failed. Please try again."
                );
                return;
            }

            router.push("/login?registered=true");
        } catch {
            setError("Unable to register right now. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-12 text-white">
            <div className="w-full max-w-md">
                <Link
                    href="/"
                    className="mb-8 flex items-center justify-center gap-3"
                >
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
                            Get started
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                            Register your workspace
                        </h1>
                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            Create your company workspace and administrator account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >
                                Your full name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                minLength={2}
                                maxLength={100}
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="John Doe"
                                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="companyName"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >
                                Company name
                            </label>
                            <input
                                id="companyName"
                                name="companyName"
                                type="text"
                                autoComplete="organization"
                                required
                                minLength={2}
                                maxLength={100}
                                value={companyName}
                                onChange={(event) => setCompanyName(event.target.value)}
                                placeholder="Your Company"
                                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >
                                Work email
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
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                minLength={12}
                                maxLength={72}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="At least 12 characters"
                                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                Use at least 12 characters.
                            </p>
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
                            {isLoading ? "Creating workspace..." : "Create workspace"}
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-slate-400">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-indigo-300 transition hover:text-indigo-200"
                        >
                            Sign in
                        </Link>
                    </p>
                </section>

                <p className="mt-6 text-center text-xs leading-5 text-slate-500">
                    Your account will be the administrator for your new workspace.
                </p>
            </div>
        </main>
    );
}
