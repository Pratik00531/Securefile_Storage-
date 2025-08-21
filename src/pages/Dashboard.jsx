import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fileAPI } from '../services/api';
import { 
  Files, 
  Upload, 
  Download, 
  Shield, 
  Activity,
  TrendingUp,
  Users,
  HardDrive,
  Calendar,
  FileText,
  Trash2,
  BarChart3,
  CheckCircle,
  X
} from 'lucide-react';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    uploadsThisMonth: 0,
    storageUsed: 0
  });

  useEffect(() => {
    fetchFiles();
    // Remove initializeCharts() from here - we'll call it after data loads
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fileAPI.getMyFiles();
      // API returns { files: [], pagination: {} }
      const fileList = response.data.files || [];
      setFiles(fileList);
      calculateStats(fileList);
      // Initialize charts after data is loaded
      setTimeout(() => initializeCharts(fileList), 100);
    } catch (error) {
      console.error('Failed to fetch files:', error);
      setFiles([]); // Set empty array on error
      // Initialize empty charts even on error
      setTimeout(() => initializeCharts([]), 100);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (fileList) => {
    // Ensure fileList is an array
    if (!Array.isArray(fileList)) {
      console.warn('fileList is not an array:', fileList);
      fileList = [];
    }

    const totalSize = fileList.reduce((sum, file) => sum + (file.size || 0), 0);
    const currentMonth = new Date().getMonth();
    const uploadsThisMonth = fileList.filter(file => 
      new Date(file.createdAt).getMonth() === currentMonth
    ).length;

    setStats({
      totalFiles: fileList.length,
      totalSize,
      uploadsThisMonth,
      storageUsed: (totalSize / (1024 * 1024 * 1024)) * 100 // Percentage of 1GB
    });
  };

  const initializeCharts = (fileList = []) => {
    try {
      // Destroy existing charts if they exist and have destroy method
      if (window.storageChart && typeof window.storageChart.destroy === 'function') {
        window.storageChart.destroy();
      }
      if (window.activityChart && typeof window.activityChart.destroy === 'function') {
        window.activityChart.destroy();
      }

      // Calculate real storage data
      const totalSize = fileList.reduce((sum, file) => sum + (file.size || 0), 0);
      const totalSizeGB = totalSize / (1024 * 1024 * 1024);
      const maxStorageGB = 1; // 1GB limit for demo
      const usedPercentage = Math.min((totalSizeGB / maxStorageGB) * 100, 100);
      const availablePercentage = 100 - usedPercentage;

      // Storage Usage Chart with real data
      const storageCtx = document.getElementById('storageChart');
      if (storageCtx) {
      window.storageChart = new Chart(storageCtx, {
        type: 'doughnut',
        data: {
          labels: ['Used', 'Available'],
          datasets: [{
            data: [usedPercentage, availablePercentage],
            backgroundColor: ['#3b82f6', '#e2e8f0'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const percentage = context.parsed.toFixed(1);
                  const sizeGB = context.dataIndex === 0 ? 
                    totalSizeGB.toFixed(2) : 
                    (maxStorageGB - totalSizeGB).toFixed(2);
                  return `${label}: ${percentage}% (${sizeGB} GB)`;
                }
              }
            }
          }
        }
      });
    }

    // Calculate upload activity by month (last 6 months)
    const now = new Date();
    const monthlyData = [];
    const monthLabels = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      monthLabels.push(monthName);
      
      const filesInMonth = fileList.filter(file => {
        const fileDate = new Date(file.createdAt);
        return fileDate.getMonth() === date.getMonth() && 
               fileDate.getFullYear() === date.getFullYear();
      }).length;
      
      monthlyData.push(filesInMonth);
    }

    // Upload Activity Chart with real data
    const activityCtx = document.getElementById('activityChart');
    if (activityCtx) {
      window.activityChart = new Chart(activityCtx, {
        type: 'line',
        data: {
          labels: monthLabels,
          datasets: [{
            label: 'Files Uploaded',
            data: monthlyData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Files: ${context.parsed.y}`;
                }
              }
            }
          }
        }
      });
    }
    } catch (error) {
      console.error('Error initializing charts:', error);
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      await fileAPI.upload(formData);
      
      // Show success popup
      setUploadedFileName(file.name);
      setShowSuccessPopup(true);
      
      // Auto-hide popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
      
      fetchFiles(); // Refresh the files list
      event.target.value = ''; // Reset the file input
    } catch (error) {
      console.error('File upload failed:', error);
      alert('File upload failed. Please try again.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'upload':
        document.getElementById('fileInput').click();
        break;
      case 'viewFiles':
        navigate('/files');
        break;
      case 'security':
        console.log('Security scan');
        break;
      case 'reports':
        console.log('View reports');
        break;
      default:
        break;
    }
  };

  const recentActivities = [
    { icon: Upload, text: 'Uploaded document.pdf', time: '2 hours ago', color: 'blue' },
    { icon: Download, text: 'Downloaded report.xlsx', time: '4 hours ago', color: 'green' },
    { icon: Trash2, text: 'Deleted old-file.txt', time: '1 day ago', color: 'red' },
    { icon: Shield, text: 'Security scan completed', time: '2 days ago', color: 'yellow' }
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
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
      
      {/* Hidden file input for upload */}
      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
        multiple
      />
      
      {/* Left Sidebar - Quick Actions */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h3>Quick Actions</h3>
          <p>Common tasks and shortcuts</p>
        </div>
        
        <div className="sidebar-actions">
          <button 
            className="sidebar-btn sidebar-btn-primary"
            onClick={() => handleQuickAction('upload')}
            disabled={uploadingFile}
          >
            <Upload size={20} />
            <span>{uploadingFile ? 'Uploading...' : 'Upload File'}</span>
          </button>
          
          <button 
            className="sidebar-btn sidebar-btn-outline"
            onClick={() => handleQuickAction('viewFiles')}
          >
            <Files size={20} />
            <span>View All Files</span>
          </button>
          
          <button 
            className="sidebar-btn sidebar-btn-outline"
            onClick={() => handleQuickAction('security')}
          >
            <Shield size={20} />
            <span>Security Scan</span>
          </button>
          
          <button 
            className="sidebar-btn sidebar-btn-outline"
            onClick={() => handleQuickAction('reports')}
          >
            <BarChart3 size={20} />
            <span>View Reports</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="page-container">
          <div className="page-header">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome back, {user?.username}!</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">
                <Files size={24} />
              </div>
              <div className="stat-content">
                <h3>{stats.totalFiles}</h3>
                <p>Total Files</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <HardDrive size={24} />
              </div>
              <div className="stat-content">
                <h3>{formatFileSize(stats.totalSize)}</h3>
                <p>Storage Used</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon yellow">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <h3>{stats.uploadsThisMonth}</h3>
                <p>Uploads This Month</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon red">
                <Shield size={24} />
              </div>
              <div className="stat-content">
                <h3>100%</h3>
                <p>Security Score</p>
              </div>
            </div>
          </div>

          {/* Charts and Activity */}
          <div className="grid grid-cols-2">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Storage Usage</h3>
                <p className="card-subtitle">Current storage utilization</p>
              </div>
              <div className="card-body">
                <div className="chart-container">
                  <canvas id="storageChart"></canvas>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Upload Activity</h3>
                <p className="card-subtitle">Files uploaded over time</p>
              </div>
              <div className="card-body">
                <div className="chart-container">
                  <canvas id="activityChart"></canvas>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity and Files */}
          <div className="grid grid-cols-2">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Activity</h3>
                <p className="card-subtitle">Latest actions in your account</p>
              </div>
              <div className="card-body">
                <ul className="activity-list">
                  {recentActivities.map((activity, index) => (
                    <li key={index} className="activity-item">
                      <div className={`activity-icon ${activity.color}`}>
                        <activity.icon size={16} />
                      </div>
                      <div className="activity-content">
                        <h4>{activity.text}</h4>
                        <p>{activity.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Files</h3>
                <p className="card-subtitle">Your latest uploads</p>
              </div>
              <div className="card-body">
                {(files && files.length > 0) ? (
                  <ul className="activity-list">
                    {files.slice(0, 4).map((file) => (
                      <li key={file._id} className="activity-item">
                        <div className="activity-icon blue">
                          <FileText size={16} />
                        </div>
                        <div className="activity-content">
                          <h4>{file.originalName}</h4>
                          <p>{formatFileSize(file.size)} • {formatDate(file.createdAt)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>No files uploaded yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;