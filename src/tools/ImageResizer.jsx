import { useState } from 'react'
import imageCompression from 'browser-image-compression'
import { saveAs } from 'file-saver'
import ToolLayout from '../components/ToolLayout'
import UploadZone, { FilePreview } from '../components/UploadZone'
import { useProcessing } from '../hooks/useProcessing'

const IMAGE_ACCEPT = { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] }
const MAX_SIZE = 20 * 1024 * 1024
const MAX_FILES = 10

export default function ImageResizer() {
  const [files, setFiles] = useState([])
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [keepAspect, setKeepAspect] = useState(true)
  const { processing, progress, error, start, finish, setProgressValue, setError, reset } = useProcessing()

  const handleDrop = (accepted) => setFiles((prev) => [...prev, ...accepted].slice(0, MAX_FILES))
  const removeFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))

  const process = async () => {
    if (!files.length) return
    start()
    try {
      const total = files.length
      for (let i = 0; i < total; i++) {
        setProgressValue((i / total) * 100)
        const file = files[i]
        let blob
        if (keepAspect) {
          const opts = { maxWidthOrHeight: Math.max(width, height), useWebWorker: true, initialQuality: 1 }
          const resized = await imageCompression(file, opts)
          blob = resized
        } else {
          const img = await createImageBitmap(file)
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          blob = await new Promise((resolve) => canvas.toBlob(resolve, file.type, 0.95))
          if (!blob) throw new Error('Canvas toBlob failed')
        }
        const base = file.name.replace(/\.[^.]+$/, '')
        const ext = file.type === 'image/png' ? 'png' : 'jpg'
        saveAs(blob, `${base}-${width}x${height}.${ext}`)
      }
      setProgressValue(100)
      finish()
    } catch (e) {
      setError(e?.message || 'Failed to resize images')
    }
  }

  return (
    <ToolLayout
      title="Image Resizer – Resize Images Online"
      description="Resize JPG, PNG or WebP images to custom dimensions online. Keep aspect ratio or set exact width and height for your pictures."
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
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-slate-400 text-sm">Width</span>
          <input
            type="number"
            min="1"
            max="4096"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value) || 1)}
            className="mt-1 w-full px-4 py-2 rounded-xl bg-dark-700 border border-dark-500 text-white"
          />
        </label>
        <label className="block">
          <span className="text-slate-400 text-sm">Height</span>
          <input
            type="number"
            min="1"
            max="4096"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value) || 1)}
            className="mt-1 w-full px-4 py-2 rounded-xl bg-dark-700 border border-dark-500 text-white"
          />
        </label>
        <label className="flex items-end gap-2 pb-2">
          <input
            type="checkbox"
            checked={keepAspect}
            onChange={(e) => setKeepAspect(e.target.checked)}
            className="rounded bg-dark-600 border-dark-500 text-accent-primary focus:ring-accent-primary"
          />
          <span className="text-slate-400 text-sm">Keep aspect ratio (use max dimension)</span>
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
          {processing ? 'Resizing…' : 'Resize images'}
        </button>
        {files.length > 0 && !processing && (
          <button type="button" onClick={() => { setFiles([]); reset(); }} className="px-6 py-3 rounded-xl bg-dark-600 text-slate-300 hover:bg-dark-500">Clear</button>
        )}
      </div>
      <div className="mt-10 grid gap-6">
        <section>
          <h2 className="font-display text-xl text-white mb-2">Description</h2>
          <p className="text-slate-300 text-sm">
            Resize images to fit upload limits or design requirements. Choose exact pixel dimensions
            and optionally maintain aspect ratio for natural-looking results.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-white mb-2">When to use this tool</h2>
          <p className="text-slate-300 text-sm">
            Use this image resizer when websites or applications request specific image sizes, such as
            profile photos, ID pictures, or banner images.
          </p>
        </section>
      </div>
    </ToolLayout>
  )
}
