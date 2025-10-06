const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const classSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    set: function(value) {
      // Remove all spaces and convert to uppercase for consistent storage
      return value.replace(/\s+/g, '').toUpperCase();
    }
  },
  sectionCode: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  discussionCode: {
    type: String,
    required: false,
    trim: true,
    uppercase: true
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return email.endsWith('@ucsd.edu');
      },
      message: 'Email must be a UCSD email address ending with @ucsd.edu'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  major: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    required: true,
    enum: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']
  },
  gender: {
    type: String,
    required: true,
    enum: ['Brother', 'Sister']
  },
  genderPreference: {
    type: Boolean,
    default: false
  },
  classes: [classSchema],
  isEmailConfirmed: {
    type: Boolean,
    default: false
  },
  emailConfirmationToken: {
    type: String
  },
  emailConfirmationExpires: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.emailConfirmationToken;
  return user;
};

module.exports = mongoose.model('User', userSchema);
