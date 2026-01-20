import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Key, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import { sendOtpApi, verifyOtpApi } from "../../api/otp.api";
import { registerUserApi } from "../../api/auth.api";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterUser = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    const email = getValues("email");
    const name = getValues("name");
    const password = getValues("password");

    if (!email || !name || password.length < 6) {
      setError("Please fill in all details correctly before requesting OTP.");
      return;
    }

    setIsSendingOtp(true);
    setError("");
    try {
      await sendOtpApi({ email, purpose: "verification" });
      setStep(2);
      setTimer(60);
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setError(errorResponse.response?.data?.message || "Failed to send OTP. Try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setError("");
    try {
      // Step 1: Verify OTP (sets isVerified = true in DB)
      await verifyOtpApi({ 
        email: data.email, 
        otp: data.otp, 
        purpose: "verification" 
      });

      // Step 2: Final Registration (re-checks OTP value and isVerified flag)
      await registerUserApi({ ...data, otp: Number(data.otp), role: "user" });
      navigate("/login", { state: { message: "Registration successful! Please login." } });
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setError(errorResponse.response?.data?.message || "Registration failed. Check your OTP.");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950 px-4">
      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Join SkillRent</h2>
            <p className="text-slate-400">Create an account to find local services</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-5"
                >
                  <div className="space-y-4">
                    <div className="relative group">
                      <label className="text-sm font-medium text-slate-400 ml-1">Full Name</label>
                      <div className="relative mt-1.5">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          {...register("name")}
                          className="w-full bg-slate-800/50 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && <p className="text-xs text-red-400 mt-1 ml-1">{errors.name.message}</p>}
                    </div>

                    <div className="relative group">
                      <label className="text-sm font-medium text-slate-400 ml-1">Email Address</label>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          {...register("email")}
                          type="email"
                          className="w-full bg-slate-800/50 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-400 mt-1 ml-1">{errors.email.message}</p>}
                    </div>

                    <div className="relative group">
                      <label className="text-sm font-medium text-slate-400 ml-1">Password</label>
                      <div className="relative mt-1.5">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          {...register("password")}
                          type="password"
                          className="w-full bg-slate-800/50 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.password && <p className="text-xs text-red-400 mt-1 ml-1">{errors.password.message}</p>}
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    {isSendingOtp ? "Sending..." : "Continue to Verify"}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0" />
                    <div>
                      <p className="text-sm text-blue-100 font-medium">Verification Code Sent</p>
                      <p className="text-xs text-blue-300/80 mt-1">Please enter the 6-digit code sent to your email.</p>
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="text-sm font-medium text-slate-400 ml-1">OTP Code</label>
                    <div className="relative mt-1.5">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        {...register("otp")}
                        max={6}
                        className="w-full bg-slate-800/50 border border-slate-700 text-white pl-10 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-2xl tracking-[0.5em] font-mono text-center"
                        placeholder="000000"
                      />
                    </div>
                    {errors.otp && <p className="text-xs text-red-400 mt-1 ml-1">{errors.otp.message}</p>}
                  </div>

                  <div className="flex justify-between items-center text-sm px-1">
                    <p className="text-slate-500">Didn't receive code?</p>
                    {timer > 0 ? (
                      <span className="text-slate-400 font-medium">Resend in {timer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        Resend Now
                      </button>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors"
                    >
                      Back
                    </button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting}
                      className="flex-[2] py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-xl shadow-blue-500/25"
                    >
                      {isSubmitting ? "Verifying..." : "Complete Registration"}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-400 font-semibold hover:text-blue-300"
            >
              Log in
            </button>
          </p>

          <div className="mt-4 pt-4 border-t border-slate-700/50 text-center">
            <p className="text-sm text-slate-500">
              Want to offer your skills?{" "}
              <button
                onClick={() => navigate("/register/provider")}
                className="text-purple-400 font-semibold hover:text-purple-300"
              >
                Register as Provider
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterUser;
