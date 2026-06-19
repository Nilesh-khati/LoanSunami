import Rate from '../models/Rate.js'

/**
 * @desc    Get all active interest rates
 * @route   GET /api/rates
 * @access  Public
 */
export const getRates = async (req, res, next) => {
  try {
    const rates = await Rate.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean()
    res.status(200).json({ success: true, data: rates })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get all rates including inactive (admin)
 * @route   GET /api/rates/all
 * @access  Private/Admin
 */
export const getAllRates = async (req, res, next) => {
  try {
    const rates = await Rate.find().sort({ order: 1, createdAt: 1 }).lean()
    res.status(200).json({ success: true, data: rates })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Create a new rate
 * @route   POST /api/rates
 * @access  Private/Admin
 */
export const createRate = async (req, res, next) => {
  try {
    const { type, rate, rateValue, trend, lender, tenure, order } = req.body

    const newRate = await Rate.create({
      type,
      rate,
      rateValue,
      trend,
      lender,
      tenure,
      order: order || 0,
      lastUpdatedBy: req.user._id,
    })

    res.status(201).json({ success: true, data: newRate })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Update a rate
 * @route   PUT /api/rates/:id
 * @access  Private/Admin
 */
export const updateRate = async (req, res, next) => {
  try {
    const allowedFields = ['type', 'rate', 'rateValue', 'trend', 'lender', 'tenure', 'isActive', 'order']
    const updates = { lastUpdatedBy: req.user._id }
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field]
    })

    const rate = await Rate.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })

    if (!rate) {
      return res.status(404).json({ success: false, message: 'Rate not found.' })
    }

    res.status(200).json({ success: true, data: rate })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Delete a rate
 * @route   DELETE /api/rates/:id
 * @access  Private/Admin
 */
export const deleteRate = async (req, res, next) => {
  try {
    const rate = await Rate.findByIdAndDelete(req.params.id)
    if (!rate) {
      return res.status(404).json({ success: false, message: 'Rate not found.' })
    }
    res.status(200).json({ success: true, message: 'Rate deleted successfully.' })
  } catch (error) {
    next(error)
  }
}
