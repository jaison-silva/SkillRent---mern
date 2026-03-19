import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { nameValidation, phoneValidation } from "../../auth/zod";

const basicSchema = z.object({
  name: nameValidation,
  phone: phoneValidation,
});

export const BasicInfoForm = ({ initialData, onSave, isLoading }: any) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(basicSchema),
    defaultValues: {
      name: initialData?.name,
      phone: initialData?.phone
    },
  });

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

      <button 
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 shadow-lg shadow-blue-200 transition-all"
      >
        {isLoading ? 'Updating Identity...' : 'Save Changes'}
      </button>
    </form>
  );
};