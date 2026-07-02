import { useState, useEffect } from 'react';
import { useGetAvailableJobsQuery } from '../jobApiSlice';
import { JobDetailedView } from '../components/JobDetailedView';
import SearchInput from '../../../components/SearchInput';
import SortSelect from '../../../components/SortSelect';
import Pagination from '../../../components/Pagination';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Budget: High to Low', value: 'budget_high' },
  { label: 'Budget: Low to High', value: 'budget_low' },
];

export const JobBoardPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const limit = 8;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useGetAvailableJobsQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    sort,
  });

  const [selectedJob, setSelectedJob] = useState<any>(null);

  const jobs = data?.jobs || [];
  const total = data?.total || 0;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
        <p className="text-gray-500 mt-1">Browse open job requests in your area</p>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search jobs by title or description..."
          />
        </div>
        <div className="w-full sm:w-48">
          <SortSelect value={sort} onChange={(val) => { setSort(val); setPage(1); }} options={SORT_OPTIONS} />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500 font-medium">Loading available jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No open jobs at the moment</h3>
          <p className="text-gray-500">Check back later for new opportunities from users.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {jobs.map((job: any) => (
              <div 
                key={job._id} 
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
                onClick={() => setSelectedJob(job)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{job.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">Posted by {job.userId?.name || 'User'}</p>
                  </div>
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-sm font-bold border border-green-100">
                    ${job.budget}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 font-semibold">
                    <span className="text-red-400">📍</span> 
                    <span className="truncate max-w-[150px] mr-3">{job.location?.address}</span>
                    <span className="text-gray-400">🕒</span> 
                    <span className="truncate max-w-[120px]">{job.time}</span>
                  </div>
                  <button className="text-sm font-bold text-blue-600 group-hover:text-blue-700">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} limit={limit} total={total} onPageChange={setPage} label="jobs" />
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
};
