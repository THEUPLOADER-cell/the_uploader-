# THE UPLOADER

**Upload. Fix. Download.** — Powerful file tools made simple.

A modern web app for students and anyone filling forms: compress PDFs, convert images to PDF, merge, split, resize, and more. **All processing happens in your browser** — no login, no server uploads.

## Run the app

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview   # optional: preview production build
```

## Optional backend (health check)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Health: [http://localhost:8000/health](http://localhost:8000/health)

## Tools

1. **Image to PDF** — Convert JPG, PNG, WebP to a single PDF  
2. **PDF to Image** — Export each PDF page as PNG or JPG  
3. **PDF Compressor** — Reduce PDF size  
4. **Image Compressor** — Compress images with quality control  
5. **PDF Merger** — Combine multiple PDFs into one  
6. **PDF Splitter** — Split a PDF into one file per page  
7. **Image Resizer** — Resize to custom dimensions  
8. **Image Format Converter** — Convert between JPG, PNG, WebP  
9. **PDF Page Rotator** — Rotate pages 90° or 180°  
10. **PDF Page Extractor** — Extract selected pages to a new PDF  

## Tech stack

- **Frontend:** React, Vite, TailwindCSS, React Router, Framer Motion, Lucide React  
- **Libraries:** pdf-lib, pdf.js, jsPDF, browser-image-compression, FileSaver.js, react-dropzone  
- **Backend (optional):** FastAPI for health check only  

## SEO

- Update `public/sitemap.xml` with your real domain (replace `https://the-uploader.example.com`).  
- Meta tags and structured data are set in `index.html` and via React Helmet on pages.
