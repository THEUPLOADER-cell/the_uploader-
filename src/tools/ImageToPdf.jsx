import { useState } from 'react'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import { Link } from 'react-router-dom'
import ToolLayout from '../components/ToolLayout'
import UploadZone, { FilePreview } from '../components/UploadZone'
import { useProcessing } from '../hooks/useProcessing'
import DownloadSuccessModal from '../components/DownloadSuccessModal'

const IMAGE_ACCEPT = { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] }
const MAX_SIZE = 20 * 1024 * 1024
const MAX_FILES = 30

export default function ImageToPdf() {
  const [files, setFiles] = useState([])
  const [fileName, setFileName] = useState('the-uploader-image.pdf')
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastBlob, setLastBlob] = useState(null)
  const { processing, progress, error, start, finish, setProgressValue, setError, reset } = useProcessing()

  const handleDrop = (accepted) => setFiles((prev) => [...prev, ...accepted].slice(0, MAX_FILES))
  const removeFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))

  const process = async () => {
    if (!files.length) return
    start()
    try {
      const doc = new jsPDF({ unit: 'px' })
      const total = files.length
      for (let i = 0; i < total; i++) {
        setProgressValue((i / total) * 100)
        const file = files[i]
        let imgData = await readAsDataURL(file)
        let format = file.type === 'image/png' ? 'PNG' : 'JPEG'
        if (file.type === 'image/webp') {
          const { dataUrl } = await webpToJpeg(imgData)
          imgData = dataUrl
          format = 'JPEG'
        }
        const dims = await getImageDimensions(imgData)
        const pageW = doc.internal.pageSize.getWidth()
        const pageH = doc.internal.pageSize.getHeight()
        const scale = Math.min(pageW / dims.w, pageH / dims.h, 1)
        const w = dims.w * scale
        const h = dims.h * scale
        const x = (pageW - w) / 2
        const y = (pageH - h) / 2
        if (i > 0) doc.addPage()
        doc.addImage(imgData, format, x, y, w, h, undefined, 'FAST')
      }
      setProgressValue(100)
      const blob = doc.output('blob')
      const safeName = fileName && fileName.trim().length ? fileName.trim() : 'the-uploader-image.pdf'
      saveAs(blob, safeName)
      setLastBlob(blob)
      finish()
      setShowSuccess(true)
    } catch (e) {
      setError(e?.message || 'Failed to create PDF')
    }
  }

  const handleDownloadAgain = () => {
    if (lastBlob) {
      const safeName = fileName && fileName.trim().length ? fileName.trim() : 'the-uploader-image.pdf'
      saveAs(lastBlob, safeName)
    } else {
      process()
    }
  }

  return (
    <>
      <ToolLayout
        title="Image to PDF Converter – Free Online Tool"
        description="Convert one or more images into a single PDF file in your browser. Supports JPG, PNG and WebP with no uploads."
        keywords="image to pdf converter, jpg to pdf online, png to pdf, webp to pdf, combine images into pdf, photos to pdf"
      >
        <UploadZone
          onDrop={handleDrop}
          accept={IMAGE_ACCEPT}
          multiple
          maxSize={MAX_SIZE}
          maxFiles={MAX_FILES}
          disabled={processing}
        />
        <FilePreview files={files} onRemove={removeFile} />
        <div className="mt-6 max-w-md">
          <label className="block">
            <span className="text-slate-400 text-sm">File name before download</span>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="the-uploader-image.pdf"
              className="mt-1 w-full px-4 py-2 rounded-xl bg-dark-700 border border-dark-500 text-white placeholder-slate-500"
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
            {processing ? 'Creating…' : 'Create PDF'}
          </button>
          {files.length > 0 && !processing && (
            <button
              type="button"
              onClick={() => {
                setFiles([])
                reset()
              }}
              className="px-6 py-3 rounded-xl bg-dark-600 text-slate-300 hover:bg-dark-500"
            >
              Clear
            </button>
          )}
        </div>
        <div className="mt-10 grid gap-6">
          <section>
            <h2 className="font-display text-xl text-white mb-2">Description</h2>
            <p className="text-slate-300 text-sm">
              Turn multiple images into a single, tidy PDF. Perfect for combining homework photos,
              ID scans, or document pictures into one file for upload.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-2">When to use this tool</h2>
            <p className="text-slate-300 text-sm">
              Use this converter when websites or portals only accept PDFs but your files are currently
              photos or screenshots taken on your phone.
            </p>
          </section>
          <section className="pt-2">
            <h2 className="font-display text-xl text-white mb-2">What is an Image to PDF converter?</h2>
            <p className="text-slate-300 text-sm">
              An <strong>image to PDF converter</strong> turns photos or screenshots (JPG, PNG, or WebP)
              into a single PDF document. This is useful when an upload form accepts only PDF files, or
              when you want multiple images to stay together in one neat file. Instead of attaching many
              separate images, you can combine them into one PDF with pages in the same order you upload.
              THE UPLOADER runs fully in your browser, so your files stay on your device while you create
              the PDF.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-2">How to use this tool</h2>
            <ul className="list-disc list-inside text-slate-300 text-sm space-y-1.5">
              <li>Upload images (JPG, PNG, or WebP) using drag &amp; drop or the file picker.</li>
              <li>Remove any image you don’t want included.</li>
              <li>Optionally edit the output file name.</li>
              <li>Click <strong>Create PDF</strong> and download your file.</li>
            </ul>
            <p className="mt-3 text-slate-300 text-sm">
              If you need a quick <strong>JPG to PDF online</strong> workflow for forms, assignments, or
              ID uploads, this tool helps you produce a clean PDF without sending your images to a server.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-2">Features</h2>
            <ul className="list-disc list-inside text-slate-300 text-sm space-y-1.5">
              <li>Combine multiple images into a single PDF in the order you upload.</li>
              <li>Supports JPG, PNG, and WebP (WebP is converted safely to JPEG for compatibility).</li>
              <li>Automatic scaling and centering so pages look tidy.</li>
              <li>Runs locally in your browser for privacy.</li>
            </ul>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-2">Why choose THE UPLOADER?</h2>
            <p className="text-slate-300 text-sm">
              When you convert images to PDF, privacy and speed matter. THE UPLOADER performs processing
              on your device, avoids unnecessary steps, and keeps the interface simple so you can finish
              quickly. For related workflows, you can also try{' '}
              <Link to="/pdf-compressor" className="text-accent-secondary hover:text-accent-primary hover:underline underline-offset-2">
                PDF Compressor
              </Link>
              ,{' '}
              <Link to="/image-compressor" className="text-accent-secondary hover:text-accent-primary hover:underline underline-offset-2">
                Image Compressor
              </Link>
              , or{' '}
              <Link to="/image-resizer" className="text-accent-secondary hover:text-accent-primary hover:underline underline-offset-2">
                Image Resizer
              </Link>
              .
            </p>
          </section>
        </div>
      </ToolLayout>
      <DownloadSuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        onDownloadAgain={handleDownloadAgain}
      />
    </>
  )
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

function getImageDimensions(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ w: img.width, h: img.height })
    img.onerror = reject
    img.src = dataUrl
  })
}

function webpToJpeg(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      resolve({ dataUrl: canvas.toDataURL('image/jpeg', 0.92) })
    }
    img.onerror = reject
    img.src = dataUrl
  })
}
