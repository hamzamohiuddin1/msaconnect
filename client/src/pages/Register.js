import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import '../styles/Auth.css';
import logo from '../assets/ilmpluslogo.png';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    major: '',
    year: '',
    gender: '',
    genderPreference: false
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { register, loading } = useAuth();
  const navigate = useNavigate();

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
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.endsWith('@ucsd.edu')) {
      newErrors.email = 'Email must be a UCSD email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.major.trim()) newErrors.major = 'Major is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await register({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      phoneNumber: formData.phoneNumber.trim(),
      major: formData.major.trim(),
      year: formData.year,
      gender: formData.gender,
      genderPreference: formData.genderPreference
    });

    if (result.success) {
      setShowSuccess(true);
      toast.success('Registration successful! Please check your email to confirm your account.');
    } else {
      toast.error(result.error);
    }
  };

  if (showSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-card">
            <div className="auth-form">
              <div className="success-container">
                <div className="success-icon">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2>Check Your Email!</h2>
                <p>
                  We've sent a confirmation email to <strong>{formData.email}</strong>. 
                  Please click the link in the email to verify your account.
                </p>
                <div className="success-actions">
                  <Link to="/login" className="success-button-primary">
                    Go to Login
                  </Link>
                  <button
                    onClick={() => setShowSuccess(false)}
                    className="success-button-secondary"
                  >
                    Back to Registration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <img src={logo} alt="ILM+ Logo" />
            </div>
            <div className="auth-logo-text">
              <h1>ILM+</h1>
              <p>Connecting Students in the Pursuit of Knowledge</p>
            </div>
          </div>
          <h2>Create Your Account</h2>
          <p>Join the ILM+ community at UCSD</p>
        </div>

        <div className="auth-card">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group full-width">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group full-width">
              <label className="form-label">UCSD Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="yourname@ucsd.edu"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Password"
                />
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm"
                />
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                placeholder="(123) 456-7890"
              />
              {errors.phoneNumber && <span className="form-error">{errors.phoneNumber}</span>}
            </div>

            <div className="form-group full-width">
              <label className="form-label">Major</label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                className={`form-input ${errors.major ? 'error' : ''}`}
                placeholder="e.g. Computer Science"
              />
              {errors.major && <span className="form-error">{errors.major}</span>}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Year</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={`form-select ${errors.year ? 'error' : ''}`}
                >
                  <option value="">Select Year</option>
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Graduate">Graduate</option>
                </select>
                {errors.year && <span className="form-error">{errors.year}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`form-select ${errors.gender ? 'error' : ''}`}
                >
                  <option value="">Select Gender</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                </select>
                {errors.gender && <span className="form-error">{errors.gender}</span>}
              </div>
            </div>

            {formData.gender && (
              <div className="form-group full-width">
                <div className="privacy-preference">
                  <input
                    type="checkbox"
                    id="genderPreference"
                    name="genderPreference"
                    checked={formData.genderPreference}
                    onChange={handleChange}
                    className="privacy-checkbox"
                  />
                  <label htmlFor="genderPreference" className="privacy-label">
                    <span className="privacy-title">Connect with {formData.gender === 'Brother' ? 'Brothers' : 'Sisters'} only. </span>
                    <span className="privacy-description">
                      When enabled, you'll only see and be visible to {formData.gender === 'Brother' ? 'brothers' : 'sisters'} when searching for classmates. 
                      You can change this preference anytime in your profile settings.
                    </span>
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="auth-button"
            >
              {loading ? (
                <>
                  <div className="auth-loading"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
