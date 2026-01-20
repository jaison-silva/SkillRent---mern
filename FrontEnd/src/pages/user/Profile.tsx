import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Edit3, ArrowLeft, AlertCircle, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserProfileApi } from "../../api/user.api";
import { getProviderProfileApi } from "../../api/provider.api";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let res;
        if (user?.role === "provider") {
            res = await getProviderProfileApi();
            console.log("Provider profile fetched:", res.data);
            setUserProfile({ ...res.data.provider.userId, ...res.data.provider }); // Merge user and provider data
        } else {
            res = await getUserProfileApi();
            console.log("User profile fetched:", res.data);
            setUserProfile(res.data.user);
        }
      } catch (err: unknown) {
        console.error("Profile fetch error:", err);
        const errorResponse = err as { response?: { data?: { message?: string } } };
        setError(errorResponse.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
            <div className="absolute -bottom-12 left-8 p-1 bg-slate-950 rounded-2xl">
              <div className="w-24 h-24 bg-slate-900 rounded-xl flex items-center justify-center border border-white/10">
                <User className="w-12 h-12 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="pt-16 pb-8 px-8">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">{userProfile?.name}</h1>
                <p className="text-slate-400 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" /> {userProfile?.email}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/forgot-password", { state: { email: user?.email, autoSend: true } })}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-blue-400 transition-all font-medium"
                >
                  <Lock className="w-4 h-4" /> Change Password
                </button>
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all font-medium"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              </div>
            </div>

            {!error && userProfile && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Account Status</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Account Type</span>
                      <span className="text-white capitalize">{userProfile?.role}</span>
                    </div>
                    {user?.role === "provider" && (
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Merchant Status</span>
                        <span className={`font-bold capitalize ${
                            userProfile?.validationStatus === "approved" ? "text-green-400" : 
                            userProfile?.validationStatus === "denied" ? "text-red-400" : "text-yellow-400"
                        }`}>
                            {userProfile?.validationStatus || "Pending"}
                        </span>
                    </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Member Since</span>
                      <span className="text-white">
                        {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {user?.role === "provider" ? (
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-5 h-5 text-indigo-400" />
                      <h3 className="text-lg font-semibold text-white">Professional Details</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Bio</span>
                            <p className="text-sm text-slate-300 mt-1">{userProfile.bio || "No bio added yet."}</p>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2 block">Skills</span>
                            <div className="flex flex-wrap gap-2">
                                {userProfile.skills?.map((skill: string) => (
                                    <span key={skill} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs rounded-lg font-medium">
                                        {skill}
                                    </span>
                                ))}
                                {(!userProfile.skills || userProfile.skills.length === 0) && <span className="text-xs text-slate-500 italic">No skills listed</span>}
                            </div>
                        </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-center items-center text-center">
                    <p className="text-slate-400 text-sm mb-2">Need help with your account?</p>
                    <button className="text-blue-400 font-medium hover:underline">Contact Support</button>
                  </div>
                )}
              </div>
            )}

            {!userProfile && !error && (
                <div className="py-12 text-center text-slate-500">
                    No profile data found.
                </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
