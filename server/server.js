import mongoose from 'mongoose'
import app from './index.js'
import dotenv from 'dotenv'
import dns from 'dns'

dotenv.config()

const PORT = process.env.PORT || 3001

//dns.setServers(['8.8.8.8', '8.8.4.4']);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(err => console.error(err))