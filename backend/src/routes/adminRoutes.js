import { Router } from 'express'
import { getDashboardStats, getAdminUsers } from '../controllers/adminController.js'
import { protect, restrictTo } from '../middleware/auth.js'

const router = Router()

// All admin routes require auth + admin role
router.use(protect, restrictTo('admin'))

// ── GET /api/admin/stats ──────────────────────────────────────
router.get('/stats', getDashboardStats)

// ── GET /api/admin/users ──────────────────────────────────────
router.get('/users', getAdminUsers)

export default router
