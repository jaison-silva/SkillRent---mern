import { useState } from "react";
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
  const {UserRole} = useParams<{UserRole: Role}>()
  const [step, setStep] = useState<SignupStep>("EMAIL_INPUT");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const { seconds, start } = useTimer(60);
  const navigage = useNavigate()
  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation(); // ithu renamed ahnu, from isloading to isSending
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [registerUser] = useSignupUserMutation();
  const [registerProvider] = useSignupProviderMutation();

  const handleSendOtp = async ({email:email}:{email:string}) => {
    try {
      await sendOtp({ email, purpose: 'verification' }).unwrap();
      setEmail(email);
      start();
      setStep("OTP_VERIFY");
    } catch (err) {
      console.error("OTP Send Error", err);
    }
  };

  const handleVerify = async (otpInput: string) => {
    try {
      await verifyOtp({ email, otp: otpInput, purpose: 'verification' }).unwrap();
      setOtp(otpInput);
      setStep("DETAILS");
    } catch (err) {
      console.log(err);
    }
  };

  const handleFinalSubmit = async (
    formData: UserSignupData | ProviderSignupData,
  ) => {
    const finalData = { ...formData, email, otp };
    try {
      if (UserRole === "user") await registerUser(finalData).unwrap();
      else if (UserRole === "provider") await registerProvider(finalData).unwrap()
      navigage("/dashboard")
    } catch (err) {
      console.error("Registration failed", err);
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
        <DetailsStep onSubmit={handleFinalSubmit} role={UserRole} />
      )}
    </div>
  );
};
