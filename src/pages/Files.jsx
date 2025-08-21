import React, { useState, useEffect } from 'react';
import { fileAPI } from '../services/api';
import { 
  Files as FilesIcon, 
  Download, 
  Trash2, 
  Search, 
  Filter,
  Image,
  Video,
  Music,
  FileText,
  Archive,
  Grid,
  List,
  Upload,
  CheckCircle,
  X
} from 'lucide-react';

const Files = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalFiles: 0
  });

  const categories = [
    { value: 'all', label: 'All Files', icon: FilesIcon },
    { value: 'image', label: 'Images', icon: Image },
    { value: 'video', label: 'Videos', icon: Video },
    { value: 'audio', label: 'Audio', icon: Music },
    { value: 'document', label: 'Documents', icon: FileText },
    { value: 'archive', label: 'Archives', icon: Archive },
  ];

  useEffect(() => {
    fetchFiles();
  }, [selectedCategory, searchTerm, pagination.currentPage]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fileAPI.getMyFiles();
      setFiles(response.data.files || response.data);
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await fileAPI.download(fileId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleDelete = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await fileAPI.delete(fileId);
        fetchFiles(); // Refresh the list
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Delete failed. Please try again.');
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (category, mimetype) => {
    switch (category) {
      case 'image': return Image;
      case 'video': return Video;
      case 'audio': return Music;
      case 'document': return FileText;
      case 'archive': return Archive;
      default: return FileText;
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    console.log('Upload file:', file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      await fileAPI.upload(formData);
      
      // Show success popup
      setUploadedFileName(file.name);
      setShowSuccessPopup(true);
      
      // Auto-hide popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
      
      // Refresh files list
      fetchFiles();
      
      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('File upload failed:', error);
      alert('File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in">
          <CheckCircle className="w-6 h-6 text-white" />
          <div>
            <p className="font-semibold">File Uploaded Successfully!</p>
            <p className="text-sm opacity-90">{uploadedFileName}</p>
          </div>
          <button 
            onClick={() => setShowSuccessPopup(false)}
            className="ml-4 text-white hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        id="fileUploadInput"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
        multiple
      />

      <div className="page-header">
        <h1 className="page-title">My Files</h1>
        <p className="page-subtitle">Manage your uploaded files</p>
      </div>

      {/* Toolbar */}
      <div className="files-toolbar">
        <div className="toolbar-left">
          {/* Search */}
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Category Filter */}
          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category.value}
                className={`filter-btn ${selectedCategory === category.value ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.value)}
              >
                <category.icon size={16} />
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-right">
          {/* Upload Button */}
          <button
            className="btn btn-primary"
            onClick={() => document.getElementById('fileUploadInput').click()}
            disabled={uploading}
          >
            <Upload size={16} />
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>

          {/* View Mode Toggle */}
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Files Display */}
      {files.length === 0 ? (
        <div className="empty-state">
          <FilesIcon size={64} />
          <h3>No files found</h3>
          <p>Upload your first file to get started</p>
          <button
            className="btn btn-primary"
            onClick={() => document.getElementById('fileUploadInput').click()}
          >
            <Upload size={16} />
            Upload Files
          </button>
        </div>
      ) : (
        <>
          <div className={`files-container ${viewMode}`}>
            {files.map((file) => {
              const IconComponent = getFileIcon(file.category, file.mimetype);
              
              return viewMode === 'grid' ? (
                <div key={file._id} className="file-card">
                  <div className="file-icon-large">
                    <IconComponent size={32} />
                  </div>
                  <div className="file-info">
                    <h4 className="file-name" title={file.originalName}>
                      {file.originalName}
                    </h4>
                    <p className="file-meta">
                      {formatFileSize(file.size)}
                    </p>
                    <p className="file-date">
                      {formatDate(file.createdAt)}
                    </p>
                  </div>
                  <div className="file-actions">
                    <button
                      className="action-btn download"
                      onClick={() => handleDownload(file._id, file.originalName)}
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(file._id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div key={file._id} className="file-row">
                  <div className="file-icon">
                    <IconComponent size={20} />
                  </div>
                  <div className="file-details">
                    <h4 className="file-name">{file.originalName}</h4>
                    <p className="file-meta">
                      {formatFileSize(file.size)} • {formatDate(file.createdAt)}
                    </p>
                  </div>
                  <div className="file-actions">
                    <button
                      className="action-btn download"
                      onClick={() => handleDownload(file._id, file.originalName)}
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(file._id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-outline"
                disabled={!pagination.hasPrev}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                className="btn btn-outline"
                disabled={!pagination.hasNext}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Files;
