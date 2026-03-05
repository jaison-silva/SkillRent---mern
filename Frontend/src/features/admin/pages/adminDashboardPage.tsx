import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  useGetAdminDashboardQuery, 
  useVerifyProviderMutation, 
  useChangeUserStatusMutation 
} from '../adminApiSlice';
import { ShieldAlert, Check, X, Ban, Undo2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const limit = 10;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useGetAdminDashboardQuery({ 
    page, 
    limit, 
    search: debouncedSearch || undefined 
  });
  
  const [verifyProvider] = useVerifyProviderMutation();
  const [changeUserStatus] = useChangeUserStatusMutation();

  const [activeTab, setActiveTab] = useState<'pending' | 'users'>('pending');

  if (isLoading) return <div className="p-20 text-center animate-pulse text-gray-500">Loading admin data...</div>;

  const users = data?.users || [];
  const providers = data?.providers || [];
  
  const pendingProviders = providers.filter((p: any) => p.validationStatus === 'pending');

  const handleVerify = (id: string, status: 'approved' | 'denied') => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-gray-800">Are you sure you want to <span className="capitalize font-bold">{status}</span> this provider?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await verifyProvider({ id, status }).unwrap();
                toast.success(`Provider successfully ${status}!`);
              } catch (err: any) {
                toast.error(err?.data?.message || 'Verification failed');
              }
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700"
          >Confirm</button>
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">Cancel</button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  const handleToggleBlock = (id: string, isCurrentlyBanned: boolean) => {
    const action = isCurrentlyBanned ? 'unblock' : 'block';
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-gray-800">Are you sure you want to <span className="capitalize font-bold">{action}</span> this user?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await changeUserStatus({ id, isBanned: !isCurrentlyBanned }).unwrap();
                toast.success(`User ${action}ed successfully!`);
              } catch (err: any) {
                toast.error(err?.data?.message || `Failed to ${action} user.`);
              }
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700"
          >Confirm</button>
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">Cancel</button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Control Center</h1>
          <p className="text-gray-500 mt-2">Manage users and verify provider applications.</p>
        </div>
        <ShieldAlert className="w-12 h-12 text-blue-600 opacity-20" />
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`pb-4 px-2 font-semibold ${activeTab === 'pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Pending Verifications ({pendingProviders.length})
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`pb-4 px-2 font-semibold ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          All Users ({users.length})
        </button>
      </div>

      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingProviders.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-500">
              No pending verifications.
            </div>
          ) : (
            pendingProviders.map((provider: any) => (
              <div key={provider._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{provider.userId?.name} <span className="text-sm font-normal text-gray-500">({provider.userId?.email})</span></h3>
                  <p className="text-gray-600 mt-1">Skills: {provider.skills?.join(', ') || 'N/A'}</p>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => handleVerify(provider._id, 'approved')} className="flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition">
                    <Check className="w-4 h-4 mr-2" /> Approve
                  </button>
                  <button onClick={() => handleVerify(provider._id, 'denied')} className="flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition">
                    <X className="w-4 h-4 mr-2" /> Deny
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full focus:outline-none p-2 text-gray-700 bg-transparent" 
            />
          </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user: any) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 uppercase">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isBanned ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Banned</span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => handleToggleBlock(user._id, user.isBanned)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-md ${user.isBanned ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
                      >
                        {user.isBanned ? <><Undo2 className="w-4 h-4 mr-1"/> Unblock</> : <><Ban className="w-4 h-4 mr-1"/> Block</>}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {data?.totalUsers > limit && (
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 mt-4 shadow-sm">
            <span className="text-sm text-gray-600 font-medium">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.totalUsers)} of {data.totalUsers} users
            </span>
            <div className="flex space-x-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed border border-gray-200 transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={page * limit >= data.totalUsers}
                className="p-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed border border-gray-200 transition-colors shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
}
