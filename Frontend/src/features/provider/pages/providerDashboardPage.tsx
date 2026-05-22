import { useState } from 'react';
import { useGetProviderProfileQuery } from '../providerApiSlice';
import { useGetAvailableJobsQuery, useGetDirectJobsQuery } from '../../job/jobApiSlice';
import { AlertCircle, CheckCircle, Clock, MapPin, DollarSign, Calendar } from 'lucide-react';

export default function ProviderDashboardPage() {
  const { data: profileData, isLoading: isProfileLoading } = useGetProviderProfileQuery();
  const [activeTab, setActiveTab] = useState<'direct' | 'general'>('direct');

  const { data: directJobsData, isLoading: isDirectJobsLoading } = useGetDirectJobsQuery(undefined, { skip: activeTab !== 'direct' });
  const { data: generalJobsData, isLoading: isGeneralJobsLoading } = useGetAvailableJobsQuery(undefined, { skip: activeTab !== 'general' });

  if (isProfileLoading) return <div className="p-20 text-center animate-pulse text-gray-500">Loading your workspace...</div>;

  const provider = profileData?.provider;
  const status = provider?.validationStatus || 'pending';

  const jobsToDisplay = activeTab === 'direct' 
    ? directJobsData?.jobs || [] 
    : generalJobsData?.jobs || [];
    
  const isJobsLoading = activeTab === 'direct' ? isDirectJobsLoading : isGeneralJobsLoading;

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

      <div className="mb-8 border-b border-gray-200 flex space-x-8">
        <button 
          onClick={() => setActiveTab('direct')}
          className={`pb-4 font-bold text-lg transition-colors relative ${activeTab === 'direct' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Direct Requests
          {activeTab === 'direct' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('general')}
          className={`pb-4 font-bold text-lg transition-colors relative ${activeTab === 'general' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          General Job Board
          {activeTab === 'general' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>}
        </button>
      </div>

      {isJobsLoading ? (
         <div className="p-20 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
      ) : jobsToDisplay.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <h2 className="text-2xl font-bold text-gray-400 mb-2">No jobs found</h2>
          <p className="text-gray-500">
            {activeTab === 'direct' 
              ? "You haven't received any direct job requests yet. Keep your profile updated to attract clients!" 
              : "There are no general jobs posted at the moment."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobsToDisplay.map((job: any) => (
            <div key={job._id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-900 text-lg line-clamp-2">{job.title}</h3>
                {activeTab === 'direct' && (
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap ml-2">
                    Direct To You
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">{job.description}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-500 font-medium">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {job.location?.address}
                </div>
                <div className="flex items-center text-sm text-gray-500 font-medium">
                  <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                  Budget: ${job.budget}
                </div>
                <div className="flex items-center text-sm text-gray-500 font-medium">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {job.time}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    {job.userId?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{job.userId?.name || 'Unknown Client'}</span>
                </div>
                <button className="text-blue-600 text-sm font-bold hover:underline">
                  Respond
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
