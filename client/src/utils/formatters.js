// Utility function to format course IDs for display
export const formatCourseId = (courseId) => {
  if (!courseId) return '';
  
  // Remove spaces and convert to uppercase
  const normalized = courseId.replace(/\s+/g, '').toUpperCase();
  
  // Add space between letters and numbers for better readability
  // e.g., "CSE101" becomes "CSE 101"
  return normalized.replace(/([A-Z]+)(\d+)/, '$1 $2');
};

// Utility function to normalize course ID for storage/search
export const normalizeCourseId = (courseId) => {
  if (!courseId) return '';
  return courseId.replace(/\s+/g, '').toUpperCase();
};