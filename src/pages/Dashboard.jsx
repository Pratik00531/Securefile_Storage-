import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { fileAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Files, Shield, Upload, Database, Lock, Zap } from 'lucide-react';
import Scene3D from '../components/3D/Scene3D';
import HolographicCard from '../components/3D/HolographicCard';
import UploadZone3D from '../components/3D/UploadZone3D';
import FileCard3D from '../components/3D/FileCard3D';

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

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await fileAPI.download(fileId);
      
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
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      await fileAPI.delete(fileId);
      handleFileDelete(fileId);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete file');
    }
  };

  const getTotalSize = () => {
    return files.reduce((total, file) => total + file.size, 0);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Scene3D>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh' 
        }}>
          <LoadingSpinner />
        </div>
      </Scene3D>
    );
  }

  return (
    <Scene3D>
      <div className="container-3d" style={{ paddingTop: '20px' }}>
        {/* Header */}
        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="dashboard-title">
            <Shield size={48} style={{ marginRight: '15px' }} />
            SECURE VAULT
          </h1>
          <p className="dashboard-subtitle">
            Welcome back, <span style={{ color: '#00ffff' }}>{user.username}</span>
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="stats-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="stat-card">
            <Files size={32} style={{ color: '#00ffff', marginBottom: '10px' }} />
            <div className="stat-number">{files.length}</div>
            <div className="stat-label">Files Stored</div>
          </div>
          <div className="stat-card">
            <Database size={32} style={{ color: '#ff00ff', marginBottom: '10px' }} />
            <div className="stat-number">{formatFileSize(getTotalSize())}</div>
            <div className="stat-label">Total Size</div>
          </div>
          <div className="stat-card">
            <Lock size={32} style={{ color: '#00ff00', marginBottom: '10px' }} />
            <div className="stat-number">AES-256</div>
            <div className="stat-label">Encryption</div>
          </div>
          <div className="stat-card">
            <Zap size={32} style={{ color: '#ffff00', marginBottom: '10px' }} />
            <div className="stat-number">Active</div>
            <div className="stat-label">Status</div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="alert-3d"
            style={{ maxWidth: '600px', margin: '0 auto 20px' }}
          >
            {error}
          </motion.div>
        )}

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{ maxWidth: '600px', margin: '0 auto 40px' }}
        >
          <HolographicCard>
            <UploadZone3D onUpload={handleFileUpload} />
          </HolographicCard>
        </motion.div>

        {/* Files Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {files.length === 0 ? (
            <HolographicCard style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <Files size={64} style={{ 
                color: 'rgba(0, 255, 255, 0.5)', 
                marginBottom: '20px' 
              }} />
              <h3 style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                marginBottom: '10px' 
              }}>
                Vault is Empty
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Upload your first file to secure it in the vault
              </p>
            </HolographicCard>
          ) : (
            <div className="file-grid">
              {files.map((file, index) => (
                <motion.div
                  key={file._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                >
                  <FileCard3D
                    file={file}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Scene3D>
  );
};

export default Dashboard;