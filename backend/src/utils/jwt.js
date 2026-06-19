import jwt from 'jsonwebtoken'

/**
 * Generate a signed JWT for a user
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

/**
 * Send token in response — explicitly serialize safe user fields
 */
export const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id)

  // Explicitly pick only safe fields — avoids toJSON/select issues
  const safeUser = {
    _id:       user._id,
    fullName:  user.fullName,
    email:     user.email,
    phone:     user.phone,
    role:      user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  }

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  }

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: safeUser,
    })
}
