// Inject GA4 script before React renders (runs once on initial load).
const gaMeasurementId = 'G-MXHR2YJ86C'
if (typeof document !== 'undefined') {
  const existingGtag = document.querySelector(
    `script[src="https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}"]`
  )

  if (!existingGtag) {
    const script1 = document.createElement('script')
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`
    script1.async = true
    document.head.appendChild(script1)
  }

  const hasInlineConfig = Array.from(document.scripts).some((s) =>
    (s.innerHTML || '').includes(`gtag('config', '${gaMeasurementId}')`)
  )

  if (!hasInlineConfig) {
    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaMeasurementId}');
    `
    document.head.appendChild(script2)
  }
}

import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>,
)
