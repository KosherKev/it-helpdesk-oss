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

export const login = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username }).select('+passwordHash')
    
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401)
    }

    if (!user.isActive) {
      return errorResponse(res, 'Account is inactive', 403)
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401)
    }

    user.lastLogin = new Date()
    await user.save()

    const token = generateToken(user._id)

    logger.info(`User logged in: ${username}`)

    successResponse(res, 'Login successful', {
      token,
      expiresIn: 86400,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        department: user.department
      }
    })

  } catch (error) {
    logger.error(`Login error: ${error.message}`)
    errorResponse(res, 'Login failed', 500)
  }
}

export const logout = async (req, res) => {
  logger.info(`User logged out: ${req.user.username}`)
  successResponse(res, 'Logout successful')
}

export const getProfile = async (req, res) => {
  successResponse(res, 'Profile retrieved', {
    user: req.user
  })
}
