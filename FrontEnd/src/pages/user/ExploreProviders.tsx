import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Star, Briefcase, Filter, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const ExploreProviders = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await api.get("/providers");
        setProviders(res.data.providers || []);
      } catch (err: unknown) {
        console.error("Failed to fetch providers");
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  const allSkills = Array.from(new Set(providers.flatMap(p => p.skills || [])));

  const filteredProviders = providers.filter(p => {
    const name = p.userId?.name || "";
    const address = p.location?.address || "";
    const matchesSearch = 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = selectedSkill === "" || (p.skills && p.skills.includes(selectedSkill));
    
    // Strict filter: only approved and non-banned providers show in marketplace
    return matchesSearch && matchesSkill && p.validationStatus === "approved" && !p.isBanned;
  });

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
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Discover Professional Services</h1>
          <p className="text-slate-400">Find the right talent for your next project, trusted and verified.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-blue-500 transition-all font-medium"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-400" /> Filter by Skill
                    </h3>
                    {selectedSkill && (
                        <button 
                            onClick={() => setSelectedSkill("")}
                            className="text-xs text-slate-500 hover:text-white flex items-center gap-1"
                        >
                            <X className="w-3 h-3" /> Clear Selection
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => setSelectedSkill(skill === selectedSkill ? "" : skill)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedSkill === skill 
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                          : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <motion.div
              layout
              key={provider._id}
              className="group bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all cursor-pointer"
              onClick={() => navigate(`/providers/${provider._id}`)}
              whileHover={{ y: -5 }}
            >
              <div className="h-24 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 relative" />
              <div className="px-6 pb-6 relative">
                <div className="absolute -top-10 left-6 p-1 bg-slate-950 rounded-2xl shadow-xl">
                  <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center border border-white/10">
                    <Briefcase className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                
                <div className="pt-10 mb-6">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {provider.userId?.name}
                  </h3>
                  <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5" /> {provider.location?.address || "Remote"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {provider.skills?.slice(0, 3).map((skill: string) => (
                    <span key={skill} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md text-[10px] uppercase font-bold tracking-wider border border-blue-500/20">
                      {skill}
                    </span>
                  ))}
                  {provider.skills?.length > 3 && (
                    <span className="px-2 py-0.5 bg-white/5 text-slate-500 rounded-md text-[10px] uppercase font-bold tracking-wider">
                      +{provider.skills.length - 3} More
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-yellow-500 font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{provider.rating || "0.0"}</span>
                  </div>
                  <button className="flex items-center gap-1 text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                    View Profile <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div className="text-center py-24 bg-white/5 border border-dashed border-white/10 rounded-3xl">
            <Briefcase className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400">No providers found</h3>
            <p className="text-slate-600 mt-1">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreProviders;
