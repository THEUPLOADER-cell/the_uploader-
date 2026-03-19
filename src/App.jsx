import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnimatedBackground from './components/AnimatedBackground'
import { ToolSearchProvider } from './context/ToolSearchContext'

const HomePage = lazy(() => import('./pages/HomePage'))
const HelpPage = lazy(() => import('./pages/HelpPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const ImageToPdf = lazy(() => import('./tools/ImageToPdf'))
const WordToPdf = lazy(() => import('./tools/WordToPdf'))
const PdfCompressor = lazy(() => import('./tools/PdfCompressor'))
const ImageCompressor = lazy(() => import('./tools/ImageCompressor'))
const PdfMerger = lazy(() => import('./tools/PdfMerger'))
const PdfSplitter = lazy(() => import('./tools/PdfSplitter'))
const ImageResizer = lazy(() => import('./tools/ImageResizer'))
const ImageFormatConverter = lazy(() => import('./tools/ImageFormatConverter'))
const PdfWatermark = lazy(() => import('./tools/PdfWatermark'))
const PdfPageExtractor = lazy(() => import('./tools/PdfPageExtractor'))
const PdfToImage = lazy(() => import('./tools/PdfToImage'))
const PdfPageRotator = lazy(() => import('./tools/PdfPageRotator'))

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-12 h-12 border-2 border-accent-primary border-t-transparent rounded-full"
    />
  </div>
)

function App() {
  return (
    <ToolSearchProvider>
      <div className="relative flex flex-col min-h-screen bg-dark-900 text-white">
        <AnimatedBackground />
        <Navbar />
        <main className="flex-1 relative z-10">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/image-to-pdf" element={<ImageToPdf />} />
              <Route path="/word-to-pdf" element={<WordToPdf />} />
              <Route path="/pdf-compressor" element={<PdfCompressor />} />
              <Route path="/image-compressor" element={<ImageCompressor />} />
              <Route path="/pdf-merger" element={<PdfMerger />} />
              <Route path="/pdf-splitter" element={<PdfSplitter />} />
              <Route path="/image-resizer" element={<ImageResizer />} />
              <Route path="/image-converter" element={<ImageFormatConverter />} />
              <Route path="/image-format-converter" element={<ImageFormatConverter />} />
              <Route path="/pdf-watermark" element={<PdfWatermark />} />
              <Route path="/pdf-page-extractor" element={<PdfPageExtractor />} />
              <Route path="/pdf-to-image" element={<PdfToImage />} />
              <Route path="/pdf-page-rotator" element={<PdfPageRotator />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </ToolSearchProvider>
  )
}

export default App
