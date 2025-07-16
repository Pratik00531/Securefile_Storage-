import React from 'react';
import { Clock, Download, Share2, Eye, FileText, Image, Archive, File } from 'lucide-react';

const RecentFiles = ({ files = [] }) => {
  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return Image;
    } else if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension)) {
      return FileText;
    } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
      return Archive;
    }
    return File;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const recentFiles = files
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Files
        </h3>
        {files.length > 5 && (
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all files
          </button>
        )}
      </div>

      {recentFiles.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">No files yet</p>
          <p className="text-sm text-gray-400">Upload your first file to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentFiles.map((file) => {
            const FileIcon = getFileIcon(file.originalName);
            
            return (
              <div
                key={file._id}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FileIcon className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.originalName}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(file.createdAt)}
                    </span>
                    {file.isShared && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <div className="flex items-center gap-1">
                          <Share2 className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600">Shared</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="View file"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    title="Download file"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  {file.isShared && (
                    <button
                      className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                      title="Share options"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {recentFiles.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Showing {recentFiles.length} of {files.length} files</span>
            <span>Last updated: {formatDate(files[0]?.updatedAt || new Date())}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentFiles;
