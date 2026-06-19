import jwt from 'jsonwebtoken'
import User from '../models/User.js'

/**
 * Protect routes — require valid JWT
 */
export const protect = async (req, res, next) => {
  try {
    let token

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }

    // Check cookie as fallback
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from DB
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid — user no longer exists.',
      })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired.' })
    }
    next(error)
  }
}

/**
 * Restrict to specific roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action.',
      })
    }
    next()
  }
}

/**
 * Optional auth — attaches user if token present but doesn't block
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id)
    }
  } catch {
    // silently ignore — token is optional
  }
  next()
}
