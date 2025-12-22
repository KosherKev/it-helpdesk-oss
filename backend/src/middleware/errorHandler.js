import logger from '../utils/logger.js'
import config from '../config/environment.js'

export const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id
  })

  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors).map(e => e.message).join(', ')
  }

  if (err.code === 11000) {
    statusCode = 400
    const field = Object.keys(err.keyPattern)[0]
    message = `${field} already exists`
  }

  if (err.name === 'CastError') {
    statusCode = 400
    message = 'Invalid ID format'
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.NODE_ENV === 'development' && { stack: err.stack })
  })
}

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  })
}
