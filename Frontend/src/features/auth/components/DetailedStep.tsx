import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  password: z.string().min(6, "Password must be 6+ chars"),
});

export const DetailsStep = ({ onSubmit, role, isLoading }: any) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-bold">Almost there!</h2>
      <p className="text-sm text-gray-500 font-semibold text-primary-600 uppercase">Signing up as {role}</p>
      
      <div>
        <label className="text-sm block mb-1">Full Name</label>
        <input {...register('name')} className="input-field" />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message as string}</p>}
      </div>

      <div>
        <label className="text-sm block mb-1">Password</label>
        <input {...register('password')} type="password" className="input-field" />
        {errors.password && <p className="text-red-500 text-xs">{errors.password.message as string}</p>}
      </div>

      <button 
        disabled={isLoading}
        className="btn-primary bg-primary-600 hover:bg-primary-700" 
      >
        {isLoading ? 'Creating Account...' : 'Complete Registration'}
      </button>
    </form>
  );
};