import React, { useState } from 'react';
import { fileAPI } from '../services/api';
import { Download, Trash2, File, Calendar, HardDrive } from 'lucide-react';

const FileList = ({ files, onDelete, onRefresh }) => {
  const [downloading, setDownloading] = useState({});
  const [deleting, setDeleting] = useState({});

  const handleDownload = async (fileId, fileName) => {
    setDownloading({ ...downloading, [fileId]: true });
    
    try {
      const response = await fileAPI.download(fileId);
      
      // Create blob and download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file');
    } finally {
      setDownloading({ ...downloading, [fileId]: false });
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    setDeleting({ ...deleting, [fileId]: true });
    
    try {
      await fileAPI.delete(fileId);
      onDelete(fileId);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete file');
    } finally {
      setDeleting({ ...deleting, [fileId]: false });
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

  if (files.length === 0) {
    return (
      <div className="text-center py-5">
        <File size={48} className="text-muted mb-3" />
        <h5>No files uploaded yet</h5>
        <p className="text-muted">Upload your first file to get started</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Size</th>
            <th>Upload Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file._id}>
              <td>
                <div className="d-flex align-items-center">
                  <File className="me-2 text-primary" size={16} />
                  <span>{file.originalName}</span>
                </div>
              </td>
              <td>
                <small className="text-muted">
                  <HardDrive className="me-1" size={14} />
                  {formatFileSize(file.size)}
                </small>
              </td>
              <td>
                <small className="text-muted">
                  <Calendar className="me-1" size={14} />
                  {formatDate(file.createdAt)}
                </small>
              </td>
              <td>
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleDownload(file._id, file.originalName)}
                    disabled={downloading[file._id]}
                  >
                    {downloading[file._id] ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download size={14} className="me-1" />
                        Download
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(file._id)}
                    disabled={deleting[file._id]}
                  >
                    {deleting[file._id] ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={14} className="me-1" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;