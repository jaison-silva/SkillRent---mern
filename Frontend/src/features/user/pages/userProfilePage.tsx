import { useState } from 'react';
import toast from 'react-hot-toast';
import { useGetProfileQuery, useUpdateProfileMutation } from '../userApiSlice';
import { BasicInfoForm } from '../components/BasicInfoForm';
import { AvatarUpload } from '../components/AvatarUpload';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import { User, ShieldCheck, Calendar, MapPin } from 'lucide-react';

export default function UserProfilePage() {
  const { data, isLoading, isError } = useGetProfileQuery();
  const profile = data?.user;
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

  if (isLoading) return <div className="p-20 text-center animate-pulse">Loading Profile...</div>;
  if (isError) return <div className="p-20 text-center text-red-500">Error loading profile data.</div>;

  const handleSave = async (formData: any) => {
    try {
      await updateProfile(formData).unwrap();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      console.error("Update failed", err);
      toast.error(err?.data?.message || 'Failed to update profile.');
    }
  };

  const handleAvatarSuccess = async (url: string) => {
    try {
      await updateProfile({ profilePicture: url }).unwrap();
      toast.success('Profile picture updated!');
    } catch (err: any) {
      console.error("Avatar update failed", err);
      toast.error('Failed to link profile picture to your account.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Profile Header */}
        <div className="bg-gray-50 p-8 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <AvatarUpload 
              currentImageUrl={profile?.profilePicture} 
              name={profile?.name || '?'} 
              onUploadSuccess={handleAvatarSuccess} 
              isEditable={isEditing}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile?.name}</h1>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <ShieldCheck className="w-4 h-4 mr-1 text-green-500" />
                <span>Verified {profile?.role} Account</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {profile?.authProvider !== 'google' && (
               <button 
                 onClick={() => setPasswordModalOpen(true)}
                 className="px-4 py-2 rounded-lg text-sm font-bold transition-all bg-red-50 text-red-600 hover:bg-red-100"
               >
                 Change Password
               </button>
            )}
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                isEditing ? 'bg-gray-200 text-gray-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Change Password Modal UI */}
        <ChangePasswordModal 
          email={profile?.email} 
          isOpen={isPasswordModalOpen} 
          onClose={() => setPasswordModalOpen(false)} 
        />

        {/* Profile Content */}
        <div className="p-8">
          {isEditing ? (
            <BasicInfoForm 
              initialData={profile} 
              onSave={handleSave} 
              isLoading={isUpdating} 
            />
          ) : (
            <div className="space-y-8">
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoItem label="Full Name" value={profile?.name} icon={<User className="w-4 h-4" />} />
                <InfoItem label="Phone Number" value={profile?.phone || 'Not provided'} icon={<Calendar className="w-4 h-4" />} />
                <InfoItem label="Email Address" value={profile?.email} isMuted />
                <InfoItem label="Location" value={profile?.location ? `${profile.location.lat.toFixed(4)}, ${profile.location.lng.toFixed(4)}` : 'Not provided'} icon={<MapPin className="w-4 h-4" />} />
              </section>
              
              <div className="pt-8 border-t border-gray-50">
                <p className="text-xs text-gray-400">
                  Account created on {new Date(profile?.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const InfoItem = ({ label, value, icon, isMuted }: any) => (
  <div className="space-y-1">
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
    <div className={`flex items-center space-x-2 ${isMuted ? 'text-gray-400 italic' : 'text-gray-700'}`}>
      {icon}
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);