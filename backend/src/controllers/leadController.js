import Lead from '../models/Lead.js'
import { sendEmail, leadConfirmationEmail, adminNewLeadEmail } from '../utils/email.js'
import { leadsToCSV } from '../utils/csvExport.js'

/**
 * @desc    Submit a new loan application (lead)
 * @route   POST /api/leads
 * @access  Public (optionally authenticated)
 */
export const submitLead = async (req, res, next) => {
  try {
    const leadData = { ...req.body }

    // Attach user if authenticated
    if (req.user) {
      leadData.user = req.user._id
    }

    const lead = await Lead.create(leadData)

    // Send emails asynchronously (don't block response)
    Promise.all([
      sendEmail(leadConfirmationEmail(lead)),
      sendEmail(adminNewLeadEmail(lead)),
    ])
      .then(([userResult, adminResult]) => {
        if (userResult.success || adminResult.success) {
          Lead.findByIdAndUpdate(lead._id, { emailSent: true }).catch(() => {})
        }
      })
      .catch((err) => console.error('[Lead Email Error]', err.message))

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully. Our specialist will contact you within 24 hours.',
      data: {
        id: lead._id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        loanAmount: lead.loanAmount,
        loanPurpose: lead.loanPurpose,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get all leads (admin)
 * @route   GET /api/leads
 * @access  Private/Admin
 */
export const getAllLeads = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query

    const query = {}

    // Status filter
    if (status && status !== 'All') {
      query.status = status
    }

    // Search filter — name, email, city
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i')
      query.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { city: regex },
        { phone: regex },
      ]
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }

    const [leads, total] = await Promise.all([
      Lead.find(query).sort(sort).skip(skip).limit(parseInt(limit)).lean(),
      Lead.countDocuments(query),
    ])

    // Stats for dashboard
    const [totalCount, contactedCount, qualifiedCount] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'Contacted' }),
      Lead.countDocuments({ status: 'Qualified' }),
    ])

    // Average loan amount this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    const monthlyLeads = await Lead.find({ createdAt: { $gte: startOfMonth } }, 'loanAmount').lean()
    const avgLoan =
      monthlyLeads.length > 0
        ? Math.round(monthlyLeads.reduce((sum, l) => sum + (l.loanAmount || 0), 0) / monthlyLeads.length)
        : 0

    // Today's new leads count
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const todayCount = await Lead.countDocuments({ createdAt: { $gte: startOfToday } })

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
      stats: {
        totalLeads: totalCount,
        todayLeads: todayCount,
        contacted: contactedCount,
        qualified: qualifiedCount,
        avgLoanAmount: avgLoan,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get single lead by ID (admin)
 * @route   GET /api/leads/:id
 * @access  Private/Admin
 */
export const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' })
    }
    res.status(200).json({ success: true, data: lead })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Update lead status / admin notes (admin)
 * @route   PUT /api/leads/:id
 * @access  Private/Admin
 */
export const updateLead = async (req, res, next) => {
  try {
    const allowedUpdates = ['status', 'adminNotes', 'assignedTo']
    const updates = {}
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field]
    })

    const lead = await Lead.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' })
    }

    res.status(200).json({ success: true, data: lead })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Delete a lead (admin)
 * @route   DELETE /api/leads/:id
 * @access  Private/Admin
 */
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id)
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' })
    }
    res.status(200).json({ success: true, message: 'Lead deleted successfully.' })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Export leads to CSV
 * @route   GET /api/leads/export/csv
 * @access  Private/Admin
 */
export const exportLeadsCSV = async (req, res, next) => {
  try {
    const { status, search } = req.query
    const query = {}

    if (status && status !== 'All') query.status = status
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i')
      query.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { city: regex },
      ]
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 }).lean()
    const csv = leadsToCSV(leads)

    const filename = `loansunami-leads-${new Date().toISOString().split('T')[0]}.csv`

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.status(200).send(csv)
  } catch (error) {
    next(error)
  }
}
