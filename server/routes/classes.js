const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendNewClassmateEmail } = require('../utils/emailService');

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
  body('classes.*.sectionCode').trim().isLength({ min: 1 }).withMessage('Section code is required'),
  body('classes.*.discussionCode').optional().trim()
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

    // Format classes to uppercase and remove spaces from courseId
    const formattedClasses = classes.map(cls => {
      const formattedClass = {
        courseId: cls.courseId.replace(/\s+/g, '').toUpperCase().trim(),
        sectionCode: cls.sectionCode.toUpperCase().trim()
      };
      
      // Add discussion code if provided
      if (cls.discussionCode && cls.discussionCode.trim()) {
        formattedClass.discussionCode = cls.discussionCode.toUpperCase().trim();
      }
      
      return formattedClass;
    });

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

    // Send new classmate notification email to all classmates in newly added class
    
  } catch (error) {
    console.error('Update classes error:', error);
    res.status(500).json({ message: 'Server error while updating classes' });
  }
});

// Find classmates for a specific class
router.get('/classmates/:courseId/:sectionCode', auth, async (req, res) => {
  try {
    const { courseId, sectionCode } = req.params;
    
    // Normalize courseId by removing spaces and converting to uppercase
    const normalizedCourseId = courseId.replace(/\s+/g, '').toUpperCase();
    
    // Build query filter based on gender preferences
    const query = {
      _id: { $ne: req.user._id },
      isEmailConfirmed: true,
      classes: {
        $elemMatch: {
          courseId: normalizedCourseId,
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
        cls.courseId === normalizedCourseId
      );

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        major: user.major,
        year: user.year,
        gender: user.gender,
        sectionCode: matchingClass.sectionCode,
        discussionCode: matchingClass.discussionCode
      };
    });

    res.json({
      courseId: normalizedCourseId,
      sectionCode: sectionCode.toUpperCase(),
      classmates: formattedClassmates,
      count: formattedClassmates.length
    });
  } catch (error) {
    console.error('Find classmates error:', error);
    res.status(500).json({ message: 'Server error while finding classmates' });
  }

});

router.post('/send-new-classmate-email', auth, async (req, res) => {
  try {
    const { name, courseId } = req.body;
    // Find all users with the same course id
    const normalizedCourseId = courseId.replace(/\s+/g, '').toUpperCase();
    
    const query = {
      _id: { $ne: req.user._id },
      isEmailConfirmed: true,
      classes: {
        $elemMatch: {
          courseId: normalizedCourseId,
        }
      }
    };

    if (req.user.genderPreference) {
      query.gender = req.user.gender;
    }

    let classmates = await User.find(query)
      .select('name email phoneNumber major year gender classes genderPreference');

    classmates = classmates.filter(user => {
      if (user.genderPreference) {
        return user.gender === req.user.gender;
      }
      return true;
    });

    // Send new classmate email to all these users
    for (const user of classmates) {
      await sendNewClassmateEmail(user.email, user.name, name, courseId);
    }
    res.json({ message: 'New classmate email sent successfully' });
  } catch (error) {
    console.error('Send new classmate email error:', error);
    res.status(500).json({ message: 'Server error while sending new classmate email' });
  }
});

module.exports = router;
