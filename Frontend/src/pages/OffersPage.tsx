import { useGetPublicOffersQuery } from '../features/public/publicApiSlice';
import { Tag } from 'lucide-react';

export default function OffersPage() {
  const { data, isLoading } = useGetPublicOffersQuery();

  if (isLoading) return <div className="p-20 text-center">Loading coupons...</div>;

  const offers = data?.offers || [];

  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
          <Tag className="w-10 h-10 mr-4 text-blue-600" /> Current Coupons & Promotions
        </h1>
        <p className="mt-4 text-xl text-gray-500">Take advantage of these limited time deals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer: any) => (
          <div key={offer._id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-sm hover:shadow-md transition">
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{offer.title}</h3>
              <p className="text-gray-600 mb-4">{offer.description}</p>
              <div className="text-sm font-medium text-gray-500 bg-white inline-block px-3 py-1 rounded-full border border-gray-200">
                Valid until {new Date(offer.endDate).toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl border border-blue-100 shadow-sm min-w-[140px]">
              <span className="text-4xl font-extrabold text-blue-600">
                {offer.discountValue}{offer.discountType === 'percentage' ? '%' : '₹'}
              </span>
              <span className="text-sm font-bold text-gray-500 uppercase mt-1">OFF</span>
              <button className="mt-4 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                Apply Deal
              </button>
            </div>
          </div>
        ))}
      </div>

      {offers.length === 0 && (
        <div className="text-center text-gray-500 py-10">No active coupons at the moment.</div>
      )}
    </div>
  );
}
