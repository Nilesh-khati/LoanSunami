import { Router } from 'express'
import { body } from 'express-validator'
import { signup, signin, getMe, signout, updateMe } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

// ── POST /api/auth/signup ──────────────────────────────────────
router.post(
  '/signup',
  [
    body('fullName')
      .trim()
      .notEmpty().withMessage('Full name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Full name must be 2–100 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('phone')
      .trim()
      .notEmpty().withMessage('Phone number is required')
      .matches(/^[+\d\s\-()]{7,20}$/).withMessage('Please provide a valid phone number'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match')
        }
        return true
      }),
  ],
  validate,
  signup
)

// ── POST /api/auth/signin ──────────────────────────────────────
router.post(
  '/signin',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required'),
  ],
  validate,
  signin
)

// ── GET /api/auth/me ──────────────────────────────────────────
router.get('/me', protect, getMe)

// ── PUT /api/auth/me ──────────────────────────────────────────
router.put(
  '/me',
  protect,
  [
    body('fullName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('Full name must be 2–100 characters'),
    body('phone')
      .optional()
      .trim()
      .matches(/^[+\d\s\-()]{7,20}$/).withMessage('Please provide a valid phone number'),
  ],
  validate,
  updateMe
)

// ── POST /api/auth/signout ────────────────────────────────────
router.post('/signout', protect, signout)

export default router
