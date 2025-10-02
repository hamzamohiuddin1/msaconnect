import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, GraduationCap, Calendar, Users, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import '../styles/Profile.css';
import mtcLogo from '../assets/mtcatucsd.jpg'; // Added import for MTC logo

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    major: user?.major || '',
    year: user?.year || '',
    gender: user?.gender || '',
    genderPreference: user?.genderPreference || false
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.major.trim()) newErrors.major = 'Major is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setFormData({
      name: user?.name || '',
      phoneNumber: user?.phoneNumber || '',
      major: user?.major || '',
      year: user?.year || '',
      gender: user?.gender || '',
      genderPreference: user?.genderPreference || false
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phoneNumber: user?.phoneNumber || '',
      major: user?.major || '',
      year: user?.year || '',
      gender: user?.gender || '',
      genderPreference: user?.genderPreference || false
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      // In a real app, you'd make an API call here to update the user
      updateUser(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-spinner"></div>
        <p className="profile-loading-text">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <h1>{user.name}</h1>
        <p>{user.major} • {user.year}</p>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-card-header">
          <h2 className="profile-card-title">Profile Information</h2>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="edit-button"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button
                onClick={handleCancel}
                className="cancel-button"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="save-button"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="profile-card-body">
          <div className="profile-fields">
            {/* Name */}
            <div className="profile-field">
              <div className="field-icon user">
                <User className="w-5 h-5" />
              </div>
              <div className="field-content">
                <label className="field-label">Full Name</label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`field-input ${errors.name ? 'error' : ''}`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </div>
                ) : (
                  <p className="field-value">{user.name}</p>
                )}
              </div>
            </div>

            {/* Email (read-only) */}
            <div className="profile-field">
              <div className="field-icon mail">
                <Mail className="w-5 h-5" />
              </div>
              <div className="field-content">
                <label className="field-label">Email Address</label>
                <p className="field-value">{user.email}</p>
                <p className="field-note">Email cannot be changed. Contact support if needed.</p>
              </div>
            </div>

            {/* Phone */}
            <div className="profile-field">
              <div className="field-icon phone">
                <Phone className="w-5 h-5" />
              </div>
              <div className="field-content">
                <label className="field-label">Phone Number</label>
                {isEditing ? (
                  <div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`field-input ${errors.phoneNumber ? 'error' : ''}`}
                      placeholder="(123) 456-7890"
                    />
                    {errors.phoneNumber && <span className="field-error">{errors.phoneNumber}</span>}
                  </div>
                ) : (
                  <p className="field-value">{user.phoneNumber}</p>
                )}
              </div>
            </div>

            {/* Major */}
            <div className="profile-field">
              <div className="field-icon graduation">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="field-content">
                <label className="field-label">Major</label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      name="major"
                      value={formData.major}
                      onChange={handleChange}
                      className={`field-input ${errors.major ? 'error' : ''}`}
                      placeholder="e.g. Computer Science"
                    />
                    {errors.major && <span className="field-error">{errors.major}</span>}
                  </div>
                ) : (
                  <p className="field-value">{user.major}</p>
                )}
              </div>
            </div>

            {/* Year */}
            <div className="profile-field">
              <div className="field-icon calendar">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="field-content">
                <label className="field-label">Academic Year</label>
                {isEditing ? (
                  <div>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className={`field-select ${errors.year ? 'error' : ''}`}
                    >
                      <option value="">Select Year</option>
                      <option value="Freshman">Freshman</option>
                      <option value="Sophomore">Sophomore</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                      <option value="Graduate">Graduate</option>
                    </select>
                    {errors.year && <span className="field-error">{errors.year}</span>}
                  </div>
                ) : (
                  <p className="field-value">{user.year}</p>
                )}
              </div>
            </div>

            {/* Gender */}
            <div className="profile-field">
              <div className="field-icon users">
                <Users className="w-5 h-5" />
              </div>
              <div className="field-content">
                <label className="field-label">Gender</label>
                {isEditing ? (
                  <div>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`field-select ${errors.gender ? 'error' : ''}`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                    </select>
                    {errors.gender && <span className="field-error">{errors.gender}</span>}
                  </div>
                ) : (
                  <p className="field-value">{user.gender}</p>
                )}
              </div>
            </div>
          </div>

          {/* Privacy Preference Section */}
          <div className="profile-section">
            <h3 className="profile-section-title">Privacy Preferences</h3>
            <div className="privacy-setting">
              <div className="privacy-setting-header">
                <div>
                  <h4 className="privacy-setting-title">{user?.gender === 'Brother' ? 'Brothers' : 'Sisters'} Only</h4>
                  <p className="privacy-setting-description">
                    When enabled, you'll only see and be visible to {user?.gender === 'Brother' ? 'brothers' : 'sisters'} when searching for classmates.
                  </p>
                </div>
                {isEditing ? (
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="genderPreference"
                      checked={formData.genderPreference}
                      onChange={handleChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                ) : (
                  <div className={`preference-badge ${user?.genderPreference ? 'active' : 'inactive'}`}>
                    {user?.genderPreference ? 'Enabled' : 'Disabled'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Classes Summary */}
      <div className="classes-summary">
        <div className="classes-summary-header">
          <h2 className="classes-summary-title">My Classes</h2>
        </div>
        <div className="classes-summary-body">
          {user.classes && user.classes.length > 0 ? (
            <div className="classes-grid">
              {user.classes.map((classItem, index) => (
                <div key={index} className="class-item">
                  <h3>{classItem.courseId}</h3>
                  <p>Section {classItem.sectionCode}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-classes">
              <p>No classes added yet. Go to the dashboard to add your classes!</p>
            </div>
          )}
        </div>
      </div>

      {/* Support Section */}
      <div className="support-section">
        <p>
          Built by the Muslim Tech Collaborative at UCSD. For support or questions, please email hmohiuddin@ucsd.edu
        </p>
        <img src={mtcLogo} alt="Muslim Tech Collaborative Logo" className="mtc-logo" />
      </div>
    </div>
  );
};

export default Profile;
