import { useForm } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export const OtpStep = ({ email, timeLeft, onVerify, onResend, isVerifying }: any) => {
  const { register, handleSubmit } = useForm();
  const hasExpired = useRef(false);

  useEffect(() => {
    if (timeLeft > 0) {
        hasExpired.current = false;
    } else if (timeLeft === 0 && !hasExpired.current) {
        toast.error("OTP has expired. Please resend the code.");
        hasExpired.current = true;
    }
  }, [timeLeft]);

  return (
    <form onSubmit={handleSubmit((data) => onVerify(data.otp))} className="space-y-4 text-center">
      <h2 className="text-xl font-bold">Enter OTP</h2>
      <p className="text-sm text-gray-500">Sent to <span className="font-medium text-gray-900">{email}</span></p>
      
      <input 
        {...register('otp')} 
        maxLength={6}
        className="w-32 text-center text-2xl tracking-widest p-2 border-b-2 border-primary-600 outline-none focus:border-primary-700 transition-colors"
        placeholder="000000"
      />
      
      <div className="flex flex-col space-y-3 mt-4">
        <button 
          disabled={isVerifying}
          className="btn-primary"
        >
          {isVerifying ? 'Verifying...' : 'Verify OTP'}
        </button>

        <button 
          type="button"
          onClick={onResend}
          disabled={timeLeft > 0}
          className={`text-sm font-medium transition-colors ${
            timeLeft > 0 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-600 hover:underline'
          }`}
        >
          {timeLeft > 0 ? `Resend code in ${timeLeft}s` : 'Resend OTP'}
        </button>
      </div>
    </form>
  );
};