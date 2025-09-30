import React, { useState, useEffect } from 'react';
import { X, Users, Mail, Phone, Copy, User, BookOpen } from 'lucide-react';
import { classesAPI } from '../utils/api';
import toast from 'react-hot-toast';
import ContactModal from './ContactModal';

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
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal" style={{ maxWidth: '600px' }}>
          <div className="modal-header">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Find Classmates</h3>
              <p className="text-sm text-gray-600 mt-1">
                {classInfo?.courseId} - Section {classInfo?.sectionCode}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="modal-body">
            {loading && (
              <div className="text-center py-8">
                <div className="loading mb-4"></div>
                <p className="text-gray-600">Searching for classmates...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Error</h4>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={findClassmates}
                  className="btn btn-primary"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && classmates.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">No Classmates Found</h4>
                <p className="text-gray-600">
                  No other MSA members have added this class yet. Be the first to connect 
                  when more students join!
                </p>
              </div>
            )}

            {!loading && !error && classmates.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">
                    {classmates.length} classmate{classmates.length !== 1 ? 's' : ''} found
                  </span>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {classmates.map((classmate) => (
                    <div
                      key={classmate._id}
                      onClick={() => handleClassmateClick(classmate)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900">
                              {classmate.name}
                            </h5>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{classmate.major}</span>
                              <span>•</span>
                              <span>{classmate.year}</span>
                              <span>•</span>
                              <span>{classmate.gender}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-blue-600">
                            Section {classmate.sectionCode}
                          </div>
                          <div className="text-xs text-gray-500">
                            Click to view contact
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gold/10 border border-gold/20 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">
                    🤝 Connect Respectfully
                  </h5>
                  <p className="text-sm text-gray-600">
                    Remember to be respectful when reaching out to classmates. 
                    Introduce yourself and mention you found them through MSAConnect.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              onClick={onClose}
              className="btn btn-outline"
            >
              Close
            </button>
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
