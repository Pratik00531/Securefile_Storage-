import React, { useState } from 'react';
import { 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Lock, 
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Key,
  Trash2,
  Download
} from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    securityAlerts: true,
    marketingEmails: false,
    
    // Privacy Settings
    profileVisibility: 'private',
    dataSharing: false,
    analyticsTracking: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
    
    // Appearance Settings
    theme: 'light',
    language: 'en',
    timezone: 'UTC-8'
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Handle password change logic here
    console.log('Changing password...');
    setShowPasswordForm(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const exportData = () => {
    // Handle data export
    console.log('Exporting user data...');
    alert('Data export initiated. You will receive an email when ready.');
  };

  const deleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account...');
      alert('Account deletion initiated. You will receive a confirmation email.');
    }
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-slider"></span>
    </label>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account preferences and security settings</p>
      </div>

      <div className="grid grid-cols-1">
        {/* Notification Settings */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Bell size={20} style={{ marginRight: '0.5rem' }} />
              Notifications
            </h3>
            <p className="card-subtitle">Configure how you receive notifications</p>
          </div>
          <div className="card-body">
            <div className="settings-section">
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Email Notifications</h4>
                  <p>Receive notifications via email</p>
                </div>
                <ToggleSwitch
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                />
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Push Notifications</h4>
                  <p>Receive push notifications on your devices</p>
                </div>
                <ToggleSwitch
                  checked={settings.pushNotifications}
                  onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                />
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Security Alerts</h4>
                  <p>Get notified about security-related activities</p>
                </div>
                <ToggleSwitch
                  checked={settings.securityAlerts}
                  onChange={(e) => handleSettingChange('securityAlerts', e.target.checked)}
                />
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Marketing Emails</h4>
                  <p>Receive promotional and marketing emails</p>
                </div>
                <ToggleSwitch
                  checked={settings.marketingEmails}
                  onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Shield size={20} style={{ marginRight: '0.5rem' }} />
              Security
            </h3>
            <p className="card-subtitle">Manage your account security and privacy</p>
          </div>
          <div className="card-body">
            <div className="settings-section">
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <ToggleSwitch
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                />
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Session Timeout</h4>
                  <p>Automatically log out after inactivity</p>
                </div>
                <select
                  className="form-select"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                  style={{ width: '150px' }}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="240">4 hours</option>
                </select>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Password</h4>
                  <p>Change your account password</p>
                </div>
                <button 
                  className="btn btn-outline"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                >
                  <Key size={16} />
                  Change Password
                </button>
              </div>

              {showPasswordForm && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="submit" className="btn btn-primary">
                        Update Password
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => setShowPasswordForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Palette size={20} style={{ marginRight: '0.5rem' }} />
              Appearance
            </h3>
            <p className="card-subtitle">Customize the look and feel of your dashboard</p>
          </div>
          <div className="card-body">
            <div className="settings-section">
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Theme</h4>
                  <p>Choose your preferred color scheme</p>
                </div>
                <select
                  className="form-select"
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  style={{ width: '150px' }}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Language</h4>
                  <p>Select your preferred language</p>
                </div>
                <select
                  className="form-select"
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  style={{ width: '150px' }}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Timezone</h4>
                  <p>Set your local timezone</p>
                </div>
                <select
                  className="form-select"
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  style={{ width: '200px' }}
                >
                  <option value="UTC-8">Pacific Time (UTC-8)</option>
                  <option value="UTC-5">Eastern Time (UTC-5)</option>
                  <option value="UTC+0">Greenwich Mean Time (UTC+0)</option>
                  <option value="UTC+1">Central European Time (UTC+1)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Lock size={20} style={{ marginRight: '0.5rem' }} />
              Privacy
            </h3>
            <p className="card-subtitle">Control your privacy and data sharing preferences</p>
          </div>
          <div className="card-body">
            <div className="settings-section">
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Profile Visibility</h4>
                  <p>Control who can see your profile information</p>
                </div>
                <select
                  className="form-select"
                  value={settings.profileVisibility}
                  onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                  style={{ width: '150px' }}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends Only</option>
                </select>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Data Sharing</h4>
                  <p>Allow sharing of anonymized usage data</p>
                </div>
                <ToggleSwitch
                  checked={settings.dataSharing}
                  onChange={(e) => handleSettingChange('dataSharing', e.target.checked)}
                />
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Analytics Tracking</h4>
                  <p>Help improve our service with usage analytics</p>
                </div>
                <ToggleSwitch
                  checked={settings.analyticsTracking}
                  onChange={(e) => handleSettingChange('analyticsTracking', e.target.checked)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Account Management */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Trash2 size={20} style={{ marginRight: '0.5rem' }} />
              Account Management
            </h3>
            <p className="card-subtitle">Export your data or delete your account</p>
          </div>
          <div className="card-body">
            <div className="settings-section">
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Export Data</h4>
                  <p>Download a copy of all your data</p>
                </div>
                <button className="btn btn-outline" onClick={exportData}>
                  <Download size={16} />
                  Export Data
                </button>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Delete Account</h4>
                  <p>Permanently delete your account and all data</p>
                </div>
                <button className="btn btn-danger" onClick={deleteAccount}>
                  <Trash2 size={16} />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;