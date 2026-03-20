import { useState } from 'react'
import { saveAs } from 'file-saver'
import { PDFDocument } from 'pdf-lib'
import { Link } from 'react-router-dom'
import ToolLayout from '../components/ToolLayout'
import UploadZone, { FilePreview } from '../components/UploadZone'
import { useProcessing } from '../hooks/useProcessing'

const PDF_ACCEPT = { 'application/pdf': ['.pdf'] }
const MAX_SIZE = 200 * 1024 * 1024

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
      finish()
    }
  }

  return (
    <ToolLayout
      title="PDF Splitter – Split PDF Pages into Separate Files"
      description="Split a PDF into individual pages and download each page as its own PDF. Perfect for forms, assignments, or multi-page scans."
      keywords="split pdf online, pdf splitter, separate pdf pages, extract pages, split pdf into pages, download pdf pages"
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
        <section className="pt-2">
          <h2 className="font-display text-xl text-white mb-2">What is a PDF splitter?</h2>
          <p className="text-slate-300 text-sm">
            A <strong>PDF splitter</strong> separates a multi-page PDF into individual page files. This helps when you only
            need to submit one page, when a portal requests specific pages, or when you want to share part of a document
            without sending everything. THE UPLOADER lets you <strong>split PDF online</strong> in your browser with no uploads.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-white mb-2">How to use it</h2>
          <ul className="list-disc list-inside text-slate-300 text-sm space-y-1.5">
            <li>Upload a PDF file from your device.</li>
            <li>Click <strong>Split PDF</strong> to export each page as its own PDF.</li>
            <li>Download the pages you need and upload only those pages to the portal.</li>
          </ul>
          <p className="mt-3 text-slate-300 text-sm">
            If you only need a few pages (not every page), try{' '}
            <Link to="/pdf-page-extractor" className="text-accent-secondary hover:text-accent-primary hover:underline underline-offset-2">
              PDF Page Extractor
            </Link>
            , which creates one new PDF containing only selected pages.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-white mb-2">Features</h2>
          <ul className="list-disc list-inside text-slate-300 text-sm space-y-1.5">
            <li>Splits a PDF into one PDF per page.</li>
            <li>Clear file naming for easy uploads (page numbers included).</li>
            <li>Runs locally in your browser for privacy.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-xl text-white mb-2">Why choose this tool?</h2>
          <p className="text-slate-300 text-sm">
            THE UPLOADER makes document prep quick and private. If your pages are too large after splitting, you can{' '}
            <Link to="/pdf-compressor" className="text-accent-secondary hover:text-accent-primary hover:underline underline-offset-2">
              compress the PDF
            </Link>
            . If you later need to combine pages again, use{' '}
            <Link to="/pdf-merger" className="text-accent-secondary hover:text-accent-primary hover:underline underline-offset-2">
              PDF Merger
            </Link>
            .
          </p>
        </section>
      </div>
    </ToolLayout>
  )
}
