import express from 'express'
import multer from 'multer'
import path from 'path'
import { handleUpload } from '../controllers/uploadController.js'

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req,file,cb)=> cb(null, path.resolve('uploads')),
  filename: (req,file,cb)=> {
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi,'_')
    cb(null, `${name}-${Date.now()}${ext}`)
  }
})

const ACCEPT = ['.pdf', '.docx', '.txt']

function fileFilter(req,file,cb){
  const ext = path.extname(file.originalname).toLowerCase()
  if (!ACCEPT.includes(ext)) return cb(new Error('Unsupported format. Use PDF, DOCX, or TXT.'))
  cb(null, true)
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }) // 10MB

router.post('/', upload.single('file'), handleUpload)

export default router
