import { useState, useEffect } from 'react';
import { useGetMyJobsQuery, useDeleteJobMutation } from '../jobApiSlice';
import { CreateJobForm } from '../components/CreateJobForm';
import { EditJobForm } from '../components/EditJobForm';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import SearchInput from '../../../components/SearchInput';
import SortSelect from '../../../components/SortSelect';
import Pagination from '../../../components/Pagination';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
];

const STATUS_FILTERS = [
  { label: 'All Status', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Closed', value: 'closed' },
];

export const UserJobsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [status, setStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const limit = 10;
  const [deleteJob] = useDeleteJobMutation();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading, refetch } = useGetMyJobsQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    sort,
    status: status !== 'all' ? status : undefined,
  });

  const jobs = data?.jobs || [];
  const total = data?.total || 0;

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteJob(id).unwrap();
      toast.success("Job deleted successfully");
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to delete job");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Job Posts</h1>
          <p className="text-gray-500 mt-1">Manage your job requests</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : '+ Post New Job'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <CreateJobForm onSuccess={() => {
            setShowForm(false);
            refetch();
          }} />
        </div>
      )}

      {/* Search, Sort & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search jobs by title or description..."
          />
        </div>
        <div className="w-full sm:w-44">
          <SortSelect value={sort} onChange={(val) => { setSort(val); setPage(1); }} options={SORT_OPTIONS} />
        </div>
        <div className="w-full sm:w-44">
          <SortSelect value={status} onChange={(val) => { setStatus(val); setPage(1); }} options={STATUS_FILTERS} />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading your jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{debouncedSearch || status !== 'all' ? 'No jobs match your filters' : 'No jobs posted yet'}</h3>
          <p className="text-gray-500">{debouncedSearch || status !== 'all' ? 'Try adjusting your search or filters.' : 'Post a job to find skilled providers in your area.'}</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {jobs.map((job: any) => (
              <div key={job._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 hover:border-blue-100 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      job.status === 'open' ? 'bg-green-100 text-green-700' :
                      job.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {job.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="text-blue-600">💰</span> ₹{job.budget}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-red-500">📍</span> {job.location?.address}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      🕒 {job.time}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      📅 {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => setEditingJobId(job._id)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(job._id)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
                  
                  {/* Edit Form (Inline) */}
                  {editingJobId === job._id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 w-full">
                      <EditJobForm
                      job={job}
                      onSuccess={() => {
                        setEditingJobId(null);
                        refetch();
                      }}
                      onCancel={() => setEditingJobId(null)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <Pagination page={page} limit={limit} total={total} onPageChange={setPage} label="jobs" />
        </>
      )}
    </div>
  );
};
