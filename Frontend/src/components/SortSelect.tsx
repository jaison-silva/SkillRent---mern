import { ArrowUpDown } from 'lucide-react';

interface SortOption {
  label: string;
  value: string;
}

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SortOption[];
}

export default function SortSelect({ value, onChange, options }: SortSelectProps) {
  return (
    <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
      <ArrowUpDown className="w-4 h-4 text-gray-400 shrink-0" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full focus:outline-none py-2 text-gray-700 bg-transparent text-sm font-medium cursor-pointer appearance-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
