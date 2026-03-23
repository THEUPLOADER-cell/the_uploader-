import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search } from 'lucide-react'
import Logo from './Logo'
import { useToolSearch } from '../context/ToolSearchContext'
import useDebouncedValue from '../hooks/useDebouncedValue'
import { findExactTool, getToolSuggestions } from '../data/tools'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const { query, setQuery } = useToolSearch()
  const location = useLocation()
  const navigate = useNavigate()
  const containerRef = useRef(null)

  const isHome = location.pathname === '/'
  const debouncedForPageFilter = useDebouncedValue(inputValue, 150)

  useEffect(() => {
    if (!isHome) return
    setQuery(debouncedForPageFilter)
  }, [debouncedForPageFilter, isHome, setQuery])

  useEffect(() => {
    if (!isHome) return
    setInputValue(query || '')
  }, [isHome, query])

  const suggestions = useMemo(
    () => (isHome ? getToolSuggestions(inputValue, 8) : []),
    [inputValue, isHome]
  )

  useEffect(() => {
    const onDown = (e) => {
      if (!containerRef.current) return
      if (containerRef.current.contains(e.target)) return
      setDropdownOpen(false)
      setActiveIndex(-1)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const openTool = (tool) => {
    if (!tool?.to) return
    setDropdownOpen(false)
    setActiveIndex(-1)
    setOpen(false)
    setSearchOpen(false)
    navigate(tool.to)
  }

  const onKeyDown = (e) => {
    if (!isHome) return

    const hasQuery = inputValue.trim().length > 0
    const hasSuggestions = suggestions.length > 0

    if (e.key === 'ArrowDown') {
      if (!hasQuery) return
      e.preventDefault()
      setDropdownOpen(true)
      if (!hasSuggestions) return
      setActiveIndex((idx) => {
        const next = idx + 1
        return next >= suggestions.length ? 0 : next
      })
      return
    }

    if (e.key === 'ArrowUp') {
      if (!hasQuery) return
      e.preventDefault()
      setDropdownOpen(true)
      if (!hasSuggestions) return
      setActiveIndex((idx) => {
        const next = idx <= 0 ? suggestions.length - 1 : idx - 1
        return next
      })
      return
    }

    if (e.key === 'Escape') {
      if (!dropdownOpen) return
      e.preventDefault()
      setDropdownOpen(false)
      setActiveIndex(-1)
      return
    }

    if (e.key === 'Enter') {
      if (!hasQuery) return
      e.preventDefault()

      if (dropdownOpen && activeIndex >= 0 && suggestions[activeIndex]) {
        openTool(suggestions[activeIndex])
        return
      }

      const exact = findExactTool(inputValue)
      if (exact) {
        openTool(exact)
        return
      }

      if (suggestions.length === 1) {
        openTool(suggestions[0])
        return
      }

      setDropdownOpen(true)
      setActiveIndex(suggestions.length ? 0 : -1)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-dark-900/90 backdrop-blur-md border-b border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="w-9 h-9" />
            <span className="font-display font-semibold text-xl text-white">THE UPLOADER</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/help"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Help &amp; Guidance
            </Link>
            <Link
              to="/about"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              About Us
            </Link>
            <Link
              to="/privacy-policy"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Privacy Policy
            </Link>
            {isHome && (
              <div className="relative" ref={containerRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="search"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                    setDropdownOpen(true)
                    setActiveIndex(-1)
                  }}
                  onFocus={() => {
                    if (inputValue.trim()) setDropdownOpen(true)
                  }}
                  onKeyDown={onKeyDown}
                  placeholder="Search tools…"
                  className="pl-9 pr-3 py-1.5 rounded-full bg-dark-700 border border-dark-500 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-accent-primary/70"
                />

                <AnimatePresence>
                  {dropdownOpen && inputValue.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.12 }}
                      className="absolute left-0 right-0 mt-2 rounded-2xl bg-dark-800 border border-dark-600 shadow-card overflow-hidden z-50"
                    >
                      {suggestions.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-slate-400">
                          No results found
                        </div>
                      ) : (
                        <ul className="py-1 max-h-[320px] overflow-auto">
                          {suggestions.map((t, idx) => (
                            <li key={t.id || t.to}>
                              <button
                                type="button"
                                onMouseEnter={() => setActiveIndex(idx)}
                                onClick={() => openTool(t)}
                                className={`w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors ${
                                  idx === activeIndex
                                    ? 'bg-dark-700 text-white'
                                    : 'text-slate-200 hover:bg-dark-700/70'
                                }`}
                              >
                                <span className="mt-0.5 text-accent-primary">
                                  {t.icon ? <t.icon size={18} /> : null}
                                </span>
                                <span className="min-w-0">
                                  <span className="block text-sm font-medium truncate">{t.title}</span>
                                  <span className="block text-xs text-slate-400 truncate">{t.description}</span>
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {isHome && (
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-white"
                onClick={() => setSearchOpen((v) => !v)}
                aria-label="Toggle search"
              >
                <Search size={20} />
              </button>
            )}
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-white"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-dark-600 bg-dark-800"
          >
            <div className="px-4 py-3 flex flex-col gap-2">
              <Link
                to="/"
                className="py-2 text-slate-300 hover:text-white"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/help"
                className="py-2 text-slate-300 hover:text-white"
                onClick={() => setOpen(false)}
              >
                Help &amp; Guidance
              </Link>
              <Link
                to="/about"
                className="py-2 text-slate-300 hover:text-white"
                onClick={() => setOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/privacy-policy"
                className="py-2 text-slate-300 hover:text-white"
                onClick={() => setOpen(false)}
              >
                Privacy Policy
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {searchOpen && isHome && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-dark-600 bg-dark-800"
          >
            <div className="px-4 py-3">
              <div className="relative" ref={containerRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="search"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                    setDropdownOpen(true)
                    setActiveIndex(-1)
                  }}
                  onFocus={() => {
                    if (inputValue.trim()) setDropdownOpen(true)
                  }}
                  onKeyDown={onKeyDown}
                  placeholder="Search tools…"
                  className="pl-9 pr-3 py-2 rounded-full bg-dark-700 border border-dark-500 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-accent-primary/70 w-full"
                />

                <AnimatePresence>
                  {dropdownOpen && inputValue.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.12 }}
                      className="absolute left-0 right-0 mt-2 rounded-2xl bg-dark-800 border border-dark-600 shadow-card overflow-hidden z-50"
                    >
                      {suggestions.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-slate-400">
                          No results found
                        </div>
                      ) : (
                        <ul className="py-1 max-h-[320px] overflow-auto">
                          {suggestions.map((t, idx) => (
                            <li key={t.id || t.to}>
                              <button
                                type="button"
                                onMouseEnter={() => setActiveIndex(idx)}
                                onClick={() => openTool(t)}
                                className={`w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors ${
                                  idx === activeIndex
                                    ? 'bg-dark-700 text-white'
                                    : 'text-slate-200 hover:bg-dark-700/70'
                                }`}
                              >
                                <span className="mt-0.5 text-accent-primary">
                                  {t.icon ? <t.icon size={18} /> : null}
                                </span>
                                <span className="min-w-0">
                                  <span className="block text-sm font-medium truncate">{t.title}</span>
                                  <span className="block text-xs text-slate-400 truncate">{t.description}</span>
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
