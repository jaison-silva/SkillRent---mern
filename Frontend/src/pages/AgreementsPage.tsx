import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import AgreementModal from '../components/AgreementModal';
import { useGetAgreementsQuery } from '../features/agreements/agreementApiSlice';
import { Calendar as CalendarIcon, Briefcase } from 'lucide-react';

const AgreementsPage = () => {
  const { data: agreements, isLoading, isError } = useGetAgreementsQuery({});
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalAgreements, setModalAgreements] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateSelect = (date: Date, dateAgreements: any[]) => {
    setSelectedDate(date);
    setModalAgreements(dateAgreements);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <CalendarIcon className="text-blue-600" size={32} />
              Service Agreements
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage and track all your scheduled jobs and confirmed services.
            </p>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <Briefcase size={20} className="text-indigo-600" />
            <span className="font-semibold text-gray-700">
              {agreements?.length || 0} Total Agreements
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : isError ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center font-medium">
            Failed to load service agreements.
          </div>
        ) : (
          <Calendar agreements={agreements || []} onDateSelect={handleDateSelect} />
        )}

      </div>

      <AgreementModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        date={selectedDate}
        agreements={modalAgreements}
      />
    </div>
  );
};

export default AgreementsPage;
