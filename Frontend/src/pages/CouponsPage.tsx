import { useGetPublicCouponsQuery } from '../features/public/publicApiSlice';
import { Ticket } from 'lucide-react';

export default function CouponsPage() {
  const { data, isLoading } = useGetPublicCouponsQuery();

  if (isLoading) return <div className="p-20 text-center">Loading coupons...</div>;

  const coupons = data?.coupons || [];

  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
          <Ticket className="w-10 h-10 mr-4 text-blue-600" /> Member Coupons
        </h1>
        <p className="mt-4 text-xl text-gray-500">Exclusive coupons you can apply to your bookings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.map((coupon: any) => (
          <div key={coupon._id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-sm hover:shadow-md transition">
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 font-mono font-bold text-xl rounded-lg border-2 border-dashed border-blue-300 mb-4 uppercase tracking-wider">
                {coupon.code}
              </div>
              
              {coupon.conditionDescription && (
                <p className="text-gray-700 font-medium mb-2">{coupon.conditionDescription}</p>
              )}
              
              {coupon.applicableCategories && coupon.applicableCategories.length > 0 && (
                <p className="text-sm text-gray-500 mb-4">
                  Categories: {coupon.applicableCategories.join(', ')}
                </p>
              )}

              <div className="text-sm font-medium text-gray-500 bg-white inline-block px-3 py-1 rounded-full border border-gray-200">
                Valid until {new Date(coupon.expiryDate).toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl border border-blue-100 shadow-sm min-w-[140px]">
              <span className="text-4xl font-extrabold text-blue-600">
                {coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : '₹'}
              </span>
              <span className="text-sm font-bold text-gray-500 uppercase mt-1">OFF</span>
            </div>
          </div>
        ))}
      </div>

      {coupons.length === 0 && (
        <div className="text-center text-gray-500 py-10">No active coupons at the moment.</div>
      )}
    </div>
  );
}
