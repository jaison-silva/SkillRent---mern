import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userDetailsSchema as schema } from '../zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useGetPublicCategoriesQuery } from '../../public/publicApiSlice';

export const DetailsStep = ({ onSubmit, role, isLoading }: any) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'fetching' | 'success' | 'error' | 'unsupported'>('idle');
  
  const { data: catData, isLoading: isLoadingCats } = useGetPublicCategoriesQuery(undefined, { skip: role !== 'provider' });
  const categories = catData?.categories || [];

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

      {role === 'provider' && (
        <div>
          <label className="text-sm block mb-1">Work Nature</label>
          <select {...register('workNature')} className="input-field w-full p-2 border rounded">
            <option value="offline">Offline / On-site</option>
            <option value="online">Online / Remote</option>
            <option value="both">Both</option>
          </select>
          {errors.workNature && <p className="text-red-500 text-xs">{errors.workNature.message as string}</p>}
        </div>
      )}

      {role === 'provider' && !isLoadingCats && categories.length > 0 && (
        <div>
          <label className="text-sm block mb-1">Categories (Select one or more)</label>
          <select 
            multiple
            {...register('categories')}
            className="input-field w-full p-2 border rounded min-h-[100px]"
          >
            {categories.map((cat: any) => (
              <option key={cat._id} value={cat._id} className="p-1.5 hover:bg-blue-50 cursor-pointer">
                {cat.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple categories.</p>
        </div>
      )}

      <div>
        <label className="text-sm block mb-1">Location (Optional)</label>
        <button
          type="button"
          onClick={() => {
            setLocationStatus('fetching');
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  setValue('location', {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  });
                  setLocationStatus('success');
                },
                (error) => {
                  console.error("Error getting location:", error);
                  setLocationStatus('error');
                }
              );
            } else {
              setLocationStatus('unsupported');
            }
          }}
          className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center transition-colors"
        >
          {locationStatus === 'fetching' ? 'Fetching...' : 
           locationStatus === 'success' ? 'Location Saved ✓' : 
           locationStatus === 'error' ? 'Failed to get location' :
           locationStatus === 'unsupported' ? 'Not supported by browser' :
           '📍 Get Current Location'}
        </button>
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