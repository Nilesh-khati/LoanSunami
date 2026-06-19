import { Router } from 'express'

const router = Router()

/**
 * @desc    EMI Calculator
 * @route   GET|POST /api/calculators/emi
 * @access  Public
 * Query/Body params: principal, rate (annual %), tenure (years)
 */
router.all('/emi', (req, res) => {
  const params = req.method === 'POST' ? req.body : req.query
  const principal  = parseFloat(params.principal)
  const annualRate = parseFloat(params.rate)
  const tenureYrs  = parseFloat(params.tenure)

  if (!principal || !annualRate || !tenureYrs) {
    return res.status(400).json({
      success: false,
      message: 'Required params: principal, rate (annual %), tenure (years)',
    })
  }

  const r = annualRate / 12 / 100
  const n = tenureYrs * 12
  const emi = r === 0
    ? principal / n
    : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)

  const totalPayment = emi * n
  const totalInterest = totalPayment - principal

  res.status(200).json({
    success: true,
    data: {
      emi:           Math.round(emi),
      totalPayment:  Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      principal:     Math.round(principal),
      annualRate,
      tenureYears:   tenureYrs,
      tenureMonths:  n,
    },
  })
})

/**
 * @desc    Affordability Calculator
 * @route   GET|POST /api/calculators/affordability
 * @access  Public
 * Params: income, expenses, existingEmi, rate (annual %), tenure (years)
 */
router.all('/affordability', (req, res) => {
  const params       = req.method === 'POST' ? req.body : req.query
  const income       = parseFloat(params.income)
  const expenses     = parseFloat(params.expenses)     || 0
  const existingEmi  = parseFloat(params.existingEmi)  || 0
  const annualRate   = parseFloat(params.rate)
  const tenureYrs    = parseFloat(params.tenure)

  if (!income || !annualRate || !tenureYrs) {
    return res.status(400).json({
      success: false,
      message: 'Required params: income, rate (annual %), tenure (years)',
    })
  }

  const disposable = income - expenses - existingEmi
  const maxEmi     = Math.round(disposable * 0.4)
  const r          = annualRate / 12 / 100
  const n          = tenureYrs * 12
  const maxLoan    = maxEmi > 0
    ? Math.round((maxEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n)))
    : 0

  res.status(200).json({
    success: true,
    data: {
      maxLoanAmount: maxLoan,
      maxEmi,
      disposableIncome: Math.round(disposable),
      annualRate,
      tenureYears: tenureYrs,
    },
  })
})

export default router
