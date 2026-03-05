import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useGetProviderProfileQuery, useUpdateProviderProfileMutation } from '../providerApiSlice';

export default function ProviderProfilePage() {
  const { data: profileData, isLoading } = useGetProviderProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProviderProfileMutation();
  const [isEditMode, setIsEditMode] = useState(false);

  // Form State
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');

  const provider = profileData?.provider;

  useEffect(() => {
    if (provider) {
        setBio(provider.bio || '');
        setSkills(provider.skills?.join(', ') || '');
        setLocation(provider.location?.address || '');
    }
  }, [provider]);

  if (isLoading) return <div className="p-20 text-center text-gray-500 animate-pulse">Loading Provider Data...</div>;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await updateProfile({
            bio,
            skills: skills.split(',').map(s => s.trim()).filter(s => s !== ''),
            location
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
        <div className="bg-gray-50 p-8 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Provider Storefront</h1>
            <p className="text-sm text-gray-500 mt-1">Manage exactly how clients see you.</p>
          </div>
          
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              isEditMode ? 'bg-gray-200 text-gray-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            {isEditMode ? 'Discard Changes' : 'Edit Business Profile'}
          </button>
        </div>

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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Location</label>
                        <input 
                            type="text" 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                            placeholder="e.g. New York, NY"
                        />
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

                    <section className="grid grid-cols-2 gap-8 border-t border-gray-100 pt-8 mt-8">
                        <div>
                            <h2 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-1">Service Area</h2>
                            <p className="font-medium text-gray-900">{provider?.location?.address || <span className="text-gray-400 italic">Not set</span>}</p>
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
    </div>
  );
}