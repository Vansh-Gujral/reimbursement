import { useRef, useState } from 'react'
import { formatFileSize } from '../../utils/helpers'

const UPLOAD_ICON = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
const CHECK = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const CLOSE = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

export default function UploadZone({ label, hint = 'PDF, JPG, PNG — max 10 MB', accept = '.pdf,.jpg,.jpeg,.png', multiple = false, onFile, required }) {
  const inputRef = useRef()
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)

  function processFile(f) {
    if (!f) return
    if (f.size > 10 * 1024 * 1024) { alert('File must be under 10 MB'); return }
    setFile(f)
    onFile && onFile(f)
  }

  function handleChange(e) { processFile(e.target.files[0]) }
  function handleDrop(e) {
    e.preventDefault(); setDragging(false)
    processFile(e.dataTransfer.files[0])
  }
  function handleRemove() { setFile(null); inputRef.current.value = ''; onFile && onFile(null) }

  return (
    <div className="form-group">
      {label && <label className="form-label">{label}{required && <span className="required"> *</span>}</label>}
      <div
        className={`upload-zone${file ? ' has-file' : ''}${dragging ? ' dragover' : ''}`}
        onClick={() => !file && inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{ cursor: file ? 'default' : 'pointer' }}
      >
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={handleChange} style={{display:'none'}} />
        <div className="upload-zone__icon">{UPLOAD_ICON}</div>
        <div className="upload-zone__title">{file ? file.name : 'Click to upload or drag & drop'}</div>
        <div className="upload-zone__hint">{file ? formatFileSize(file.size) : hint}</div>
      </div>
      {file && (
        <div className="upload-file-item">
          {CHECK}
          <span className="upload-file-item__name">{file.name}</span>
          <span className="upload-file-item__size">{formatFileSize(file.size)}</span>
          <button type="button" className="btn btn-ghost btn-sm btn-icon" onClick={handleRemove}>{CLOSE}</button>
        </div>
      )}
    </div>
  )
}
