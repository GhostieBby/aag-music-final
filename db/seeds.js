import mongoose from 'mongoose' // gives us the mongoose.connect method for establishing a db connection
import 'dotenv/config' // adds our .env variables to process.env

// Model
import User from '../models/user.js'

// Data
import userData from './data/users.js' // data to input into the db
import Song from '../models/song.js'


const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING)
    console.log('🚀 Database connection established')

    const { deletedCount: usersDeleted } = await User.deleteMany()
    console.log(`❌ Deleted ${usersDeleted} documents from the users collection`)

    const { deletedCount: songsDeleted } = await Song.deleteMany()
    console.log(`❌ Deleted ${songsDeleted} documents from the songs collection`)

    const usersAdded = await User.create(userData)
    console.log(`🌱 Seeded ${usersAdded.length} documents into the users collection`)

    await mongoose.connection.close()
    console.log('👋 Database connection closed')
  } catch (error) {
    console.log(error)

    await mongoose.connection.close()
    console.log('👋 Database connection closed')
  }
}
seedDatabase()