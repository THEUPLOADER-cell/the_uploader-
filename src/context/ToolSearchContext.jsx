import { createContext, useContext, useState } from 'react'

const ToolSearchContext = createContext(null)

export function ToolSearchProvider({ children }) {
  const [query, setQuery] = useState('')

  return (
    <ToolSearchContext.Provider value={{ query, setQuery }}>
      {children}
    </ToolSearchContext.Provider>
  )
}

export function useToolSearch() {
  const ctx = useContext(ToolSearchContext)
  if (!ctx) {
    throw new Error('useToolSearch must be used within a ToolSearchProvider')
  }
  return ctx
}

