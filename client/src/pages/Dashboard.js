import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { classesAPI } from '../utils/api';
import { formatCourseId } from '../utils/formatters';
import { Plus, BookOpen, Users, Edit3, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ClassModal from '../components/ClassModal';
import FindClassmatesModal from '../components/FindClassmatesModal';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [showClassmatesModal, setShowClassmatesModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const response = await classesAPI.getClasses();
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error loading classes:', error);
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = () => {
    setEditingClass(null);
    setShowClassModal(true);
  };

  const handleEditClass = (classItem, index) => {
    setEditingClass({ ...classItem, index });
    setShowClassModal(true);
  };

  const handleDeleteClass = async (index) => {
    if (!window.confirm('Are you sure you want to remove this class?')) return;

    try {
      const updatedClasses = classes.filter((_, i) => i !== index);
      await classesAPI.updateClasses(updatedClasses);
      setClasses(updatedClasses);
      updateUser({ classes: updatedClasses });
      toast.success('Class removed successfully');
    } catch (error) {
      console.error('Error removing class:', error);
      toast.error('Failed to remove class');
    }
  };

  const handleSaveClass = async (classData) => {
    try {
      let updatedClasses;
      
      if (editingClass !== null && editingClass.index !== undefined) {
        // Editing existing class
        updatedClasses = [...classes];
        updatedClasses[editingClass.index] = classData;
      } else {
        // Adding new class
        updatedClasses = [...classes, classData];
      }

      await classesAPI.updateClasses(updatedClasses);
      setClasses(updatedClasses);
      updateUser({ classes: updatedClasses });
      setShowClassModal(false);
      setEditingClass(null);
      
      toast.success(editingClass ? 'Class updated successfully' : 'Class added successfully');
    } catch (error) {
      console.error('Error saving class:', error);
      toast.error('Failed to save class');
    }
  };

  const handleFindClassmates = (classItem) => {
    setSelectedClass(classItem);
    setShowClassmatesModal(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your classes...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h1>My Classes</h1>
          <p>Manage your class schedule and find classmates</p>
        </div>
        <button
          onClick={handleAddClass}
          className="add-class-button"
        >
          <Plus className="w-4 h-4" />
          Add Class
        </button>
      </div>

      {/* Welcome message for new users */}
      {classes.length === 0 && (
        <div className="welcome-card">
          <div className="welcome-icon">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h3>Welcome to ILM+, {user?.name?.split(' ')[0]}!</h3>
          <p>
            Start by adding your classes to connect with fellow students 
            in your courses. Build your network and find study partners!
          </p>
          <button
            onClick={handleAddClass}
            className="add-class-button"
          >
            <Plus className="w-4 h-4" />
            Add Your First Class
          </button>
        </div>
      )}

      {/* Classes section */}
      {classes.length > 0 && (
        <div className="classes-section">
          <div className="classes-section-header">
            <h2 className="classes-section-title">Your Classes</h2>
          </div>
          <div className="classes-grid">
            {classes.map((classItem, index) => (
              <div key={index} className="class-card">
                <div className="class-card-header">
                  <div className="class-info">
                    <div className="class-icon">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="class-details">
                      <h3>{formatCourseId(classItem.courseId)}</h3>
                      <p>Section {classItem.sectionCode}</p>
                    </div>
                  </div>
                  <div className="class-actions">
                    <button
                      onClick={() => handleEditClass(classItem, index)}
                      className="action-button edit-button"
                      title="Edit class"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClass(index)}
                      className="action-button delete-button"
                      title="Remove class"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => handleFindClassmates(classItem)}
                  className="find-classmates-button"
                >
                  <Users className="w-4 h-4" />
                  Find Classmates
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showClassModal && (
        <ClassModal
          isOpen={showClassModal}
          onClose={() => {
            setShowClassModal(false);
            setEditingClass(null);
          }}
          onSave={handleSaveClass}
          editingClass={editingClass}
        />
      )}

      {showClassmatesModal && selectedClass && (
        <FindClassmatesModal
          isOpen={showClassmatesModal}
          onClose={() => {
            setShowClassmatesModal(false);
            setSelectedClass(null);
          }}
          classInfo={selectedClass}
        />
      )}
    </div>
  );
};

export default Dashboard;
