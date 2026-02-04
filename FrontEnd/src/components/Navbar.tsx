import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { API_ROUTES } from "../routes/apiRoutes";

export function Navbar() {
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();
  
  // State to control the modal visibility
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post(API_ROUTES.auth.logout);
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  return (
    <>
      <nav className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <Link
              to={user ? "/home" : "/publicLanding"}
              className="flex items-center space-x-2"
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                SkillRent
              </span>
            </Link>


            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-300">
                    Hello,{" "}
                    <span className="font-semibold text-white">{user.name}</span>
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-600 rounded-full capitalize">
                    {user.role}
                  </span>
                  
                  {/* Profile Link */}
                  <Link
                    to="/profile"
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
                  >
                    Profile
                  </Link>

                  {/* Logout button - opens modal instead of logging out directly */}
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Dark overlay behind the modal */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          
          {/* Modal card */}
          <div className="relative bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-2">
              Confirm Logout
            </h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to logout?
            </p>
            
            <div className="flex gap-3">
              {/* Cancel button */}
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              
              {/* Confirm logout button */}
              <button
                onClick={handleLogout}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

