import { useState } from 'react'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import * as mammoth from 'mammoth/mammoth.browser'
import ToolLayout from '../components/ToolLayout'
import UploadZone, { FilePreview } from '../components/UploadZone'
import { useProcessing } from '../hooks/useProcessing'
import DownloadSuccessModal from '../components/DownloadSuccessModal'

const WORD_ACCEPT = {
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
}
const MAX_SIZE = 20 * 1024 * 1024

export default function WordToPdf() {
  const [files, setFiles] = useState([])
  const [fileName, setFileName] = useState('the-uploader-document.pdf')
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastBlob, setLastBlob] = useState(null)
  const { processing, progress, error, start, finish, setProgressValue, setError, reset } =
    useProcessing()

  const handleDrop = (accepted) => setFiles(accepted.length ? [accepted[0]] : [])
  const removeFile = () => setFiles([])

  const process = async () => {
    if (!files.length || processing) return
    const file = files[0]
    const ext = (file.name.split('.').pop() || '').toLowerCase()

    if (ext === 'doc') {
      setError('DOC files are not fully supported. Please save as DOCX and try again.')
      return
    }

    start()
    try {
      setProgressValue(10)
      const buf = await file.arrayBuffer()
      const { value: text } = await mammoth.extractRawText({ arrayBuffer: buf })
      setProgressValue(60)

      const doc = new jsPDF({ unit: 'pt', format: 'a4' })
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 40
      const maxWidth = pageWidth - margin * 2

      doc.setFont('Helvetica', 'normal')
      doc.setFontSize(12)

      const paragraphs = text.split(/\n\s*\n/)
      let y = margin

      paragraphs.forEach((p, idx) => {
        const lines = doc.splitTextToSize(p.trim(), maxWidth)
        lines.forEach((line) => {
          if (y > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage()
            y = margin
          }
          doc.text(line, margin, y)
          y += 16
        })
        if (idx < paragraphs.length - 1) {
          y += 12
        }
      })

      setProgressValue(95)
      const blob = doc.output('blob')
      const safeName = fileName && fileName.trim().length ? fileName.trim() : 'the-uploader-document.pdf'
      saveAs(blob, safeName)
      setLastBlob(blob)
      setProgressValue(100)
      finish()
      setShowSuccess(true)
    } catch (e) {
      setError(e?.message || 'Failed to convert Word document to PDF')
    }
  }

  const handleDownloadAgain = () => {
    if (lastBlob) {
      const safeName = fileName && fileName.trim().length ? fileName.trim() : 'the-uploader-document.pdf'
      saveAs(lastBlob, safeName)
    } else {
      process()
    }
  }

  return (
    <>
      <ToolLayout
        title="Word to PDF Converter – Free Online Tool"
        description="Convert DOC and DOCX files to PDF directly in your browser. Perfect for applications, homework, and forms."
      >
        <UploadZone
          onDrop={handleDrop}
          accept={WORD_ACCEPT}
          multiple={false}
          maxSize={MAX_SIZE}
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
              placeholder="the-uploader-document.pdf"
              className="mt-1 w-full px-4 py-2 rounded-xl bg-dark-700 border border-dark-500 text-white placeholder-slate-500"
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
            {processing ? 'Converting…' : 'Convert to PDF'}
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
              Quickly turn DOC or DOCX documents into shareable PDFs without uploading anything to a server.
              Ideal for application forms, assignments, and official submissions.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-2">How to use</h2>
            <ol className="list-decimal list-inside text-slate-300 text-sm space-y-1.5">
              <li>Click the upload area or drag your DOCX file into it.</li>
              <li>Optionally change the output file name.</li>
              <li>Click &quot;Convert to PDF&quot; and wait for processing.</li>
              <li>Download your new PDF and review it before submitting.</li>
            </ol>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-2">Features</h2>
            <ul className="list-disc list-inside text-slate-300 text-sm space-y-1.5">
              <li>Client-side conversion using mammoth.js and jsPDF.</li>
              <li>No login, no upload, and no storage of your files.</li>
              <li>Custom output file name for easier organization.</li>
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

