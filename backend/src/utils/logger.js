import winston from 'winston'
import config from '../config/environment.js'

const { combine, timestamp, printf, colorize, errors } = winston.format

const logFormat = printf(({ timestamp, level, message, stack }) => {
  let log = `${timestamp} [${level.toUpperCase()}]: ${message}`
  if (stack) log += `\n${stack}`
  return log
})

const transports = [
  new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      logFormat
    )
  })
]

if (config.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: config.LOG_FILE,
      maxsize: 5242880,
      maxFiles: 5,
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat
      )
    })
  )
}

const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  transports
})

export default logger
