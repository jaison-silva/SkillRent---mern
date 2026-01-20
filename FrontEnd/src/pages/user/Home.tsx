import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Briefcase, Star, Shield, ArrowRight, Sparkles } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-20 pb-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6">
              <Sparkles className="w-3 h-3" />
              Verified Professional Services
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight mb-8">
              The Best Talent <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 italic font-serif">
                Just a Click Away
              </span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-lg leading-relaxed">
              Connect with verified experts, manage your projects, and get work done efficiently. Your reliable partner for all service needs.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/explore")}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-blue-500/20 active:scale-95 group"
              >
                Find Services
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold transition-all"
              >
                How it Works
              </button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8">
                <div>
                    <h4 className="text-2xl font-bold text-white mb-1">2k+</h4>
                    <p className="text-sm text-slate-500 font-medium">Experts</p>
                </div>
                <div>
                    <h4 className="text-2xl font-bold text-white mb-1">15k+</h4>
                    <p className="text-sm text-slate-500 font-medium">Projects Done</p>
                </div>
                <div>
                    <h4 className="text-2xl font-bold text-white mb-1">4.9</h4>
                    <p className="text-sm text-slate-500 font-medium">Avg Rating</p>
                </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="relative">
               <div className="absolute inset-0 bg-blue-500/20 blur-[100px] -z-10" />
               <div className="grid grid-cols-2 gap-6 scale-90 translate-x-10">
                  <StatCard icon={<Search className="w-6 h-6" />} title="Discovery" bg="bg-blue-500/10 text-blue-400" />
                  <StatCard icon={<Briefcase className="w-6 h-6" />} title="Verified Jobs" bg="bg-indigo-500/10 text-indigo-400" className="mt-12" />
                  <StatCard icon={<Star className="w-6 h-6" />} title="Premium Quality" bg="bg-yellow-500/10 text-yellow-400" />
                  <StatCard icon={<Shield className="w-6 h-6" />} title="Secure Escrow" bg="bg-green-500/10 text-green-400" className="mt-y-12" />
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, bg, className = "" }: any) => (
    <div className={`p-8 bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl flex flex-col items-center justify-center text-center group hover:border-white/20 transition-all ${className}`}>
        <div className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <h3 className="text-white font-bold text-lg">{title}</h3>
    </div>
)

export default Home;
