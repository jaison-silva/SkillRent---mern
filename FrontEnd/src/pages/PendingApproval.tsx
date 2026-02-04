import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function PendingApproval() {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();

  function handleLogout() {
    clearAuth();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">Pending Approval</h1>

        <p className="text-gray-400 mb-6">
          Your provider account is being reviewed by our team. You'll be notified via email once your account is approved.
        </p>

        <div className="inline-block px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium mb-8">
          Status: Pending Review
        </div>

        <div className="text-left bg-gray-700/30 rounded-lg p-4 mb-6">
          <h3 className="text-white font-medium mb-2">What happens next?</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>• Our team will review your profile</li>
            <li>• You'll receive an email notification</li>
            <li>• Once approved, you can start accepting bookings</li>
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
