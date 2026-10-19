
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  async function handleSignOut() {
    "use server";

    await signOut({ redirectTo: "/login" });
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-900/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-lg font-bold">
              A
            </div>
            <div>
              <p className="font-semibold tracking-tight">AI Support OS</p>
              <p className="text-xs text-slate-400">Workspace dashboard</p>
            </div>
          </div>

          <form action={handleSignOut}>
            <button
              type="submit"
              className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/5"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
        <div className="mb-10">
          <p className="text-sm font-medium text-indigo-300">
            Your workspace
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome, {user.name ?? "there"}
          </h1>
          <p className="mt-3 text-slate-400">
            You are signed in. Your workspace is ready for the next stage of
            development.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold">Account details</h2>
            <p className="mt-1 text-sm text-slate-400">
              Your authenticated account information.
            </p>

            <dl className="mt-6 divide-y divide-white/10">
              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <dt className="text-sm text-slate-400">Name</dt>
                <dd className="font-medium">{user.name ?? "Not available"}</dd>
              </div>

              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <dt className="text-sm text-slate-400">Email</dt>
                <dd className="break-all font-medium">
                  {user.email ?? "Not available"}
                </dd>
              </div>

              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <dt className="text-sm text-slate-400">Role</dt>
                <dd>
                  <span className="inline-flex rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-sm font-medium capitalize text-indigo-300">
                    {user.role}
                  </span>
                </dd>
              </div>

              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <dt className="text-sm text-slate-400">Tenant ID</dt>
                <dd className="break-all font-mono text-sm text-slate-300">
                  {user.tenantId}
                </dd>
              </div>
            </dl>
          </section>

          <aside className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <span aria-hidden="true" className="text-xl">
                ✓
              </span>
            </div>

            <h2 className="mt-5 text-lg font-semibold">Authentication active</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Your session has been verified on the server. Access to future
              workspace data will also be checked on the server.
            </p>

            <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs text-slate-500">Workspace access</p>
              <p className="mt-1 font-medium">Authenticated</p>
            </div>
          </aside>
        </div>

        <section className="mt-8 rounded-2xl border border-dashed border-white/15 bg-white/2 p-8">
          <p className="text-sm font-medium text-indigo-300">Coming later</p>
          <h2 className="mt-2 text-xl font-semibold">
            Your support workspace
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Ticket management, conversations, team workflows, and AI-assisted
            support will be added in their planned phases. No sample ticket
            data is being presented as real data here.
          </p>
        </section>
      </section>
    </main>
  );
}
