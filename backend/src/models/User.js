import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide contact phone number'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: [
        'super_admin',
        'admin',
        'staff_coordinator',
        'general_volunteer',
        'Super Admin',
        'Admin',
        'Staff Coordinator',
        'General Volunteer',
        'staff',
        'volunteer',
        'member',
      ],
      default: 'member',
    },
    permissions: {
      type: [String],
      default: [],
    },
    assignedBy: {
      name: { type: String, default: 'System Root' },
      email: { type: String, default: 'admin@gmail.com' },
      role: { type: String, default: 'Super Admin' },
    },
    accessGrantedDate: {
      type: Date,
      default: Date.now,
    },
    accessExpiryDate: {
      type: Date,
      default: null, // null represents Permanent access
    },
    accessReason: {
      type: String,
      default: 'Initial operational onboarding',
    },
    accountStatus: {
      type: String,
      enum: ['Active', 'Inactive', 'Pending', 'active', 'inactive', 'pending'],
      default: 'Active',
    },
    designation: {
      type: String,
      default: 'General Member',
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    officeLocation: {
      type: String,
      trim: true,
      default: '',
    },
    bloodGroup: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
      default: '',
    },
    dateOfBirth: {
      type: String,
      trim: true,
      default: '',
    },
    occupation: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      street: String,
      city: { type: String, default: 'Rajahmundry' },
      state: { type: String, default: 'Andhra Pradesh' },
      pincode: String,
    },
    avatar: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
