import { useState } from 'react'
import { saveAs } from 'file-saver'
import { PDFDocument } from 'pdf-lib'
import ToolLayout from '../components/ToolLayout'
import UploadZone, { FilePreview } from '../components/UploadZone'
import { useProcessing } from '../hooks/useProcessing'
import { formatFileSize } from '../utils/fileSize'
import DownloadSuccessModal from '../components/DownloadSuccessModal'

const PDF_ACCEPT = { 'application/pdf': ['.pdf'] }
const MAX_SIZE = 50 * 1024 * 1024

export default function PdfCompressor() {
  const [files, setFiles] = useState([])
  const [fileName, setFileName] = useState('the-uploader-compressed.pdf')
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastBlob, setLastBlob] = useState(null)
  const { processing, progress, error, start, finish, setProgressValue, setError, reset } = useProcessing()

  const handleDrop = (accepted) => setFiles(accepted.length ? [accepted[0]] : [])
  const removeFile = () => setFiles([])

  const process = async () => {
    if (!files.length) return
    start()
    try {
      setProgressValue(10)
      const file = files[0]
      const buf = await file.arrayBuffer()
      const pdf = await PDFDocument.load(buf, { ignoreEncryption: true })
      setProgressValue(50)
      const pages = pdf.getPages()
      const newPdf = await PDFDocument.create()
      for (let i = 0; i < pages.length; i++) {
        setProgressValue(50 + (i / pages.length) * 40)
        const [copiedPage] = await newPdf.copyPages(pdf, [i])
        newPdf.addPage(copiedPage)
      }
      setProgressValue(95)
      const outBytes = await newPdf.save({ useObjectStreams: true })
      setProgressValue(100)
      const blob = new Blob([outBytes], { type: 'application/pdf' })
      const safeName = fileName && fileName.trim().length ? fileName.trim() : 'the-uploader-compressed.pdf'
      saveAs(blob, safeName)
      setLastBlob(blob)
      finish()
      setShowSuccess(true)
    } catch (e) {
      setError(e?.message || 'Failed to compress PDF')
    }
  }

  const originalSize = files[0]?.size

  const handleDownloadAgain = () => {
    if (lastBlob) {
      const safeName = fileName && fileName.trim().length ? fileName.trim() : 'the-uploader-compressed.pdf'
      saveAs(lastBlob, safeName)
    } else {
      process()
    }
  }

  return (
    <>
      <ToolLayout
        title="PDF Compressor – Reduce PDF File Size Online"
        description="Compress PDF files to reduce size while keeping them readable. Ideal for meeting strict upload limits on portals and email."
      >
        <UploadZone onDrop={handleDrop} accept={PDF_ACCEPT} multiple={false} maxSize={MAX_SIZE} disabled={processing} />
        <FilePreview files={files} onRemove={removeFile} />
        {files.length > 0 && originalSize != null && (
          <p className="mt-4 text-slate-400 text-sm">Original size: {formatFileSize(originalSize)}</p>
        )}
        <div className="mt-4 max-w-md">
          <label className="block">
            <span className="text-slate-400 text-sm">File name before download</span>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="the-uploader-compressed.pdf"
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
            {processing ? 'Compressing…' : 'Compress PDF'}
          </button>
          {files.length > 0 && !processing && (
            <button type="button" onClick={() => { setFiles([]); reset(); }} className="px-6 py-3 rounded-xl bg-dark-600 text-slate-300 hover:bg-dark-500">Clear</button>
          )}
        </div>
        <div className="mt-10 grid gap-6">
          <section>
            <h2 className="font-display text-xl text-white mb-2">Description</h2>
            <p className="text-slate-300 text-sm">
              Compress large PDFs so they fit upload limits for portals, email, and applications while keeping them readable.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-2">How to use</h2>
            <ol className="list-decimal list-inside text-slate-300 text-sm space-y-1.5">
              <li>Upload a PDF from your device.</li>
              <li>Review the original file size.</li>
              <li>Optionally change the output file name.</li>
              <li>Click &quot;Compress PDF&quot; and download the smaller file.</li>
            </ol>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-2">Features</h2>
            <ul className="list-disc list-inside text-slate-300 text-sm space-y-1.5">
              <li>Client-side compression using pdf-lib.</li>
              <li>No upload, no login, and no storage.</li>
              <li>Friendly progress indicator for larger documents.</li>
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
