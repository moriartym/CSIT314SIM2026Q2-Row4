import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

import UserProfile from './src/models/UserProfile.js'
import UserAccount from './src/models/UserAccount.js'

async function seedSuperUser() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB\n')

  await mongoose.connection.collection('useraccounts').deleteMany({ email: 'superuser@admin.com' })
  await mongoose.connection.collection('userprofiles').deleteMany({ profileName: 'Super User' })

  const superProfile = await UserProfile.create({
    profileName: 'Super User',
    description: 'Has all permissions',
    permissions: ['user_management', 'fundraising', 'donating', 'platform_management'],
    isActive: true
  })

  const hash = await bcrypt.hash('Abc.1234', 10)

  const superUser = await UserAccount.create({
    username: 'superuser',
    email: 'superuser@admin.com',
    password: hash,
    userProfile: superProfile._id,
    isActive: true
  })

  console.log('-- Super User Created ------------------------')
  console.log(`  Username : ${superUser.username}`)
  console.log(`  Email    : ${superUser.email}`)
  console.log(`  Password : Abc.1234`)
  console.log(`  Perms    : user_management, fundraising, donating, platform_management`)
  console.log('----------------------------------------------\n')

  await mongoose.disconnect()
}

seedSuperUser().catch(err => { console.error(err); process.exit(1) })