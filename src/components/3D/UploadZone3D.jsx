import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle, File } from 'lucide-react';
import { fileAPI } from '../../services/api';
import NeonButton from './NeonButton';

const UploadZone3D = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setMessage('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
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
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
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
    <motion.div
      className="upload-zone-3d"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(255, 0, 255, 0.1) 100%)',
        backdropFilter: 'blur(10px)',
        border: `2px dashed ${dragOver ? '#00ffff' : 'rgba(0, 255, 255, 0.3)'}`,
        borderRadius: '15px',
        padding: '30px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Animated background */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, transparent 30%, rgba(0, 255, 255, 0.1) 50%, transparent 70%)',
          zIndex: 0
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          animate={{ 
            y: dragOver ? -10 : 0,
            scale: dragOver ? 1.1 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          <Upload 
            size={48} 
            style={{ 
              color: '#00ffff', 
              marginBottom: '20px',
              filter: 'drop-shadow(0 0 10px #00ffff)'
            }} 
          />
        </motion.div>

        <h4 style={{ 
          color: '#ffffff', 
          marginBottom: '10px',
          textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
        }}>
          {dragOver ? 'Drop file here' : 'Upload Secure File'}
        </h4>
        
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.7)', 
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          Drag and drop a file here, or click to select
        </p>

        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => handleFileSelect(e.target.files[0])}
          style={{ display: 'none' }}
          disabled={uploading}
        />

        <NeonButton
          variant="primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{ marginBottom: '20px' }}
        >
          Select File
        </NeonButton>

        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(0, 255, 255, 0.1)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              borderRadius: '10px',
              padding: '15px',
              margin: '20px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <File size={20} style={{ color: '#00ffff', marginRight: '10px' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: '#ffffff', fontWeight: 'bold' }}>
                {file.name}
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                {formatFileSize(file.size)}
              </div>
            </div>
          </motion.div>
        )}

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: messageType === 'success' 
                ? 'rgba(0, 255, 0, 0.1)' 
                : 'rgba(255, 0, 64, 0.1)',
              border: `1px solid ${messageType === 'success' ? '#00ff00' : '#ff0040'}`,
              borderRadius: '10px',
              padding: '15px',
              margin: '20px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: messageType === 'success' ? '#00ff00' : '#ff0040'
            }}
          >
            {messageType === 'success' ? (
              <CheckCircle size={20} style={{ marginRight: '10px' }} />
            ) : (
              <AlertCircle size={20} style={{ marginRight: '10px' }} />
            )}
            {message}
          </motion.div>
        )}

        {file && (
          <NeonButton
            variant="success"
            onClick={handleUpload}
            disabled={uploading}
            loading={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </NeonButton>
        )}

        <div style={{ 
          marginTop: '20px', 
          fontSize: '12px', 
          color: 'rgba(255, 255, 255, 0.5)' 
        }}>
          <AlertCircle size={14} style={{ marginRight: '5px' }} />
          Files are encrypted with AES-256 for maximum security
        </div>
      </div>
    </motion.div>
  );
};

export default UploadZone3D;