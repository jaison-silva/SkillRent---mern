export function Navbar() {
  return (
    <>
      <nav className="w-full border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center">
              <a
                href="/"
                className="text-xl font-semibold tracking-tight text-gray-900"
              >
                Brand
              </a>
            </div>

            {/* Center: Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Projects
              </a>
              <a
                href="#"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Team
              </a>
              <a
                href="#"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Reports
              </a>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4">
              <button className="hidden md:inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                Sign in
              </button>
              <button className="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                Get Started
              </button>

              {/* Mobile Menu Button */}
              <button className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
