import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  Trash2
} from 'lucide-react';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    uploadsThisMonth: 0,
    storageUsed: 0
  });

  useEffect(() => {
    fetchFiles();
    initializeCharts();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fileAPI.getMyFiles();
      setFiles(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (fileList) => {
    const totalSize = fileList.reduce((sum, file) => sum + file.size, 0);
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

  const initializeCharts = () => {
    // Storage Usage Chart
    const storageCtx = document.getElementById('storageChart');
    if (storageCtx) {
      new Chart(storageCtx, {
        type: 'doughnut',
        data: {
          labels: ['Used', 'Available'],
          datasets: [{
            data: [25, 75],
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
            }
          }
        }
      });
    }

    // Upload Activity Chart
    const activityCtx = document.getElementById('activityChart');
    if (activityCtx) {
      new Chart(activityCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Files Uploaded',
            data: [12, 19, 8, 15, 22, 18],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
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
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user.username}!</p>
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
            {files.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>No files uploaded yet</p>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
          <p className="card-subtitle">Common tasks and shortcuts</p>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-4">
            <button className="btn btn-primary">
              <Upload size={16} />
              Upload File
            </button>
            <button className="btn btn-outline">
              <Files size={16} />
              View All Files
            </button>
            <button className="btn btn-outline">
              <Shield size={16} />
              Security Scan
            </button>
            <button className="btn btn-outline">
              <Activity size={16} />
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;