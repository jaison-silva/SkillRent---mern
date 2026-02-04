import { Link } from "react-router-dom";

export function PublicLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Hire Skills,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Not Employees
            </span>
          </h1>


          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            SkillRent connects you with talented professionals on an hourly or daily basis. 
            Find the perfect skill for your project, when you need it.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register/user"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
            >
              Get Started — It's Free
            </Link>
            <Link
              to="/register/provider"
              className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-200 border border-gray-600"
            >
              Become a Provider
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Find Talent Fast</h3>
            <p className="text-gray-400">
              Browse through verified professionals and find the right skill for your project in minutes.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Pay by Hour or Day</h3>
            <p className="text-gray-400">
              Flexible pricing that fits your budget. Only pay for the time you need.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Verified Providers</h3>
            <p className="text-gray-400">
              All providers go through our verification process to ensure quality and trust.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
