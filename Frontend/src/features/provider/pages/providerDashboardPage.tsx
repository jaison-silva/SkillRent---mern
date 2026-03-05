import { useGetProviderProfileQuery } from '../providerApiSlice';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function ProviderDashboardPage() {
  const { data: profileData, isLoading } = useGetProviderProfileQuery();

  if (isLoading) return <div className="p-20 text-center animate-pulse text-gray-500">Loading your workspace...</div>;

  const provider = profileData?.provider;
  const status = provider?.validationStatus || 'pending';

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      
      {/* Status Banner */}
      <div className={`mb-8 p-6 rounded-2xl flex items-center space-x-4 border ${
        status === 'approved' ? 'bg-green-50 border-green-200 text-green-800' : 
        status === 'rejected' ? 'bg-red-50 border-red-200 text-red-800' : 
        'bg-yellow-50 border-yellow-200 text-yellow-800'
      }`}>
        {status === 'approved' ? <CheckCircle className="w-8 h-8 text-green-600" /> : 
         status === 'rejected' ? <AlertCircle className="w-8 h-8 text-red-600" /> : 
         <Clock className="w-8 h-8 text-yellow-600" />}
        
        <div>
          <h2 className="text-xl font-bold">
            {status === 'approved' ? 'Active and Visible' : 
             status === 'rejected' ? 'Application Rejected' : 
             'Pending Admin Approval'}
          </h2>
          <p className="opacity-90 mt-1">
            {status === 'approved' ? 'Your profile is approved and you can now accept requests.' : 
             status === 'rejected' ? 'Please contact support for more details regarding your application.' : 
             'Your profile is currently under review by our team. Please ensure your profile is fully filled out.'}
          </p>
        </div>
      </div>

      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Incoming Requests</h1>
      </div>

      <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        <h2 className="text-2xl font-bold text-gray-400 mb-2">Coming Soon</h2>
        <p className="text-gray-500">
          When clients request your services, they will appear here.
        </p>
      </div>

    </div>
  );
}
