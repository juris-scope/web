import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
  enable2FA,
  disable2FA,
  getSessions,
  revokeSession,
  signOutOthers,
  updatePreferences,
  getStatistics,
  exportData,
  deleteAccount,
} from '../controllers/userController.js'

const router = express.Router()

// ensure uploads dir exists
const uploadsDir = path.resolve(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, '_')
    cb(null, `${base}_${Date.now()}${ext}`)
  }
})
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!/image\/(jpeg|png)/.test(file.mimetype)) return cb(new Error('Only JPG/PNG allowed'))
    cb(null, true)
  }
})

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.post('/avatar', upload.single('avatar'), uploadAvatar)
router.put('/password', changePassword)

router.post('/2fa/enable', enable2FA)
router.post('/2fa/disable', disable2FA)

router.get('/sessions', getSessions)
router.delete('/sessions/:id', revokeSession)
router.post('/sessions/signout-others', signOutOthers)

router.put('/preferences', updatePreferences)
router.get('/statistics', getStatistics)
router.get('/export-data', exportData)
router.delete('/account', deleteAccount)

export default router
