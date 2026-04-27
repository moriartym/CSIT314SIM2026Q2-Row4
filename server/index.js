import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './src/routes/userRoutes.js'
import userProfileRoutes from './src/routes/userProfileRoutes.js'
import session from 'express-session'
import authRoutes from './src/routes/authRoutes.js'
import fundraisingActivityRoutes from './src/routes/fundraisingActivityRoutes.js'

dotenv.config()

const app = express()
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)
app.use(express.json())

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60, sameSite: 'lax' }
  })
)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err))

app.get('/', (req, res) => res.send('API running'))
app.use('/api/users', userRoutes)
app.use('/api/user-profiles', userProfileRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/fra', fundraisingActivityRoutes)

const PORT = process.env.PORT || 3001
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server on port ${PORT}`))
}

export default app