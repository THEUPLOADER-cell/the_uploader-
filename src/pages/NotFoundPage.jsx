import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found (404) | THE UPLOADER</title>
        <meta
          name="description"
          content="The page you’re looking for doesn’t exist. Return to THE UPLOADER homepage to use our free PDF and image tools."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl bg-dark-800 border border-dark-600 p-8 shadow-card text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">Page not found</h1>
          <p className="mt-3 text-slate-400">
            The URL may be incorrect, or the page may have been moved.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              to="/"
              className="px-6 py-3 rounded-xl bg-accent-primary text-white font-medium hover:bg-accent-secondary transition-colors"
            >
              Go to homepage
            </Link>
            <Link
              to="/help"
              className="px-6 py-3 rounded-xl bg-dark-700 text-slate-200 border border-dark-500 hover:bg-dark-600 transition-colors"
            >
              Help &amp; Guidance
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

