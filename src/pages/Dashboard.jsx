import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fileAPI } from '../services/api';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import LoadingSpinner from '../components/LoadingSpinner';
import { Files, Shield, Upload } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fileAPI.getMyFiles();
      setFiles(response.data);
    } catch (error) {
      setError('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (newFile) => {
    setFiles([newFile, ...files]);
  };

  const handleFileDelete = (fileId) => {
    setFiles(files.filter(file => file._id !== fileId));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3">
                <Shield className="me-2" />
                Secure File Storage
              </h1>
              <p className="text-muted">Welcome back, {user.username}!</p>
            </div>
            <div className="text-end">
              <small className="text-muted">
                <Files className="me-1" size={16} />
                {files.length} files stored
              </small>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="row">
            <div className="col-md-12 mb-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <Upload className="me-2" size={20} />
                    Upload New File
                  </h5>
                </div>
                <div className="card-body">
                  <FileUpload onUpload={handleFileUpload} />
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <Files className="me-2" size={20} />
                    My Files
                  </h5>
                </div>
                <div className="card-body">
                  <FileList 
                    files={files} 
                    onDelete={handleFileDelete}
                    onRefresh={fetchFiles}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;