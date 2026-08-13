import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  agreements: any[];
  onDateSelect: (date: Date, dateAgreements: any[]) => void;
}

const Calendar: React.FC<CalendarProps> = ({ agreements, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Helper to parse agreedTime to a Date object
  const parseAgreementDate = (dateStr: string) => {
    if (!dateStr) return null;
    try {
      const parts = dateStr.split(" at ")[0].split(" from ")[0];
      return new Date(parts);
    } catch {
      return null;
    }
  };

  const agreementsMap = new Map<number, any[]>();
  agreements?.forEach(agreement => {
    const d = parseAgreementDate(agreement.agreedTime);
    if (d && d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!agreementsMap.has(day)) {
        agreementsMap.set(day, []);
      }
      agreementsMap.get(day)!.push(agreement);
    }
  });

  const renderCells = () => {
    const cells = [];
    
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="p-4 border border-gray-100 bg-gray-50/50"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dayAgreements = agreementsMap.get(d) || [];
      const hasAgreement = dayAgreements.length > 0;
      
      const today = new Date();
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

      cells.push(
        <div 
          key={d} 
          onClick={() => {
            if (hasAgreement) {
              onDateSelect(new Date(year, month, d), dayAgreements);
            }
          }}
          className={`p-4 min-h-[100px] border border-gray-100 relative transition-all duration-200
            ${hasAgreement ? 'cursor-pointer hover:bg-blue-50 hover:border-blue-200' : 'text-gray-400'}
            ${isToday ? 'bg-indigo-50/30' : ''}
          `}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium ${isToday ? 'bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : ''} ${hasAgreement && !isToday ? 'text-gray-900' : ''}`}>
              {d}
            </span>
          </div>
          
          {hasAgreement && (
            <div className="mt-2 flex flex-col gap-1">
              {dayAgreements.slice(0, 2).map((agr, idx) => (
                <div key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate">
                  {agr.jobId?.title || 'Service'}
                </div>
              ))}
              {dayAgreements.length > 2 && (
                <div className="text-xs text-gray-500 font-medium pl-1">
                  +{dayAgreements.length - 2} more
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">{monthNames[month]} {year}</h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {days.map(d => (
          <div key={d} className="p-4 text-sm font-semibold text-gray-500 text-center uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 bg-white">
        {renderCells()}
      </div>
    </div>
  );
};

export default Calendar;
