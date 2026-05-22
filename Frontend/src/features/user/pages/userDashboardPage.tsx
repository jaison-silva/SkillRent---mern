import { useState, useEffect } from 'react';
import { useGetProvidersQuery } from '../../provider/providerApiSlice';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import SearchInput from '../../../components/SearchInput';
import SortSelect from '../../../components/SortSelect';
import Pagination from '../../../components/Pagination';
import LocationPicker, { type LocationData } from '../../../components/LocationPicker';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Highest Rated', value: 'rating' },
];

export default function UserDashboardPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [location, setLocation] = useState<LocationData | null>(null);
  const limit = 9;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading, isError } = useGetProvidersQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    sort,
    lat: location?.lat,
    lng: location?.lng,
  });

  const providers = data?.providers || [];
  const total = data?.total || 0;

  if (isLoading) return <div className="p-20 text-center animate-pulse text-gray-500">Loading providers...</div>;
  if (isError) return <div className="p-20 text-center text-red-500">Failed to load providers.</div>;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Providers</h1>
        <p className="text-gray-500 mt-2">Find the right skills for your needs.</p>
      </div>

      {/* Location Filter */}
      <div className="mb-4">
        <LocationPicker 
          onLocationSelect={(loc) => {
            setLocation(loc);
            setPage(1);
          }} 
          placeholder="Filter providers near a specific city or area..."
        />
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search providers by name or skill..."
          />
        </div>
        <div className="w-full sm:w-48">
          <SortSelect value={sort} onChange={(val) => { setSort(val); setPage(1); }} options={SORT_OPTIONS} />
        </div>
      </div>

      {providers.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500">
            {location ? 'No providers found near this location.' : debouncedSearch ? 'No providers match your search.' : 'No approved providers available right now.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider: any) => (
              <div key={provider._id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                     {provider.userId?.name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{provider.userId?.name || 'Unknown Provider'}</h3>
                    <p className="text-sm text-gray-500">{provider.skills?.[0] || 'Multiple Skills'}</p>
                  </div>
                </div>
                {provider.rating > 0 && (
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold text-gray-700">{provider.rating}</span>
                    <span className="text-xs text-gray-400">({provider.jobCount} reviews)</span>
                  </div>
                )}
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {provider.bio || 'No bio provided yet.'}
                </p>
                <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                  <Link
                    to={`/provider/${provider._id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View Profile &rarr;
                  </Link>
                  {provider.location?.address && (
                    <span className="text-xs font-medium text-gray-400 truncate max-w-[150px]" title={provider.location.address}>
                      📍 {provider.location.address.split(',')[0]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} limit={limit} total={total} onPageChange={setPage} label="providers" />
        </>
      )}
    </div>
  );
}
