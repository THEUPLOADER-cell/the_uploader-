import { useState, useCallback } from 'react'

export function useProcessing() {
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const start = useCallback(() => {
    setProcessing(true)
    setProgress(0)
    setError(null)
  }, [])

  const setProgressValue = useCallback((value) => {
    setProgress(Math.min(100, Math.round(value)))
  }, [])

  const finish = useCallback(() => {
    setProcessing(false)
    setProgress(100)
  }, [])

  const setErr = useCallback((msg) => {
    setError(msg)
    setProcessing(false)
  }, [])

  const reset = useCallback(() => {
    setProcessing(false)
    setProgress(0)
    setError(null)
  }, [])

  return { processing, progress, error, start, finish, setProgressValue, setError: setErr, reset }
}
