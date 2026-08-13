import { useState } from 'react';
import { useGetOffersQuery, useCreateOfferMutation, useDeleteOfferMutation } from '../adminApiSlice';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOffersTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetOffersQuery({ page, limit: 10 });
  const [createOffer] = useCreateOfferMutation();
  const [deleteOffer] = useDeleteOfferMutation();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '',
    discountType: 'percentage', 
    discountValue: 0, 
    startDate: '', 
    endDate: '',
    category: '',
    location: ''
  });

  const offers = data?.offers || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOffer(formData).unwrap();
      toast.success('Offer created successfully');
      setIsCreating(false);
      setFormData({ title: '', description: '', discountType: 'percentage', discountValue: 0, startDate: '', endDate: '', category: '', location: '' });
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create offer');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    try {
      await deleteOffer(id).unwrap();
      toast.success('Offer deleted');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete offer');
    }
  };

  if (isLoading) return <div>Loading offers...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Offers</h2>
        <button onClick={() => setIsCreating(!isCreating)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Add Offer
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" placeholder="e.g. Holiday Sale 20% Off!" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" />
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
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input required type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input required type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input type="text" placeholder="e.g. Plumbing, or leave blank for all" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" placeholder="e.g. New York, or leave blank for all" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm" />
            </div>
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">Save Offer</button>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Discount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Dates</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {offers.map((offer: any) => (
              <tr key={offer._id}>
                <td className="px-6 py-4 font-bold">{offer.title}</td>
                <td className="px-6 py-4">{offer.discountValue}{offer.discountType === 'percentage' ? '%' : '₹'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(offer._id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5 inline" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
