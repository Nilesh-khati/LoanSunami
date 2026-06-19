import User from '../models/User.js'
import { sendTokenResponse } from '../utils/jwt.js'

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req, res, next) => {
  try {
    const { fullName, email, phone, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      })
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password,
    })

    sendTokenResponse(user, 201, res)
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Login user
 * @route   POST /api/auth/signin
 * @access  Public
 */
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

    sendTokenResponse(user, 200, res)
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Logout user (clear cookie)
 * @route   POST /api/auth/signout
 * @access  Private
 */
export const signout = async (req, res) => {
  res
    .cookie('token', 'none', {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      message: 'Signed out successfully.',
    })
}

/**
 * @desc    Update current user profile
 * @route   PUT /api/auth/me
 * @access  Private
 */
export const updateMe = async (req, res, next) => {
  try {
    const allowedFields = ['fullName', 'phone']
    const updates = {}
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field]
    })

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    next(error)
  }
}
