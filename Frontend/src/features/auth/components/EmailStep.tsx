import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema } from "../zod";
import { GoogleLoginUser } from "./GoogleLogin";

export const EmailStep = ({  handleOtp,  isLoading, role }: {  handleOtp: (email:{email: string}) => void | Promise<void>,  isLoading: boolean; role?: string;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(emailSchema) });

  return (
    <form onSubmit={handleSubmit(handleOtp)} className="space-y-4">
      <h2 className="text-xl font-bold">Verify your Email</h2>
      <p className="text-sm text-gray-500">
        We'll send a 6-digit code to your inbox.
      </p>
      <input
        {...register("email")}
        placeholder="email@example.com"
        className="input-field"
      />
      {errors.email && (
        <p className="text-red-500 text-xs">{errors.email.message as string}</p>
      )}
      <button
        disabled={isLoading}
        className="btn-primary"
      >
        {isLoading ? "Sending..." : "Send OTP"}
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <GoogleLoginUser role={role} />
    </form>
  );
};

