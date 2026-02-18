import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTimer } from "../../../hooks/useTimer";
import {
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} from "../authApiSlice";

import { RequestStep } from "../components/ForgotPasswordS1";
import { VerifyStep } from "../components/ForgotPasswordS2";
import { FinalStep } from "../components/ForgotPasswordS3";

export default function ResetPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const [forgotPassword, { isLoading: isRequesting }] =
    useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation(); // : renameing innu olle ah
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

  const { seconds: timeLeft, start: startTimer } = useTimer(60);

  const handleRequest = async (data: { email: string }) => {
    await forgotPassword(data).unwrap();
    setEmail(data.email);
    startTimer();
    setStep(2);
  };

  const handleVerify = async (data: { otp: string }) => {
    await verifyOtp({
      email,
      otp: data.otp,
      purpose: "FORGOT_PASSWORD",
    }).unwrap();
    setOtp(data.otp);
    setStep(3);
  };

  const handleReset = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    await resetPassword({
      email,
      otp: Number(otp),
      newPassword: data.password,
    }).unwrap();
    alert("Password updated successfully!");
    navigate("/login");
  };

  const handleResend = async () => {
    await forgotPassword({ email }).unwrap();
    startTimer();
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      {step === 1 && (
        <RequestStep onSubmit={handleRequest} isLoading={isRequesting} />
      )}
      {step === 2 && (
        <VerifyStep
          email={email}
          onSubmit={handleVerify}
          onResend={handleResend}
          timeLeft={timeLeft}
          isLoading={isVerifying}
        />
      )}
      {step === 3 && (
        <FinalStep onSubmit={handleReset} isLoading={isResetting} />
      )}
    </div>
  );
}
