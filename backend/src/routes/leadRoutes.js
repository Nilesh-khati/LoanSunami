import { Router } from 'express'
import { body, query } from 'express-validator'
import {
  submitLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/leadController.js'
import { protect, restrictTo, optionalAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

// ── POST /api/leads  (public — submit application) ────────────
router.post(
  '/',
  optionalAuth,
  [
    // Step 1 — Personal Info
    body('firstName')
      .trim()
      .notEmpty().withMessage('First name is required')
      .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
    body('lastName')
      .trim()
      .notEmpty().withMessage('Last name is required')
      .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('phone')
      .trim()
      .notEmpty().withMessage('Phone number is required')
      .matches(/^[+\d\s\-()]{7,20}$/).withMessage('Please provide a valid phone number'),
    body('dob')
      .optional({ checkFalsy: true })
      .isISO8601().withMessage('Please provide a valid date of birth'),

    // Step 2 — Employment
    body('employmentType')
      .optional({ checkFalsy: true })
      .isIn(['Salaried', 'Self-Employed', 'Business Owner', 'Freelancer', 'Retired', ''])
      .withMessage('Invalid employment type'),
    body('monthlyIncome')
      .optional({ checkFalsy: true })
      .isNumeric().withMessage('Monthly income must be a number')
      .toFloat(),

    // Step 3 — Loan Details
    body('loanAmount')
      .notEmpty().withMessage('Loan amount is required')
      .isNumeric().withMessage('Loan amount must be a number')
      .custom((v) => v >= 10000).withMessage('Minimum loan amount is ₹10,000')
      .toFloat(),
    body('downPayment')
      .optional({ checkFalsy: true })
      .isNumeric().withMessage('Down payment must be a number')
      .toFloat(),

    // Step 5 — Financial
    body('monthlyExpenses')
      .optional({ checkFalsy: true })
      .isNumeric().withMessage('Monthly expenses must be a number')
      .toFloat(),
    body('existingLoans')
      .optional({ checkFalsy: true })
      .isNumeric().withMessage('Existing loan EMI must be a number')
      .toFloat(),
    body('propertyValue')
      .optional({ checkFalsy: true })
      .isNumeric().withMessage('Property value must be a number')
      .toFloat(),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),
  ],
  validate,
  submitLead
)

// ── GET /api/leads/export/csv  (admin) ────────────────────────
// Must be before /:id to avoid route conflict
router.get('/export/csv', protect, restrictTo('admin'), exportLeadsCSV)

// ── GET /api/leads  (admin) ────────────────────────────────────
router.get('/', protect, restrictTo('admin'), getAllLeads)

// ── GET /api/leads/:id  (admin) ────────────────────────────────
router.get('/:id', protect, restrictTo('admin'), getLeadById)

// ── PUT /api/leads/:id  (admin) ────────────────────────────────
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  [
    body('status')
      .optional()
      .isIn(['New', 'Contacted', 'Qualified', 'Closed'])
      .withMessage('Invalid status value'),
    body('adminNotes')
      .optional()
      .trim()
      .isLength({ max: 2000 }).withMessage('Admin notes cannot exceed 2000 characters'),
  ],
  validate,
  updateLead
)

// ── DELETE /api/leads/:id  (admin) ────────────────────────────
router.delete('/:id', protect, restrictTo('admin'), deleteLead)

export default router
