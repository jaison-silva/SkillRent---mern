import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { nameValidation, phoneValidation } from "../../auth/zod";
import LocationPicker from "../../../components/LocationPicker";

const basicSchema = z.object({
  name: nameValidation,
  phone: phoneValidation,
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().optional()
  }).optional()
});

export const BasicInfoForm = ({ initialData, onSave, isLoading }: any) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(basicSchema),
    defaultValues: {
      name: initialData?.name,
      phone: initialData?.phone,
      location: initialData?.location
    },
  });

  const currentLocation = watch('location');

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
          <input 
            {...register('name')} 
            className="w-full p-3 mt-1 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
          />
          {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name.message as string}</p>}
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
          <input 
            {...register('phone')} 
            placeholder="eg : 9876543210"
            className="w-full p-3 mt-1 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
          />
          {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone.message as string}</p>}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email (Read Only)</label>
        <p className="text-gray-500 mt-1 font-medium">{initialData?.email}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</label>
        <div className="mt-2">
          <LocationPicker 
            initialAddress={currentLocation?.address || ''}
            onLocationSelect={(loc) => {
              if (loc) {
                setValue('location', loc);
              } else {
                setValue('location', undefined);
              }
            }} 
            placeholder="Search for your city or use current location..."
          />
        </div>
        {currentLocation && (
          <p className="text-xs text-green-600 mt-2 font-medium">
            Location set: {currentLocation.address || `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`}
          </p>
        )}
      </div>

      <button 
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 shadow-lg shadow-blue-200 transition-all"
      >
        {isLoading ? 'Updating Identity...' : 'Save Changes'}
      </button>
    </form>
  );
};