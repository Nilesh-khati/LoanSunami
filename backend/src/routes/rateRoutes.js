import { Router } from 'express'
import { body } from 'express-validator'
import {
  getRates,
  getAllRates,
  createRate,
  updateRate,
  deleteRate,
} from '../controllers/rateController.js'
import { protect, restrictTo } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

const rateValidation = [
  body('type').trim().notEmpty().withMessage('Loan type is required'),
  body('rate').trim().notEmpty().withMessage('Rate display string is required'),
  body('rateValue')
    .notEmpty().withMessage('Rate value is required')
    .isFloat({ min: 0, max: 50 }).withMessage('Rate value must be between 0 and 50')
    .toFloat(),
  body('trend')
    .optional()
    .isIn(['up', 'down', 'stable']).withMessage('Trend must be up, down, or stable'),
  body('lender').trim().notEmpty().withMessage('Lender name is required'),
  body('tenure').trim().notEmpty().withMessage('Tenure is required'),
]

// ── GET /api/rates  (public — active rates for frontend) ──────
router.get('/', getRates)

// ── GET /api/rates/all  (admin — all rates incl inactive) ─────
router.get('/all', protect, restrictTo('admin'), getAllRates)

// ── POST /api/rates  (admin) ──────────────────────────────────
router.post('/', protect, restrictTo('admin'), rateValidation, validate, createRate)

// ── PUT /api/rates/:id  (admin) ───────────────────────────────
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  [
    body('rateValue')
      .optional()
      .isFloat({ min: 0, max: 50 }).withMessage('Rate value must be between 0 and 50')
      .toFloat(),
    body('trend')
      .optional()
      .isIn(['up', 'down', 'stable']).withMessage('Trend must be up, down, or stable'),
  ],
  validate,
  updateRate
)

// ── DELETE /api/rates/:id  (admin) ────────────────────────────
router.delete('/:id', protect, restrictTo('admin'), deleteRate)

export default router
