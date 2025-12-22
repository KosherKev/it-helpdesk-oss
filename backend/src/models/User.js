import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  passwordHash: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['customer', 'technician', 'admin'],
    default: 'customer'
  },
  fullName: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next()
  const salt = await bcrypt.genSalt(10)
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt)
  next()
})

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash)
}

// Remove sensitive data from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject()
  delete obj.passwordHash
  return obj
}

export default mongoose.model('User', userSchema)
