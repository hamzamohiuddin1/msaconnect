import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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
    } else if (!/^[A-Z]\d{2}$/i.test(formData.sectionCode.trim())) {
      newErrors.sectionCode = 'Please enter a valid section code (e.g., A00, B01)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Format the data
    const classData = {
      courseId: formData.courseId.trim().toUpperCase(),
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
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="text-xl font-semibold text-gray-900">
            {editingClass ? 'Edit Class' : 'Add New Class'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body space-y-6">
            <div className="form-group">
              <label className="form-label">Course ID</label>
              <input
                type="text"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className={`input ${errors.courseId ? 'error' : ''}`}
                placeholder="e.g., CSE 101, MATH 20A, CHEM 6A"
                autoFocus
              />
              {errors.courseId && <div className="form-error">{errors.courseId}</div>}
              <p className="text-xs text-gray-500 mt-1">
                Enter the course department and number (e.g., CSE 101, MATH 20A)
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Section Code</label>
              <input
                type="text"
                name="sectionCode"
                value={formData.sectionCode}
                onChange={handleChange}
                className={`input ${errors.sectionCode ? 'error' : ''}`}
                placeholder="e.g., A00, B01, C02"
              />
              {errors.sectionCode && <div className="form-error">{errors.sectionCode}</div>}
              <p className="text-xs text-gray-500 mt-1">
                Enter your lecture section code (e.g., A00, B01, C02)
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">💡 Tips:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• You can find your section code on WebReg or your class schedule</li>
                <li>• Make sure to enter the lecture section, not discussion sections</li>
                <li>• Course IDs are automatically formatted (e.g., "cse101" → "CSE 101")</li>
              </ul>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
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
