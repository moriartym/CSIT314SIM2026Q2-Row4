import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  dateOfBirth: { type: Date },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  profilePicture: { type: String },
  isActive: { type: Boolean, default: true },
  userProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile',
    required: true
  }
}, { timestamps: true })

export default mongoose.model('UserAccount', userSchema)