"use client";

import { useEffect, useState, type FormEvent } from "react";

type Ticket = {
    _id: string;
    customerName: string;
    customerEmail: string;
    subject: string;
    message: string;
    status: "open" | "drafted" | "sent" | "escalated";
    createdAt: string;
};

type TicketsResponse = {
    tickets?: Ticket[];
    error?: string;
};

export default function TicketsPanel() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function loadTickets() {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/tickets");
            const data = (await response.json()) as TicketsResponse;

            if (!response.ok) {
                throw new Error(data.error ?? "Failed to load tickets.");
            }

            setTickets(data.tickets ?? []);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load tickets.",
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const controller = new AbortController();

        async function fetchTickets() {
            setError("");

            try {
                const response = await fetch("/api/tickets", {
                    signal: controller.signal,
                });

                const data = (await response.json()) as TicketsResponse;

                if (!response.ok) {
                    throw new Error(data.error ?? "Failed to load tickets.");
                }

                setTickets(data.tickets ?? []);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") {
                    return;
                }

                setError(
                    err instanceof Error ? err.message : "Failed to load tickets.",
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void fetchTickets();

        return () => controller.abort();
    }, []);

    async function handleCreateTicket(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setCreating(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/tickets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customerName,
                    customerEmail,
                    subject,
                    message,
                }),
            });

            const data = (await response.json()) as {
                ticket?: Ticket;
                error?: string;
            };

            if (!response.ok) {
                throw new Error(data.error ?? "Failed to create ticket.");
            }

            if (!data.ticket) {
                throw new Error("The server did not return the created ticket.");
            }

            setTickets((current) => [
                data.ticket!,
                ...current.filter((ticket) => ticket._id !== data.ticket!._id),
            ]);

            setCustomerName("");
            setCustomerEmail("");
            setSubject("");
            setMessage("");
            setSuccess("Ticket created successfully.");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to create ticket.",
            );
        } finally {
            setCreating(false);
        }
    }

    const inputClass =
        "mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400";

    return (
        <section className="mt-8 grid gap-6 lg:grid-cols-5">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 lg:col-span-2">
                <h2 className="text-lg font-semibold">Create a ticket</h2>
                <p className="mt-1 text-sm text-slate-400">
                    Record a customer support request.
                </p>

                <form onSubmit={handleCreateTicket} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="customerName" className="text-sm text-slate-300">
                            Customer name
                        </label>
                        <input
                            id="customerName"
                            name="customerName"
                            required
                            minLength={2}
                            maxLength={100}
                            value={customerName}
                            onChange={(event) => setCustomerName(event.target.value)}
                            className={inputClass}
                            placeholder="Customer name"
                        />
                    </div>

                    <div>
                        <label htmlFor="customerEmail" className="text-sm text-slate-300">
                            Customer email
                        </label>
                        <input
                            id="customerEmail"
                            name="customerEmail"
                            type="email"
                            required
                            maxLength={254}
                            value={customerEmail}
                            onChange={(event) => setCustomerEmail(event.target.value)}
                            className={inputClass}
                            placeholder="customer@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="subject" className="text-sm text-slate-300">
                            Subject
                        </label>
                        <input
                            id="subject"
                            name="subject"
                            required
                            minLength={3}
                            maxLength={200}
                            value={subject}
                            onChange={(event) => setSubject(event.target.value)}
                            className={inputClass}
                            placeholder="Briefly describe the issue"
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="text-sm text-slate-300">
                            Customer message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            required
                            maxLength={10000}
                            rows={5}
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            className={inputClass}
                            placeholder="Describe the customer's problem..."
                        />
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-red-300">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p role="status" className="text-sm text-emerald-300">
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={creating}
                        className="w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {creating ? "Creating ticket..." : "Create ticket"}
                    </button>
                </form>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 lg:col-span-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold">Support tickets</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Tickets in your workspace.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => void loadTickets()}
                        disabled={loading}
                        className="rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5 disabled:opacity-60"
                    >
                        {loading ? "Loading..." : "Refresh"}
                    </button>
                </div>

                <div className="mt-6 space-y-4">
                    {loading ? (
                        <p className="py-8 text-center text-sm text-slate-400">
                            Loading tickets...
                        </p>
                    ) : tickets.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-white/15 px-4 py-10 text-center text-sm text-slate-400">
                            No tickets yet. Create your first ticket using the form.
                        </p>
                    ) : (
                        tickets.map((ticket) => (
                            <article
                                key={ticket._id}
                                className="rounded-xl border border-white/10 bg-slate-950/60 p-4"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <h3 className="font-medium text-white">{ticket.subject}</h3>

                                    <span className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-medium capitalize text-indigo-300">
                                        {ticket.status}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-slate-300">
                                    {ticket.customerName}
                                </p>
                                <p className="mt-1 break-all text-xs text-slate-400">
                                    {ticket.customerEmail}
                                </p>
                                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                                    {ticket.message}
                                </p>
                                <p className="mt-4 text-xs text-slate-500">
                                    Created{" "}
                                    {new Date(ticket.createdAt).toLocaleString()}
                                </p>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
