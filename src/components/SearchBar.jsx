import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchQuery, onSearchChange, placeholder = "Search files..." }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="relative max-w-md w-full">
      <div className={`relative flex items-center border rounded-lg bg-white transition-all duration-200 ${
        isFocused ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-gray-300'
      }`}>
        <Search className="h-4 w-4 text-gray-400 ml-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 pl-3 pr-10 py-2 text-sm text-gray-900 placeholder-gray-500 bg-transparent border-0 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-1 text-xs text-gray-500">
          Searching for "{searchQuery}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;
