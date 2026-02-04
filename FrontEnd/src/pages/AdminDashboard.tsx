import { useState, useEffect } from "react";
import api from "../api/axios";
import { API_ROUTES } from "../routes/apiRoutes";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBanned: boolean;
};

type Provider = {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    isBanned: boolean;
  };
  skills: string[];
  validationStatus: "pending" | "approved" | "denied";
};

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(API_ROUTES.admin.dashboard);
        setUsers(res.data.users?.users || []);
        setProviders(res.data.providers?.providers || []);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleBlockUser(id: string, isBanned: boolean) {
    try {
      await api.patch(`${API_ROUTES.admin.blockUser}/${id}`, { isBanned });
      setUsers(users.map(u => u._id === id ? { ...u, isBanned } : u));
    } catch {
      setError("Failed to update user");
    }
  }

  async function handleBlockProvider(id: string, isBanned: boolean) {
    try {
      await api.patch(`${API_ROUTES.admin.blockProvider}/${id}`, { isBanned });
      setProviders(providers.map(p =>
        p._id === id ? { ...p, userId: { ...p.userId, isBanned } } : p
      ));
    } catch {
      setError("Failed to update provider");
    }
  }

  async function handleVerifyProvider(id: string, status: "approved" | "denied") {
    try {
      await api.patch(`${API_ROUTES.admin.verifyProvider}/${id}`, { status });
      setProviders(providers.map(p =>
        p._id === id ? { ...p, validationStatus: status } : p
      ));
    } catch {
      setError("Failed to verify provider");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Users</h2>
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="text-left p-4 text-gray-300">Name</th>
                  <th className="text-left p-4 text-gray-300">Email</th>
                  <th className="text-left p-4 text-gray-300">Status</th>
                  <th className="text-left p-4 text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t border-gray-700/50">
                    <td className="p-4 text-white">{user.name}</td>
                    <td className="p-4 text-gray-400">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${user.isBanned ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                        }`}>
                        {user.isBanned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleBlockUser(user._id, !user.isBanned)}
                        className={`px-3 py-1 text-sm rounded ${user.isBanned
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                          }`}
                      >
                        {user.isBanned ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Providers</h2>
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="text-left p-4 text-gray-300">Name</th>
                  <th className="text-left p-4 text-gray-300">Email</th>
                  <th className="text-left p-4 text-gray-300">Skills</th>
                  <th className="text-left p-4 text-gray-300">Status</th>
                  <th className="text-left p-4 text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((provider) => (
                  <tr key={provider._id} className="border-t border-gray-700/50">
                    <td className="p-4 text-white">{provider.userId?.name}</td>
                    <td className="p-4 text-gray-400">{provider.userId?.email}</td>
                    <td className="p-4 text-gray-400">{provider.skills?.slice(0, 2).join(", ")}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${provider.validationStatus === "approved"
                        ? "bg-green-500/20 text-green-400"
                        : provider.validationStatus === "denied"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                        {provider.validationStatus}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      {provider.validationStatus === "pending" && (
                        <>
                          <button
                            onClick={() => handleVerifyProvider(provider._id, "approved")}
                            className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerifyProvider(provider._id, "denied")}
                            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
                          >
                            Deny
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleBlockProvider(provider._id, !provider.userId?.isBanned)}
                        className={`px-3 py-1 text-sm rounded ${provider.userId?.isBanned
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                          }`}
                      >
                        {provider.userId?.isBanned ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
