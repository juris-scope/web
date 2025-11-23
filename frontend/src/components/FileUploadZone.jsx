import { useCallback, useRef, useState } from 'react'
import axios from 'axios'
import { api } from '../utils/api'

const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
const ACCEPT_EXT = ['.pdf', '.docx', '.txt']

export default function FileUploadZone({ language = 'English', onUploaded }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const validateFile = (f) => {
    if (!f) return 'No file selected.'
    const ext = '.' + f.name.split('.').pop().toLowerCase()
    if (!ACCEPTED.includes(f.type) && !ACCEPT_EXT.includes(ext)) {
      return 'Unsupported format. Use PDF, DOCX, or TXT.'
    }
    if (f.size > MAX_SIZE) {
      return 'File too large. Max 10MB.'
    }
    return ''
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    const v = validateFile(f)
    if (v) { setError(v); return }
    setError('')
    setFile(f)
  }, [])

  const onChange = (e) => {
    const f = e.target.files?.[0]
    const v = validateFile(f)
    if (v) { setError(v); return }
    setError('')
    setFile(f)
  }

  const upload = async () => {
    if (!file) { setError('Please select a file.'); return }
    const v = validateFile(file)
    if (v) { setError(v); return }

    const form = new FormData()
    form.append('file', file)
    form.append('language', language)

    try {
      setLoading(true)
      setProgress(0)
      setError('')
      const res = await api.post('/api/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (!e.total) return
          setProgress(Math.round((e.loaded * 100) / e.total))
        }
      })
      onUploaded && onUploaded(res.data)
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Upload failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e)=>{e.preventDefault(); setDragOver(true)}}
        onDragLeave={()=>setDragOver(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition ${dragOver ? 'border-brand-orange bg-orange-50' : 'border-gray-300'}`}
        onClick={()=>inputRef.current?.click()}
        role="button"
        aria-label="Upload file"
      >
        <input ref={inputRef} type="file" className="hidden" accept={ACCEPT_EXT.join(',')} onChange={onChange} />
        <div className="mx-auto mb-3">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="#FF851B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="font-medium text-gray-900">Drag & drop your contract here or click to browse files</div>
        <div className="text-sm text-gray-500 mt-1">Supported formats: PDF, DOCX, TXT (Max 10MB)</div>
        {file && <div className="mt-3 text-sm text-gray-700">Selected: <span className="font-medium">{file.name}</span></div>}
      </div>

      {loading && (
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"><div className="bg-brand-orange h-2" style={{width:`${progress}%`}}/></div>
      )}
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="flex justify-end">
        <button onClick={upload} className="btn-primary">Upload</button>
      </div>
    </div>
  )
}
