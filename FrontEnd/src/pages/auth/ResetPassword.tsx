import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Key, Lock, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import { resetPasswordApi } from "../../api/auth.api";
import { verifyOtpApi } from "../../api/otp.api";

const resetSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email: initialEmail } = location.state || {};
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: initialEmail || "" },
  });

  const onSubmit = async (data: ResetFormValues) => {
    setError("");
    try {
      // Step 1: Verify OTP
      await verifyOtpApi({ 
        email: data.email, 
        otp: data.otp, 
        purpose: "forgot_password" 
      });

      // Step 2: Reset Password
      await resetPasswordApi({ ...data, otp: Number(data.otp) });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setError(errorResponse.response?.data?.message || "Failed to reset password. Check your code.");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
          
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Reset Password</h2>
            <p className="text-slate-400 mt-2 text-sm px-4">
              Enter the reset code and your new secure password.
            </p>
          </div>

          {success ? (
            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-green-400 text-center text-sm">
              Password has been successfully updated!
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {!initialEmail && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-400 ml-1">Email Address</label>
                  <input
                    {...register("email")}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:border-purple-500 transition-colors"
                  />
                  {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-400 ml-1">OTP Code</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    {...register("otp")}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:border-purple-500 transition-all font-mono tracking-widest"
                    placeholder="000000"
                  />
                </div>
                {errors.otp && <p className="text-xs text-red-400">{errors.otp.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-400 ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    {...register("newPassword")}
                    type="password"
                    className="w-full bg-slate-800/50 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:border-purple-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
                {errors.newPassword && <p className="text-xs text-red-400">{errors.newPassword.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-400 ml-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    className="w-full bg-slate-800/50 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:border-purple-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-purple-900/30 transition-all flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Update Password"
                )}
              </motion.button>
            </form>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to log in
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
