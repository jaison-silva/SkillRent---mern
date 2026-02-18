
export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">

      {/* Hero Section */}
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Build, manage, and scale your workflow.
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                A focused platform for teams that want clarity, speed, and structured execution.
                Eliminate noise. Centralize operations. Ship consistently.
              </p>
              <div className="mt-8 flex gap-4">
                <button className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800">
                  Get Started
                </button>
                <button className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  Learn More
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8">
              <div className="space-y-4">
                <div className="h-4 w-3/4 rounded bg-gray-300" />
                <div className="h-4 w-5/6 rounded bg-gray-300" />
                <div className="h-4 w-2/3 rounded bg-gray-300" />
                <div className="h-32 rounded-lg bg-gray-200" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-gray-200 bg-gray-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Structured for execution
              </h2>
              <p className="mt-4 text-gray-600">
                Every feature exists to remove friction and enforce clarity.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold">Centralized Dashboard</h3>
                <p className="mt-4 text-sm text-gray-600">
                  View active projects, team progress, and performance metrics in one place.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold">Project Control</h3>
                <p className="mt-4 text-sm text-gray-600">
                  Define scope, assign ownership, and track milestones without ambiguity.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold">Clear Reporting</h3>
                <p className="mt-4 text-sm text-gray-600">
                  Generate concise reports that reflect actual performance and outcomes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Replace complexity with structure.
            </h2>
            <p className="mt-6 text-gray-600">
              Start organizing work with precision and eliminate execution drift.
            </p>
            <div className="mt-8">
              <button className="rounded-md bg-black px-8 py-3 text-sm font-medium text-white hover:bg-gray-800">
                Create Account
              </button>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
