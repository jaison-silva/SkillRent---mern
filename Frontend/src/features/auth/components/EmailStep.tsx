import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema } from "../zod";

export const EmailStep = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(emailSchema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-bold">Verify your Email</h2>
      <p className="text-sm text-gray-500">
        We'll send a 6-digit code to your inbox.
      </p>
      <input
        {...register("email")}
        placeholder="email@example.com"
        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
      />
      {errors.email && (
        <p className="text-red-500 text-xs">{errors.email.message as string}</p>
      )}
      <button
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isLoading ? "Sending..." : "Send OTP"}
      </button>
    </form>
  );
};
