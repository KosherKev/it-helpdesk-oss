import mongoose from 'mongoose'
import config from './environment.js'
import logger from '../utils/logger.js'

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    await mongoose.connect(config.MONGODB_URI, options)
    logger.info(`MongoDB Connected: ${mongoose.connection.host}`)
    
    mongoose.connection.on('error', (err) => {
      logger.error(`Mongoose connection error: ${err}`)
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB')
    })

    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      logger.info('Mongoose connection closed due to app termination')
      process.exit(0)
    })

  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
