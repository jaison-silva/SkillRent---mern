export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Brand</h2>
            <p className="mt-4 text-sm text-gray-600">
              Concise description of the product or company. Keep it direct and clear.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Navigation</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Projects
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Team
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Reports
                </a>
              </li>
            </ul>
          </div>


          <div>
            <h3 className="text-sm font-semibold text-gray-900">Resources</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Status
                </a>
              </li>
            </ul>
          </div>


          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Brand. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
