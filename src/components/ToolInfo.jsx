export default function ToolInfo({ title }) {
  return (
    <section className="max-w-4xl mx-auto mt-12 px-6 py-8 bg-white/5 rounded-2xl shadow-lg border border-white/10 text-gray-300">

      {/* ABOUT */}
      <h2 className="text-2xl font-semibold mb-4 text-white">
        About {title}
      </h2>
      <p className="mb-6 leading-relaxed">
        This tool allows you to easily process your files online for free.
        All operations are performed directly in your browser, ensuring complete privacy and security.
        No login or signup is required, making it fast and convenient to use anytime.
      </p>

      {/* HOW TO USE */}
      <h2 className="text-2xl font-semibold mb-4 text-white">
        How to Use
      </h2>
      <ol className="list-decimal ml-6 mb-6 space-y-2">
        <li>Upload your file</li>
        <li>Adjust settings if needed</li>
        <li>Click the process button</li>
        <li>Download your file instantly</li>
      </ol>

      {/* FEATURES */}
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Features
      </h2>
      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>100% free to use</li>
        <li>No login required</li>
        <li>Fast processing</li>
        <li>Secure and private (client-side)</li>
      </ul>

      {/* FAQ */}
      <h2 className="text-2xl font-semibold mb-4 text-white">
        FAQ
      </h2>

      <div className="space-y-4">
        <p>
          <strong>Is my data safe?</strong><br />
          Yes, all files are processed directly in your browser and never uploaded to any server.
        </p>

        <p>
          <strong>Is this tool free?</strong><br />
          Yes, all tools on THE UPLOADER are completely free to use.
        </p>

        <p>
          <strong>Does it work on mobile?</strong><br />
          Yes, the tool is fully responsive and works smoothly on all devices.
        </p>
      </div>

    </section>
  );
}