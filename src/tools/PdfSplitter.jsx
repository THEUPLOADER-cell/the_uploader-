import { useState } from 'react'
import { saveAs } from 'file-saver'
import { PDFDocument } from 'pdf-lib'
import ToolLayout from '../components/ToolLayout'
import UploadZone, { FilePreview } from '../components/UploadZone'
import { useProcessing } from '../hooks/useProcessing'

const PDF_ACCEPT = { 'application/pdf': ['.pdf'] }
const MAX_SIZE = 50 * 1024 * 1024

export default function PdfSplitter() {
  const [files, setFiles] = useState([])
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
      const numPages = pdf.getPageCount()
      const base = file.name.replace(/\.pdf$/i, '')
      for (let i = 0; i < numPages; i++) {
        setProgressValue((i / numPages) * 100)
        const newPdf = await PDFDocument.create()
        const [page] = await newPdf.copyPages(pdf, [i])
        newPdf.addPage(page)
        const outBytes = await newPdf.save()
        const blob = new Blob([outBytes], { type: 'application/pdf' })
        saveAs(blob, `${base}-page-${i + 1}.pdf`)
      }
      setProgressValue(100)
      finish()
    } catch (e) {
      setError(e?.message || 'Failed to split PDF')
    }
  }

  return (
    <ToolLayout
      title="PDF Splitter – Split PDF Pages into Separate Files"
      description="Split a PDF into individual pages and download each page as its own PDF. Perfect for forms, assignments, or multi-page scans."
    >
      <UploadZone onDrop={handleDrop} accept={PDF_ACCEPT} multiple={false} maxSize={MAX_SIZE} disabled={processing} />
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
          {processing ? 'Splitting…' : 'Split PDF'}
        </button>
        {files.length > 0 && !processing && (
          <button type="button" onClick={() => { setFiles([]); reset(); }} className="px-6 py-3 rounded-xl bg-dark-600 text-slate-300 hover:bg-dark-500">Clear</button>
        )}
      </div>
      <div className="mt-10 grid gap-6">
        <section>
          <h2 className="font-display text-xl text-white mb-2">Description</h2>
          <p className="text-slate-300 text-sm">
            Quickly split a multi-page PDF into separate files, one PDF per page. Each page is saved
            with a clear file name so you can upload only the pages you need.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-white mb-2">When to use this tool</h2>
          <p className="text-slate-300 text-sm">
            Use this splitter when an application only needs specific pages from a longer document,
            like a single mark sheet, ID page, or form page.
          </p>
        </section>
      </div>
    </ToolLayout>
  )
}
