import { useState } from 'react'
import { saveAs } from 'file-saver'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
import ToolLayout from '../components/ToolLayout'
import UploadZone, { FilePreview } from '../components/UploadZone'
import { useProcessing } from '../hooks/useProcessing'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

const PDF_ACCEPT = { 'application/pdf': ['.pdf'] }
const MAX_SIZE = 50 * 1024 * 1024

export default function PdfToImage() {
  const [files, setFiles] = useState([])
  const [scale, setScale] = useState(2)
  const [format, setFormat] = useState('image/png')
  const { processing, progress, error, start, finish, setProgressValue, setError, reset } = useProcessing()

  const handleDrop = (accepted) => setFiles(accepted.length ? [accepted[0]] : [])
  const removeFile = () => setFiles([])

  const process = async () => {
    if (!files.length) return
    start()
    try {
      const file = files[0]
      const buf = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument(buf).promise
      const numPages = pdf.numPages
      for (let i = 1; i <= numPages; i++) {
        setProgressValue(((i - 1) / numPages) * 100)
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')
        await page.render({ canvasContext: ctx, viewport }).promise
        const mime = format
        const ext = format === 'image/jpeg' ? 'jpg' : 'png'
        canvas.toBlob((blob) => {
          if (blob) saveAs(blob, `page-${i}.${ext}`)
        }, mime, 0.92)
      }
      setProgressValue(100)
      finish()
    } catch (e) {
      setError(e?.message || 'Failed to convert PDF to images')
    }
  }

  return (
    <ToolLayout
      title="PDF to Image Converter – Free Online Tool"
      description="Convert PDF pages to PNG or JPG images in your browser. Download each page as a separate image, perfect for sharing or uploading."
    >
      <UploadZone onDrop={handleDrop} accept={PDF_ACCEPT} multiple={false} maxSize={MAX_SIZE} disabled={processing} />
      <FilePreview files={files} onRemove={removeFile} />
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-slate-400 text-sm">Resolution (scale)</span>
          <select
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="mt-1 w-full px-4 py-2 rounded-xl bg-dark-700 border border-dark-500 text-white"
          >
            {[1, 1.5, 2, 2.5, 3].map((s) => (
              <option key={s} value={s}>{s}x</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-slate-400 text-sm">Format</span>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="mt-1 w-full px-4 py-2 rounded-xl bg-dark-700 border border-dark-500 text-white"
          >
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPG</option>
          </select>
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
          {processing ? 'Converting…' : 'Convert to images'}
        </button>
        {files.length > 0 && !processing && (
          <button type="button" onClick={() => { setFiles([]); reset(); }} className="px-6 py-3 rounded-xl bg-dark-600 text-slate-300 hover:bg-dark-500">Clear</button>
        )}
      </div>
      <div className="mt-10 grid gap-6">
        <section>
          <h2 className="font-display text-xl text-white mb-2">Description</h2>
          <p className="text-slate-300 text-sm">
            Turn each page of a PDF into a high-quality PNG or JPG image. Great for sharing pages
            in chat apps, slides, or websites that do not accept PDF files.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-white mb-2">When to use this tool</h2>
          <p className="text-slate-300 text-sm">
            Use this PDF to Image converter when you need screenshots of pages for social media,
            presentations, or online forms that only accept images.
          </p>
        </section>
      </div>
    </ToolLayout>
  )
}
