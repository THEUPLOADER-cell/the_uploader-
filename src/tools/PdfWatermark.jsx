import { useState } from 'react'
import { saveAs } from 'file-saver'
import { PDFDocument, rgb, degrees } from 'pdf-lib'
import ToolLayout from '../components/ToolLayout'
import UploadZone, { FilePreview } from '../components/UploadZone'
import { useProcessing } from '../hooks/useProcessing'
import DownloadSuccessModal from '../components/DownloadSuccessModal'

const PDF_ACCEPT = { 'application/pdf': ['.pdf'] }
const MAX_SIZE = 200 * 1024 * 1024

export default function PdfWatermark() {
  const [files, setFiles] = useState([])
  const [text, setText] = useState('THE UPLOADER')
  const [opacity, setOpacity] = useState(0.2)
  const [rotation, setRotation] = useState(30)
  const [fileName, setFileName] = useState('the-uploader-watermarked.pdf')
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastBlob, setLastBlob] = useState(null)
  const { processing, progress, error, start, finish, setProgressValue, setError, reset } =
    useProcessing()

  const handleDrop = (accepted) => setFiles(accepted.length ? [accepted[0]] : [])
  const removeFile = () => setFiles([])

  const process = async () => {
    if (!files.length || processing) return
    start()
    try {
      const file = files[0]
      setProgressValue(10)
      const buf = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(buf, { ignoreEncryption: true })
      const pages = pdfDoc.getPages()

      pages.forEach((page, index) => {
        const { width, height } = page.getSize()
        const fontSize = Math.min(width, height) / 10
        page.drawText(text || '', {
          x: width / 2 - (text.length * fontSize) / 4,
          y: height / 2,
          size: fontSize,
          color: rgb(0.8, 0.8, 0.8),
          opacity,
          rotate: degrees(rotation),
        })
        setProgressValue(10 + ((index + 1) / pages.length) * 80)
      })

      const outBytes = await pdfDoc.save()
      const blob = new Blob([outBytes], { type: 'application/pdf' })
      const safeName =
        fileName && fileName.trim().length ? fileName.trim() : 'the-uploader-watermarked.pdf'
      saveAs(blob, safeName)
      setLastBlob(blob)
      setProgressValue(100)
      finish()
      setShowSuccess(true)
    } catch (e) {
      setError(e?.message || 'Failed to add watermark')
      finish()
    }
  }

  const handleDownloadAgain = () => {
    if (lastBlob) {
      const safeName =
        fileName && fileName.trim().length ? fileName.trim() : 'the-uploader-watermarked.pdf'
      saveAs(lastBlob, safeName)
    } else {
      process()
    }
  }

  return (
    <>
      <ToolLayout
        title="Add Watermark to PDF – Free Online Tool"
        description="Add a text watermark to every page of your PDF. Control rotation and opacity while keeping all processing on your device."
      >
        <UploadZone
          onDrop={handleDrop}
          accept={PDF_ACCEPT}
          multiple={false}
          maxSize={MAX_SIZE}
          disabled={processing}
        />
        <FilePreview files={files} onRemove={removeFile} />
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-slate-400 text-sm">Watermark text</span>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-xl bg-dark-700 border border-dark-500 text-white placeholder-slate-500"
              placeholder="Enter watermark text"
            />
          </label>
          <label className="block">
            <span className="text-slate-400 text-sm">Output file name</span>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="the-uploader-watermarked.pdf"
              className="mt-1 w-full px-4 py-2 rounded-xl bg-dark-700 border border-dark-500 text-white placeholder-slate-500"
            />
          </label>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-slate-400 text-sm">Opacity ({opacity.toFixed(2)})</span>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.01"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="mt-1 w-full h-2 bg-dark-600 rounded-full appearance-none cursor-pointer accent-accent-primary"
            />
          </label>
          <label className="block">
            <span className="text-slate-400 text-sm">Rotation (degrees)</span>
            <input
              type="number"
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value) || 0)}
              className="mt-1 w-full px-4 py-2 rounded-xl bg-dark-700 border border-dark-500 text-white"
            />
          </label>
        </div>
        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
        {processing && (
          <div className="mt-4 h-2 bg-dark-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={process}
            disabled={!files.length || processing}
            className="px-6 py-3 rounded-xl bg-accent-primary text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-secondary transition-colors"
          >
            {processing ? 'Adding watermark…' : 'Add watermark'}
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
              Overlay a light, secure text watermark on every page of your PDF. Ideal for drafts,
              submissions, or documents you want to share while keeping ownership clear.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-2">How to use</h2>
            <ol className="list-decimal list-inside text-slate-300 text-sm space-y-1.5">
              <li>Upload your PDF using drag &amp; drop or the file picker.</li>
              <li>Enter the watermark text and optional output file name.</li>
              <li>Adjust opacity and rotation to match your preference.</li>
              <li>Click &quot;Add watermark&quot; and download the updated PDF.</li>
            </ol>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-2">Features</h2>
            <ul className="list-disc list-inside text-slate-300 text-sm space-y-1.5">
              <li>Client-side watermarking with pdf-lib – no uploads.</li>
              <li>Adjustable opacity between subtle and visible.</li>
              <li>Custom rotation for diagonal or horizontal watermarks.</li>
            </ul>
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

