import { Link } from 'react-router-dom'
import Logo from './Logo'

const toolLinks = [
  { to: '/image-to-pdf', label: 'Image to PDF' },
  { to: '/word-to-pdf', label: 'Word to PDF' },
  { to: '/pdf-compressor', label: 'PDF Compressor' },
  { to: '/image-compressor', label: 'Image Compressor' },
  { to: '/pdf-merger', label: 'PDF Merger' },
  { to: '/pdf-splitter', label: 'PDF Splitter' },
  { to: '/image-resizer', label: 'Image Resizer' },
  { to: '/image-converter', label: 'Image Converter' },
  { to: '/pdf-watermark', label: 'PDF Watermark' },
  { to: '/pdf-page-extractor', label: 'PDF Page Extractor' },
]

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="font-display font-semibold text-lg text-white">THE UPLOADER</span>
          </div>
          <p className="text-slate-400 text-sm max-w-md">
            Upload. Fix. Download. Powerful file tools made simple. All processing happens in your browser — your files never leave your device.
          </p>
        </div>
        <div className="mt-10 pt-8 border-t border-dark-600">
          <h3 className="text-sm font-medium text-white mb-4">All Tools</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {toolLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-slate-400 hover:text-accent-secondary text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-dark-600 text-center text-slate-500 text-sm space-y-2">
          <p>
            Need help? Contact us at{' '}
            <a
              href="mailto:support.theuploader@gmail.com"
              className="text-accent-secondary hover:text-accent-primary underline-offset-2 hover:underline"
            >
              support.theuploader@gmail.com
            </a>
            .
          </p>
          <p>
            © {new Date().getFullYear()} THE UPLOADER. No login required. Your files stay on your
            device.
          </p>
        </div>
      </div>
    </footer>
  )
}
