import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  MapPin, 
  Star, 
  ArrowLeft, 
  Mail, 
  Languages, 
  Truck,
  MessageCircle,
  CalendarCheck
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const ProviderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await api.get(`/providers/${id}`);
        setProvider(res.data.provider);
      } catch (err: unknown) {
        console.error("Failed to fetch provider detail");
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!provider) {
      return (
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
              <h2 className="text-2xl font-bold text-white mb-4">Provider not found</h2>
              <button onClick={() => navigate("/explore")} className="text-blue-400 flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back to Explore
              </button>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <button
          onClick={() => navigate("/explore")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Explore
        </button>

        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
             <div className="absolute inset-0 bg-black/20" />
             <div className="absolute top-0 right-0 p-8 opacity-20">
                <Briefcase className="w-40 h-40" />
             </div>
            <div className="absolute -bottom-16 left-8 p-1 bg-slate-950 rounded-2xl shadow-2xl">
              <div className="w-32 h-32 bg-slate-900 rounded-xl flex items-center justify-center border border-white/10">
                <Briefcase className="w-16 h-16 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="pt-20 pb-8 px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-bold text-white">{provider.userId?.name}</h1>
                <p className="text-slate-400 flex items-center gap-2 mt-2">
                  <Mail className="w-4 h-4" /> {provider.userId?.email}
                </p>
                <p className="text-slate-400 flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-red-500" /> {provider.location?.address || "Location not set"}
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-center">
                    <div className="flex items-center justify-center gap-1 text-yellow-400 font-bold">
                        <Star className="w-4 h-4 fill-current" /> {provider.rating || "0.0"}
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Rating</p>
                </div>
                <button
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-blue-500/20"
                >
                    <CalendarCheck className="w-4 h-4" /> Book Now
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        About this Provider
                    </h3>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                        <p className="text-slate-400 leading-relaxed italic">
                            {provider.bio || "No biography provided."}
                        </p>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-white mb-4">Offered Services</h3>
                    <div className="flex flex-wrap gap-2">
                        {provider.skills?.map((skill: string) => (
                            <span key={skill} className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-sm font-bold">
                                {skill}
                            </span>
                        )) || <span className="text-slate-500 text-sm">No skills listed</span>}
                    </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6">Service Area</h3>
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                                <Languages className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Languages</p>
                                <p className="text-sm text-white">{provider.language?.join(", ") || "English"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                                <Truck className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Transport</p>
                                <p className="text-sm text-white">{provider.hasTransport ? "Has own vehicle" : "Public transport only"}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-white/10 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-white font-bold text-2xl">{provider.jobCount || 0}</p>
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Jobs Completed</p>
                    </div>
                    <MessageCircle className="w-10 h-10 text-slate-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProviderDetail;
