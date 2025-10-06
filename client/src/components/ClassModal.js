import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../styles/ClassModal.css';

const ClassModal = ({ isOpen, onClose, onSave, editingClass }) => {
  const [formData, setFormData] = useState({
    courseId: '',
    sectionCode: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingClass) {
      setFormData({
        courseId: editingClass.courseId || '',
        sectionCode: editingClass.sectionCode || ''
      });
    } else {
      setFormData({
        courseId: '',
        sectionCode: ''
      });
    }
    setErrors({});
  }, [editingClass, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.toUpperCase() // Auto-convert to uppercase
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

    if (!formData.courseId.trim()) {
      newErrors.courseId = 'Course ID is required';
    } else if (!/^[A-Z]{2,4}\s*\d{1,3}[A-Z]?$/i.test(formData.courseId.trim())) {
      newErrors.courseId = 'Please enter a valid course ID (e.g., CSE 101, MATH 20A)';
    }

    if (!formData.sectionCode.trim()) {
      newErrors.sectionCode = 'Section code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Format the data - remove spaces from courseId for consistent storage
    const classData = {
      courseId: formData.courseId.replace(/\s+/g, '').trim().toUpperCase(),
      sectionCode: formData.sectionCode.trim().toUpperCase()
    };

    onSave(classData);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="class-modal-overlay" onClick={handleOverlayClick}>
      <div className="class-modal">
        <div className="class-modal-header">
          <h3>{editingClass ? 'Edit Class' : 'Add New Class'}</h3>
          <button onClick={onClose} className="class-modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="class-modal-body">
            <div className="class-modal-form-group">
              <label className="class-modal-label">Course ID</label>
              <input
                type="text"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className={`class-modal-input ${errors.courseId ? 'error' : ''}`}
                placeholder="e.g., CSE 101, MATH 20A, CHEM 6A"
                autoFocus
              />
              {errors.courseId && <span className="class-modal-error">{errors.courseId}</span>}
              <span className="class-modal-hint">
                Enter the course department and number (e.g., CSE101, MATH20A)
              </span>
            </div>

            <div className="class-modal-form-group">
              <label className="class-modal-label">Section Code</label>
              <input
                type="text"
                name="sectionCode"
                value={formData.sectionCode}
                onChange={handleChange}
                className={`class-modal-input ${errors.sectionCode ? 'error' : ''}`}
                placeholder="e.g., A00, B01, C02"
              />
              {errors.sectionCode && <span className="class-modal-error">{errors.sectionCode}</span>}
              <span className="class-modal-hint">
                Enter your lecture section code (e.g., A00, B01, C02)
              </span>
            </div>

            <div className="class-modal-tips">
              <h4>💡 Tips:</h4>
              <ul>
                <li>• You can find your section code on WebReg or your class schedule</li>
                <li>• Make sure to enter the lecture section, not discussion sections</li>
                <li>• Course IDs are automatically formatted (e.g., "cse 101" → "CSE101")</li>
                <li>• Spaces in course IDs are automatically removed for consistency</li>
              </ul>
            </div>
          </div>

          <div className="class-modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="class-modal-btn class-modal-btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="class-modal-btn class-modal-btn-primary"
            >
              {editingClass ? 'Update Class' : 'Add Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassModal;
