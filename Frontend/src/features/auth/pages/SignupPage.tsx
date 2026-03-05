import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "../authSlice";
import { useTimer } from "../../../hooks/useTimer";
import { useParams, useNavigate } from "react-router-dom";
import { EmailStep } from "../components/EmailStep";
import { OtpStep } from "../components/OtpStep";
import { DetailsStep } from "../components/DetailedStep";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useSignupUserMutation,
  useSignupProviderMutation,
} from "../../auth/authApiSlice";

type SignupStep = "EMAIL_INPUT" | "OTP_VERIFY" | "DETAILS";
type Role = "user" | "provider";

interface BaseSignupData {
  password: string;
  email: string;
}

interface UserSignupData extends BaseSignupData {
  name: string;
}

interface ProviderSignupData extends BaseSignupData {
  name: string;
  hasTransport: boolean;
  skills: string[];
}

export const Signup = () => {
  const { role: UserRole } = useParams<{ role: Role }>();
  const [step, setStep] = useState<SignupStep>("EMAIL_INPUT");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const { seconds, start } = useTimer(60);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation(); // ithu renamed ahnu, from isloading to isSending 
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [registerUser, { isLoading: isRegisteringUser }] = useSignupUserMutation();
  const [registerProvider, { isLoading: isRegisteringProvider }] = useSignupProviderMutation();

  const isRegistering = isRegisteringUser || isRegisteringProvider;

  const handleSendOtp = async ({email:email}:{email:string}) => {
    try {
      await sendOtp({ email, purpose: 'verification' }).unwrap();
      setEmail(email);
      start();
      setStep("OTP_VERIFY");
    } catch (err: any) {
      console.error("OTP Send Error", err);
      toast.error(err?.data?.message || err?.message || "Failed to send OTP. User may already exist.");
    }
  };

  const handleVerify = async (otpInput: string) => {
    try {
      await verifyOtp({ email, otp: otpInput, purpose: 'verification' }).unwrap();
      setOtp(otpInput);
      setStep("DETAILS");
    } catch (err: any) {
      console.log(err);
      toast.error(err?.data?.message || "Invalid OTP provided.");
    }
  };

  const handleFinalSubmit = async (
    formData: UserSignupData | ProviderSignupData,
  ) => {
    const finalData = { ...formData, email, otp };
    try {
      let result;
      if (UserRole === "user") {
        result = await registerUser(finalData).unwrap();
      } else if (UserRole === "provider") {
        result = await registerProvider(finalData).unwrap();
      }

      if (result && result.user && result.accessToken) {
        dispatch(
          setCredentials({
            user: result.user,
            token: result.accessToken,
          })
        );
      }
      
      navigate("/dashboard")
    } catch (err: any) {
      console.error("Registration failed", err);
      toast.error(err?.data?.message || "Registration failed. User may already exist.");
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      {step === "EMAIL_INPUT" && (
        <EmailStep handleOtp={handleSendOtp} isLoading={isSending} />
      )}

      {step === "OTP_VERIFY" && (
        <OtpStep
          email={email}
          timeLeft={seconds}
          onVerify={handleVerify}
          onResend={() => handleSendOtp({email})}
          isVerifying={isVerifying}
        />
      )}

      {step === "DETAILS" && (
        <DetailsStep onSubmit={handleFinalSubmit} role={UserRole} isLoading={isRegistering} />
      )}
    </div>
  );
};
