import { Router } from 'express'
import { body } from 'express-validator'
import {
  getFAQs,
  getAllFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from '../controllers/faqController.js'
import { protect, restrictTo } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

// ── GET /api/faqs  (public) ───────────────────────────────────
router.get('/', getFAQs)

// ── GET /api/faqs/all  (admin) ────────────────────────────────
router.get('/all', protect, restrictTo('admin'), getAllFAQs)

// ── POST /api/faqs  (admin) ───────────────────────────────────
router.post(
  '/',
  protect,
  restrictTo('admin'),
  [
    body('question')
      .trim()
      .notEmpty().withMessage('Question is required')
      .isLength({ max: 300 }).withMessage('Question cannot exceed 300 characters'),
    body('answer')
      .trim()
      .notEmpty().withMessage('Answer is required')
      .isLength({ max: 2000 }).withMessage('Answer cannot exceed 2000 characters'),
  ],
  validate,
  createFAQ
)

// ── PUT /api/faqs/:id  (admin) ────────────────────────────────
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  [
    body('question')
      .optional()
      .trim()
      .isLength({ max: 300 }).withMessage('Question cannot exceed 300 characters'),
    body('answer')
      .optional()
      .trim()
      .isLength({ max: 2000 }).withMessage('Answer cannot exceed 2000 characters'),
  ],
  validate,
  updateFAQ
)

// ── DELETE /api/faqs/:id  (admin) ─────────────────────────────
router.delete('/:id', protect, restrictTo('admin'), deleteFAQ)

export default router
