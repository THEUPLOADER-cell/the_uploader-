import { useState } from 'react'
import { saveAs } from 'file-saver'
import { PDFDocument } from 'pdf-lib'
import ToolLayout from '../components/ToolLayout'
import UploadZone, { FilePreview } from '../components/UploadZone'
import { useProcessing } from '../hooks/useProcessing'

const PDF_ACCEPT = { 'application/pdf': ['.pdf'] }
const MAX_SIZE = 50 * 1024 * 1024
const MAX_FILES = 20

export default function PdfMerger() {
  const [files, setFiles] = useState([])
  const { processing, progress, error, start, finish, setProgressValue, setError, reset } = useProcessing()

  const handleDrop = (accepted) => setFiles((prev) => [...prev, ...accepted].slice(0, MAX_FILES))
  const removeFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))

  const process = async () => {
    if (!files.length) return
    start()
    try {
      const merged = await PDFDocument.create()
      const total = files.length
      for (let i = 0; i < total; i++) {
        setProgressValue((i / total) * 100)
        const file = files[i]
        const buf = await file.arrayBuffer()
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true })
        const pageIndices = Array.from({ length: pdf.getPageCount() }, (_, i) => i)
      const pages = await merged.copyPages(pdf, pageIndices)
        pages.forEach((p) => merged.addPage(p))
      }
      setProgressValue(100)
      const outBytes = await merged.save()
      const blob = new Blob([outBytes], { type: 'application/pdf' })
      saveAs(blob, 'the-uploader-merged.pdf')
      finish()
    } catch (e) {
      setError(e?.message || 'Failed to merge PDFs')
    }
  }

  return (
    <ToolLayout
      title="PDF Merger – Combine PDF Files Online"
      description="Merge multiple PDF files into a single document in your browser. Keep pages in order and download one clean combined PDF."
    >
      <UploadZone
        onDrop={handleDrop}
        accept={PDF_ACCEPT}
        multiple
        maxSize={MAX_SIZE}
        maxFiles={MAX_FILES}
        disabled={processing}
      />
      <FilePreview files={files} onRemove={removeFile} />
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
          {processing ? 'Merging…' : 'Merge PDFs'}
        </button>
        {files.length > 0 && !processing && (
          <button type="button" onClick={() => { setFiles([]); reset(); }} className="px-6 py-3 rounded-xl bg-dark-600 text-slate-300 hover:bg-dark-500">Clear</button>
        )}
      </div>
      <div className="mt-10 grid gap-6">
        <section>
          <h2 className="font-display text-xl text-white mb-2">Description</h2>
          <p className="text-slate-300 text-sm">
            Use this PDF merger to join several PDF files into one document. Preserve the order of uploads
            so you can create a single, organized file for portals, email, or printing.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-white mb-2">When to use this tool</h2>
          <p className="text-slate-300 text-sm">
            Ideal when you have multiple statements, scanned pages, or forms that must be uploaded as
            a single PDF. Combine everything on your device without sending files to a server.
          </p>
        </section>
      </div>
    </ToolLayout>
  )
}
