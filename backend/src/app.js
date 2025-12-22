import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import config from './config/environment.js'
import routes from './routes/index.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use('/api', routes)
app.use(notFound)
app.use(errorHandler)

export default app
