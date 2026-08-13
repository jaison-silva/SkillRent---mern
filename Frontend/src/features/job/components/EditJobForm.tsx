import React, { useState, useEffect } from 'react';
import { useUpdateJobMutation } from '../jobApiSlice';
import { toast } from 'react-hot-toast';

const formatTimeString = (timeString: string) => {
  if (!timeString) return '';
  const [hourStr, minStr] = timeString.split(':');
  const hours = parseInt(hourStr);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minStr} ${ampm}`;
};

export const EditJobForm = ({ job, onSuccess, onCancel }: { job: any, onSuccess: () => void, onCancel: () => void }) => {
  const [updateJob, { isLoading }] = useUpdateJobMutation();
  const [title, setTitle] = useState(job.title);
  const [description, setDescription] = useState(job.description);
  const [budget, setBudget] = useState(job.budget.toString());
  const [time, setTime] = useState(job.time);
  
  // Date and Time picker states
  const [selectedDate, setSelectedDate] = useState('');
  const [scheduleType, setScheduleType] = useState<'specific' | 'range'>('specific');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [address, setAddress] = useState(job.location?.address || '');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'fetching' | 'success' | 'error' | 'unsupported'>('idle');
  const [coordinates, setCoordinates] = useState<{lat?: number, lng?: number}>({});

  useEffect(() => {
    if (!selectedDate) {
      return;
    }
    
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
      }
    } else {
      if (startTime && endTime) {
        const formattedStart = formatTimeString(startTime);
        const formattedEnd = formatTimeString(endTime);
        setTime(`${formattedDate} from ${formattedStart} to ${formattedEnd}`);
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
      await updateJob({
        id: job._id,
        data: {
          title,
          description,
          budget: Number(budget),
          time,
          location: {
            address,
            ...coordinates
          }
        }
      }).unwrap();
      toast.success("Job updated successfully!");
      onSuccess();
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update job");
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
      <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Job</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border min-h-[100px]"
          required
        />
      </div>

      <div className="space-y-4 border border-gray-200 p-4 rounded-xl bg-gray-50/50">
        <span className="block text-sm font-semibold text-gray-800">Change Job Schedule (Current: {job.time})</span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Select New Date</label>
            <input 
              type="date" 
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-sm text-gray-700 bg-white"
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
              step="1800"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-sm text-gray-700 bg-white"
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
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">End Time</label>
              <input 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-sm text-gray-700 bg-white"
              />
            </div>
          </div>
        )}

        {selectedDate && time !== job.time && (
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs font-semibold text-blue-700 flex items-center gap-2">
            <span>⏰</span>
            <span>New Schedule: <strong>{time}</strong></span>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Budget (₹)</label>
        <input 
          type="number" 
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
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
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Precise Location (Optional)</label>
        <button
          type="button"
          onClick={handleGetLocation}
          className="text-sm w-full py-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center transition-colors"
        >
          {locationStatus === 'fetching' ? 'Fetching coordinates...' : 
           locationStatus === 'success' ? '📍 GPS Coordinates Updated ✓' : 
           locationStatus === 'error' ? 'Failed to get location' :
           locationStatus === 'unsupported' ? 'Not supported by browser' :
           '📍 Update GPS Location'}
        </button>
      </div>

      <div className="pt-4 flex gap-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};
