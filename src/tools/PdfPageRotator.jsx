import { useState } from 'react'
import { saveAs } from 'file-saver'
import { PDFDocument, degrees } from 'pdf-lib'
import ToolLayout from '../components/ToolLayout'
import UploadZone, { FilePreview } from '../components/UploadZone'
import { useProcessing } from '../hooks/useProcessing'

const PDF_ACCEPT = { 'application/pdf': ['.pdf'] }
const MAX_SIZE = 200 * 1024 * 1024

const ROTATIONS = [
  { value: 90, label: '90° clockwise' },
  { value: -90, label: '90° counter-clockwise' },
  { value: 180, label: '180°' },
]

export default function PdfPageRotator() {
  const [files, setFiles] = useState([])
  const [rotation, setRotation] = useState(90)
  const [allPages, setAllPages] = useState(true)
  const [pageNum, setPageNum] = useState(1)
  const { processing, progress, error, start, finish, setProgressValue, setError, reset } = useProcessing()

  const handleDrop = (accepted) => setFiles(accepted.length ? [accepted[0]] : [])
  const removeFile = () => setFiles([])

  const process = async () => {
    if (!files.length) return
    start()
    try {
      const file = files[0]
      const buf = await file.arrayBuffer()
      const pdf = await PDFDocument.load(buf, { ignoreEncryption: true })
      const pages = pdf.getPages()
      const angle = degrees(rotation)
      if (allPages) {
        pages.forEach((p) => p.setRotation(angle.add(p.getRotation())))
      } else {
        const idx = Math.min(Math.max(1, pageNum), pages.length) - 1
        pages[idx].setRotation(angle.add(pages[idx].getRotation()))
      }
      setProgressValue(100)
      const outBytes = await pdf.save()
      const blob = new Blob([outBytes], { type: 'application/pdf' })
      saveAs(blob, file.name.replace(/\.pdf$/i, '-rotated.pdf'))
      finish()
    } catch (e) {
      setError(e?.message || 'Failed to rotate PDF')
      finish()
    }
  }

  return (
    <ToolLayout
      title="Rotate PDF Pages – Free Online Tool"
      description="Rotate PDF pages by 90° or 180° in your browser. Fix sideways scans by rotating all pages or just a single page."
    >
      <UploadZone onDrop={handleDrop} accept={PDF_ACCEPT} multiple={false} maxSize={MAX_SIZE} disabled={processing} />
      <FilePreview files={files} onRemove={removeFile} />
      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-slate-400 text-sm">Rotation</span>
          <select
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            className="mt-1 w-full px-4 py-2 rounded-xl bg-dark-700 border border-dark-500 text-white"
          >
            {ROTATIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="scope"
            checked={allPages}
            onChange={() => setAllPages(true)}
            className="accent-accent-primary"
          />
          <span className="text-slate-300">All pages</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="scope"
            checked={!allPages}
            onChange={() => setAllPages(false)}
            className="accent-accent-primary"
          />
          <span className="text-slate-300">Page number</span>
          <input
            type="number"
            min="1"
            value={pageNum}
            onChange={(e) => setPageNum(Number(e.target.value) || 1)}
            disabled={allPages}
            className="w-20 px-2 py-1 rounded-lg bg-dark-700 border border-dark-500 text-white text-sm disabled:opacity-50"
          />
        </label>
      </div>
      {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
      {processing && (
        <div className="mt-4 h-2 bg-dark-600 rounded-full overflow-hidden">
          <div className="h-full bg-accent-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={process}
          disabled={!files.length || processing}
          className="px-6 py-3 rounded-xl bg-accent-primary text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-secondary transition-colors"
        >
          {processing ? 'Rotating…' : 'Rotate PDF'}
        </button>
        {files.length > 0 && !processing && (
          <button type="button" onClick={() => { setFiles([]); reset(); }} className="px-6 py-3 rounded-xl bg-dark-600 text-slate-300 hover:bg-dark-500">Clear</button>
        )}
      </div>
      <div className="mt-10 grid gap-6">
        <section>
          <h2 className="font-display text-xl text-white mb-2">Description</h2>
          <p className="text-slate-300 text-sm">
            Quickly rotate PDF pages that were scanned sideways or upside down. Apply rotation to
            the entire document or target a single page that needs fixing.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-white mb-2">When to use this tool</h2>
          <p className="text-slate-300 text-sm">
            Helpful after scanning documents with a phone or printer when some pages are rotated
            incorrectly before submitting them to portals or email.
          </p>
        </section>
      </div>
    </ToolLayout>
  )
}
