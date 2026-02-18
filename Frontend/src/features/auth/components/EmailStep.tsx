import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema } from "../zod";

export const EmailStep = ({  handleOtp,  isLoading,}: {  handleOtp: (email:{email: string}) => void | Promise<void>,  isLoading: boolean;
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
    </form>
  );
};
