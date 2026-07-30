import { Send } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import { useGetAvailableJobsQuery, useGetMyJobsQuery } from '../features/job/jobApiSlice';

export default function ChatPage() {
  const user = useSelector(selectCurrentUser);
  const isProvider = user?.role === 'provider';

  // For providers, fetch available jobs. For users, fetch their own jobs.
  const { data: availableJobsData, isLoading: isLoadingAvailable } = useGetAvailableJobsQuery(undefined, { skip: !isProvider });
  const { data: myJobsData, isLoading: isLoadingMyJobs } = useGetMyJobsQuery(undefined, { skip: isProvider });

  const isLoading = isProvider ? isLoadingAvailable : isLoadingMyJobs;
  const jobs = isProvider ? (availableJobsData?.jobs || []) : (myJobsData?.jobs || []);

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)] p-4 flex flex-col md:flex-row gap-4">
      {/* Left sidebar - Job Cards */}
      <div className="w-full md:w-1/3 bg-white border border-gray-200 rounded-2xl flex flex-col overflow-hidden shadow-sm h-[30vh] md:h-full">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Active Jobs</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
          {isLoading ? (
            <div className="text-center py-4 text-gray-500 font-medium">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-4 text-gray-500 font-medium">No jobs found.</div>
          ) : (
            jobs.map((job: any) => (
              <div key={job._id} className="p-4 border border-gray-100 rounded-xl hover:border-blue-300 hover:shadow-md transition cursor-pointer bg-white group">
                 <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">{job.title}</h3>
                 <div className="text-sm text-gray-500 mt-2 flex justify-between items-center">
                   <span className="font-medium truncate mr-2">{isProvider ? job.userId?.name : 'Me'}</span>
                   <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">₹{job.budget}</span>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Area - Chat Box */}
      <div className="flex-1 bg-white border border-gray-200 rounded-2xl flex flex-col shadow-sm h-[60vh] md:h-full">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg shadow-sm border border-blue-200">
              A
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Alex</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-xs text-gray-500 font-medium">Online now</p>
              </div>
            </div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95 flex items-center gap-2">
            Book Now
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50 space-y-6">
           {/* Dummy messages */}
           <div className="flex justify-start">
             <div className="bg-white border border-gray-200 text-gray-800 p-4 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
               <p>Hi, are you available for the plumbing repair tomorrow?</p>
               <span className="text-[10px] text-gray-400 mt-2 block font-medium">10:30 AM</span>
             </div>
           </div>
           
           <div className="flex justify-end">
             <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
               <p>Yes, I can come by at 10 AM. Does that work for you?</p>
               <span className="text-[10px] text-blue-200 mt-2 block font-medium text-right">10:32 AM</span>
             </div>
           </div>

           <div className="flex justify-start">
             <div className="bg-white border border-gray-200 text-gray-800 p-4 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
               <p>Perfect! See you then.</p>
               <span className="text-[10px] text-gray-400 mt-2 block font-medium">10:33 AM</span>
             </div>
           </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 border border-gray-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-700 font-medium"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
