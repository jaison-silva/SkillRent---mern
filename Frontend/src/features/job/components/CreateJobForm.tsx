import React, { useState } from 'react';
import { useCreateJobMutation } from '../jobApiSlice';
import { toast } from 'react-hot-toast';

export const CreateJobForm = ({ onSuccess, prefillProviderId }: { onSuccess: () => void, prefillProviderId?: string }) => {
  const [createJob, { isLoading }] = useCreateJobMutation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'fetching' | 'success' | 'error' | 'unsupported'>('idle');
  const [coordinates, setCoordinates] = useState<{lat?: number, lng?: number}>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !budget || !time || !address) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await createJob({
        title,
        description,
        budget: Number(budget),
        time,
        providerId: prefillProviderId,
        location: {
          address,
          ...coordinates
        }
      }).unwrap();
      toast.success("Job posted successfully!");
      setTitle('');
      setDescription('');
      setBudget('');
      setTime('');
      setAddress('');
      setCoordinates({});
      setLocationStatus('idle');
      onSuccess();
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to post job");
    }
  };

  const handleGetLocation = () => {
    setLocationStatus('fetching');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationStatus('success');
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationStatus('error');
          toast.error("Could not fetch location");
        }
      );
    } else {
      setLocationStatus('unsupported');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Post a New Job</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
          placeholder="e.g. Need a Plumber for kitchen sink"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border min-h-[100px]"
          placeholder="Describe the issue or task in detail..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time / Schedule</label>
          <input 
            type="text" 
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
            placeholder="e.g. Tomorrow at 5 PM"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
          <input 
            type="number" 
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
            placeholder="e.g. 150"
            min="1"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address/City</label>
        <input 
          type="text" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
          placeholder="e.g. New York, NY"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Precise Location (Optional for better matching)</label>
        <button
          type="button"
          onClick={handleGetLocation}
          className="text-sm w-full py-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center transition-colors"
        >
          {locationStatus === 'fetching' ? 'Fetching coordinates...' : 
           locationStatus === 'success' ? '📍 GPS Coordinates Saved ✓' : 
           locationStatus === 'error' ? 'Failed to get location' :
           locationStatus === 'unsupported' ? 'Not supported by browser' :
           '📍 Set Current GPS Location'}
        </button>
      </div>

      <div className="pt-4">
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Posting Job...' : 'Post Job'}
        </button>
      </div>
    </form>
  );
};
