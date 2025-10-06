import React, { useState, useEffect } from 'react';
import { X, Users, User } from 'lucide-react';
import { classesAPI } from '../utils/api';
import { formatCourseId } from '../utils/formatters';
import toast from 'react-hot-toast';
import ContactModal from './ContactModal';
import '../styles/FindClassmatesModal.css';

const FindClassmatesModal = ({ isOpen, onClose, classInfo }) => {
  const [classmates, setClassmates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedClassmate, setSelectedClassmate] = useState(null);

  useEffect(() => {
    if (isOpen && classInfo) {
      findClassmates();
    }
  }, [isOpen, classInfo]);

  const findClassmates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await classesAPI.findClassmates(
        classInfo.courseId,
        classInfo.sectionCode
      );
      
      setClassmates(response.data.classmates || []);
    } catch (error) {
      console.error('Error finding classmates:', error);
      setError(error.response?.data?.message || 'Failed to find classmates');
    } finally {
      setLoading(false);
    }
  };

  const handleClassmateClick = (classmate) => {
    setSelectedClassmate(classmate);
    setShowContactModal(true);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="find-classmates-modal-overlay" onClick={handleOverlayClick}>
        <div className="find-classmates-modal">
          <div className="find-classmates-header">
            <div className="find-classmates-header-content">
              <h3>Find Classmates</h3>
              <p>
                {formatCourseId(classInfo?.courseId)} - Lecture: {classInfo?.sectionCode}
                {classInfo?.discussionCode && (
                  <span> • Discussion: {classInfo?.discussionCode}</span>
                )}
              </p>
            </div>
            <button onClick={onClose} className="find-classmates-close">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="find-classmates-body">
            {loading && (
              <div className="find-classmates-loading">
                <div className="find-classmates-loading-spinner"></div>
                <p>Searching for classmates...</p>
              </div>
            )}

            {error && (
              <div className="find-classmates-error">
                <div className="find-classmates-error-icon">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h4>Error</h4>
                <p>{error}</p>
                <button onClick={findClassmates} className="btn btn-primary">
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && classmates.length === 0 && (
              <div className="find-classmates-empty">
                <div className="find-classmates-empty-icon">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h4>No Classmates Found</h4>
                <p>
                  No other students have added this class yet. Be the first to connect 
                  when more students join!
                </p>
              </div>
            )}

            {!loading && !error && classmates.length > 0 && (
              <div>
                <div className="find-classmates-results-header">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="find-classmates-results-count">
                    {classmates.length} classmate{classmates.length !== 1 ? 's' : ''} found
                  </span>
                </div>

                <div className="find-classmates-list">
                  {classmates.map((classmate) => (
                    <div
                      key={classmate._id}
                      onClick={() => handleClassmateClick(classmate)}
                      className="find-classmates-item"
                    >
                      <div className="find-classmates-item-content">
                        <div className="find-classmates-item-left">
                          <div className="find-classmates-item-avatar">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="find-classmates-item-info">
                            <h5 className="find-classmates-item-name">
                              {classmate.name}
                            </h5>
                            <div className="find-classmates-item-meta">
                              <span>{classmate.major}</span>
                              <span>•</span>
                              <span>{classmate.year}</span>
                              <span>•</span>
                              <span>{classmate.gender}</span>
                            </div>
                          </div>
                        </div>
                        <div className="find-classmates-item-right">
                          <div className="find-classmates-item-section">
                            Lecture: {classmate.sectionCode}
                            {classmate.discussionCode && (
                              <div>Discussion: {classmate.discussionCode}</div>
                            )}
                          </div>
                          <div className="find-classmates-item-hint">
                            Click to view contact
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="find-classmates-info-banner">
                  <h5>🤝 Connect Respectfully</h5>
                  <p>
                    Remember to be respectful when reaching out to classmates. 
                    Introduce yourself and mention you found them through ILM+.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="find-classmates-footer">
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && selectedClassmate && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => {
            setShowContactModal(false);
            setSelectedClassmate(null);
          }}
          classmate={selectedClassmate}
          classInfo={classInfo}
        />
      )}
    </>
  );
};

export default FindClassmatesModal;
