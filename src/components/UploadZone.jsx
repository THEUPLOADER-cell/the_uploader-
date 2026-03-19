import { memo, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, File } from 'lucide-react'

function UploadZone({
  onDrop,
  accept,
  multiple = true,
  maxSize = 50 * 1024 * 1024,
  maxFiles,
  disabled,
}) {
  const onDropAccepted = useCallback(
    (acceptedFiles) => {
      onDrop(acceptedFiles)
    },
    [onDrop]
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDropAccepted,
    accept,
    multiple,
    maxSize,
    maxFiles,
    disabled,
    noClick: disabled,
    noKeyboard: disabled,
  })

  return (
    <div className="space-y-2">
      <motion.div
        {...getRootProps()}
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.99 } : {}}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-accent-primary bg-accent-primary/10' : 'border-dark-500 bg-dark-800 hover:border-dark-500 hover:bg-dark-700'}
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto w-12 h-12 text-slate-500 mb-4" />
        <p className="text-slate-300 font-medium">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here, or click to select'}
        </p>
        <p className="text-slate-500 text-sm mt-1">
          Max {maxSize / (1024 * 1024)}MB per file{maxFiles ? `, up to ${maxFiles} files` : ''}
        </p>
      </motion.div>
      {fileRejections.length > 0 && (
        <p className="text-amber-400 text-sm">
          Some files were rejected (size or type). Check limits above.
        </p>
      )}
    </div>
  )
}

export const MemoizedUploadZone = memo(UploadZone)
export default MemoizedUploadZone

export function FilePreview({ files, onRemove }) {
  if (!files?.length) return null
  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {files.map((file, i) => (
        <motion.div
          key={file.name + i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-700 border border-dark-600"
        >
          <File size={18} className="text-slate-400" />
          <span className="text-sm text-slate-300 truncate max-w-[180px]">{file.name}</span>
          <span className="text-slate-500 text-xs">
            ({(file.size / 1024).toFixed(1)} KB)
          </span>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="text-slate-500 hover:text-red-400 ml-1"
              aria-label="Remove file"
            >
              ×
            </button>
          )}
        </motion.div>
      ))}
    </div>
  )
}
