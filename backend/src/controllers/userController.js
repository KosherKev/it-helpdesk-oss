import User from '../models/User.js'
import { successResponse, errorResponse } from '../utils/response.js'

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, department, search } = req.query
    const query = {}

    if (role) query.role = role
    if (department) query.department = department
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ]
    }

    const users = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-passwordHash')
      .sort({ createdAt: -1 })

    const count = await User.countDocuments(query)

    return successResponse(res, 'Users retrieved successfully', {
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count
    })
  } catch (error) {
    return errorResponse(res, 'Error retrieving users', 500, error.message)
  }
}

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash')
    if (!user) {
      return errorResponse(res, 'User not found', 404)
    }
    return successResponse(res, 'User retrieved successfully', user)
  } catch (error) {
    return errorResponse(res, 'Error retrieving user', 500, error.message)
  }
}

export const updateUser = async (req, res) => {
  try {
    const { fullName, department, role, isActive } = req.body
    const userId = req.params.id

    // Only admin can update role and isActive status
    if ((role || isActive !== undefined) && req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to update restricted fields', 403)
    }

    // Users can only update their own profile unless they are admin
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to update this profile', 403)
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: req.body }, // Be careful here, might want to be more explicit
      { new: true, runValidators: true }
    ).select('-passwordHash')

    if (!user) {
      return errorResponse(res, 'User not found', 404)
    }

    return successResponse(res, 'User updated successfully', user)
  } catch (error) {
    return errorResponse(res, 'Error updating user', 500, error.message)
  }
}

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    )

    if (!user) {
      return errorResponse(res, 'User not found', 404)
    }

    return successResponse(res, 'User deactivated successfully')
  } catch (error) {
    return errorResponse(res, 'Error deactivating user', 500, error.message)
  }
}

export const getTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({ role: 'technician', isActive: true })
      .select('fullName email department')
    
    return successResponse(res, 'Technicians retrieved successfully', technicians)
  } catch (error) {
    return errorResponse(res, 'Error retrieving technicians', 500, error.message)
  }
}
