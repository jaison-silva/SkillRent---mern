import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const passwordSchema = z
  .object({
    password: z.string().min(6, "Min 6 characters"),
    confirmPassword: z.string().min(6, "Min 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const FinalStep = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: {password:string, confirmPassword:string}) => void;
  isLoading: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(passwordSchema) });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-2xl font-bold">New Password</h1>
      <input
        {...register("password")}
        type="password"
        placeholder="New Password"
        className="w-full p-2 border rounded"
      />
      <input
        {...register("confirmPassword")}
        type="password"
        placeholder="Confirm Password"
        className="w-full p-2 border rounded"
      />
      {errors.confirmPassword && (
        <p className="text-red-500 text-xs">
          {errors.confirmPassword.message as string}
        </p>
      )}
      <button
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        {isLoading ? "Updating..." : "Reset Password"}
      </button>
    </form>
  );
};
