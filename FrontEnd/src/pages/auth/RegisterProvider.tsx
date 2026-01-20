import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, User, Mail, Lock, Key, ShieldCheck, AlertCircle, ArrowRight, Check } from "lucide-react";
import { sendOtpApi, verifyOtpApi } from "../../api/otp.api";
import { registerProviderApi } from "../../api/auth.api";

const registerSchema = z.object({
  name: z.string().min(2, "Name/Business name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  serviceType: z.string().min(1, "Please select a service type"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const services = ["Plumbing", "Electrical", "Cleaning", "Carpentry", "Gardening", "Moving"];

const RegisterProvider = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Details, 2: OTP
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { otp: "", serviceType: "" },
  });

  const selectedService = watch("serviceType");

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
    const serviceType = getValues("serviceType");

    if (!email || !name || password.length < 6 || !serviceType) {
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
      // Step 1: Verify OTP
      await verifyOtpApi({ 
        email: data.email, 
        otp: data.otp, 
        purpose: "verification" 
      });

      // Step 2: Register Provider
      const { serviceType, otp, ...rest } = data;
      await registerProviderApi({
        ...rest,
        otp: Number(otp),
        skills: [serviceType], // Backend expects skills array
        role: "provider" // Required by backend DTO
      } as any);
      navigate("/login", { state: { message: "Provider account created! Please login." } });
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setError(errorResponse.response?.data?.message || "Registration failed. Check your OTP.");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500" />
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Partner with SkillRent</h2>
            <p className="text-slate-400">Offer your expertise and grow your business</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="p-step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-400 ml-1">Business/Personal Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          {...register("name")}
                          className="w-full bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:border-indigo-500 transition-colors"
                          placeholder="Skillful Co."
                        />
                      </div>
                      {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-400 ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          {...register("email")}
                          type="email"
                          className="w-full bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:border-indigo-500 transition-colors"
                          placeholder="pro@example.com"
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-400 ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        {...register("password")}
                        type="password"
                        className="w-full bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:border-indigo-500 transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-400 ml-1">Select Your Service</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {services.map((service) => (
                        <button
                          key={service}
                          type="button"
                          onClick={() => setValue("serviceType", service)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between ${
                            selectedService === service
                              ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/40"
                              : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500"
                          }`}
                        >
                          {service}
                          {selectedService === service && <Check className="w-3 h-3" />}
                        </button>
                      ))}
                    </div>
                    {errors.serviceType && <p className="text-xs text-red-400 mt-1">{errors.serviceType.message}</p>}
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-xl shadow-indigo-900/30 flex items-center justify-center gap-2 transition-all mt-4"
                  >
                    {isSendingOtp ? "Sending OTP..." : "Continue with Verification"}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="p-step2"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-8 py-4"
                >
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-full mb-2">
                      <ShieldCheck className="w-6 h-6 text-green-400" />
                    </div>
                    <p className="text-lg font-medium text-white">Enter Verification Code</p>
                    <p className="text-slate-400 text-sm">We've sent a 6-digit code to {getValues("email")}</p>
                  </div>

                  <div className="relative max-w-[280px] mx-auto">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
                    <input
                      {...register("otp")}
                      className="w-full bg-slate-900/50 border-2 border-slate-700 text-white py-5 rounded-2xl outline-none focus:border-indigo-500 transition-all text-3xl tracking-[0.4em] font-mono text-center pl-8"
                      placeholder="000000"
                    />
                    {errors.otp && <p className="text-center text-xs text-red-400 mt-2">{errors.otp.message}</p>}
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    {timer > 0 ? (
                      <p className="text-sm text-slate-500">Resend code in <span className="text-indigo-400 font-mono">{timer}s</span></p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-sm text-indigo-400 hover:underline font-medium"
                      >
                        Didn't receive code? Resend
                      </button>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-4 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors"
                    >
                      Back
                    </button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting}
                      className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-2xl shadow-indigo-500/30"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                      ) : (
                        "Verify & Finalize Account"
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </form>

          <p className="mt-10 text-center text-sm text-slate-500">
            Already registered?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
            >
              Sign In
            </button>
          </p>

          <div className="mt-4 pt-4 border-t border-slate-700/50 text-center">
            <p className="text-sm text-slate-500">
              Looking to hire services instead?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-blue-400 font-semibold hover:text-blue-300"
              >
                Register as User
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterProvider;
