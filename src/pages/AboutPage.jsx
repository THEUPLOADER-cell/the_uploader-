import { Helmet } from 'react-helmet-async'
import { canonicalUrl, getSiteUrl } from '../utils/site'

export default function AboutPage() {
  const title = 'About Us | THE UPLOADER'
  const description =
    'Learn about THE UPLOADER — fast, simple, privacy-first file tools to compress PDFs, convert images, and handle everyday file tasks online.'
  const canonical = canonicalUrl('/about')
  const ogImage = `${getSiteUrl()}/logo.svg`

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="rounded-2xl bg-dark-800 border border-dark-600 p-7 sm:p-10 shadow-card">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">About Us</h1>
          <p className="mt-4 text-slate-300 leading-relaxed">
            Welcome to <span className="font-semibold text-white">The Uploader</span> — your
            all-in-one platform for simple, fast, and reliable file tools.
          </p>
          <p className="mt-4 text-slate-300 leading-relaxed">
            At The Uploader, our goal is to make everyday digital tasks easier for everyone.
            Whether you need to compress PDFs, convert images, or manage files quickly, we provide
            tools that are easy to use and completely online — no installation required.
          </p>

          <div className="mt-10 grid gap-8">
            <section>
              <h2 className="font-display text-2xl text-white mb-3">What We Offer</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                We offer a growing collection of free tools designed to save your time and effort:
              </p>
              <ul className="mt-4 list-disc list-inside text-slate-300 text-sm space-y-2">
                <li>PDF Compression</li>
                <li>Image to PDF Conversion</li>
                <li>File Optimization Tools</li>
                <li>And many more coming soon...</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-white mb-3">Why Choose Us?</h2>
              <ul className="list-disc list-inside text-slate-300 text-sm space-y-2">
                <li>Fast and efficient processing</li>
                <li>Clean and simple interface</li>
                <li>No unnecessary steps</li>
                <li>Works on all devices (mobile &amp; desktop)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-white mb-3">Privacy First</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                We respect your privacy. Your files are processed securely and are not stored
                permanently on our servers.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-white mb-3">Contact Us</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                If you have any questions, suggestions, or need help, feel free to reach out:
              </p>
              <p className="mt-3 text-slate-300 text-sm">
                <a
                  href="mailto:support.theuploader@gmail.com"
                  className="text-accent-secondary hover:text-accent-primary underline-offset-2 hover:underline"
                >
                  support.theuploader@gmail.com
                </a>
              </p>
              <p className="mt-6 text-slate-300 text-sm leading-relaxed">
                We are constantly working to improve and add new features to make The Uploader even
                better for you. Thank you for using{' '}
                <span className="font-semibold text-white">The Uploader</span>!
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

