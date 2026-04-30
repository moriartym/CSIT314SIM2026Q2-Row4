import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import UserProfile from './src/models/UserProfile.js'
import UserAccount from './src/models/UserAccount.js'

dotenv.config()

await mongoose.connect(process.env.MONGO_URI)
console.log('MongoDB connected')

const existing = await UserAccount.findOne({ username: 'super' })
if (existing) {
  console.log('User "super" already exists, skipping.')
  await mongoose.disconnect()
  process.exit(0)
}

const profile = await UserProfile.create({
  profileName: 'Superadmin',
  description: 'Full access profile',
  permissions: ['user_management', 'fundraising', 'donating', 'platform_management'],
  isActive: true
})

const hashedPassword = await bcrypt.hash('Abc.1234', 10)

await UserAccount.create({
  username: 'super',
  email: 'super@admin.com',
  password: hashedPassword,
  userProfile: profile._id,
  isActive: true
})

console.log('Superadmin created successfully')
await mongoose.disconnect()
process.exit(0)