import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

type OtpType = z.infer<typeof otpSchema>; // kinda like string thanne

export const VerifyStep = ({
  email,
  onSubmit,
  onResend,
  timeLeft,
  isLoading,
}: {
  email: string;
  onSubmit: (data: OtpType) => void;
  timeLeft: number;
  onResend: () => void;
  isLoading: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-2xl font-bold">Verify Code</h1>
      <p className="text-gray-500">Sent to {email}</p>
      <input
        {...register("otp")}
        className="w-full p-2 border rounded text-center text-xl tracking-widest"
        maxLength={6}
      />
      {errors.otp && (
        <p className="text-sm text-red-500">{errors.otp.message}</p>
      )}

      <button
        disabled={isLoading}
        className="w-full bg-black text-white py-2 rounded"
      >
        {isLoading ? "Verifying..." : "Continue"}
      </button>

      {timeLeft > 0 ? (
        <p className="text-xs text-gray-400">Resend code in {timeLeft}s</p>
      ) : (
        <button
          type="button"
          onClick={onResend}
          className="text-sm text-blue-600 underline"
        >
          Resend OTP
        </button>
      )}
    </form>
  );
};
