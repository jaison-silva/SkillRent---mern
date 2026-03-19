import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTimer } from '../../../hooks/useTimer';
import { useForgotPasswordMutation, useVerifyOtpMutation, useResetPasswordMutation } from '../../auth/authApiSlice';
import { VerifyStep } from '../../auth/components/ForgotPasswordS2';
import { FinalStep } from '../../auth/components/ForgotPasswordS3';
import { X } from 'lucide-react';

interface ChangePasswordModalProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ email, isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  
  const [forgotPassword] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();
  const { seconds: timeLeft, start: startTimer } = useTimer(60);

  useEffect(() => {
    if (isOpen && step === 1) {
      handleRequestOTP();
    }
  }, [isOpen]);

  const handleRequestOTP = async () => {
    try {
      await forgotPassword({ email }).unwrap();
      startTimer();
      setStep(2);
      toast.success("Security OTP sent to your email!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send security OTP.");
      onClose();
    }
  };

  const handleVerify = async (data: { otp: string }) => {
    try {
      await verifyOtp({ email, otp: data.otp, purpose: "forgot_password" }).unwrap();
      setOtp(data.otp);
      setStep(3);
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid OTP.");
    }
  };

  const handleReset = async (data: { password: string; confirmPassword: string }) => {
    try {
      await resetPassword({ email, otp: Number(otp), newPassword: data.password }).unwrap();
      toast.success("Password updated successfully!");
      handleClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reset password.");
    }
  };

  const handleClose = () => {
    setStep(1);
    setOtp("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>
        <div className="p-6">
          {step === 1 && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium text-sm">Requesting secure session... Please wait.</p>
            </div>
          )}
          {step === 2 && (
            <div className="pt-4">
              <VerifyStep
                email={email}
                onSubmit={handleVerify}
                onResend={handleRequestOTP}
                timeLeft={timeLeft}
                isLoading={isVerifying}
              />
            </div>
          )}
          {step === 3 && (
            <div className="pt-4">
              <FinalStep onSubmit={handleReset} isLoading={isResetting} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
