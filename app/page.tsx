
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-lg font-bold">
            A
          </div>
          <span className="text-lg font-semibold tracking-tight">
            AI Support OS
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Get started
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-88px)] w-full max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:px-10 lg:py-24">
        <div className="max-w-2xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-200">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            A smarter way to support your customers
          </div>

          <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            Support that feels
            <span className="block text-indigo-400">effortless.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
            Bring customer conversations, team workflows, and AI-assisted
            support into one focused workspace. Help your team respond faster
            without losing the human touch.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400"
            >
              Create your workspace
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 px-6 py-3 font-semibold text-slate-200 transition hover:bg-white/5"
            >
              Sign in to your workspace
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            One workspace for your team. Built with tenant-aware access controls.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-4xl bg-indigo-500/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-black/30 sm:p-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-sm text-slate-400">Workspace overview</p>
                <h2 className="mt-1 text-xl font-semibold">Support dashboard</h2>
              </div>
              <div className="rounded-xl bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-300">
                Workspace preview
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                <p className="text-sm text-slate-400">Open conversations</p>
                <p className="mt-3 text-3xl font-semibold">24</p>
                <p className="mt-2 text-xs text-indigo-300">
                  Team workspace preview
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                <p className="text-sm text-slate-400">Response time</p>
                <p className="mt-3 text-3xl font-semibold">4.2 min</p>
                <p className="mt-2 text-xs text-emerald-300">
                  Illustrative metric
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/3 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">A calmer support workflow</h3>
                <span className="text-xs text-slate-500">Preview</span>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-400/15 text-sm font-semibold text-indigo-300">
                    01
                  </div>
                  <div>
                    <p className="font-medium">Bring conversations together</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Give your team a shared place to work on customer requests.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-400/15 text-sm font-semibold text-indigo-300">
                    02
                  </div>
                  <div>
                    <p className="font-medium">Keep your team aligned</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Organize responsibilities and keep work moving.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-400/15 text-sm font-semibold text-indigo-300">
                    03
                  </div>
                  <div>
                    <p className="font-medium">Make room for AI assistance</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Build toward faster, more consistent customer responses.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-slate-500">
              Preview only — the support dashboard will be built in a later phase.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-sm text-slate-500">
        AI Support OS · Thoughtful support, one conversation at a time.
      </footer>
    </main>
  );
}
