import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Briefcase, MapPin, Star, Edit3, ArrowLeft, Languages, Truck, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProviderProfileApi } from "../../api/provider.api";

const Profile = () => {
  const navigate = useNavigate();
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProviderProfileApi();
        setProviderProfile(res.data.provider);
      } catch (err: unknown) {
        const errorResponse = err as { response?: { data?: { message?: string } } };
        setError(errorResponse.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />

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
          Back to Dashboard
        </button>

        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="h-40 bg-gradient-to-r from-indigo-600 to-blue-600 relative">
             <div className="absolute inset-0 bg-black/20" />
            <div className="absolute -bottom-16 left-8 p-1 bg-slate-950 rounded-2xl shadow-xl">
              <div className="w-32 h-32 bg-slate-900 rounded-xl flex items-center justify-center border border-white/10">
                <Briefcase className="w-16 h-16 text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="pt-20 pb-8 px-8">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    {providerProfile?.userId?.name}
                    <span className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">Provider</span>
                </h1>
                <p className="text-slate-400 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" /> {providerProfile?.userId?.email}
                </p>
                <p className="text-slate-400 flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-red-400" /> {providerProfile?.location?.address || "Location not set"}
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-center">
                    <div className="flex items-center justify-center gap-1 text-yellow-400 font-bold">
                        <Star className="w-4 h-4 fill-current" /> {providerProfile?.rating || "0.0"}
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Rating</p>
                </div>
                <button
                    onClick={() => navigate("/profile/edit")}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all font-semibold shadow-lg shadow-indigo-900/20"
                >
                    <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <h3 className="text-lg font-semibold text-white mb-4">About Me</h3>
                    <p className="text-slate-400 leading-relaxed italic">
                        {providerProfile?.bio || "No biography provided yet. Tell clients about your expertise!"}
                    </p>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <h3 className="text-lg font-semibold text-white mb-4">Professional Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {providerProfile?.skills?.map((skill: string) => (
                            <span key={skill} className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-sm font-medium">
                                {skill}
                            </span>
                        )) || <span className="text-slate-500 text-sm">No skills added</span>}
                    </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <h3 className="text-lg font-semibold text-white mb-4">Badges & Details</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Languages className="w-5 h-5 text-purple-400" />
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase">Languages</p>
                                <p className="text-sm text-white">{providerProfile?.language?.join(", ") || "English"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Truck className="w-5 h-5 text-green-400" />
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase">Transportation</p>
                                <p className="text-sm text-white">{providerProfile?.hasTransport ? "Own Transport" : "No transport"}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-indigo-600/20 to-blue-600/20 border border-white/10 rounded-2xl text-center">
                    <p className="text-white font-bold text-2xl mb-1">{providerProfile?.jobCount || 0}</p>
                    <p className="text-slate-400 text-xs uppercase tracking-widest">Jobs Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
