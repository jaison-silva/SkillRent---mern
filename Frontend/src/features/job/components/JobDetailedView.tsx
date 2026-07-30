
export const JobDetailedView = ({ job, onClose }: { job: any, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
        >
          ✕
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">
              {job.status}
            </span>
          </div>
          <p className="text-gray-500 text-sm">Posted by {job.userId?.name || 'Unknown User'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Budget</h3>
            <p className="text-xl font-bold text-blue-700">₹{job.budget}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time</h3>
            <p className="font-semibold text-gray-800">{job.time}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</h3>
            <p className="font-semibold text-gray-800">{job.location?.address}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap">
            {job.description}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-3 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              alert("Pending");
              onClose();
            }}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            Chat and Book
          </button>
        </div>
      </div>
    </div>
  );
};
