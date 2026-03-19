import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userDetailsSchema as schema } from '../zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export const DetailsStep = ({ onSubmit, role, isLoading }: any) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        <div className="relative">
          <input 
            {...register('password')} 
            type={showPassword ? "text" : "password"} 
            className="input-field w-full pr-10" 
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
      </div>

      <div>
        <label className="text-sm block mb-1">Confirm Password</label>
        <div className="relative">
          <input 
            {...register('confirmPassword')} 
            type={showConfirmPassword ? "text" : "password"} 
            className="input-field w-full pr-10" 
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message as string}</p>}
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