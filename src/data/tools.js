import {
  Droplets,
  FileDown,
  FileImage,
  FileOutput,
  FileText,
  Image,
  ImagePlus,
  Maximize2,
  Merge,
  RefreshCw,
  RotateCw,
  Split,
} from 'lucide-react'

export const TOOLS = [
  {
    id: 'image-to-pdf',
    to: '/image-to-pdf',
    title: 'Image to PDF',
    description: 'Convert JPG, PNG or WebP images into a single PDF file.',
    icon: ImagePlus,
    keywords: ['jpg', 'jpeg', 'png', 'webp', 'convert', 'image', 'pdf'],
    tags: ['convert', 'pdf', 'image'],
  },
  {
    id: 'word-to-pdf',
    to: '/word-to-pdf',
    title: 'Word to PDF',
    description: 'Convert DOC or DOCX documents into PDF.',
    icon: FileText,
    keywords: ['doc', 'docx', 'convert', 'document', 'pdf'],
    tags: ['convert', 'pdf', 'document'],
  },
  {
    id: 'pdf-compressor',
    to: '/pdf-compressor',
    title: 'PDF Compressor',
    description: 'Reduce PDF file size without losing quality.',
    icon: FileDown,
    keywords: ['compress', 'reduce size', 'optimize', 'shrink', 'pdf'],
    tags: ['compress', 'pdf'],
  },
  {
    id: 'image-compressor',
    to: '/image-compressor',
    title: 'Image Compressor',
    description: 'Compress images to reduce file size.',
    icon: Image,
    keywords: ['compress', 'reduce size', 'optimize', 'jpg', 'jpeg', 'png', 'webp', 'image'],
    tags: ['compress', 'image'],
  },
  {
    id: 'pdf-merger',
    to: '/pdf-merger',
    title: 'PDF Merger',
    description: 'Combine multiple PDF files into one.',
    icon: Merge,
    keywords: ['merge', 'combine', 'join', 'pdf'],
    tags: ['merge', 'pdf'],
  },
  {
    id: 'pdf-splitter',
    to: '/pdf-splitter',
    title: 'PDF Splitter',
    description: 'Split a PDF into separate files by page.',
    icon: Split,
    keywords: ['split', 'pages', 'extract', 'pdf'],
    tags: ['split', 'pdf'],
  },
  {
    id: 'image-resizer',
    to: '/image-resizer',
    title: 'Image Resizer',
    description: 'Resize images to custom dimensions.',
    icon: Maximize2,
    keywords: ['resize', 'dimensions', 'scale', 'image', 'jpg', 'png', 'webp'],
    tags: ['resize', 'image'],
  },
  {
    id: 'image-format-converter',
    to: '/image-format-converter',
    title: 'Image Format Converter',
    description: 'Convert between JPG, PNG and WebP.',
    icon: RefreshCw,
    keywords: ['convert', 'format', 'jpg', 'jpeg', 'png', 'webp', 'image'],
    tags: ['convert', 'image'],
  },
  {
    id: 'pdf-watermark',
    to: '/pdf-watermark',
    title: 'PDF Watermark',
    description: 'Add a text watermark to your PDF.',
    icon: Droplets,
    keywords: ['watermark', 'text', 'secure', 'brand', 'pdf'],
    tags: ['watermark', 'pdf'],
  },
  {
    id: 'pdf-page-extractor',
    to: '/pdf-page-extractor',
    title: 'PDF Page Extractor',
    description: 'Extract specific pages into a new PDF.',
    icon: FileOutput,
    keywords: ['extract', 'pages', 'split', 'pdf'],
    tags: ['extract', 'pdf'],
  },
  {
    id: 'pdf-to-image',
    to: '/pdf-to-image',
    title: 'PDF to Image',
    description: 'Extract each PDF page as a PNG or JPG image.',
    icon: FileImage,
    keywords: ['pdf', 'to image', 'png', 'jpg', 'jpeg', 'extract', 'pages'],
    tags: ['convert', 'pdf', 'image'],
  },
  {
    id: 'pdf-page-rotator',
    to: '/pdf-page-rotator',
    title: 'PDF Page Rotator',
    description: 'Rotate PDF pages by 90° or 180°.',
    icon: RotateCw,
    keywords: ['rotate', 'rotation', 'turn', 'pages', 'pdf', '90', '180'],
    tags: ['rotate', 'pdf'],
  },
]

const normalize = (s) =>
  (s || '')
    .toString()
    .trim()
    .toLowerCase()

const INDEXED_TOOLS = TOOLS.map((t) => {
  const titleNorm = normalize(t.title)
  const keywordsNorm = (t.keywords || []).map(normalize)
  const tagsNorm = (t.tags || []).map(normalize)
  const haystack = [titleNorm, ...keywordsNorm, ...tagsNorm].join(' ')

  return {
    raw: t,
    titleNorm,
    keywordsNorm,
    tagsNorm,
    haystack,
  }
})

export function findExactTool(query) {
  const q = normalize(query)
  if (!q) return null

  const exact =
    INDEXED_TOOLS.find((t) => t.titleNorm === q) ||
    INDEXED_TOOLS.find((t) => t.keywordsNorm.includes(q))

  return exact ? exact.raw : null
}

export function getToolSuggestions(query, limit = 8) {
  const q = normalize(query)
  if (!q) return []

  const scored = []
  for (const t of INDEXED_TOOLS) {
    const { titleNorm, keywordsNorm, tagsNorm, haystack } = t

    let score = 0
    if (titleNorm === q) score = 1000
    else if (titleNorm.startsWith(q)) score = 700
    else if (titleNorm.includes(q)) score = 520
    else if (keywordsNorm.includes(q)) score = 480
    else if (keywordsNorm.some((k) => k.startsWith(q))) score = 360
    else if (keywordsNorm.some((k) => k.includes(q))) score = 220
    else if (tagsNorm.some((tag) => tag.startsWith(q) || tag.includes(q))) score = 160
    else if (haystack.includes(q)) score = 120

    if (score > 0) scored.push({ tool: t.raw, score })
  }

  scored.sort((a, b) => b.score - a.score || a.tool.title.localeCompare(b.tool.title))
  return scored.slice(0, limit).map((s) => s.tool)
}

