import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = "Search..." }: SearchInputProps) {
  return (
    <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
      <Search className="w-5 h-5 text-gray-400 shrink-0" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full focus:outline-none p-2 text-gray-700 bg-transparent"
      />
      {value && (
        <button onClick={() => onChange('')} className="text-gray-400 hover:text-gray-600 shrink-0">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
