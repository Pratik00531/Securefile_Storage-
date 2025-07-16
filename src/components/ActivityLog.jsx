import React, { useState, useEffect } from 'react';
import { Clock, Upload, Download, Share2, Trash2, Edit, Eye } from 'lucide-react';

const ActivityLog = ({ detailed = false }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching activity data
    const fetchActivities = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockActivities = [
        {
          id: 1,
          action: 'uploaded',
          fileName: 'project-proposal.pdf',
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          icon: Upload,
          color: 'green'
        },
        {
          id: 2,
          action: 'downloaded',
          fileName: 'meeting-notes.docx',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          icon: Download,
          color: 'blue'
        },
        {
          id: 3,
          action: 'shared',
          fileName: 'presentation.pptx',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          icon: Share2,
          color: 'purple'
        },
        {
          id: 4,
          action: 'viewed',
          fileName: 'contract.pdf',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          icon: Eye,
          color: 'gray'
        },
        {
          id: 5,
          action: 'deleted',
          fileName: 'old-backup.zip',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          icon: Trash2,
          color: 'red'
        },
        {
          id: 6,
          action: 'renamed',
          fileName: 'document.txt → final-document.txt',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          icon: Edit,
          color: 'orange'
        }
      ];

      setActivities(detailed ? mockActivities : mockActivities.slice(0, 4));
      setLoading(false);
    };

    fetchActivities();
  }, [detailed]);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getActionText = (action) => {
    const actions = {
      uploaded: 'uploaded',
      downloaded: 'downloaded',
      shared: 'shared',
      viewed: 'viewed',
      deleted: 'deleted',
      renamed: 'renamed'
    };
    return actions[action] || action;
  };

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      gray: 'bg-gray-100 text-gray-600',
      red: 'bg-red-100 text-red-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color] || colors.gray;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Recent Activity
      </h3>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activity</p>
        ) : (
          activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${getColorClasses(activity.color)}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    You <span className="font-medium">{getActionText(activity.action)}</span>{' '}
                    <span className="font-medium text-gray-700">{activity.fileName}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {!detailed && activities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all activity
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
