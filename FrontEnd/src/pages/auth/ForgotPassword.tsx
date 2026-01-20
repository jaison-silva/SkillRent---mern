import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Mail, HelpCircle, ArrowLeft, Send, AlertCircle } from "lucide-react";
import { forgotPasswordApi } from "../../api/auth.api";

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email: initialEmail, autoSend } = location.state || {};
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isAutoProcessing, setIsAutoProcessing] = useState(false);
  const hasAutoSent = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: initialEmail || "" },
  });

  useEffect(() => {
    if (autoSend && initialEmail && !hasAutoSent.current) {
      hasAutoSent.current = true;
      setIsAutoProcessing(true);
      onSubmit({ email: initialEmail });
    }
  }, [autoSend, initialEmail]);

  const onSubmit = async (data: ForgotFormValues) => {
    if (isSubmitting && !isAutoProcessing) return; // Prevent double submit from button
    setError("");
    try {
      await forgotPasswordApi(data);
      setSuccess(true);
      setTimeout(() => {
        navigate("/reset-password", { state: { email: data.email } });
      }, 2000);
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setError(errorResponse.response?.data?.message || "Failed to send reset code. Please check your email.");
    } finally {
      setIsAutoProcessing(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          
          <div className="mb-8 flex flex-col items-center">
            <div className="w-14 h-14 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mb-4">
              <HelpCircle className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Forgot Password?</h2>
            <p className="text-slate-400 text-center mt-2 px-4 text-sm">
              No worries! Enter your email and we'll send you a recovery code.
            </p>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-green-400 text-center text-sm"
            >
              Reset code sent successfully! Redirecting...
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-400 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full bg-slate-800/50 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-400 ml-1">{errors.email.message}</p>}
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting || isAutoProcessing}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                {isSubmitting || isAutoProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{isAutoProcessing ? "Auto-sending..." : "Sending..."}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send reset code
                  </>
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
              Back to Sign In
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
