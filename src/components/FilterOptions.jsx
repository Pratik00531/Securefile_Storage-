import React, { useState } from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';

const FilterOptions = ({ filters, onFiltersChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const filterOptions = {
    fileType: {
      label: 'File Type',
      options: [
        { value: 'all', label: 'All Files' },
        { value: 'images', label: 'Images' },
        { value: 'documents', label: 'Documents' },
        { value: 'archives', label: 'Archives' },
        { value: 'others', label: 'Others' }
      ]
    },
    dateRange: {
      label: 'Date Range',
      options: [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'year', label: 'This Year' }
      ]
    },
    size: {
      label: 'File Size',
      options: [
        { value: 'all', label: 'Any Size' },
        { value: 'small', label: 'Small (< 1MB)' },
        { value: 'medium', label: 'Medium (1-10MB)' },
        { value: 'large', label: 'Large (> 10MB)' }
      ]
    },
    shared: {
      label: 'Sharing Status',
      options: [
        { value: 'all', label: 'All Files' },
        { value: 'shared', label: 'Shared Only' },
        { value: 'private', label: 'Private Only' }
      ]
    }
  };

  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      fileType: 'all',
      dateRange: 'all',
      size: 'all',
      shared: 'all'
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all');
  const activeFilterCount = Object.values(filters).filter(value => value !== 'all').length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
          hasActiveFilters 
            ? 'bg-blue-50 text-blue-600 border-blue-200' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
      >
        <Filter className="h-4 w-4" />
        Filters
        {activeFilterCount > 0 && (
          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Filter Files</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {Object.entries(filterOptions).map(([filterType, config]) => (
                  <div key={filterType}>
                    <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                      {config.label}
                    </label>
                    <div className="mt-2 space-y-1">
                      {config.options.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={filterType}
                            value={option.value}
                            checked={filters[filterType] === option.value}
                            onChange={(e) => handleFilterChange(filterType, e.target.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterOptions;
