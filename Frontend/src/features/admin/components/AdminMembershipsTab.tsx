import { useState } from 'react';
import { useGetMembershipsQuery, useCreateMembershipMutation, useDeleteMembershipMutation } from '../adminApiSlice';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMembershipsTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetMembershipsQuery({ page, limit: 10 });
  const [createMembership] = useCreateMembershipMutation();
  const [deleteMembership] = useDeleteMembershipMutation();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', targetRole: 'user', price: 0, billingCycle: 'monthly',
    features: { membersOnlyCoupons: false, platformFeeDiscount: 0, priorityDiscovery: false }
  });

  const memberships = data?.memberships || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMembership(formData).unwrap();
      toast.success('Membership created successfully');
      setIsCreating(false);
      setFormData({ 
        name: '', targetRole: 'user', price: 0, billingCycle: 'monthly',
        features: { membersOnlyCoupons: false, platformFeeDiscount: 0, priorityDiscovery: false }
      });
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create membership');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this membership?')) return;
    try {
      await deleteMembership(id).unwrap();
      toast.success('Membership deleted');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete membership');
    }
  };

  if (isLoading) return <div>Loading memberships...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Memberships</h2>
        <button onClick={() => setIsCreating(!isCreating)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Add Plan
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Plan Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Target Role</label>
              <select value={formData.targetRole} onChange={e => setFormData({ ...formData, targetRole: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm">
                <option value="user">User</option>
                <option value="provider">Provider</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input required type="number" min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Billing Cycle</label>
              <select value={formData.billingCycle} onChange={e => setFormData({ ...formData, billingCycle: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm">
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          
          <div className="pt-2 pb-1 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Subscription Features</h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={formData.features.membersOnlyCoupons} 
                  onChange={e => setFormData({ ...formData, features: { ...formData.features, membersOnlyCoupons: e.target.checked } })} 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-700">Members Only Coupons</span>
              </label>

              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={formData.features.priorityDiscovery} 
                  onChange={e => setFormData({ ...formData, features: { ...formData.features, priorityDiscovery: e.target.checked } })} 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-700">Priority Discovery</span>
              </label>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Platform Fee Discount (%)</label>
                <input type="number" min="0" max="100" value={formData.features.platformFeeDiscount} 
                  onChange={e => setFormData({ ...formData, features: { ...formData.features, platformFeeDiscount: Number(e.target.value) } })} 
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" />
              </div>
            </div>
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">Save Plan</button>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Plan Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {memberships.map((plan: any) => (
              <tr key={plan._id}>
                <td className="px-6 py-4 font-medium">{plan.name}</td>
                <td className="px-6 py-4 capitalize">{plan.targetRole}</td>
                <td className="px-6 py-4">₹{plan.price} / {plan.billingCycle}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(plan._id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5 inline" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
