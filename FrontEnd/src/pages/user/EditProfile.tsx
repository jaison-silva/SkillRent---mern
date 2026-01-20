import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { User, Save, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserProfileApi, updateUserProfileApi } from "../../api/user.api";
import { getProviderProfileApi, updateProviderProfileApi } from "../../api/provider.api";
import { useAuth } from "../../context/AuthContext";

const editSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional(),
  skills: z.string().optional(), // We'll convert from/to array on frontend
});

type EditFormValues = z.infer<typeof editSchema>;

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let res;
        if (user?.role === "provider") {
            res = await getProviderProfileApi();
            console.log("EditProfile: fetched provider:", res.data);
            setValue("name", res.data.provider.userId.name);
            setValue("bio", res.data.provider.bio || "");
            setValue("skills", res.data.provider.skills?.join(", ") || "");
        } else {
            res = await getUserProfileApi();
            console.log("EditProfile: fetched user:", res.data);
            setValue("name", res.data.user.name);
        }
      } catch (err: unknown) {
        console.error("EditProfile fetch error:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user, setValue]);

  const onSubmit = async (data: EditFormValues) => {
    try {
      if (user?.role === "provider") {
          const formattedData = {
              name: data.name,
              bio: data.bio,
              skills: data.skills?.split(",").map(s => s.trim()).filter(s => s !== "") || []
          };
          console.log("Updating provider profile:", formattedData);
          await updateProviderProfileApi(formattedData);
      } else {
          console.log("Updating user profile:", data);
          await updateUserProfileApi({ name: data.name });
      }
      navigate("/profile");
    } catch (err: unknown) {
      console.error("Profile update error:", err);
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setError(errorResponse.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto relative z-10"
      >
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Cancel
        </button>

        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-8">Edit Your Profile</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1.5 text-center mb-8">
               <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-2 text-blue-400">
                  <User className="w-10 h-10" />
               </div>
               <p className="text-xs text-slate-500">Avatar upload coming soon</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-400 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  {...register("name")}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors"
                  placeholder="Your Name"
                />
              </div>
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
            </div>

            {user?.role === "provider" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-400 ml-1">Bio</label>
                  <textarea
                    {...register("bio")}
                    rows={4}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors resize-none"
                    placeholder="Tell us about yourself..."
                  />
                  {errors.bio && <p className="text-xs text-red-400 mt-1">{errors.bio.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-400 ml-1">Skills (comma separated)</label>
                  <input
                    {...register("skills")}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors"
                    placeholder="Plumbing, Electrician, Gardening..."
                  />
                  <p className="text-[10px] text-slate-500 ml-1 italic">Example: Painting, Carpentry, Cleaning</p>
                  {errors.skills && <p className="text-xs text-red-400 mt-1">{errors.skills.message}</p>}
                </div>
              </>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
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
