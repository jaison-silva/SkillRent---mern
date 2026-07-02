import React, { useState, useEffect } from 'react';
import { useCreateJobMutation } from '../jobApiSlice';
import { toast } from 'react-hot-toast';

const formatTimeString = (timeString: string) => {
  if (!timeString) return '';
  const [hourStr, minStr] = timeString.split(':');
  const hours = parseInt(hourStr);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minStr} ${ampm}`;
};

export const CreateJobForm = ({ onSuccess, prefillProviderId }: { onSuccess: () => void, prefillProviderId?: string }) => {
  const [createJob, { isLoading }] = useCreateJobMutation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [time, setTime] = useState('');
  
  // Date and Time picker states
  const [selectedDate, setSelectedDate] = useState('');
  const [scheduleType, setScheduleType] = useState<'specific' | 'range'>('specific');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [address, setAddress] = useState('');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'fetching' | 'success' | 'error' | 'unsupported'>('idle');
  const [coordinates, setCoordinates] = useState<{lat?: number, lng?: number}>({});

  useEffect(() => {
    if (!selectedDate) {
      setTime('');
      return;
    }
    
    // Normalize date conversion to avoid timezone offsets causing date to shift
    const [year, month, day] = selectedDate.split('-');
    const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    if (scheduleType === 'specific') {
      if (startTime) {
        const formattedStart = formatTimeString(startTime);
        setTime(`${formattedDate} at ${formattedStart}`);
      } else {
        setTime('');
      }
    } else {
      if (startTime && endTime) {
        const formattedStart = formatTimeString(startTime);
        const formattedEnd = formatTimeString(endTime);
        setTime(`${formattedDate} from ${formattedStart} to ${formattedEnd}`);
      } else {
        setTime('');
      }
    }
  }, [selectedDate, scheduleType, startTime, endTime]);

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
      setSelectedDate('');
      setStartTime('');
      setEndTime('');
      setScheduleType('specific');
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

      <div className="space-y-4 border border-gray-200 p-4 rounded-xl bg-gray-50/50">
        <span className="block text-sm font-semibold text-gray-800">Job Schedule</span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Select Date</label>
            <input 
              type="date" 
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-sm text-gray-700 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Schedule Type</label>
            <select 
              value={scheduleType}
              onChange={(e) => {
                setScheduleType(e.target.value as 'specific' | 'range');
                setEndTime('');
              }}
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-sm text-gray-700 bg-white"
            >
              <option value="specific">Specific Time</option>
              <option value="range">Time Range</option>
            </select>
          </div>
        </div>

        {scheduleType === 'specific' ? (
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Start Time</label>
            <input 
              type="time" 
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-sm text-gray-700 bg-white"
              required
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Start Time</label>
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-sm text-gray-700 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">End Time</label>
              <input 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-sm text-gray-700 bg-white"
                required
              />
            </div>
          </div>
        )}

        {time && (
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs font-semibold text-blue-700 flex items-center gap-2">
            <span>⏰</span>
            <span>Selected Schedule: <strong>{time}</strong></span>
          </div>
        )}
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
