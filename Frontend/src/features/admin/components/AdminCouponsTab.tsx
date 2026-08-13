import { useState } from 'react';
import { useGetCouponsQuery, useCreateCouponMutation, useDeleteCouponMutation } from '../adminApiSlice';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCouponsTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetCouponsQuery({ page, limit: 10 });
  const [createCoupon] = useCreateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ 
    code: '', 
    discountType: 'percentage', 
    discountValue: 0, 
    startDate: '', 
    expiryDate: '',
    excludeIfMembership: false,
    applicableCategories: '', // Comma-separated string in UI for ease
    conditionDescription: ''
  });

  const coupons = data?.coupons || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        applicableCategories: formData.applicableCategories ? formData.applicableCategories.split(',').map(s => s.trim()) : []
      };
      await createCoupon(payload).unwrap();
      toast.success('Coupon created successfully');
      setIsCreating(false);
      setFormData({ code: '', discountType: 'percentage', discountValue: 0, startDate: '', expiryDate: '', excludeIfMembership: false, applicableCategories: '', conditionDescription: '' });
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await deleteCoupon(id).unwrap();
      toast.success('Coupon deleted');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete coupon');
    }
  };

  if (isLoading) return <div>Loading coupons...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Coupons</h2>
        <button onClick={() => setIsCreating(!isCreating)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Add Coupon
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Code</label>
              <input required type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm uppercase" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Value</label>
              <input required type="number" min="0" value={formData.discountValue} onChange={e => setFormData({ ...formData, discountValue: Number(e.target.value) })} className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Exclude if Member?</label>
              <input type="checkbox" checked={formData.excludeIfMembership} onChange={e => setFormData({ ...formData, excludeIfMembership: e.target.checked })} className="mt-3 block" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input required type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input required type="date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Categories (comma-separated)</label>
              <input type="text" placeholder="e.g. Plumbing, Electrical" value={formData.applicableCategories} onChange={e => setFormData({ ...formData, applicableCategories: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Condition Description</label>
              <input type="text" placeholder="e.g. First-time users only" value={formData.conditionDescription} onChange={e => setFormData({ ...formData, conditionDescription: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" />
            </div>
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">Save Coupon</button>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Code</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Discount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Dates</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coupons.map((coupon: any) => (
              <tr key={coupon._id}>
                <td className="px-6 py-4 font-bold">{coupon.code}</td>
                <td className="px-6 py-4">{coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : '₹'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.expiryDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(coupon._id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5 inline" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
