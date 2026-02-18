export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      
      {/* Sidebar */}
      <aside className="hidden w-64 border-r border-gray-200 bg-gray-50 md:flex md:flex-col">
        <div className="border-b border-gray-200 px-6 py-6">
          <h2 className="text-lg font-semibold">Workspace</h2>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6 text-sm">
          <button className="w-full rounded-md bg-black px-4 py-2 text-left font-medium text-white">
            Dashboard
          </button>
          <button className="w-full rounded-md px-4 py-2 text-left text-gray-700 hover:bg-gray-200">
            Projects
          </button>
          <button className="w-full rounded-md px-4 py-2 text-left text-gray-700 hover:bg-gray-200">
            Reports
          </button>
          <button className="w-full rounded-md px-4 py-2 text-left text-gray-700 hover:bg-gray-200">
            Team
          </button>
          <button className="w-full rounded-md px-4 py-2 text-left text-gray-700 hover:bg-gray-200">
            Settings
          </button>
        </nav>

        <div className="border-t border-gray-200 px-6 py-4 text-sm text-gray-500">
          Logged in as <span className="font-medium text-gray-800">User</span>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">

        {/* Top Bar */}
        <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-gray-300" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 bg-white px-6 py-8">
          
          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm text-gray-500">Active Projects</p>
              <p className="mt-2 text-3xl font-bold">12</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm text-gray-500">Tasks Due</p>
              <p className="mt-2 text-3xl font-bold">27</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="mt-2 text-3xl font-bold">84%</p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            
            {/* Recent Activity */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-md bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium">Project Alpha updated</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Milestone 2 marked as complete.
                  </p>
                </div>
                <div className="rounded-md bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium">New task assigned</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Review design specs for onboarding flow.
                  </p>
                </div>
                <div className="rounded-md bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium">Report generated</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Weekly performance summary exported.
                  </p>
                </div>
              </div>
            </div>

            {/* Overview Card */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="text-lg font-semibold">Overview</h2>
              <div className="mt-6 space-y-4">
                <div className="h-4 w-3/4 rounded bg-gray-300" />
                <div className="h-4 w-5/6 rounded bg-gray-300" />
                <div className="h-4 w-2/3 rounded bg-gray-300" />
                <div className="h-32 rounded-lg bg-gray-200" />
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
