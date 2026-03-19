import { useState } from 'react'
import imageCompression from 'browser-image-compression'
import { saveAs } from 'file-saver'
import ToolLayout from '../components/ToolLayout'
import UploadZone, { FilePreview } from '../components/UploadZone'
import { useProcessing } from '../hooks/useProcessing'
import { formatFileSize } from '../utils/fileSize'
import DownloadSuccessModal from '../components/DownloadSuccessModal'

const IMAGE_ACCEPT = { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] }
const MAX_SIZE = 20 * 1024 * 1024
const MAX_FILES = 1

export default function ImageCompressor() {
  const [files, setFiles] = useState([])
  const [quality, setQuality] = useState(0.8)
  const [fileName, setFileName] = useState('the-uploader-image.jpg')
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastBlob, setLastBlob] = useState(null)
  const { processing, progress, error, start, finish, setProgressValue, setError, reset } = useProcessing()

  const handleDrop = (accepted) => setFiles(accepted.length ? [accepted[0]] : [])
  const removeFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))

  const process = async () => {
    if (!files.length) return
    start()
    try {
      const file = files[0]
      setProgressValue(40)
      const opts = {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: quality,
      }
      const compressed = await imageCompression(file, opts)
      setProgressValue(90)
      const safeName = fileName && fileName.trim().length ? fileName.trim() : 'the-uploader-image.jpg'
      setLastBlob(compressed)
      saveAs(compressed, safeName)
      setProgressValue(100)
      finish()
      setShowSuccess(true)
    } catch (e) {
      setError(e?.message || 'Failed to compress images')
    }
  }

  const totalSize = files.reduce((s, f) => s + f.size, 0)

  const handleDownloadAgain = () => {
    if (lastBlob) {
      const safeName = fileName && fileName.trim().length ? fileName.trim() : 'the-uploader-image.jpg'
      saveAs(lastBlob, safeName)
    } else {
      process()
    }
  }

  return (
    <>
      <ToolLayout
        title="Image Compressor – Compress Images Online"
        description="Compress JPG, PNG or WebP images to reduce file size while staying clear. Adjust quality to balance size and sharpness."
      >
        <UploadZone
          onDrop={handleDrop}
          accept={IMAGE_ACCEPT}
          multiple={false}
          maxSize={MAX_SIZE}
          maxFiles={MAX_FILES}
          disabled={processing}
        />
        <FilePreview files={files} onRemove={removeFile} />
        {files.length > 0 && (
          <p className="mt-4 text-slate-400 text-sm">Original size: {formatFileSize(totalSize)}</p>
        )}
        <div className="mt-4 max-w-md">
          <label className="block">
            <span className="text-slate-400 text-sm">File name before download</span>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="the-uploader-image.jpg"
              className="mt-1 w-full px-4 py-2 rounded-xl bg-dark-700 border border-dark-500 text-white placeholder-slate-500"
            />
          </label>
        </div>
        <label className="mt-6 block">
          <span className="text-slate-400 text-sm">Quality (0.1 – 1)</span>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="mt-1 w-full h-2 bg-dark-600 rounded-full appearance-none cursor-pointer accent-accent-primary"
          />
          <span className="text-slate-300 text-sm ml-2">{Math.round(quality * 100)}%</span>
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
            {processing ? 'Compressing…' : 'Compress image'}
          </button>
          {files.length > 0 && !processing && (
            <button type="button" onClick={() => { setFiles([]); reset(); }} className="px-6 py-3 rounded-xl bg-dark-600 text-slate-300 hover:bg-dark-500">Clear</button>
          )}
        </div>
        <div className="mt-10 grid gap-6">
          <section>
            <h2 className="font-display text-xl text-white mb-2">Description</h2>
            <p className="text-slate-300 text-sm">
              Shrink large photos and scans so they upload faster and fit school or application limits.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-2">How to use</h2>
            <ol className="list-decimal list-inside text-slate-300 text-sm space-y-1.5">
              <li>Upload a JPG, PNG, or WebP image.</li>
              <li>Choose a quality level using the slider.</li>
              <li>Optionally change the output file name.</li>
              <li>Click &quot;Compress image&quot; and download the optimized file.</li>
            </ol>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-2">Features</h2>
            <ul className="list-disc list-inside text-slate-300 text-sm space-y-1.5">
              <li>Client-side compression with no uploads.</li>
              <li>Quality slider to control visual clarity.</li>
              <li>Safe default file name for quick downloads.</li>
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
