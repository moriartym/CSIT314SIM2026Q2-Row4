import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

import UserProfile         from './src/models/UserProfile.js'
import UserAccount         from './src/models/UserAccount.js'
import FRACategory         from './src/models/FRACategory.js'
import FundraisingActivity from './src/models/FundraisingActivity.js'
import Donation            from './src/models/Donation.js'
import Favourite           from './src/models/Favourite.js'

const pick    = (arr)      => arr[Math.floor(Math.random() * arr.length)]
const rand    = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randAmt = (min, max) => Math.max(min, Math.round((Math.random() * (max - min) + min) / 50) * 50)
const randDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))

const FIRST_NAMES = [
  'James','John','Robert','Michael','William','David','Richard','Joseph','Thomas','Charles',
  'Mary','Patricia','Jennifer','Linda','Barbara','Elizabeth','Susan','Jessica','Sarah','Karen',
  'Daniel','Matthew','Anthony','Mark','Donald','Steven','Paul','Andrew','Joshua','Kenneth',
  'Emily','Ashley','Megan','Stephanie','Nicole','Rachel','Amanda','Melissa','Laura','Rebecca',
  'Kevin','Brian','George','Edward','Ronald','Timothy','Jason','Jeffrey','Ryan','Gary',
  'Hannah','Samantha','Katherine','Natalie','Christine','Deborah','Marie','Diana','Alice','Joan',
  'Liam','Noah','Oliver','Elijah','Lucas','Mason','Logan','Ethan','Aiden','Carter',
  'Emma','Olivia','Ava','Sophia','Mia','Isabella','Amelia','Charlotte','Harper','Evelyn',
]

const LAST_NAMES = [
  'Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Martinez',
  'Anderson','Taylor','Thomas','Hernandez','Moore','Jackson','Martin','Lee','Perez','Thompson',
  'White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen',
  'King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green','Adams','Nelson',
  'Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts','Gomez','Phillips','Evans',
  'Turner','Diaz','Parker','Cruz','Edwards','Collins','Reyes','Stewart','Morris','Morales',
  'Murphy','Cook','Rogers','Gutierrez','Ortiz','Morgan','Cooper','Peterson','Bailey','Reed',
  'Kelly','Howard','Ramos','Kim','Cox','Ward','Richardson','Watson','Brooks','Chavez',
]

const DOMAINS = ['gmail.com','yahoo.com','outlook.com','hotmail.com','icloud.com','proton.me']
const STREETS = ['Main St','Oak Ave','Maple Dr','Cedar Ln','Pine Rd','Elm St','Park Blvd','Lake View','River Rd','Sunset Ave']
const CITIES  = ['New York','Los Angeles','Chicago','Houston','Phoenix','San Diego','Dallas','San Jose','Austin','Jacksonville']

const FRA_PREFIXES  = ['Help','Support','Fund','Build','Save','Restore','Empower','Create','Protect','Rebuild']
const FRA_SUBJECTS  = ['Children','Veterans','Families','Students','Communities','Animals','Schools','Hospitals','Seniors','Youth']
const FRA_SUFFIXES  = ['in Need','for Tomorrow','Together','Now','Foundation','Initiative','Project','Campaign','Relief','Fund']

const FRA_DESCRIPTIONS = [
  'Every dollar brings us closer to our goal. Your generous contribution will directly impact those most in need in our community.',
  'We are dedicated to making a real difference. Join us in this important mission and help transform lives for the better.',
  'This campaign aims to provide essential resources to those who need them most. Together we can achieve extraordinary things.',
  'Your support means everything to us and to the people we serve. Help us reach our target and create lasting change.',
  'Through collective action and community support we can overcome challenges and build a brighter future for everyone.',
  'Each contribution, big or small, moves us forward. Help us meet our fundraising goal and deliver on our promise.',
  'We believe in the power of community. With your help, we can provide vital support to those facing hardship.',
  'This initiative relies on generous donors like you. Every gift is carefully directed to maximise its positive impact.',
  'Our mission is clear and our commitment is unwavering. Support us today and be part of something truly meaningful.',
  'Together we can create the change we wish to see. Your donation will go directly to those who need it most.',
]

