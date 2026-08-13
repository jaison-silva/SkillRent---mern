import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, DollarSign, User, AlertCircle } from 'lucide-react';

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  agreements: any[];
}

const AgreementModal: React.FC<AgreementModalProps> = ({ isOpen, onClose, date, agreements }) => {
  const [cancelData, setCancelData] = useState<{ agr: any, refundPercent: number, refundAmount: number } | null>(null);

  if (!isOpen || !date) return null;

  const handleCancelClick = (agr: any) => {
    try {
      const parts = agr.agreedTime.split(" at ")[0].split(" from ")[0];
      const serviceDate = new Date(parts);
      const now = new Date();
      
      const diffTime = serviceDate.getTime() - now.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);
      
      let refundPercent = 0;
      if (diffDays >= 7) {
        refundPercent = 100;
      } else if (diffDays >= 3) {
        refundPercent = 50;
      } else {
        refundPercent = 0;
      }
      
      const refundAmount = (agr.agreedBudget * refundPercent) / 100;
      setCancelData({ agr, refundPercent, refundAmount });
    } catch (err) {
      console.error(err);
      setCancelData({ agr, refundPercent: 0, refundAmount: 0 });
    }
  };

  const handleClose = () => {
    setCancelData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
        
        {/* Cancel Overlay */}
        {cancelData && (
          <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-red-50 p-4 rounded-full mb-4">
              <AlertCircle size={48} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Cancel Service Agreement</h3>
            <p className="text-gray-600 max-w-md mb-6">
              You are about to cancel this service. Based on our cancellation policy, here is your refund summary:
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 w-full max-w-sm mb-8">
              <div className="flex justify-between mb-3 text-sm">
                <span className="text-gray-600">Original Budget:</span>
                <span className="font-semibold">${cancelData.agr.agreedBudget}</span>
              </div>
              <div className="flex justify-between mb-3 text-sm">
                <span className="text-gray-600">Refund Eligibility:</span>
                <span className="font-semibold">{cancelData.refundPercent}%</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between">
                <span className="font-bold text-gray-900">Total Refund:</span>
                <span className="font-bold text-green-600">${cancelData.refundAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3 w-full max-w-sm">
              <button 
                onClick={() => setCancelData(null)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-colors"
              >
                Go Back
              </button>
              <button 
                onClick={() => {
                  alert("Dummy backend call to process refund of $" + cancelData.refundAmount);
                  setCancelData(null);
                }}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Service Agreements</h2>
            <p className="text-sm text-gray-500 mt-1">
              {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {agreements.map((agr, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-blue-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900">{agr.jobId?.title || 'Service Name'}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                  ${agr.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {agr.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                {agr.jobId?.description || 'No description provided.'}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Client</p>
                    <p className="font-medium">{agr.clientId?.name || 'Unknown'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Provider</p>
                    <p className="font-medium">{agr.providerId?.name || 'Unknown'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg col-span-2 sm:col-span-1">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Agreed Time</p>
                    <p className="font-medium text-xs sm:text-sm">{agr.agreedTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg col-span-2 sm:col-span-1">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Agreed Budget</p>
                    <p className="font-medium">${agr.agreedBudget}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleCancelClick(agr)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <AlertCircle size={16} />
                  Cancel Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgreementModal;
