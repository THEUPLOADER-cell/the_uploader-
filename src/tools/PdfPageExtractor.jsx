import { useState } from 'react'
import { saveAs } from 'file-saver'
import { PDFDocument } from 'pdf-lib'
import ToolLayout from '../components/ToolLayout'
import UploadZone, { FilePreview } from '../components/UploadZone'
import { useProcessing } from '../hooks/useProcessing'

const PDF_ACCEPT = { 'application/pdf': ['.pdf'] }
const MAX_SIZE = 200 * 1024 * 1024

export default function PdfPageExtractor() {
  const [files, setFiles] = useState([])
  const [pageRange, setPageRange] = useState('1')
  const { processing, progress, error, start, finish, setProgressValue, setError, reset } = useProcessing()

  const handleDrop = (accepted) => setFiles(accepted.length ? [accepted[0]] : [])
  const removeFile = () => setFiles([])

  const parseRange = (str, maxPage) => {
    const pages = new Set()
    const parts = str.split(/[,\s]+/)
    for (const p of parts) {
      if (p.includes('-')) {
        const [a, b] = p.split('-').map((n) => parseInt(n.trim(), 10))
        const start = Math.max(1, isNaN(a) ? 1 : a)
        const end = Math.min(maxPage, isNaN(b) ? maxPage : b)
        for (let i = start; i <= end; i++) pages.add(i - 1)
      } else {
        const n = parseInt(p, 10)
        if (!isNaN(n) && n >= 1 && n <= maxPage) pages.add(n - 1)
      }
    }
    return [...pages].sort((a, b) => a - b)
  }

  const process = async () => {
    if (!files.length) return
    start()
    try {
      const file = files[0]
      const buf = await file.arrayBuffer()
      const pdf = await PDFDocument.load(buf, { ignoreEncryption: true })
      const numPages = pdf.getPageCount()
      const indices = parseRange(pageRange, numPages)
      if (indices.length === 0) {
        setError('Enter at least one valid page number (e.g. 1, 3-5, 7)')
        return
      }
      setProgressValue(50)
      const newPdf = await PDFDocument.create()
      const copied = await newPdf.copyPages(pdf, indices)
      copied.forEach((p) => newPdf.addPage(p))
      setProgressValue(100)
      const outBytes = await newPdf.save()
      const blob = new Blob([outBytes], { type: 'application/pdf' })
      saveAs(blob, file.name.replace(/\.pdf$/i, '-extract.pdf'))
      finish()
    } catch (e) {
      setError(e?.message || 'Failed to extract pages')
      finish()
    }
  }

  return (
    <ToolLayout
      title="PDF Page Extractor – Extract Pages from PDF"
      description="Select specific pages from a PDF and save them into a new, smaller document. Use page numbers like 1, 3, 5-8."
    >
      <UploadZone onDrop={handleDrop} accept={PDF_ACCEPT} multiple={false} maxSize={MAX_SIZE} disabled={processing} />
      <FilePreview files={files} onRemove={removeFile} />
      <label className="mt-6 block">
        <span className="text-slate-400 text-sm">Pages to extract (e.g. 1, 3, 5-8)</span>
        <input
          type="text"
          value={pageRange}
          onChange={(e) => setPageRange(e.target.value)}
          placeholder="1, 3, 5-8"
          className="mt-1 w-full px-4 py-2 rounded-xl bg-dark-700 border border-dark-500 text-white placeholder-slate-500"
        />
      </label>
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
          {processing ? 'Extracting…' : 'Extract pages'}
        </button>
        {files.length > 0 && !processing && (
          <button type="button" onClick={() => { setFiles([]); reset(); }} className="px-6 py-3 rounded-xl bg-dark-600 text-slate-300 hover:bg-dark-500">Clear</button>
        )}
      </div>
      <div className="mt-10 grid gap-6">
        <section>
          <h2 className="font-display text-xl text-white mb-2">Description</h2>
          <p className="text-slate-300 text-sm">
            Extract only the pages you need from a PDF into a new file. Keep important pages together
            without sharing the entire original document.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-white mb-2">When to use this tool</h2>
          <p className="text-slate-300 text-sm">
            Helpful when a portal asks for just a few pages from a long PDF, such as a single mark sheet,
            a specific receipt, or selected chapters from a document.
          </p>
        </section>
      </div>
    </ToolLayout>
  )
}
