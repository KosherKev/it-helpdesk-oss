import jwt from 'jsonwebtoken'
import config from '../config/environment.js'
import User from '../models/User.js'
import { errorResponse } from '../utils/response.js'

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'No token provided', 401)
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, config.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-passwordHash')
    
    if (!user) {
      return errorResponse(res, 'User not found', 401)
    }

    if (!user.isActive) {
      return errorResponse(res, 'Account is inactive', 403)
    }

    req.user = user
    next()

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token', 401)
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired', 401)
    }
    return errorResponse(res, 'Authentication failed', 500)
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Not authenticated', 401)
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 'Insufficient permissions', 403)
    }

    next()
  }
}
