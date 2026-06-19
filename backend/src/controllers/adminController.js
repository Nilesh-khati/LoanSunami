import Lead from '../models/Lead.js'
import User from '../models/User.js'

/**
 * @desc    Get admin dashboard analytics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date()

    const startOfToday     = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfMonth     = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
    const startOf6Months   = new Date(now.getFullYear(), now.getMonth() - 5, 1)

    // ── Parallel base counts ─────────────────────────────────
    const [
      totalLeads, todayLeads,
      newLeads, contactedLeads, qualifiedLeads, closedLeads,
      thisMonthLeads, lastMonthLeads, totalUsers,
    ] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ createdAt: { $gte: startOfToday } }),
      Lead.countDocuments({ status: 'New' }),
      Lead.countDocuments({ status: 'Contacted' }),
      Lead.countDocuments({ status: 'Qualified' }),
      Lead.countDocuments({ status: 'Closed' }),
      Lead.find({ createdAt: { $gte: startOfMonth } }, 'loanAmount').lean(),
      Lead.find({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }, 'loanAmount').lean(),
      User.countDocuments({ role: 'user' }),
    ])

    const thisMonthVolume = thisMonthLeads.reduce((s, l) => s + (l.loanAmount || 0), 0)
    const lastMonthVolume = lastMonthLeads.reduce((s, l) => s + (l.loanAmount || 0), 0)
    const avgLoanAmount   = thisMonthLeads.length > 0
      ? Math.round(thisMonthVolume / thisMonthLeads.length) : 0

    // ── Last 7 days — leads per day ─────────────────────────
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const d    = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
      const next = new Date(d); next.setDate(next.getDate() + 1)
      const count = await Lead.countDocuments({ createdAt: { $gte: d, $lt: next } })
      last7Days.push({
        date:  d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        count,
      })
    }

    // ── Last 6 months — leads + volume per month ────────────
    const last6Months = []
    for (let i = 5; i >= 0; i--) {
      const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const mEnd   = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999)
      const mLeads = await Lead.find(
        { createdAt: { $gte: mStart, $lte: mEnd } },
        'loanAmount'
      ).lean()
      const volume = mLeads.reduce((s, l) => s + (l.loanAmount || 0), 0)
      last6Months.push({
        month:  mStart.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
        leads:  mLeads.length,
        volume: Math.round(volume / 100000), // in Lakhs
      })
    }

    // ── Purpose breakdown ───────────────────────────────────
    const purposeAgg = await Lead.aggregate([
      { $group: { _id: '$loanPurpose', count: { $sum: 1 } } },
      { $sort:  { count: -1 } },
    ])
    const purposeBreakdown = purposeAgg
      .filter(p => p._id)
      .map(p => ({ purpose: p._id, count: p.count }))

    // ── City breakdown (top 6) ──────────────────────────────
    const cityAgg = await Lead.aggregate([
      { $match: { city: { $exists: true, $ne: '' } } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort:  { count: -1 } },
      { $limit: 6 },
    ])
    const cityBreakdown = cityAgg.map(c => ({ city: c._id, count: c.count }))

    // ── Employment type breakdown ───────────────────────────
    const empAgg = await Lead.aggregate([
      { $match: { employmentType: { $exists: true, $ne: '' } } },
      { $group: { _id: '$employmentType', count: { $sum: 1 } } },
      { $sort:  { count: -1 } },
    ])
    const employmentBreakdown = empAgg.map(e => ({ type: e._id, count: e.count }))

    // ── Average loan by purpose ─────────────────────────────
    const avgByPurpose = await Lead.aggregate([
      { $match: { loanPurpose: { $exists: true, $ne: '' } } },
      { $group: { _id: '$loanPurpose', avg: { $avg: '$loanAmount' }, count: { $sum: 1 } } },
      { $sort:  { avg: -1 } },
    ])
    const loanByPurpose = avgByPurpose.map(p => ({
      purpose: p._id,
      avgLoan: Math.round(p.avg / 100000 * 10) / 10, // Lakhs with 1 decimal
      count:   p.count,
    }))

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalLeads,
          todayLeads,
          newLeads,
          contactedLeads,
          qualifiedLeads,
          closedLeads,
          totalUsers,
          avgLoanAmount,
          thisMonthLeadsCount: thisMonthLeads.length,
          thisMonthVolume,
          lastMonthVolume,
          conversionRate: totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0,
          contactRate:    totalLeads > 0 ? Math.round((contactedLeads  / totalLeads) * 100) : 0,
        },
        statusBreakdown: [
          { status: 'New',       count: newLeads       },
          { status: 'Contacted', count: contactedLeads },
          { status: 'Qualified', count: qualifiedLeads },
          { status: 'Closed',    count: closedLeads    },
        ],
        last7Days,
        last6Months,
        purposeBreakdown,
        cityBreakdown,
        employmentBreakdown,
        loanByPurpose,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get all admin users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'admin' }).lean()
    res.status(200).json({ success: true, data: users })
  } catch (error) {
    next(error)
  }
}
