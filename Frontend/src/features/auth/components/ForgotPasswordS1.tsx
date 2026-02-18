import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const emailSchema = z.object({ email: z.string().email() });
type EmailFormData = z.infer<typeof emailSchema>;

export const RequestStep = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: EmailFormData) => void | Promise<void>;
  isLoading: boolean;
}) => {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(emailSchema),
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-2xl font-bold">Forgot Password</h1>
      <p className="text-gray-500">
        Enter your email to receive a recovery code.
      </p>
      <input
        {...register("email")}
        className="w-full p-2 border rounded"
        placeholder="email@example.com"
      />
      <button
        disabled={isLoading}
        className="w-full bg-black text-white py-2 rounded"
      >
        {isLoading ? "Sending..." : "Send OTP"}
      </button>
    </form>
  );
};
