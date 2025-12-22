import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import config from '../config/environment.js'
import { successResponse, errorResponse } from '../utils/response.js'
import logger from '../utils/logger.js'

const generateToken = (userId) => {
  return jwt.sign({ userId }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN
  })
}

export const register = async (req, res) => {
  try {
    const { username, email, password, fullName, department } = req.body

    const user = await User.create({
      username,
      email,
      passwordHash: password,
      fullName,
      department,
      role: 'customer'
    })

    logger.info(`User registered: ${username}`)

    successResponse(res, 'User registered successfully', {
      userId: user._id,
      username: user.username,
      email: user.email
    }, 201)

  } catch (error) {
    logger.error(`Registration error: ${error.message}`)
    errorResponse(res, error.message, 500)
  }
}
