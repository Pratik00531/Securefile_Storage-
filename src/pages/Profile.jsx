import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone, 
  Briefcase,
  Camera,
  Save,
  Edit
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    company: 'Tech Corp',
    bio: 'Software developer with a passion for creating secure and efficient applications.',
    joinDate: '2024-01-15'
  });
  const [avatar, setAvatar] = useState('/api/placeholder/150/150');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
    
    // Show success message
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.innerHTML = '<span>Profile updated successfully!</span>';
    document.querySelector('.page-container').insertBefore(alert, document.querySelector('.page-header').nextSibling);
    setTimeout(() => alert.remove(), 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage your personal information and preferences</p>
      </div>

      <div className="grid grid-cols-3">
        {/* Profile Overview */}
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
              <img 
                src={avatar} 
                alt="Profile" 
                className="profile-avatar"
                style={{ width: '120px', height: '120px' }}
              />
              <label 
                htmlFor="avatar-upload" 
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  background: '#3b82f6',
                  color: 'white',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '2px solid white'
                }}
              >
                <Camera size={16} />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>
            
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p style={{ color: '#64748b', margin: '0 0 1rem 0' }}>
              @{profileData.username}
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Calendar size={16} style={{ color: '#64748b' }} />
              <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Joined {formatDate(profileData.joinDate)}
              </span>
            </div>

            <button 
              className={`btn ${isEditing ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              style={{ width: '100%' }}
            >
              {isEditing ? (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit size={16} />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Personal Information</h3>
              <p className="card-subtitle">Update your personal details and contact information</p>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-2">
                <div className="form-group">
                  <label className="form-label">
                    <User size={16} style={{ marginRight: '0.5rem' }} />
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Mail size={16} style={{ marginRight: '0.5rem' }} />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Phone size={16} style={{ marginRight: '0.5rem' }} />
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <MapPin size={16} style={{ marginRight: '0.5rem' }} />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Briefcase size={16} style={{ marginRight: '0.5rem' }} />
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={profileData.company}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="4"
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <div className="card-header">
              <h3 className="card-title">Account Statistics</h3>
              <p className="card-subtitle">Your activity and usage overview</p>
            </div>
            <div className="card-body">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon blue">
                    <User size={20} />
                  </div>
                  <div className="stat-content">
                    <h3>156</h3>
                    <p>Days Active</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon green">
                    <Briefcase size={20} />
                  </div>
                  <div className="stat-content">
                    <h3>24</h3>
                    <p>Files Uploaded</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon yellow">
                    <Calendar size={20} />
                  </div>
                  <div className="stat-content">
                    <h3>89%</h3>
                    <p>Profile Complete</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;