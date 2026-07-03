import { Router } from 'express'
import { body, query } from 'express-validator'
import {
  submitLead,
  submitHomeLoan,
  submitPersonalLoan,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/leadController.js'
import { protect, restrictTo, optionalAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

/* ── Shared personal info validation ── */
const personalInfoValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ max: 50 }),
  body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ max: 50 }),
  body('email').trim().notEmpty().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('phone').trim().notEmpty().matches(/^[+\d\s\-()]{7,20}$/).withMessage('Valid phone required'),
  body('dob').optional({ checkFalsy: true }).isISO8601().withMessage('Valid date of birth required'),
  body('monthlyIncome').optional({ checkFalsy: true }).isNumeric().toFloat(),
  body('employmentType').optional({ checkFalsy: true })
    .isIn(['Salaried', 'Self-Employed', 'Business Owner', 'Freelancer', 'Retired', '']),
  body('notes').optional().trim().isLength({ max: 1000 }),
]

// ── POST /api/leads/home-loan  (public — home loan specific) ──
router.post(
  '/home-loan',
  optionalAuth,
  [
    ...personalInfoValidation,
    body('loanAmount').notEmpty().isNumeric().custom(v => v >= 100000)
      .withMessage('Minimum home loan amount is ₹1 Lakh').toFloat(),
    body('loanSubType').optional().trim(),   // Home Purchase / Construction / Renovation / Balance Transfer
    body('propertyLocation').optional().trim(),
    body('propertyValue').optional({ checkFalsy: true }).isNumeric().toFloat(),
    body('downPayment').optional({ checkFalsy: true }).isNumeric().toFloat(),
    body('tenure').optional().trim(),
    body('creditScore').optional().trim(),
    body('existingLoans').optional({ checkFalsy: true }).isNumeric().toFloat(),
  ],
  validate,
  submitHomeLoan
)

// ── POST /api/leads/personal-loan  (public — personal loan) ──
router.post(
  '/personal-loan',
  optionalAuth,
  [
    ...personalInfoValidation,
    body('loanAmount').notEmpty().isNumeric().custom(v => v >= 50000)
      .withMessage('Minimum personal loan amount is ₹50,000').toFloat(),
    body('loanSubType').optional().trim(),   // Medical / Education / Travel / Debt Consolidation
    body('tenure').optional().trim(),
    body('creditScore').optional().trim(),
    body('monthlyExpenses').optional({ checkFalsy: true }).isNumeric().toFloat(),
    body('existingLoans').optional({ checkFalsy: true }).isNumeric().toFloat(),
  ],
  validate,
  submitPersonalLoan
)

// ── POST /api/leads  (public — general application) ──────────
router.post(
  '/',
  optionalAuth,
  [
    body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ max: 50 }),
    body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ max: 50 }),
    body('email').trim().notEmpty().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('phone').trim().notEmpty().matches(/^[+\d\s\-()]{7,20}$/).withMessage('Please provide a valid phone number'),
    body('dob').optional({ checkFalsy: true }).isISO8601().withMessage('Please provide a valid date of birth'),
    body('employmentType').optional({ checkFalsy: true })
      .isIn(['Salaried', 'Self-Employed', 'Business Owner', 'Freelancer', 'Retired', '']),
    body('monthlyIncome').optional({ checkFalsy: true }).isNumeric().toFloat(),
    body('loanAmount').notEmpty().isNumeric().custom((v) => v >= 10000)
      .withMessage('Minimum loan amount is ₹10,000').toFloat(),
    body('downPayment').optional({ checkFalsy: true }).isNumeric().toFloat(),
    body('monthlyExpenses').optional({ checkFalsy: true }).isNumeric().toFloat(),
    body('existingLoans').optional({ checkFalsy: true }).isNumeric().toFloat(),
    body('propertyValue').optional({ checkFalsy: true }).isNumeric().toFloat(),
    body('notes').optional().trim().isLength({ max: 1000 }),
  ],
  validate,
  submitLead
)

// ── GET /api/leads/export/csv  (admin) ────────────────────────
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
    body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Closed']),
    body('adminNotes').optional().trim().isLength({ max: 2000 }),
  ],
  validate,
  updateLead
)

// ── DELETE /api/leads/:id  (admin) ────────────────────────────
router.delete('/:id', protect, restrictTo('admin'), deleteLead)

export default router
