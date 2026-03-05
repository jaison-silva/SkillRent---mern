import { useGetProvidersQuery } from '../../provider/providerApiSlice';
import { Link } from 'react-router-dom';

export default function UserDashboardPage() {
  const { data, isLoading, isError } = useGetProvidersQuery();

  if (isLoading) return <div className="p-20 text-center animate-pulse text-gray-500">Loading providers...</div>;
  if (isError) return <div className="p-20 text-center text-red-500">Failed to load providers.</div>;

  const providers = data?.providers || [];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Providers</h1>
        <p className="text-gray-500 mt-2">Find the right skills for your needs.</p>
      </div>

      {providers.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500">No approved providers available right now.</p>
        </div>
      ) : (
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
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {provider.bio || 'No bio provided yet.'}
              </p>
              <Link 
                to={`/provider/${provider._id}`}
                className="inline-block pt-4 border-t border-gray-50 w-full text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View Profile &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
