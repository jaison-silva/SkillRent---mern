import { useState } from "react";
import { useTimer } from "../../../hooks/useTimer";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useSignupUserMutation,
  useSignupProviderMutation,
} from "../../auth/authApiSlice";

type SignupStep = "ROLE_SELECT" | "EMAIL_INPUT" | "OTP_VERIFY" | "DETAILS";
type Role = "user" | "provider";

interface BaseSignupData {
  password: string;
  username: string;
}

interface UserSignupData extends BaseSignupData {
  name : string
}

interface ProviderSignupData extends BaseSignupData {
  hasTransport: boolean;
  skills: string[];
}


export const Signup = () => {
  const [step, setStep] = useState<SignupStep>("ROLE_SELECT");
  const [role, setRole] = useState<Role>("user");
  const [email, setEmail] = useState("");
  const { timeLeft, startTimer } = useTimer(60); 

  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [registerUser] = useSignupUserMutation();
  const [registerProvider] = useSignupProviderMutation();


  const handleSendOtp = async (targetEmail: string) => {
    try {
      await sendOtp({ email: targetEmail }).unwrap();
      setEmail(targetEmail);
      startTimer();
      setStep("OTP_VERIFY");
    } catch (err) {
      console.error("OTP Send Error", err);
    }
  };

  const handleVerify = async (otp: string) => {
    try {
      await verifyOtp({ email, otp }).unwrap();
      setStep("DETAILS");
    } catch (err) {
      console.log(err)
    }
  };

  const handleFinalSubmit = async (formData: any) => {
    const finalData = { ...formData, email };
    try {
      if (role === "user") await registerUser(finalData).unwrap();
      else await registerProvider(finalData).unwrap();
      // Redirect to Login
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      {step === "ROLE_SELECT" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Join SkillRent as...</h2>
          <button
            onClick={() => {
              setRole("user");
              setStep("EMAIL_INPUT");
            }}
            className="w-full p-4 border rounded-lg hover:border-blue-500"
          >
            A Client (Looking for Skills)
          </button>
          <button
            onClick={() => {
              setRole("provider");
              setStep("EMAIL_INPUT");
            }}
            className="w-full p-4 border rounded-lg hover:border-blue-500"
          >
            A Provider (Offering Skills)
          </button>
        </div>
      )}

      {step === "EMAIL_INPUT" && (
        <EmailStep onSubmit={handleSendOtp} isLoading={isSending} />
      )}

      {step === "OTP_VERIFY" && (
        <OtpStep
          email={email}
          timeLeft={timeLeft}
          onVerify={handleVerify}
          onResend={() => handleSendOtp(email)}
          isVerifying={isVerifying}
        />
      )}

      {step === "DETAILS" && (
        <DetailsStep onSubmit={handleFinalSubmit} role={role} />
      )}
    </div>
  );
};
