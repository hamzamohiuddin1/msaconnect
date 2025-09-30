import React from 'react';
import { X, User, Mail, Phone, Copy, BookOpen, GraduationCap, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

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
    <div className="modal-overlay" onClick={handleOverlayClick} style={{ zIndex: 1100 }}>
      <div className="modal" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body space-y-6">
          {/* Profile Header */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-1">
              {classmate.name}
            </h4>
            <p className="text-sm text-gray-600">
              {classmate.gender} • {classmate.year}
            </p>
          </div>

          {/* Class Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Shared Class</span>
            </div>
            <p className="text-blue-800">
              {classInfo.courseId} - Section {classmate.sectionCode}
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h5 className="font-semibold text-gray-900 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contact Details
            </h5>

            {/* Email */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{classmate.email}</p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(classmate.email, 'Email')}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                title="Copy email"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">{classmate.phoneNumber}</p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(classmate.phoneNumber, 'Phone number')}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                title="Copy phone number"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {/* Major */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <GraduationCap className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Major</p>
                <p className="text-sm text-gray-600">{classmate.major}</p>
              </div>
            </div>

            {/* Year */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Academic Year</p>
                <p className="text-sm text-gray-600">{classmate.year}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h5 className="font-semibold text-gray-900">Quick Actions</h5>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`mailto:${classmate.email}?subject=MSAConnect - ${classInfo.courseId} Classmate&body=Assalamu alaikum ${classmate.name},%0D%0A%0D%0AI found your contact through MSAConnect and noticed we're both in ${classInfo.courseId}. I'd love to connect!%0D%0A%0D%0ABest regards`}
                className="btn btn-primary text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </a>
              <a
                href={`sms:${classmate.phoneNumber}?body=Assalamu alaikum ${classmate.name}! I found your contact through MSAConnect and noticed we're both in ${classInfo.courseId}. I'd love to connect!`}
                className="btn btn-secondary text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="w-4 h-4" />
                Send Text
              </a>
            </div>
          </div>

          {/* Reminder */}
          <div className="bg-gold/10 border border-gold/20 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Remember:</strong> Be respectful when reaching out. Introduce yourself 
              and mention you found them through MSAConnect for your shared class.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={onClose}
            className="btn btn-outline w-full"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
