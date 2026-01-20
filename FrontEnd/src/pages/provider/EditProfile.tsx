import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Briefcase, Save, ArrowLeft, AlertCircle, MapPin, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProviderProfileApi, updateProviderProfileApi } from "../../api/provider.api";

const providerSchema = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  language: z.array(z.string()).min(1, "Select at least one language"),
  hasTransport: z.boolean(),
  location: z.object({
    address: z.string().min(5, "Address is required"),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
});

type ProviderFormValues = z.infer<typeof providerSchema>;

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSkill, setNewSkill] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: { skills: [], language: ["English"], hasTransport: false },
  });

  const skills = watch("skills");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProviderProfileApi();
        const p = res.data.provider;
        setValue("bio", p.bio || "");
        setValue("skills", p.skills || []);
        setValue("language", p.language || ["English"]);
        setValue("hasTransport", p.hasTransport || false);
        setValue("location", {
            address: p.location?.address || "",
            lat: p.location?.lat || 0,
            lng: p.location?.lng || 0
        });
      } catch (err: unknown) {
        setError("Failed to load provider data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [setValue]);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setValue("skills", [...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setValue("skills", skills.filter(s => s !== skill));
  };

  const onSubmit = async (data: ProviderFormValues) => {
    try {
      await updateProviderProfileApi(data);
      navigate("/profile");
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setError(errorResponse.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto relative z-10"
      >
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Cancel
        </button>

        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                  <Briefcase className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">Professional Profile</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-400 ml-1">Professional Biography</label>
              <textarea
                {...register("bio")}
                rows={4}
                className="w-full bg-slate-800/50 border border-slate-700 text-white p-4 rounded-xl outline-none focus:border-indigo-500 transition-colors resize-none"
                placeholder="Describe your services and experience..."
              />
              {errors.bio && <p className="text-xs text-red-400">{errors.bio.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-400 ml-1">Skills & Services</label>
              <div className="flex gap-2">
                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 bg-slate-800/50 border border-slate-700 text-white px-4 py-2 rounded-xl outline-none focus:border-indigo-500"
                  placeholder="Add a skill (e.g. Plumbing)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-sm flex items-center gap-2">
                    {skill}
                    <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => removeSkill(skill)} />
                  </span>
                ))}
              </div>
              {errors.skills && <p className="text-xs text-red-400">{errors.skills.message}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-400 ml-1">Work Location Address</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                             {...register("location.address")}
                            className="w-full bg-slate-800/50 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:border-indigo-500 transition-colors"
                            placeholder="City, State"
                        />
                    </div>
                </div>

                <div className="flex items-center h-full pt-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                {...register("hasTransport")}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                        </div>
                        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">I have own transportation</span>
                    </label>
                </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-900/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Provider Profile
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EditProfile;
