/**
 * Format a course ID for display by adding a space between department and number
 * Example: "CSE101" -> "CSE 101", "MATH20A" -> "MATH 20A"
 * @param {string} courseId - The course ID to format
 * @returns {string} Formatted course ID
 */
export const formatCourseId = (courseId) => {
  if (!courseId) return '';
  
  // Remove any existing spaces first
  const normalized = courseId.replace(/\s+/g, '').toUpperCase();
  
  // Match department code (2-4 letters) followed by course number
  const match = normalized.match(/^([A-Z]{2,4})(\d+[A-Z]?)$/);
  
  if (match) {
    return `${match[1]} ${match[2]}`;
  }
  
  // If format doesn't match, return as-is
  return normalized;
};

/**
 * Normalize a course ID for storage/searching by removing spaces
 * Example: "CSE 101" -> "CSE101", "MATH 20A" -> "MATH20A"
 * @param {string} courseId - The course ID to normalize
 * @returns {string} Normalized course ID
 */
export const normalizeCourseId = (courseId) => {
  if (!courseId) return '';
  return courseId.replace(/\s+/g, '').toUpperCase().trim();
};

