import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProviderByIdQuery } from '../../provider/providerApiSlice';
import { ArrowLeft, User, MapPin, Briefcase, Star, MessageSquare, X } from 'lucide-react';
import ProviderReviews from '../../provider/components/ProviderReviews';
import { CreateJobForm } from '../../job/components/CreateJobForm';

export default function ProviderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  
  // The backend route is GET /providers/:id
  const { data, isLoading, isError } = useGetProviderByIdQuery(id as string, { skip: !id });

  if (isLoading) return <div className="p-20 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  
  if (isError || !data || !data.provider) return (
    <div className="p-20 text-center">
      <div className="text-red-500 mb-4 font-semibold">Failed to load provider details or provider not found.</div>
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">Go Back</button>
    </div>
  );

  const provider = data.provider;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
        
        {/* Banner header */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

        <div className="px-8 pb-8">
          {/* Profile Picture / Initial */}
          <div className="flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-lg p-1">
              <div className="w-full h-full bg-blue-100/50 rounded-xl flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-600">
                  {provider.userId?.name?.charAt(0) || <User className="w-10 h-10" />}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsJobModalOpen(true)}
              className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-semibold shadow-md flex items-center transition-all"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Direct Request
            </button>
          </div>

          <div className="space-y-8">
            {/* Core Identity */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{provider.userId?.name || 'Unknown Provider'}</h1>
              <div className="flex items-center space-x-4 mt-2 text-gray-500 text-sm font-medium">
                {provider.location?.address && (
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {provider.location.address}
                  </span>
                )}
                <span className="flex items-center justify-center px-2 py-0.5 bg-green-50 text-green-700 rounded-md border border-green-100">
                  <Star className="w-3.5 h-3.5 mr-1 fill-green-700" />
                  Verified
                </span>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* About / Bio */}
            <div>
              <h2 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                About Me
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {provider.bio || <span className="text-gray-400 italic">This provider hasn't written a bio yet.</span>}
              </p>
            </div>

            {/* Work Nature */}
            <div>
              <h2 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-3 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Work Nature
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg capitalize">
                {provider.workNature || 'Offline'}
              </p>
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-3 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-2">
                {provider.skills && provider.skills.length > 0 ? (
                  provider.skills.map((skill: string, idx: number) => (
                    <span 
                      key={idx} 
                      className="bg-gray-50 text-gray-700 border border-gray-200 px-4 py-1.5 rounded-lg text-sm font-semibold"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic text-sm">No specific skills listed.</span>
                )}
              </div>
            </div>

            <hr className="border-gray-100" />
            
            {/* Reviews Section */}
            <ProviderReviews providerId={provider._id} />

          </div>
        </div>
      </div>

      {/* Direct Request Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setIsJobModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-2">
              <CreateJobForm 
                onSuccess={() => setIsJobModalOpen(false)} 
                prefillProviderId={provider._id} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
