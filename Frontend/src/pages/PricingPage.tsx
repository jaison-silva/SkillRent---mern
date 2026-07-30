import { useGetPublicMembershipsQuery } from '../features/public/publicApiSlice';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const { data, isLoading } = useGetPublicMembershipsQuery();

  if (isLoading) return <div className="p-20 text-center">Loading plans...</div>;

  const memberships = data?.memberships || [];

  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Simple, transparent memberships</h1>
        <p className="mt-4 text-xl text-gray-500">Choose the plan that's right for you. Upgrade or downgrade at any time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {memberships.map((plan: any) => (
          <div key={plan._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-500 capitalize mb-6">For {plan.targetRole}s</p>
              <div className="flex items-baseline mb-8">
                <span className="text-5xl font-extrabold tracking-tight">₹{plan.price}</span>
                <span className="text-gray-500 ml-2 font-medium">/{plan.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.noServiceCharge && (
                  <li className="flex items-center text-gray-600"><Check className="w-5 h-5 text-green-500 mr-3" /> No Service Charge</li>
                )}
                {plan.features.prioritySupport && (
                  <li className="flex items-center text-gray-600"><Check className="w-5 h-5 text-green-500 mr-3" /> Priority Support</li>
                )}
                {plan.features.proposalLimitBoost > 0 && (
                  <li className="flex items-center text-gray-600"><Check className="w-5 h-5 text-green-500 mr-3" /> {plan.features.proposalLimitBoost} Proposal Boost</li>
                )}
                {plan.features.profileBoostFactor > 1 && (
                  <li className="flex items-center text-gray-600"><Check className="w-5 h-5 text-green-500 mr-3" /> {plan.features.profileBoostFactor}x Profile Visibility</li>
                )}
              </ul>
            </div>
            
            <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
              Subscribe Now
            </button>
          </div>
        ))}
      </div>
      
      {memberships.length === 0 && (
        <div className="text-center text-gray-500 py-10">No active plans at the moment.</div>
      )}
    </div>
  );
}
