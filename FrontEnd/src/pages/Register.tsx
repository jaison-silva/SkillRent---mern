import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import axios from "axios";
import {
  REGISTER_ROLE,
  REGISTER_STEPS,
  OTP_STATUS,
} from "../pages/constants/constants";
import { UI_MESSAGES } from "./constants/messages";
import { API_ROUTES } from "../routes/apiRoutes";
import { useAuth } from "../context/AuthContext";

type Role = (typeof REGISTER_ROLE)[keyof typeof REGISTER_ROLE];
type Step = (typeof REGISTER_STEPS)[keyof typeof REGISTER_STEPS];

type Props = {
  role: Role;
};

export function Register({ role }: Props) {
  const registerEndpoint =
  role === REGISTER_ROLE.user
  ? API_ROUTES.register.user
  : API_ROUTES.register.provider;
  
  const navigate = useNavigate();
  
  const [step, setStep] = useState<Step>(REGISTER_STEPS.SEND_OTP);
  const {setAuth} = useAuth()
  
  // Common fields
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Provider-specific fields
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [hasTransport, setHasTransport] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSendOTP() {
    try {
      setLoading(true);
      setError("");
      await api.post(API_ROUTES.otp.send, {
        email,
        purpose: OTP_STATUS.VERIFICATION,
      });
      setStep(REGISTER_STEPS.VERIFY_OTP);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || UI_MESSAGES.REQUEST_FAILED);
      } else {
        setError(UI_MESSAGES.GENERIC_ERROR);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP() {
    try {
      setLoading(true);
      setError("");
      await api.post(API_ROUTES.otp.verify, {
        email,
        otp: Number(otp),
        purpose: OTP_STATUS.VERIFICATION,
      });
      setStep(REGISTER_STEPS.REGISTER);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || UI_MESSAGES.REQUEST_FAILED);
      } else {
        setError(UI_MESSAGES.GENERIC_ERROR);
      }
    } finally {
      setLoading(false);
    }
  }

  function buildPayload() {
    if (role === REGISTER_ROLE.user) {
      return { name, email, password, otp: Number(otp), role };
    }
    return {
      name,
      email,
      password,
      otp: Number(otp),
      role,
      bio,
      skills,
      hasTransport,
    };
  }

  async function handleRegister() {
    // Validate passwords match before sending to server
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await api.post(registerEndpoint, buildPayload());
      setAuth(res.data.user, res.data.accessToken)
      navigate("/home");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || UI_MESSAGES.REQUEST_FAILED);
      } else {
        setError(UI_MESSAGES.GENERIC_ERROR);
      }
    } finally {
      setLoading(false);
    }
  }

  const STEP_ORDER: Record<Step, number> = {
    [REGISTER_STEPS.SEND_OTP]: 1,
    [REGISTER_STEPS.VERIFY_OTP]: 2,
    [REGISTER_STEPS.REGISTER]: 3,
  };

  // Step indicator component
  const StepIndicator = () => {
    const currentStep = STEP_ORDER[step];
    return (
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((num, idx) => {
          const isActive = currentStep >= num;
          const isCurrent = currentStep === num;
          return (
            <div key={num} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-400"
                } ${isCurrent ? "ring-4 ring-blue-600/30" : ""}`}
              >
                {num}
              </div>
              {idx < 2 && (
                <div
                  className={`w-16 h-1 mx-2 rounded transition-all duration-300 ${
                    currentStep > num ? "bg-blue-600" : "bg-gray-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const inputClass =
    "w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";

  const buttonClass =
    "w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {role === REGISTER_ROLE.user
                ? "Join as User"
                : "Become a Provider"}
            </h1>
            <p className="text-gray-400">
              {step === REGISTER_STEPS.SEND_OTP &&
                "Enter your email to get started"}
              {step === REGISTER_STEPS.VERIFY_OTP &&
                "Check your email for the code"}
              {step === REGISTER_STEPS.REGISTER && "Complete your profile"}
            </p>
          </div>

          {/* Step Indicator */}
          <StepIndicator />

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Step 1: Send OTP */}
          {step === REGISTER_STEPS.SEND_OTP && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                onClick={handleSendOTP}
                disabled={loading || !email}
                className={buttonClass}
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </div>
          )}

          {/* Step 2: Verify OTP */}
          {step === REGISTER_STEPS.VERIFY_OTP && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className={`${inputClass} text-center text-2xl tracking-widest`}
                />
                <p className="mt-2 text-sm text-gray-400 text-center">
                  Code sent to {email}
                </p>
              </div>
              <button
                onClick={handleVerifyOTP}
                disabled={loading || !otp}
                className={buttonClass}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
              <button
                onClick={() => setStep(REGISTER_STEPS.SEND_OTP)}
                className="w-full py-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                ← Use a different email
              </button>
            </div>
          )}

          {/* Step 3: Registration Form */}
          {step === REGISTER_STEPS.REGISTER && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Provider-specific fields */}
              {role === REGISTER_ROLE.provider && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      placeholder="Tell us about yourself and your expertise..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Skills (comma separated)
                    </label>
                    <input
                      placeholder="Plumbing, Electrical, Carpentry"
                      onChange={(e) =>
                        setSkills(
                          e.target.value.split(",").map((s) => s.trim()),
                        )
                      }
                      className={inputClass}
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={hasTransport}
                      onChange={(e) => setHasTransport(e.target.checked)}
                      className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                    />
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      I have my own transport
                    </span>
                  </label>
                </>
              )}

              <button
                onClick={handleRegister}
                disabled={loading || !name || !password}
                className={buttonClass}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          )}

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
