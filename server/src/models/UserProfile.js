import mongoose from 'mongoose'

const VALID_PERMISSIONS = [
  'user_management',
  'fundraising',
  'donating',
  'platform_management'
]

const userProfileSchema = new mongoose.Schema({
  profileName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true
  },
  permissions: {
    type: [String],
    enum: VALID_PERMISSIONS,
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

export default mongoose.model('UserProfile', userProfileSchema)