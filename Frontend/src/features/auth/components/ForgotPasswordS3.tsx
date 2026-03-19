import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { passwordValidation } from "../zod";
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const passwordSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: z.string(),
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
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-2xl font-bold">New Password</h1>
      
      <div className="relative">
        <input
          {...register("password")}
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          className="w-full p-2 border rounded pr-10"
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <div className="relative">
        <input
          {...register("confirmPassword")}
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm Password"
          className="w-full p-2 border rounded pr-10"
        />
        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
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
