import app from './app.js'
import config from './config/environment.js'
import connectDB from './config/database.js'
import logger from './utils/logger.js'

const PORT = config.PORT || 5000

connectDB()

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${config.NODE_ENV} mode on port ${PORT}`)
  logger.info(`CORS enabled for: ${config.CORS_ORIGIN}`)
})

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`)
  server.close(() => process.exit(1))
})

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`)
  process.exit(1)
})

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  server.close(() => logger.info('Process terminated'))
})
