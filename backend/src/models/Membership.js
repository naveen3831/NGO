import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    membershipNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    membershipType: {
      type: String,
      enum: ['Life Member', 'Annual Member', 'Volunteer Member', 'Patron', 'Student Member'],
      default: 'Annual Member',
    },
    status: {
      type: String,
      enum: ['Active', 'Pending Approval', 'Expired', 'Suspended'],
      default: 'Active',
    },
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validTo: {
      type: Date,
    },
    feePaid: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Waived', 'N/A'],
      default: 'Paid',
    },
    cardIssued: {
      type: Boolean,
      default: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Membership = mongoose.model('Membership', membershipSchema);
export default Membership;

