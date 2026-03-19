import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Camera, Loader2 } from 'lucide-react';

interface AvatarUploadProps {
  currentImageUrl?: string;
  name: string;
  onUploadSuccess: (url: string) => void;
  isEditable?: boolean;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentImageUrl, name, onUploadSuccess, isEditable = true }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '');

    if (!import.meta.env.VITE_CLOUDINARY_CLOUD_NAME) {
      toast.error('Cloudinary Cloud Name is missing in .env');
      setIsUploading(false);
      return;
    }

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Upload failed');

      onUploadSuccess(data.secure_url);
    } catch (err: any) {
      console.error('Cloudinary Upload Error:', err);
      toast.error('Failed to upload image. Check your Cloudinary Unsigned Preset configuration.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative w-20 h-20 group">
      {currentImageUrl ? (
        <img src={currentImageUrl} alt={name} className="w-full h-full rounded-2xl object-cover shadow-sm bg-gray-100" />
      ) : (
        <div className="w-full h-full bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold uppercase shadow-sm">
          {name.charAt(0)}
        </div>
      )}
      
      {isEditable && (
        <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer">
          {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            disabled={isUploading}
            className="hidden" 
          />
        </label>
      )}
    </div>
  );
};
