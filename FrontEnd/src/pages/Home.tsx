import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { API_ROUTES } from "../routes/apiRoutes";

// Types for the list items
type Provider = {
  _id: string;
  userId: { name: string; email: string };
  bio?: string;
  skills: string[];
  rating: number;
};

type User = {
  _id: string;
  name: string;
  email: string;
};

export function Home() {
  const { user } = useAuth();
  
  // List state
  const [providers, setProviders] = useState<Provider[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch data when page changes
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (user?.role === "user") {
          // Users see list of providers
          const res = await api.get(`${API_ROUTES.providers.list}?page=${page}&limit=6`);
          setProviders(res.data.providers);
          setTotalPages(res.data.totalPages);
        } else if (user?.role === "provider") {
          // Providers see list of users
          const res = await api.get(`${API_ROUTES.users.list}?page=${page}&limit=6`);
          setUsers(res.data.users);
          setTotalPages(res.data.totalPages);
        }
      } catch (err) {
        console.log("Failed to fetch list:", err);
      } finally {
        setLoading(false);
      }
    }
    
    if (user?.role === "user" || user?.role === "provider") {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [page, user?.role]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name || "User"}! 👋
          </h1>
          <p className="text-gray-400 text-lg">
            {user?.role === "user" && "Find skilled providers for your needs"}
            {user?.role === "provider" && "See users looking for services"}
            {user?.role === "admin" && "Manage your platform"}
          </p>
        </div>

        {/* List Section for Users - Show Providers */}
        {user?.role === "user" && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-6">Available Providers</h2>
            
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : providers.length === 0 ? (
              <p className="text-gray-400">No providers available yet.</p>
            ) : (
              <>
                {/* Provider Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {providers.map((provider) => (
                    <div
                      key={provider._id}
                      className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 hover:border-blue-500/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {provider.userId?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-white">{provider.userId?.name}</p>
                          <p className="text-sm text-gray-400">{provider.userId?.email}</p>
                        </div>
                      </div>
                      {provider.bio && (
                        <p className="text-sm text-gray-400 mb-2 line-clamp-2">{provider.bio}</p>
                      )}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {provider.skills?.slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2 py-1 text-xs bg-blue-600/20 text-blue-400 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-sm text-yellow-400">
                        ⭐ {provider.rating || "No rating"}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-gray-400">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* List Section for Providers - Show Users */}
        {user?.role === "provider" && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-6">Users on Platform</h2>
            
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : users.length === 0 ? (
              <p className="text-gray-400">No users available yet.</p>
            ) : (
              <>
                {/* User Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {users.map((u) => (
                    <div
                      key={u._id}
                      className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 hover:border-blue-500/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {u.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-white">{u.name}</p>
                          <p className="text-sm text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-gray-400">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Admin Dashboard */}
        {user?.role === "admin" && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4">Admin Dashboard</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <button className="flex items-center gap-4 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors group">
                <span className="text-2xl">👥</span>
                <div className="text-left">
                  <p className="font-medium text-white group-hover:text-blue-400 transition-colors">
                    Manage Users
                  </p>
                  <p className="text-sm text-gray-400">View and manage users</p>
                </div>
              </button>
              <button className="flex items-center gap-4 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors group">
                <span className="text-2xl">✅</span>
                <div className="text-left">
                  <p className="font-medium text-white group-hover:text-blue-400 transition-colors">
                    Verify Providers
                  </p>
                  <p className="text-sm text-gray-400">Review pending providers</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

