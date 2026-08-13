import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  useGetAdminDashboardQuery, 
  useVerifyProviderMutation, 
  useChangeUserStatusMutation 
} from '../adminApiSlice';
import { ShieldAlert, Check, X, Ban, Undo2 } from 'lucide-react';
import SearchInput from '../../../components/SearchInput';
import Pagination from '../../../components/Pagination';
import AdminMembershipsTab from '../components/AdminMembershipsTab';
import AdminCouponsTab from '../components/AdminCouponsTab';
import AdminOffersTab from '../components/AdminOffersTab';
import AdminCategoriesTab from '../components/AdminCategoriesTab';

const DenyToast = ({ id, onConfirm, onCancel }: { id: string, onConfirm: (reason: string) => void, onCancel: () => void }) => {
  const [reason, setReason] = useState('');
  return (
    <div className="flex flex-col gap-3 min-w-[300px]">
      <p className="font-semibold text-gray-800">Are you sure you want to <span className="text-red-600 font-bold">deny</span> this provider?</p>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason for rejection (required)..."
        className="w-full text-sm border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        rows={3}
      />
      <div className="flex gap-2 justify-end mt-1">
        <button
          disabled={!reason.trim()}
          onClick={() => onConfirm(reason)}
          className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-bold hover:bg-red-700 disabled:opacity-50"
        >
          Confirm Deny
        </button>
        <button onClick={onCancel} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'users' | 'memberships' | 'coupons' | 'offers' | 'categories'>('pending');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const limit = 10;

  useEffect(() => {
    setPage(1);
    setSearch('');
    setDebouncedSearch('');
  }, [activeTab]);

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

  if (isLoading) return <div className="p-20 text-center animate-pulse text-gray-500">Loading admin data...</div>;

  const users = data?.users || [];
  const pendingProviders = data?.providers || []; // note

  // function HandleSort(){
    // done during review
  // }

  const handleVerify = (id: string, status: 'approved' | 'denied') => {
    if (status === 'denied') {
      toast((t) => (
        <DenyToast
          id={id}
          onConfirm={async (reason) => {
            toast.dismiss(t.id);
            try {
              await verifyProvider({ id, status, reason }).unwrap();
              toast.success(`Provider successfully denied!`);
            } catch (err: any) {
              toast.error(err?.data?.message || 'Verification failed');
            }
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ), { duration: Infinity });
      return;
    }

    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-gray-800">Are you sure you want to <span className="capitalize font-bold text-green-600">approve</span> this provider?</p>
        <div className="flex gap-2 mt-1">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await verifyProvider({ id, status }).unwrap();
                toast.success(`Provider successfully approved!`);
              } catch (err: any) {
                toast.error(err?.data?.message || 'Verification failed');
              }
            }}
            className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-bold hover:bg-green-700"
          >Confirm Approve</button>
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">Cancel</button>
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
          Pending Verifications ({data?.totalProviders || 0})
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`pb-4 px-2 font-semibold ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          All Users ({data?.totalUsers || 0})
        </button>
        <button 
          onClick={() => setActiveTab('memberships')}
          className={`pb-4 px-2 font-semibold ${activeTab === 'memberships' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Memberships
        </button>
        <button 
          onClick={() => setActiveTab('coupons')}
          className={`pb-4 px-2 font-semibold ${activeTab === 'coupons' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Coupons
        </button>
        <button 
          onClick={() => setActiveTab('offers')}
          className={`pb-4 px-2 font-semibold ${activeTab === 'offers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Offers
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`pb-4 px-2 font-semibold ${activeTab === 'categories' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Categories
        </button>
      </div>

      {activeTab === 'pending' && (
        <div className="space-y-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search pending providers by name or skills..."
          />
          {pendingProviders.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-500">
              No pending verifications.
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {pendingProviders.map((provider: any) => (
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
                ))}
              </div>
              <Pagination page={page} limit={limit} total={data?.totalProviders || 0} onPageChange={setPage} label="pending providers" />
            </>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search users by name or email..."
          />

           <button className='button' onClick={HandleSort}> // note
            Name Sort
            </button>

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

        <Pagination page={page} limit={limit} total={data?.totalUsers || 0} onPageChange={setPage} label="users" />
        </div>
      )}

      {activeTab === 'memberships' && <AdminMembershipsTab />}
      {activeTab === 'coupons' && <AdminCouponsTab />}
      {activeTab === 'offers' && <AdminOffersTab />}
      {activeTab === 'categories' && <AdminCategoriesTab />}
    </div>
  );
}
