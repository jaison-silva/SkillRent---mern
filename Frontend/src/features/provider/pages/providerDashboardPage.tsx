import { useState, useEffect } from 'react';
import { useGetProviderProfileQuery } from '../providerApiSlice';
import { useGetAvailableJobsQuery, useGetDirectJobsQuery } from '../../job/jobApiSlice';
import { AlertCircle, CheckCircle, Clock, MapPin, DollarSign, Calendar } from 'lucide-react';
import SearchInput from '../../../components/SearchInput';
import SortSelect from '../../../components/SortSelect';
import Pagination from '../../../components/Pagination';
import { JobDetailedView } from '../../job/components/JobDetailedView';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Budget: High to Low', value: 'budget_high' },
  { label: 'Budget: Low to High', value: 'budget_low' },
];

export default function ProviderDashboardPage() {
  const { data: profileData, isLoading: isProfileLoading } = useGetProviderProfileQuery();
  const [activeTab, setActiveTab] = useState<'direct' | 'general'>('direct');

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const limit = 6;

  useEffect(() => {
    setPage(1);
    setSearch('');
    setDebouncedSearch('');
  }, [activeTab]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: directJobsData, isLoading: isDirectJobsLoading } = useGetDirectJobsQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    sort,
  }, { skip: activeTab !== 'direct' });

  const { data: generalJobsData, isLoading: isGeneralJobsLoading } = useGetAvailableJobsQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    sort,
  }, { skip: activeTab !== 'general' });

  if (isProfileLoading) return <div className="p-20 text-center animate-pulse text-gray-500">Loading your workspace...</div>;

  const provider = profileData?.provider;
  const status = provider?.validationStatus || 'pending';

  const jobsToDisplay = activeTab === 'direct' 
    ? directJobsData?.jobs || [] 
    : generalJobsData?.jobs || [];
    
  const totalJobs = activeTab === 'direct'
    ? directJobsData?.total || 0
    : generalJobsData?.total || 0;

  const isJobsLoading = activeTab === 'direct' ? isDirectJobsLoading : isGeneralJobsLoading;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      
      {/* Status Banner */}
      <div className={`mb-8 p-6 rounded-2xl flex items-center space-x-4 border ${
        status === 'approved' ? 'bg-green-50 border-green-200 text-green-800' : 
        status === 'denied' ? 'bg-red-50 border-red-200 text-red-800' : 
        'bg-yellow-50 border-yellow-200 text-yellow-800'
      }`}>
        {status === 'approved' ? <CheckCircle className="w-8 h-8 text-green-600" /> : 
         status === 'denied' ? <AlertCircle className="w-8 h-8 text-red-600" /> : 
         <Clock className="w-8 h-8 text-yellow-600" />}
        
        <div>
          <h2 className="text-xl font-bold">
            {status === 'approved' ? 'Active and Visible' : 
             status === 'denied' ? 'Application Denied' : 
             'Pending Admin Approval'}
          </h2>
          <p className="opacity-90 mt-1">
            {status === 'approved' ? 'Your profile is approved and you can now accept requests.' : 
             status === 'denied' ? 'Please contact support for more details regarding your application.' : 
             'Your profile is currently under review by our team. Please ensure your profile is fully filled out.'}
          </p>
          {status === 'denied' && provider?.rejectionReason && (
            <div className="mt-3 bg-red-100 border border-red-200 text-red-900 px-4 py-2 rounded-lg text-sm font-medium">
              <span className="font-bold">Reason:</span> {provider.rejectionReason}
            </div>
          )}
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

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={activeTab === 'direct' ? "Search direct requests by title or description..." : "Search general jobs by title or description..."}
          />
        </div>
        <div className="w-full sm:w-48">
          <SortSelect value={sort} onChange={(val) => { setSort(val); setPage(1); }} options={SORT_OPTIONS} />
        </div>
      </div>

      {isJobsLoading ? (
         <div className="p-20 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
      ) : jobsToDisplay.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <h2 className="text-2xl font-bold text-gray-400 mb-2">No jobs found</h2>
          <p className="text-gray-500">
            {debouncedSearch 
              ? "No jobs match your search criteria." 
              : activeTab === 'direct' 
                ? "You haven't received any direct job requests yet. Keep your profile updated to attract clients!" 
                : "There are no general jobs posted at the moment."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                    Budget: ₹{job.budget}
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
                  <button 
                    onClick={() => setSelectedJob(job)}
                    className="text-blue-600 text-sm font-bold hover:underline"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} limit={limit} total={totalJobs} onPageChange={setPage} label="jobs" />
        </>
      )}

      {selectedJob && (
        <JobDetailedView 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />
      )}

    </div>
  );
}
