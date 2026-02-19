import { useState } from 'react';
import { useGetProfileQuery, useUpdateProviderMutation } from '../../user/userApiSlice';
import { ProviderProfileForm } from '../components/ProviderProfileForm';
import { UserBasicInfoForm } from '../components/UserBasicInfoForm';

export default function ProviderProfilePage() {
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateBusiness, { isLoading: isUpdating }] = useUpdateProviderMutation();
  const [isEditMode, setIsEditMode] = useState(false);

  if (isLoading) return <div>Loading Provider Data...</div>;

  const handleBusinessUpdate = async (data: any) => {
    try {
      await updateBusiness(data).unwrap();
      setIsEditMode(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Provider Storefront</h1>
          <p className="text-sm text-gray-500">Status: {profile.validationStatus}</p>
        </div>
        <button 
          onClick={() => setIsEditMode(!isEditMode)}
          className="px-4 py-2 border rounded font-semibold"
        >
          {isEditMode ? 'Cancel' : 'Edit Business Profile'}
        </button>
      </header>

      <section className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-sm font-bold uppercase text-gray-400 mb-4">Basic Identity</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500">Name</label>
            <p className="font-medium">{profile.name}</p>
          </div>
          <div>
            <label className="block text-xs text-gray-500">Phone</label>
            <p className="font-medium">{profile.phone}</p>
          </div>
        </div>
      </section>

      {isEditMode ? (
        <ProviderBusinessForm 
          initialData={profile} 
          onSubmit={handleBusinessUpdate} 
          isLoading={isUpdating} 
        />
      ) : (
        <ProviderDisplay profile={profile} />
      )}
    </div>
  );
}