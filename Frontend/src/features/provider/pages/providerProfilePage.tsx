import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useGetProviderProfileQuery, useUpdateProviderProfileMutation } from '../providerApiSlice';
import { useGetProfileQuery } from '../../user/userApiSlice';
import { ChangePasswordModal } from '../../user/components/ChangePasswordModal';
import ProviderReviews from '../components/ProviderReviews';
import LocationPicker, { type LocationData } from '../../../components/LocationPicker';

export default function ProviderProfilePage() {
  const { data: profileData, isLoading: isProviderLoading } = useGetProviderProfileQuery();
  const { data: baseProfileData, isLoading: isUserLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProviderProfileMutation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

  // Form State
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [workNature, setWorkNature] = useState('offline');

  const provider = profileData?.provider;
  const userNode = baseProfileData?.user;

  useEffect(() => {
    if (provider) {
        setBio(provider.bio || '');
        setSkills(provider.skills?.join(', ') || '');
        setLocation(provider.location || null);
        setWorkNature(provider.workNature || 'offline');
    }
  }, [provider]);

  if (isProviderLoading || isUserLoading) return <div className="p-20 text-center text-gray-500 animate-pulse">Loading Provider Data...</div>;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await updateProfile({
            bio,
            skills: skills.split(',').map(s => s.trim()).filter(s => s !== ''),
            location: location || undefined,
            workNature
        }).unwrap();
        toast.success('Provider profile updated successfully!');
        setIsEditMode(false);
    } catch (err) {
        console.error("Failed to update profile", err);
        toast.error("Failed to update profile. Please try again.");
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-50 p-8 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Provider Storefront</h1>
            <p className="text-sm text-gray-500 mt-1">Manage exactly how clients see you.</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            {userNode?.authProvider !== 'google' && (
               <button 
                 onClick={() => setPasswordModalOpen(true)}
                 className="px-4 py-2 rounded-lg text-sm font-bold transition-all bg-red-50 text-red-600 hover:bg-red-100"
               >
                 Change Password
               </button>
            )}
            <button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                isEditMode ? 'bg-gray-200 text-gray-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              {isEditMode ? 'Discard Changes' : 'Edit Business Profile'}
            </button>
          </div>
        </div>

        {/* Change Password Modal UI */}
        <ChangePasswordModal 
          email={userNode?.email} 
          isOpen={isPasswordModalOpen} 
          onClose={() => setPasswordModalOpen(false)} 
        />

        {/* Content */}
        <div className="p-8">
            {isEditMode ? (
                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label>
                        <textarea 
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={4} 
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                            placeholder="Tell clients about your experience..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                        <input 
                            type="text" 
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                            placeholder="e.g. Plumbing, Pipe Fitting, Water Heaters"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location Coordinates</label>
                        <div className="mt-2">
                            <LocationPicker 
                                initialAddress={location?.address || ''}
                                onLocationSelect={(loc) => setLocation(loc)} 
                                placeholder="Search for your city or use current location..."
                            />
                        </div>
                        {location && (
                            <p className="text-xs text-green-600 mt-2 font-medium">
                                Location set: {location.address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Nature</label>
                        <select 
                            value={workNature}
                            onChange={(e) => setWorkNature(e.target.value)}
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                        >
                            <option value="offline">Offline / On-site</option>
                            <option value="online">Online / Remote</option>
                            <option value="both">Both</option>
                        </select>
                    </div>
                    <div className="pt-4 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={isUpdating}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isUpdating ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-8">
                    <section>
                        <h2 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Professional Summary</h2>
                        <p className="text-gray-800 leading-relaxed text-lg">{provider?.bio || <span className="text-gray-400 italic">No bio provided. Clients prefer providers with detailed bios.</span>}</p>
                    </section>
                    
                    <section>
                        <h2 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Service Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {provider?.skills && provider.skills.length > 0 ? (
                                provider.skills.map((skill: string, idx: number) => (
                                    <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-400 italic text-sm">No skills listed yet.</span>
                            )}
                        </div>
                    </section>
                    
                    <section>
                        <h2 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Work Nature</h2>
                        <p className="text-gray-800 leading-relaxed text-lg capitalize">{provider?.workNature || 'Offline'}</p>
                    </section>

                    <section className="grid grid-cols-2 gap-8 border-t border-gray-100 pt-8 mt-8">
                        <div>
                            <h2 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-1">Service Area</h2>
                            <p className="font-medium text-gray-900">
                              {provider?.location?.lat && provider?.location?.lng 
                                ? provider.location.address || `${provider.location.lat.toFixed(4)}, ${provider.location.lng.toFixed(4)}` 
                                : <span className="text-gray-400 italic">Not set</span>}
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-1">Status</h2>
                            <p className="font-medium text-gray-900 capitalize">{provider?.validationStatus}</p>
                        </div>
                    </section>
                </div>
            )}
        </div>

      </div>
      
      {/* Reviews Section */}
      {provider?._id && (
        <div className="mt-8 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-8">
           <ProviderReviews providerId={provider._id} />
        </div>
      )}
    </div>
  );
}