import React, { useState, useEffect } from 'react'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import { Link } from 'react-router-dom'
import ToolLayout from '../components/ToolLayout'
import UploadZone from '../components/UploadZone'
import { useProcessing } from '../hooks/useProcessing'
import DownloadSuccessModal from '../components/DownloadSuccessModal'

const IMAGE_ACCEPT = { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] }
const MAX_SIZE = 20 * 1024 * 1024
const MAX_FILES = 200

export default function ImageToPdf() {
  const [files, setFiles] = useState([])
  const [fileName, setFileName] = useState('the-uploader-image.pdf')
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastBlob, setLastBlob] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const { processing, progress, error, start, finish, setProgressValue, setError, reset } = useProcessing()

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      try {
        if (typeof navigator === 'undefined' || typeof window === 'undefined') return
        const userAgent = navigator.userAgent.toLowerCase()
        const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
        const isSmallScreen = window.innerWidth < 768
        setIsMobile(isMobileDevice || isSmallScreen)
      } catch (error) {
        // Fallback to false if detection fails
        setIsMobile(false)
      }
    }

    checkMobile()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }
  }, [])

  useEffect(() => {
    if (!showPreviewModal) return undefined
    if (typeof document === 'undefined') return undefined

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = overflow
    }
  }, [showPreviewModal])

  const handleDrop = (accepted) => {
    try {
      setFiles((prev) => [...prev, ...accepted].slice(0, MAX_FILES))
    } catch (error) {
      console.error('Error handling file drop:', error)
      setError('Failed to process uploaded files. Please try again.')
    }
  }
  const removeFile = (i) => {
    try {
      setFiles((prev) => prev.filter((_, idx) => idx !== i))
    } catch (error) {
      console.error('Error removing file:', error)
    }
  }

  // Handle camera/gallery file selection
  const handleCameraCapture = (event) => {
    try {
      const selectedFiles = Array.from(event.target.files || [])
      if (selectedFiles.length > 0) {
        setFiles((prev) => [...prev, ...selectedFiles].slice(0, MAX_FILES))
      }
      // Reset the input so the same file can be selected again if needed
      event.target.value = ''
    } catch (error) {
      console.error('Error handling camera capture:', error)
      setError('Failed to process selected images. Please try again.')
    }
  }

  const clearAllFiles = () => {
    setFiles([])
    reset()
  }

  const handleDragStart = (index) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDropReorder = (dropIndex) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      return
    }

    setFiles((prev) => {
      const next = [...prev]
      const [moved] = next.splice(draggedIndex, 1)
      next.splice(dropIndex, 0, moved)
      return next
    })
    setDraggedIndex(null)
  }

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
      finish()
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
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <UploadZone
                  onDrop={handleDrop}
                  accept={IMAGE_ACCEPT}
                  multiple
                  maxSize={MAX_SIZE}
                  maxFiles={MAX_FILES}
                  disabled={processing}
                />
              </div>
              {isMobile && (
                <div className="flex flex-col gap-2 min-w-[140px]">
                  <label className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-medium cursor-pointer hover:from-accent-secondary hover:to-accent-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                    <span className="text-2xl">📷</span>
                    <span className="text-xs text-center">Camera</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      multiple
                      onChange={handleCameraCapture}
                      disabled={processing}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.createElement('input')
                      input.type = 'file'
                      input.accept = 'image/*'
                      input.multiple = true
                      input.onchange = handleCameraCapture
                      input.click()
                    }}
                    disabled={processing}
                    className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-dark-600 text-slate-300 hover:bg-dark-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-2xl">🖼️</span>
                    <span className="text-xs text-center">Gallery</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Image Selection Section */}
          {files.length > 0 && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-dark-600 bg-dark-700/40 p-4">
              <p className="text-slate-300 font-medium">
                {files.length} image{files.length !== 1 ? 's' : ''} selected
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  disabled={processing}
                  className="px-4 py-2 rounded-lg bg-dark-600 text-slate-200 hover:bg-dark-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Preview Images
                </button>
              </div>
            </div>
          )}

          {/* File Name Input */}
          <div className="max-w-md">
            <label className="block">
              <span className="text-slate-400 text-sm font-medium">Output File Name</span>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="the-uploader-image.pdf"
                className="mt-2 w-full px-4 py-3 rounded-xl bg-dark-700 border border-dark-500 text-white placeholder-slate-500 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all"
              />
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <span className="text-red-400">⚠️</span>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {processing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Creating PDF...</span>
                <span className="text-slate-500">{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-dark-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={process}
              disabled={!files.length || processing}
              className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-accent-secondary hover:to-accent-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating PDF...
                </>
              ) : (
                <>
                  <span className="text-xl">📄</span>
                  Create PDF ({files.length} image{files.length !== 1 ? 's' : ''})
                </>
              )}
            </button>
          </div>
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
              <li>On mobile devices, use "Camera" to take new photos or "Gallery" to select existing images.</li>
              <li>Remove any image you don't want included.</li>
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

      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="h-full w-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 border-b border-white/10 bg-dark-900/80">
              <button
                type="button"
                onClick={clearAllFiles}
                disabled={!files.length || processing}
                className="text-sm text-slate-300 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="text-2xl leading-none text-slate-200 hover:text-white transition-colors"
                aria-label="Close preview"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {files.map((file, i) => (
                  <div
                    key={file.name + i}
                    className="relative group"
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDropReorder(i)}
                    onDragEnd={() => setDraggedIndex(null)}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-dark-700 border border-dark-600">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition-colors"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
