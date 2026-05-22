import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';

export interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: LocationData | null) => void;
  initialAddress?: string;
  placeholder?: string;
  className?: string;
}

export default function LocationPicker({ 
  onLocationSelect, 
  initialAddress = '',
  placeholder = 'Enter a city or address...',
  className = ''
}: LocationPickerProps) {
  const [address, setAddress] = useState(initialAddress);
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!address.trim()) {
      onLocationSelect(null);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      if (!res.ok) throw new Error('Geocoding failed');
      const data = await res.json();
      
      if (data && data.length > 0) {
        onLocationSelect({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          address: data[0].display_name
        });
        toast.success('Location found');
      } else {
        toast.error('Location not found. Try a different query.');
        onLocationSelect(null);
      }
    } catch (err) {
      toast.error('Error fetching location data.');
      onLocationSelect(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Reverse geocoding to get a nice address
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            if (res.ok) {
              const data = await res.json();
              const addr = data.display_name || 'Current Location';
              setAddress(addr);
              onLocationSelect({ lat, lng, address: addr });
              toast.success('Current location acquired');
            } else {
              setAddress('Current Location');
              onLocationSelect({ lat, lng });
            }
          } catch (err) {
            setAddress('Current Location');
            onLocationSelect({ lat, lng });
          } finally {
            setIsLocating(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not fetch your location.");
          setIsLocating(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      <div className="flex-1 flex items-center bg-white px-3 py-2 rounded-xl border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
        <MapPin className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
        <input 
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={placeholder}
          className="w-full focus:outline-none text-gray-700 bg-transparent text-sm"
        />
        {address && (
          <button 
            type="button" 
            onClick={() => {
              setAddress('');
              onLocationSelect(null);
            }} 
            className="text-gray-400 hover:text-gray-600 px-2"
          >
            ✕
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching || !address.trim()}
          className="px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-xl hover:bg-blue-100 disabled:opacity-50 transition-colors text-sm whitespace-nowrap"
        >
          {isSearching ? 'Searching...' : 'Search Location'}
        </button>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isLocating}
          title="Use my current GPS location"
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Navigation className="w-4 h-4" />
          <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'Current Location'}</span>
        </button>
      </div>
    </div>
  );
}