const CATEGORY_NAMES = [
  'Education','Healthcare','Disaster Relief','Animal Welfare','Poverty Alleviation',
  "Children's Welfare",'Mental Health','Environmental Conservation','Elderly Care','Community Development',
  'Arts & Culture','Sports & Recreation','Clean Water','Food Security','Refugee Support',
  'Women Empowerment','Youth Development','Disability Support','Housing Assistance','Rural Development',
  'Urban Renewal','Medical Research','Cancer Support','Heart Disease','Diabetes Awareness',
  'HIV/AIDS Support',"Alzheimer's Care",'Orphan Support','Single Parent Aid','Scholarship Fund',
  'Vocational Training','Literacy Programs','STEM Education','Special Education','Early Childhood',
  'School Supplies','Library Access','Technology Access','Internet Connectivity','Digital Literacy',
  'Clean Energy','Solar Power','Tree Planting','Ocean Cleanup','Wildlife Protection',
  'Endangered Species','Coral Restoration','Flood Relief','Earthquake Recovery','Fire Recovery',
  'Hurricane Aid','Drought Relief','Famine Response','Pandemic Recovery','Vaccine Access',
  'Mental Wellness','Addiction Recovery','Suicide Prevention','PTSD Support','Veterans Aid',
  'First Responders','Police Welfare','Firefighter Support','Nurse Welfare','Doctor Burnout',
  'Hospital Equipment','Mobile Clinics','Dental Care','Vision Care','Hearing Support',
  'Prosthetics Fund','Wheelchair Access','Autism Awareness','Down Syndrome Support','Cerebral Palsy',
  'Blindness Prevention','Deafness Support','Speech Therapy','Physical Therapy','Home Nursing',
  'Hospice Care','Grief Support','Foster Care','Adoption Support','Child Abuse Prevention',
  'Domestic Violence','Human Trafficking','Prison Reform','Youth Justice','Legal Aid',
  'Immigration Support','Language Learning','Cultural Exchange','Interfaith Dialogue','Peace Building',
  'Conflict Resolution','Democracy Promotion','Press Freedom','Civic Education','Voter Registration',
  'Community Policing','Urban Farming','Food Banks','Soup Kitchens','Homeless Shelters',
]

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB\n')

  await Promise.all([
    UserAccount.deleteMany({}),
    UserProfile.deleteMany({}),
    FRACategory.deleteMany({}),
    FundraisingActivity.deleteMany({}),
    Donation.deleteMany({}),
    Favourite.deleteMany({}),
  ])
  console.log('Database cleared')

  const profiles = await UserProfile.insertMany([
    { profileName: 'User Administrator', description: 'Manages user accounts and profiles',       permissions: ['user_management'],     isActive: true },
    { profileName: 'Fundraiser',         description: 'Creates and manages fundraising campaigns', permissions: ['fundraising'],          isActive: true },
    { profileName: 'Donee',              description: 'Browses campaigns and makes donations',     permissions: ['donating'],             isActive: true },
    { profileName: 'Platform Manager',   description: 'Manages categories and generates reports',  permissions: ['platform_management'], isActive: true },
  ])
  const [uaProfile, frProfile, doneeProfile, pmProfile] = profiles

  const categoryDocs = CATEGORY_NAMES.map((name, i) => ({
    name,
    description: `Fundraising activities focused on ${name.toLowerCase()}`,
    isActive: i < 90,
  }))
  const categories = await FRACategory.insertMany(categoryDocs)
  const activeCategories = categories.filter(c => c.isActive)

  const PASSWORD_HASH = await bcrypt.hash('Abc.1234', 10)

  const buildUser = (first, last, tag, profileId) => ({
    username:    `${first.toLowerCase()}${last.toLowerCase()}${tag}`,
    email:       `${first.toLowerCase()}.${last.toLowerCase()}${tag}@${pick(DOMAINS)}`,
    password:    PASSWORD_HASH,
    dateOfBirth: randDate(new Date('1960-01-01'), new Date('2000-12-31')),
    phone:       `${rand(8000, 9999)}${rand(1000, 9999)}`,
    address:     `${rand(1, 999)} ${pick(STREETS)}, ${pick(CITIES)}`,
    isActive:    Math.random() > 0.1,
    userProfile: profileId,
  })

  const uaUsers    = await UserAccount.insertMany(Array.from({ length: 10 }, (_, i) => buildUser(pick(FIRST_NAMES), pick(LAST_NAMES), `_ua${i}`, uaProfile._id)))
  const frUsers    = await UserAccount.insertMany(Array.from({ length: 30 }, (_, i) => buildUser(pick(FIRST_NAMES), pick(LAST_NAMES), `_fr${i}`, frProfile._id)))
  const doneeUsers = await UserAccount.insertMany(Array.from({ length: 60 }, (_, i) => buildUser(pick(FIRST_NAMES), pick(LAST_NAMES), `_dn${i}`, doneeProfile._id)))
  const pmUsers    = await UserAccount.insertMany(Array.from({ length: 10 }, (_, i) => buildUser(pick(FIRST_NAMES), pick(LAST_NAMES), `_pm${i}`, pmProfile._id)))

  const fraDocs = []
  for (const fr of frUsers) {
    const count = rand(4, 6)
    for (let i = 0; i < count; i++) {
      const isCompleted = Math.random() < 0.25
      const isSuspended = !isCompleted && Math.random() < 0.10
      const status      = isCompleted ? 'completed' : isSuspended ? 'suspended' : 'active'
      fraDocs.push({
        title:          `${pick(FRA_PREFIXES)} ${pick(FRA_SUBJECTS)} ${pick(FRA_SUFFIXES)}`,
        description:    pick(FRA_DESCRIPTIONS),
        targetAmount:   randAmt(1000, 100000),
        category:       pick(activeCategories)._id,
        status,
        createdBy:      fr._id,
        viewCount:      rand(0, 500),
        shortlistCount: rand(0, 100),
        completedAt:    isCompleted ? randDate(new Date('2023-01-01'), new Date()) : undefined,
      })
    }
  }
  const fras       = await FundraisingActivity.insertMany(fraDocs)
  const activeFras = fras.filter(f => f.status === 'active')

  const donationDocs = []
  for (const donee of doneeUsers) {
    const shuffled = [...activeFras].sort(() => Math.random() - 0.5)
    const targets  = shuffled.slice(0, rand(3, 6))
    for (const fra of targets) {
      donationDocs.push({
        donee:     donee._id,
        fra:       fra._id,
        amount:    randAmt(10, 500),
        category:  fra.category,
        donatedAt: randDate(new Date('2023-01-01'), new Date()),
      })
    }
  }
  const donations = await Donation.insertMany(donationDocs)

  const favouriteDocs = []
  for (const donee of doneeUsers) {
    const shuffled = [...activeFras].sort(() => Math.random() - 0.5)
    const targets  = shuffled.slice(0, rand(3, 5))
    for (const fra of targets) {
      favouriteDocs.push({ donee: donee._id, fra: fra._id })
    }
  }
  const favourites = await Favourite.insertMany(favouriteDocs)

  const lines = []
  const line  = (str = '') => lines.push(str)

  line('SEED LOG')
  line(`Generated : ${new Date().toISOString()}`)
  line(`Password  : Abc.1234 (all users)`)
  line()

  line('-- User Administrators (' + uaUsers.length + ') -------------------------')
  uaUsers.forEach(u => line(`  ${u.isActive ? 'ACTIVE   ' : 'SUSPENDED'} | ${u.username.padEnd(35)} | ${u.email}`))
  line()

  line('-- Fundraisers (' + frUsers.length + ') ----------------------------------')
  frUsers.forEach(u => line(`  ${u.isActive ? 'ACTIVE   ' : 'SUSPENDED'} | ${u.username.padEnd(35)} | ${u.email}`))
  line()

  line('-- Donees (' + doneeUsers.length + ') -------------------------------------')
  doneeUsers.forEach(u => line(`  ${u.isActive ? 'ACTIVE   ' : 'SUSPENDED'} | ${u.username.padEnd(35)} | ${u.email}`))
  line()

  line('-- Platform Managers (' + pmUsers.length + ') ------------------------------')
  pmUsers.forEach(u => line(`  ${u.isActive ? 'ACTIVE   ' : 'SUSPENDED'} | ${u.username.padEnd(35)} | ${u.email}`))
  line()

  line('-- Summary -------------------------------------------')
  line(`  User Profiles  : ${profiles.length}`)
  line(`  FRA Categories : ${categories.length}  (${activeCategories.length} active, ${categories.length - activeCategories.length} inactive)`)
  line(`  Users          : ${uaUsers.length + frUsers.length + doneeUsers.length + pmUsers.length}`)
  line(`    -> UA         : ${uaUsers.length}`)
  line(`    -> Fundraiser : ${frUsers.length}`)
  line(`    -> Donee      : ${doneeUsers.length}`)
  line(`    -> PM         : ${pmUsers.length}`)
  line(`  FRA            : ${fras.length}  (${activeFras.length} active, ${fras.filter(f => f.status === 'completed').length} completed, ${fras.filter(f => f.status === 'suspended').length} suspended)`)
  line(`  Donations      : ${donations.length}`)
  line(`  Favourites     : ${favourites.length}`)

  const logPath = path.resolve('seed-log.txt')
  fs.writeFileSync(logPath, lines.join('\n'), 'utf8')
  console.log(`\n  Log written to: ${logPath}`)

  console.log('\n-- Seed Summary ------------------------------')
  console.log(`  User Profiles   : ${profiles.length}`)
  console.log(`  FRA Categories  : ${categories.length}  (${activeCategories.length} active, ${categories.length - activeCategories.length} inactive)`)
  console.log(`  Users           : ${uaUsers.length + frUsers.length + doneeUsers.length + pmUsers.length}`)
  console.log(`    -> UA          : ${uaUsers.length}`)
  console.log(`    -> Fundraiser  : ${frUsers.length}`)
  console.log(`    -> Donee       : ${doneeUsers.length}`)
  console.log(`    -> PM          : ${pmUsers.length}`)
  console.log(`  FRA             : ${fras.length}  (${activeFras.length} active, ${fras.filter(f => f.status === 'completed').length} completed, ${fras.filter(f => f.status === 'suspended').length} suspended)`)
  console.log(`  Donations       : ${donations.length}`)
  console.log(`  Favourites      : ${favourites.length}`)
  console.log('----------------------------------------------')
  console.log('\n  All user passwords: Abc.1234')
  console.log('  Done.\n')

  await mongoose.disconnect()
}

seed().catch(err => { console.error(err); process.exit(1) })