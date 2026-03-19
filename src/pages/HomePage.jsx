import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  Shield,
  Zap,
  Smartphone,
} from 'lucide-react'
import Hero from '../components/Hero'
import ToolCard from '../components/ToolCard'
import { useToolSearch } from '../context/ToolSearchContext'
import { TOOLS } from '../data/tools'

const tools = TOOLS

const features = [
  { icon: Shield, title: 'Private & secure', text: 'All processing happens in your browser. Files never leave your device.' },
  { icon: Zap, title: 'Fast', text: 'No uploads to servers means instant processing.' },
  { icon: Smartphone, title: 'No sign-up', text: 'Use any tool immediately. No account required.' },
]

const steps = [
  { step: 1, title: 'Choose a tool', text: 'Pick from compress, convert, merge, resize and more.' },
  { step: 2, title: 'Upload your files', text: 'Drag & drop or click. We support PDF and images.' },
  { step: 3, title: 'Process & download', text: 'Adjust options if needed, then download the result.' },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export default function HomePage() {
  const { query } = useToolSearch()
  const normalizedQuery = query.trim().toLowerCase()
  const filteredTools = normalizedQuery
    ? tools.filter((t) => {
        const haystack = [
          t.title,
          t.description,
          ...(t.keywords || []),
          ...(t.tags || []),
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(normalizedQuery)
      })
    : tools

  return (
    <>
      <Helmet>
        <title>THE UPLOADER – Free Online PDF & Image Tools | Convert, Compress, Merge</title>
        <meta
          name="description"
          content="THE UPLOADER is a free online toolkit to convert, compress, merge, split and resize PDFs and images directly in your browser. No signup, files stay private."
        />
        <link
          rel="canonical"
          href={
            typeof window !== 'undefined'
              ? `${window.location.origin}/`
              : 'https://theuploader.app/'
          }
        />
        <meta property="og:title" content="THE UPLOADER – Free Online PDF & Image Tools | Convert, Compress, Merge" />
        <meta
          property="og:description"
          content="Free online tools for PDFs and images – convert, compress, merge, split and resize files directly in your browser. Your files never leave your device."
        />
        <meta
          property="og:url"
          content={
            typeof window !== 'undefined'
              ? window.location.href
              : 'https://theuploader.app/'
          }
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/logo.svg" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="THE UPLOADER – Free Online PDF & Image Tools | Convert, Compress, Merge" />
        <meta
          name="twitter:description"
          content="Convert, compress, merge, split and resize PDFs and images directly in your browser. No signup, files stay private."
        />
        <meta name="twitter:image" content="/logo.svg" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                '@id': `${typeof window !== 'undefined' ? window.location.origin : ''}#organization`,
                name: 'THE UPLOADER',
                url: typeof window !== 'undefined' ? window.location.origin : '',
                description:
                  'THE UPLOADER provides free online PDF and image tools including converters, compressors, mergers and splitters. All processing happens in your browser.',
              },
              {
                '@type': 'WebSite',
                '@id': `${typeof window !== 'undefined' ? window.location.origin : ''}#website`,
                url: typeof window !== 'undefined' ? window.location.origin : '',
                name: 'THE UPLOADER',
                description:
                  'Free online tools for PDFs and images – convert, compress, merge, split and resize files directly in your browser.',
                publisher: {
                  '@id': `${typeof window !== 'undefined' ? window.location.origin : ''}#organization`,
                },
                potentialAction: {
                  '@type': 'SearchAction',
                  target: `${typeof window !== 'undefined' ? window.location.origin : ''}/?q={search_term_string}`,
                  'query-input': 'required name=search_term_string',
                },
              },
              {
                '@type': 'WebApplication',
                '@id': `${typeof window !== 'undefined' ? window.location.origin : ''}#webapp`,
                name: 'THE UPLOADER',
                url: typeof window !== 'undefined' ? window.location.origin : '',
                applicationCategory: 'UtilitiesApplication',
                description:
                  'Browser-based PDF and image utilities for converting, compressing, merging, splitting and resizing files without uploads.',
                operatingSystem: 'Any',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                },
                provider: {
                  '@id': `${typeof window !== 'undefined' ? window.location.origin : ''}#organization`,
                },
              },
            ],
          })}
        </script>
      </Helmet>
      <Hero />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
        <div className="rounded-2xl bg-dark-800/70 border border-dark-600 px-5 py-4 shadow-card">
          <p className="text-slate-200 text-sm sm:text-base">Your files never leave your device.</p>
          <p className="text-slate-400 text-sm sm:text-base">We do NOT store, back up, or access your files or data.</p>
          <p className="text-slate-400 text-sm sm:text-base">All processing happens on your device to keep your files safe.</p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-2xl sm:text-3xl font-bold text-white text-center mb-8"
        >
          Most Used Tools
        </motion.h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch"
        >
          {[
            '/image-to-pdf',
            '/word-to-pdf',
            '/pdf-compressor',
            '/image-compressor',
          ].map((path) => {
            const t = tools.find((tool) => tool.to === path)
            if (!t) return null
            return (
              <motion.div key={t.to} variants={item}>
                <ToolCard
                  to={t.to}
                  title={t.title}
                  description={t.description}
                  icon={t.icon}
                  featured
                />
              </motion.div>
            )
          })}
        </motion.div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-2xl sm:text-3xl font-bold text-white text-center mb-10"
        >
          All tools
        </motion.h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch"
        >
          {filteredTools.map((t) => (
            <motion.div key={t.to} variants={item}>
              <ToolCard to={t.to} title={t.title} description={t.description} icon={t.icon} />
            </motion.div>
          ))}
        </motion.div>
      </section>
      <section className="bg-dark-800/50 border-y border-dark-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl sm:text-3xl font-bold text-white text-center mb-12"
          >
            Why THE UPLOADER?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent-primary/20 flex items-center justify-center text-accent-primary mx-auto mb-4">
                  <f.icon size={28} />
                </div>
                <h3 className="font-display font-semibold text-lg text-white">{f.title}</h3>
                <p className="mt-2 text-slate-400">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-2xl sm:text-3xl font-bold text-white text-center mb-12"
        >
          How it works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-full bg-accent-primary text-white font-display font-bold text-lg flex items-center justify-center mx-auto mb-4">
                {s.step}
              </div>
              <h3 className="font-display font-semibold text-lg text-white">{s.title}</h3>
              <p className="mt-2 text-slate-400">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}
