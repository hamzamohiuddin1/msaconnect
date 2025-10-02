import React from 'react';
import { X, User, Mail, Phone, Copy, BookOpen, GraduationCap, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import '../styles/ContactModal.css';

const ContactModal = ({ isOpen, onClose, classmate, classInfo }) => {
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard!`);
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success(`${type} copied to clipboard!`);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="contact-modal-overlay" onClick={handleOverlayClick}>
      <div className="contact-modal">
        <div className="contact-modal-header">
          <h3>Contact Information</h3>
          <button onClick={onClose} className="contact-modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="contact-modal-body">
          {/* Profile Header */}
          <div className="contact-profile-section">
            <div className="contact-profile-avatar">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <h4 className="contact-profile-name">{classmate.name}</h4>
            <p className="contact-profile-meta">
              {classmate.gender} • {classmate.year}
            </p>
          </div>

          {/* Class Info */}
          <div className="contact-class-info">
            <div className="contact-class-info-header">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="contact-class-info-title">Shared Class</span>
            </div>
            <p className="contact-class-info-details">
              {classInfo.courseId} - Section {classmate.sectionCode}
            </p>
          </div>

          {/* Contact Details */}
          <div className="contact-details-section">
            <h5 className="contact-details-title">
              <Mail className="w-4 h-4" />
              Contact Details
            </h5>

            {/* Email */}
            <div className="contact-detail-item">
              <div className="contact-detail-content">
                <Mail className="w-4 h-4 contact-detail-icon" />
                <div className="contact-detail-info">
                  <p className="contact-detail-label">Email</p>
                  <p className="contact-detail-value">{classmate.email}</p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(classmate.email, 'Email')}
                className="contact-copy-btn"
                title="Copy email"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {/* Phone */}
            <div className="contact-detail-item">
              <div className="contact-detail-content">
                <Phone className="w-4 h-4 contact-detail-icon" />
                <div className="contact-detail-info">
                  <p className="contact-detail-label">Phone</p>
                  <p className="contact-detail-value">{classmate.phoneNumber}</p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(classmate.phoneNumber, 'Phone number')}
                className="contact-copy-btn"
                title="Copy phone number"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {/* Major */}
            <div className="contact-detail-item">
              <div className="contact-detail-content">
                <GraduationCap className="w-4 h-4 contact-detail-icon" />
                <div className="contact-detail-info">
                  <p className="contact-detail-label">Major</p>
                  <p className="contact-detail-value">{classmate.major}</p>
                </div>
              </div>
            </div>

            {/* Year */}
            <div className="contact-detail-item">
              <div className="contact-detail-content">
                <Calendar className="w-4 h-4 contact-detail-icon" />
                <div className="contact-detail-info">
                  <p className="contact-detail-label">Academic Year</p>
                  <p className="contact-detail-value">{classmate.year}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reminder */}
          <div className="contact-reminder">
            <p>
              <strong>Remember:</strong> Be respectful when reaching out. Introduce yourself 
              and mention you found them through ILM+ for your shared class.
            </p>
          </div>
        </div>

        <div className="contact-modal-footer">
          <button onClick={onClose} className="contact-close-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
