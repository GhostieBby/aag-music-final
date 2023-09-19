import express from 'express'
import mongoose from 'mongoose'
import router from './config/routes.js'
import 'dotenv/config'

const app = express()

// Parse JSON body
app.use(express.json())
app.use(express.text())


// ? Logger
app.use((req, res, next) => {
  console.log(`Request received ${req.method} ${req.url}`)
  next()
})

app.use('/api', router)

// ?  Route Not Found
app.use((req, res) => {
  return res.status(404).json({ message: 'Route not found' })
})

const startServer = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING)
    console.log('Database connection established')
    app.listen(process.env.PORT, () => console.log(`Server listening on ${process.env.PORT}`))
  } catch (error) {
    console.log('I got a bad feeling about this - Han Solo')
    console.log(error)
  }
}
startServer()