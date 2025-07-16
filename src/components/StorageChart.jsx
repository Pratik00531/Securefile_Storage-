import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { HardDrive, Folder, Image, FileText, Archive } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StorageChart = ({ files = [] }) => {
  // Calculate storage by file type
  const calculateStorageByType = () => {
    const typeGroups = {
      images: { extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'], size: 0, icon: Image, color: 'blue' },
      documents: { extensions: ['pdf', 'doc', 'docx', 'txt', 'rtf'], size: 0, icon: FileText, color: 'green' },
      archives: { extensions: ['zip', 'rar', '7z', 'tar', 'gz'], size: 0, icon: Archive, color: 'purple' },
      others: { extensions: [], size: 0, icon: Folder, color: 'gray' }
    };

    let totalSize = 0;

    files.forEach(file => {
      const extension = file.originalName?.split('.').pop()?.toLowerCase() || '';
      const fileSize = file.size || 0;
      totalSize += fileSize;

      let categorized = false;
      for (const [type, group] of Object.entries(typeGroups)) {
        if (type !== 'others' && group.extensions.includes(extension)) {
          group.size += fileSize;
          categorized = true;
          break;
        }
      }

      if (!categorized) {
        typeGroups.others.size += fileSize;
      }
    });

    return { typeGroups, totalSize };
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const { typeGroups, totalSize } = calculateStorageByType();
  const maxUsage = 10 * 1024 * 1024 * 1024; // 10GB limit
  const usagePercentage = totalSize > 0 ? Math.min((totalSize / maxUsage) * 100, 100) : 0;

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      gray: 'bg-gray-500'
    };
    return colors[color] || colors.gray;
  };

  const getColorBgClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      gray: 'bg-gray-50 text-gray-600'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <HardDrive className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Storage Usage</h3>
      </div>

      {/* Overall Usage */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Total Usage</span>
          <span className="text-sm text-gray-500">
            {formatFileSize(totalSize)} / {formatFileSize(maxUsage)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${usagePercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{usagePercentage.toFixed(1)}% used</p>
      </div>

      {/* Storage by Type */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Storage by Type</h4>
        
        {/* Chart Section */}
        {totalSize > 0 && (
          <div className="mb-6">
            <div className="w-48 h-48 mx-auto">
              <Doughnut 
                data={{
                  labels: Object.entries(typeGroups)
                    .filter(([_, data]) => data.size > 0)
                    .map(([type]) => type.charAt(0).toUpperCase() + type.slice(1)),
                  datasets: [{
                    data: Object.entries(typeGroups)
                      .filter(([_, data]) => data.size > 0)
                      .map(([_, data]) => data.size),
                    backgroundColor: [
                      '#3B82F6', // blue
                      '#10B981', // green  
                      '#8B5CF6', // purple
                      '#6B7280', // gray
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff',
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                          size: 12
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = formatFileSize(context.raw);
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = ((context.raw / total) * 100).toFixed(1);
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        )}
        
        {Object.entries(typeGroups).map(([type, data]) => {
          if (data.size === 0) return null;
          
          const Icon = data.icon;
          const percentage = totalSize > 0 ? (data.size / totalSize) * 100 : 0;
          
          return (
            <div key={type} className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getColorBgClasses(data.color)}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                  <span className="text-sm text-gray-500">{formatFileSize(data.size)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${getColorClasses(data.color)}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
        
        {totalSize === 0 && (
          <div className="text-center py-6 text-gray-500">
            <HardDrive className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No files uploaded yet</p>
            <p className="text-xs">Upload files to see storage breakdown</p>
          </div>
        )}
      </div>

      {/* Storage Tips */}
      {usagePercentage > 80 && (
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Storage almost full!</span> Consider deleting old files to free up space.
          </p>
        </div>
      )}
    </div>
  );
};

export default StorageChart;
