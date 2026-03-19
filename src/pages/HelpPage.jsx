import { Helmet } from 'react-helmet-async'

export default function HelpPage() {
  return (
    <>
      <Helmet>
        <title>Help &amp; Guidance | THE UPLOADER</title>
        <meta
          name="description"
          content="Learn how to use THE UPLOADER to upload, process, and download your files safely on your own device."
        />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">
          Help &amp; Guidance
        </h1>
        <p className="text-slate-300 mb-8">
          THE UPLOADER is designed to be simple and safe. Follow this guide to get the best results
          when preparing documents for online applications, homework, and forms.
        </p>

        <section className="mb-8">
          <h2 className="font-display text-2xl text-white mb-3">How to upload files</h2>
          <p className="text-slate-300 mb-3">
            Every tool starts with an upload area. You can either drag and drop your files from your
            desktop or click the area to choose files from your device.
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 text-sm">
            <li>Supported formats include PDF, JPG, PNG, WebP and common document types.</li>
            <li>Maximum file size and number of files are shown directly under the upload area.</li>
            <li>
              All processing happens in your browser – your files are never uploaded to any server.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-display text-2xl text-white mb-3">Step-by-step: general workflow</h2>
          <ol className="list-decimal list-inside text-slate-300 space-y-2 text-sm">
            <li>Choose the tool you need from the homepage (for example, Image to PDF).</li>
            <li>Upload your files using drag &amp; drop or the file picker.</li>
            <li>Adjust any available options such as quality, size, or watermark text.</li>
            <li>Click the main action button (Compress, Convert, Merge, etc.).</li>
            <li>Wait for the progress bar to complete, then download your processed file.</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="font-display text-2xl text-white mb-3">Tool usage examples</h2>
          <div className="space-y-4 text-sm text-slate-300">
            <div>
              <h3 className="font-semibold text-white mb-1">Image → PDF</h3>
              <p>
                Use this when a website only accepts PDFs but you have photos or screenshots.
                Upload your images, arrange them in order, then create a single PDF to upload.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Word → PDF</h3>
              <p>
                Convert DOC or DOCX files to PDF before sending them to universities or offices.
                This keeps your formatting consistent so it looks the same for everyone.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">PDF &amp; Image Compressors</h3>
              <p>
                If a form has a strict file size limit (for example 2MB), compress your PDF or
                images here to reduce the size while keeping them readable.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-display text-2xl text-white mb-3">Tips for better results</h2>
          <ul className="list-disc list-inside text-slate-300 space-y-2 text-sm">
            <li>Scan or photograph documents in good lighting for sharper results.</li>
            <li>Use the compressor tools if a website rejects your file for being too large.</li>
            <li>Keep original copies of your files in case you need to reprocess them later.</li>
            <li>
              Double-check the final PDF or image before uploading it to your application portal.
            </li>
          </ul>
        </section>
        <section className="mb-10">
          <h2 className="font-display text-2xl text-white mb-3">Need Help?</h2>
          <p className="text-slate-300 text-sm">
            If you need any help or have any questions, feel free to contact us at{' '}
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

