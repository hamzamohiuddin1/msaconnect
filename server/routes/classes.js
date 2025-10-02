const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's classes
router.get('/', auth, async (req, res) => {
  try {
    res.json({ classes: req.user.classes });
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'Server error while fetching classes' });
  }
});

// Update user's classes
router.put('/', auth, [
  body('classes').isArray().withMessage('Classes must be an array'),
  body('classes.*.courseId').trim().isLength({ min: 1 }).withMessage('Course ID is required'),
  body('classes.*.sectionCode').trim().isLength({ min: 1 }).withMessage('Section code is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { classes } = req.body;

    // Format classes to uppercase
    const formattedClasses = classes.map(cls => ({
      courseId: cls.courseId.toUpperCase().trim(),
      sectionCode: cls.sectionCode.toUpperCase().trim()
    }));

    // Update user's classes
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { classes: formattedClasses },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Classes updated successfully',
      classes: user.classes
    });
  } catch (error) {
    console.error('Update classes error:', error);
    res.status(500).json({ message: 'Server error while updating classes' });
  }
});

// Find classmates for a specific class
router.get('/classmates/:courseId/:sectionCode', auth, async (req, res) => {
  try {
    const { courseId, sectionCode } = req.params;
    
    // Build query filter based on gender preferences
    const query = {
      _id: { $ne: req.user._id },
      isEmailConfirmed: true,
      classes: {
        $elemMatch: {
          courseId: courseId.toUpperCase(),
        }
      }
    };

    // If current user has gender preference enabled, only show same gender
    if (req.user.genderPreference) {
      query.gender = req.user.gender;
    }

    // Find all users with the same class, excluding the current user
    let classmates = await User.find(query)
      .select('name email phoneNumber major year gender classes genderPreference');

    // Filter out users who have genderPreference enabled but don't match current user's gender
    classmates = classmates.filter(user => {
      // If the classmate has gender preference enabled, they only want to see same gender
      if (user.genderPreference) {
        return user.gender === req.user.gender;
      }
      // If classmate doesn't have preference, they can see anyone
      return true;
    });

    // Filter and format the response to only include relevant class info
    const formattedClassmates = classmates.map(user => {
      // Find the matching class to get the exact section
      const matchingClass = user.classes.find(cls => 
        cls.courseId === courseId.toUpperCase()
      );

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        major: user.major,
        year: user.year,
        gender: user.gender,
        sectionCode: matchingClass.sectionCode
      };
    });

    res.json({
      courseId: courseId.toUpperCase(),
      sectionCode: sectionCode.toUpperCase(),
      classmates: formattedClassmates,
      count: formattedClassmates.length
    });
  } catch (error) {
    console.error('Find classmates error:', error);
    res.status(500).json({ message: 'Server error while finding classmates' });
  }
});

module.exports = router;
