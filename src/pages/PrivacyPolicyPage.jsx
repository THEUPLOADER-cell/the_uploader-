import { Helmet } from 'react-helmet-async'

export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | THE UPLOADER</title>
        <meta
          name="description"
          content="Learn how THE UPLOADER protects your privacy. Files never leave your device, no login is required, and we do not store or collect personal data."
        />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">
          Privacy Policy
        </h1>
        <p className="text-slate-300 mb-6">
          Your privacy is a core principle of THE UPLOADER. This page explains exactly how your data
          is handled when you use our tools.
        </p>

        <section className="mb-6">
          <h2 className="font-display text-2xl text-white mb-3">Files stay on your device</h2>
          <p className="text-slate-300 text-sm">
            All processing happens directly in your browser using client-side technologies. Your
            PDFs, images, and documents are never uploaded to any server owned by us or third
            parties. The files you select only exist in your browser&apos;s memory while you are
            using the tool.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-display text-2xl text-white mb-3">No storage of your files</h2>
          <p className="text-slate-300 text-sm">
            We do not store, back up, or archive any of your files. When you close the tab or
            navigate away, the in-memory data used for processing is discarded by your browser.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-display text-2xl text-white mb-3">No login, no account</h2>
          <p className="text-slate-300 text-sm">
            THE UPLOADER does not require you to create an account or log in. You can use every
            tool for free without registering or providing any personal details.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-display text-2xl text-white mb-3">No personal data collection</h2>
          <p className="text-slate-300 text-sm">
            We do not collect personal data from your documents or files. Any analytics, if used,
            are focused on anonymous usage patterns to help improve the product, not on identifying
            individual users or reading file contents.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-display text-2xl text-white mb-3">Your control</h2>
          <p className="text-slate-300 text-sm">
            Because everything runs in your browser, you stay in full control of your files. If you
            want to remove all traces of a session, simply close the tab or clear your browser
            history and cache.
          </p>
        </section>
        <section className="mb-10">
          <h2 className="font-display text-2xl text-white mb-3">Contact Us</h2>
          <p className="text-slate-300 text-sm">
            If you have any questions about this Privacy Policy or how THE UPLOADER handles your
            data, you can contact us at{' '}
            <a
              href="mailto:support.theuploader@gmail.com"
              className="text-accent-secondary hover:text-accent-primary underline-offset-2 hover:underline"
            >
              support.theuploader@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </>
  )
}

