import { useState } from 'react'
import { saveAs } from 'file-saver'
import ToolLayout from '../components/ToolLayout'
import UploadZone, { FilePreview } from '../components/UploadZone'
import { useProcessing } from '../hooks/useProcessing'

const IMAGE_ACCEPT = { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] }
const MAX_SIZE = 20 * 1024 * 1024
const MAX_FILES = 200

const FORMATS = [
  { value: 'image/jpeg', label: 'JPG', ext: 'jpg' },
  { value: 'image/png', label: 'PNG', ext: 'png' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' },
]

export default function ImageFormatConverter() {
  const [files, setFiles] = useState([])
  const [format, setFormat] = useState('image/jpeg')
  const [quality, setQuality] = useState(0.92)
  const { processing, progress, error, start, finish, setProgressValue, setError, reset } = useProcessing()

  const handleDrop = (accepted) => setFiles((prev) => [...prev, ...accepted].slice(0, MAX_FILES))
  const removeFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))

  const process = async () => {
    if (!files.length) return
    start()
    try {
      const total = files.length
      const fmt = FORMATS.find((f) => f.value === format) || FORMATS[0]
      for (let i = 0; i < total; i++) {
        setProgressValue((i / total) * 100)
        const file = files[i]
        const img = await createImageBitmap(file)
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const blob = await new Promise((resolve) => {
          canvas.toBlob(resolve, format, format === 'image/png' ? undefined : quality)
        })
        if (blob) {
          const base = file.name.replace(/\.[^.]+$/, '')
          saveAs(blob, `${base}.${fmt.ext}`)
        }
      }
      setProgressValue(100)
      finish()
    } catch (e) {
      setError(e?.message || 'Failed to convert images')
      finish()
    }
  }

  return (
    <ToolLayout
      title="Image Format Converter – Convert JPG, PNG & WebP"
      description="Convert images between JPG, PNG and WebP formats directly in your browser. Keep quality while changing the file type."
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
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-slate-400 text-sm">Output format</span>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="mt-1 w-full px-4 py-2 rounded-xl bg-dark-700 border border-dark-500 text-white"
          >
            {FORMATS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </label>
        {format !== 'image/png' && (
          <label className="block">
            <span className="text-slate-400 text-sm">Quality (0.1 – 1)</span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="mt-1 w-full h-2 bg-dark-600 rounded-full appearance-none cursor-pointer accent-accent-primary"
            />
            <span className="text-slate-300 text-sm ml-2">{Math.round(quality * 100)}%</span>
          </label>
        )}
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
          {processing ? 'Converting…' : 'Convert images'}
        </button>
        {files.length > 0 && !processing && (
          <button type="button" onClick={() => { setFiles([]); reset(); }} className="px-6 py-3 rounded-xl bg-dark-600 text-slate-300 hover:bg-dark-500">Clear</button>
        )}
      </div>
      <div className="mt-10 grid gap-6">
        <section>
          <h2 className="font-display text-xl text-white mb-2">Description</h2>
          <p className="text-slate-300 text-sm">
            Quickly convert photos between JPG, PNG and WebP formats without leaving your browser.
            Keep the same image while changing the file type to match upload requirements.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-white mb-2">When to use this tool</h2>
          <p className="text-slate-300 text-sm">
            Ideal when a site only accepts a specific format, such as JPG for applications or PNG
            for transparent graphics and screenshots.
          </p>
        </section>
      </div>
    </ToolLayout>
  )
}
