import React from 'react';
import { motion } from 'framer-motion';
import { File, Download, Trash2, Calendar, HardDrive } from 'lucide-react';
import NeonButton from './NeonButton';

const FileCard3D = ({ 
  file, 
  onDownload, 
  onDelete, 
  downloading = false, 
  deleting = false 
}) => {
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

  return (
    <motion.div
      className="file-card-3d"
      initial={{ opacity: 0, y: 20, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={{ 
        y: -5, 
        rotateX: 5,
        boxShadow: '0 10px 30px rgba(0, 255, 255, 0.3)'
      }}
      style={{
        background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(255, 0, 255, 0.1) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 255, 255, 0.3)',
        borderRadius: '15px',
        padding: '20px',
        margin: '10px',
        position: 'relative',
        overflow: 'hidden',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Animated background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, transparent 30%, rgba(0, 255, 255, 0.1) 50%, transparent 70%)',
          animation: 'holographic-sweep 4s infinite',
          zIndex: 0
        }}
      />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* File header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '15px',
          borderBottom: '1px solid rgba(0, 255, 255, 0.2)',
          paddingBottom: '10px'
        }}>
          <File 
            size={24} 
            style={{ 
              color: '#00ffff', 
              marginRight: '10px',
              filter: 'drop-shadow(0 0 5px #00ffff)'
            }} 
          />
          <h6 style={{ 
            color: '#ffffff', 
            margin: 0, 
            fontSize: '16px',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
          }}>
            {file.originalName}
          </h6>
        </div>

        {/* File details */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '8px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px'
          }}>
            <HardDrive size={14} style={{ marginRight: '8px', color: '#ff00ff' }} />
            {formatFileSize(file.size)}
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px'
          }}>
            <Calendar size={14} style={{ marginRight: '8px', color: '#00ff00' }} />
            {formatDate(file.createdAt)}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '10px',
          justifyContent: 'space-between'
        }}>
          <NeonButton
            variant="primary"
            onClick={() => onDownload(file._id, file.originalName)}
            disabled={downloading}
            loading={downloading}
            style={{ flex: 1, fontSize: '12px', padding: '8px 16px' }}
          >
            {downloading ? 'Downloading...' : (
              <>
                <Download size={14} style={{ marginRight: '5px' }} />
                Download
              </>
            )}
          </NeonButton>
          
          <NeonButton
            variant="danger"
            onClick={() => onDelete(file._id)}
            disabled={deleting}
            loading={deleting}
            style={{ fontSize: '12px', padding: '8px 16px' }}
          >
            {deleting ? 'Deleting...' : <Trash2 size={14} />}
          </NeonButton>
        </div>
      </div>
    </motion.div>
  );
};

export default FileCard3D;