import React, { useState } from 'react';
import { fileAPI } from '../services/api';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first');
      setMessageType('error');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fileAPI.upload(formData);
      
      setMessage('File uploaded successfully!');
      setMessageType('success');
      setFile(null);
      
      // Reset file input
      document.getElementById('fileInput').value = '';
      
      // Notify parent component
      onUpload(response.data.file);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Upload failed');
      setMessageType('error');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="upload-container">
      <div className="mb-3">
        <label htmlFor="fileInput" className="form-label">
          Select File to Upload
        </label>
        <input
          type="file"
          className="form-control"
          id="fileInput"
          onChange={handleFileSelect}
          disabled={uploading}
        />
      </div>

      {file && (
        <div className="alert alert-info">
          <strong>Selected File:</strong> {file.name} ({formatFileSize(file.size)})
        </div>
      )}

      {message && (
        <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {messageType === 'success' ? (
            <CheckCircle className="me-2" size={16} />
          ) : (
            <AlertCircle className="me-2" size={16} />
          )}
          {message}
        </div>
      )}

      <button
        type="button"
        className="btn btn-primary"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="me-2" size={16} />
            Upload File
          </>
        )}
      </button>

      <div className="mt-3">
        <small className="text-muted">
          <AlertCircle className="me-1" size={14} />
          Files are encrypted with AES-256 encryption for maximum security
        </small>
      </div>
    </div>
  );
};

export default FileUpload;