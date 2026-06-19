import FAQ from '../models/FAQ.js'

/**
 * @desc    Get all active FAQs
 * @route   GET /api/faqs
 * @access  Public
 */
export const getFAQs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean()
    res.status(200).json({ success: true, data: faqs })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get all FAQs including inactive (admin)
 * @route   GET /api/faqs/all
 * @access  Private/Admin
 */
export const getAllFAQs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: 1 }).lean()
    res.status(200).json({ success: true, data: faqs })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Create a new FAQ
 * @route   POST /api/faqs
 * @access  Private/Admin
 */
export const createFAQ = async (req, res, next) => {
  try {
    const { question, answer, order } = req.body

    const faq = await FAQ.create({
      question,
      answer,
      order: order || 0,
      lastUpdatedBy: req.user._id,
    })

    res.status(201).json({ success: true, data: faq })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Update a FAQ
 * @route   PUT /api/faqs/:id
 * @access  Private/Admin
 */
export const updateFAQ = async (req, res, next) => {
  try {
    const allowedFields = ['question', 'answer', 'isActive', 'order']
    const updates = { lastUpdatedBy: req.user._id }
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field]
    })

    const faq = await FAQ.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })

    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found.' })
    }

    res.status(200).json({ success: true, data: faq })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Delete a FAQ
 * @route   DELETE /api/faqs/:id
 * @access  Private/Admin
 */
export const deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id)
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found.' })
    }
    res.status(200).json({ success: true, message: 'FAQ deleted successfully.' })
  } catch (error) {
    next(error)
  }
}
