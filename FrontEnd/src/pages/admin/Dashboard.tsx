import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Briefcase, 
  Shield, 
  UserX, 
  UserCheck, 
  CheckCircle, 
  XCircle, 
  Search,
  AlertCircle
} from "lucide-react";
import { 
  getAdminDashboardApi, 
  updateUserStatusApi, 
  updateProviderStatusApi, 
  verifyProviderApi 
} from "../../api/admin.api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"users" | "providers">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleItems, setVisibleItems] = useState(5);
  const itemsPerPage = 5;

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboardApi();
      setUsers(res.data.users || []);
      setProviders(res.data.providers || []);
    } catch (err: unknown) {
      const errorResponse = err as any;
      setError(errorResponse.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUserStatus = async (id: string, currentStatus: boolean) => {
    console.log("handleUserStatus:", { id, nextStatus: !currentStatus });
    try {
      await updateUserStatusApi(id, !currentStatus);
      setUsers(users.map(u => u._id === id ? { ...u, isBanned: !currentStatus } : u));
    } catch (err) {
      console.error("handleUserStatus error:", err);
      alert("Failed to update user status");
    }
  };

  const handleProviderStatus = async (id: string, currentStatus: boolean) => {
    console.log("handleProviderStatus:", { id, nextStatus: !currentStatus });
    try {
      await updateProviderStatusApi(id, !currentStatus);
      setProviders(providers.map(p => p._id === id ? { ...p, isBanned: !currentStatus } : p));
    } catch (err) {
      console.error("handleProviderStatus error:", err);
      alert("Failed to update provider status");
    }
  };

  const handleVerification = async (id: string, status: "approved" | "denied") => {
    console.log("handleVerification:", { id, status });
    try {
      await verifyProviderApi(id, status);
      setProviders(providers.map(p => p._id === id ? { ...p, validationStatus: status } : p));
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string } } };
      alert(errorResponse.response?.data?.message || "Failed to verify provider");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProviders = providers.filter(p => 
    p.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.userId?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <Shield className="w-10 h-10 text-blue-500" />
              Admin Control Center
            </h1>
            <p className="text-slate-400 mt-2">Manage users, providers, and marketplace integrity.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white w-full md:w-80 outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "users" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                : "bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            <Users className="w-5 h-5" />
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("providers")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "providers" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                : "bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            <Briefcase className="w-5 h-5" />
            Providers ({providers.length})
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Identify</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {activeTab === "users" ? (
                    filteredUsers.slice(0, visibleItems).map((user) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={user._id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">
                              <Users className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-white font-semibold">{user.name}</p>
                              <p className="text-slate-500 text-xs">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-2 py-1 bg-white/5 rounded text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            user.isBanned ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"
                          }`}>
                            {user.isBanned ? "Banned" : "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => handleUserStatus(user._id, user.isBanned)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.isBanned 
                                ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" 
                                : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            }`}
                            title={user.isBanned ? "Unblock User" : "Block User"}
                          >
                            {user.isBanned ? <UserCheck className="w-5 h-5" /> : <UserX className="w-5 h-5" />}
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    filteredProviders.slice(0, visibleItems).map((provider) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={provider._id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
                              <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-white font-semibold">{provider.userId?.name}</p>
                              <p className="text-slate-500 text-xs">{provider.userId?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex flex-wrap gap-1">
                              {provider.skills.map((s: string) => (
                                <span key={s} className="text-[10px] text-slate-400">{s}</span>
                              ))}
                           </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <span className={`w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              provider.validationStatus === "approved" 
                                ? "bg-green-500/10 text-green-400" 
                                : provider.validationStatus === "rejected"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-yellow-500/10 text-yellow-500"
                            }`}>
                              {provider.validationStatus}
                            </span>
                            <span className={`w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              provider.isBanned ? "bg-red-500/10 text-red-400" : "bg-blue-500/10 text-blue-400"
                            }`}>
                              {provider.isBanned ? "Banned" : "Listed"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                             {provider.validationStatus === "pending" && (
                               <>
                                 <button
                                   onClick={() => handleVerification(provider._id, "approved")}
                                   className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20"
                                   title="Approve Provider"
                                 >
                                   <CheckCircle className="w-5 h-5" />
                                 </button>
                                 <button
                                   onClick={() => handleVerification(provider._id, "denied")}
                                   className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"
                                   title="Reject Provider"
                                 >
                                   <XCircle className="w-5 h-5" />
                                 </button>
                               </>
                             )}
                            <button
                                onClick={() => handleProviderStatus(provider._id, provider.isBanned)}
                                className={`p-2 rounded-lg transition-colors ${
                                provider.isBanned 
                                    ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" 
                                    : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                }`}
                                title={provider.isBanned ? "Unblock Provider" : "Block Provider"}
                            >
                                {provider.isBanned ? <UserCheck className="w-5 h-5" /> : <UserX className="w-5 h-5" />}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {(activeTab === "users" ? filteredUsers : filteredProviders).length === 0 && (
             <div className="py-20 text-center text-slate-500">
                No results found for "{searchTerm}"
             </div>
          )}
        </div>

        {(activeTab === "users" ? filteredUsers : filteredProviders).length > visibleItems && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setVisibleItems(prev => prev + itemsPerPage)}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
