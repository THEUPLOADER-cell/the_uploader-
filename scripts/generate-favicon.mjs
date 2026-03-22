import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '../public')
const svgPath = path.join(publicDir, 'logo.svg')

const SIZE = 64

const pngBuf = await sharp(svgPath).resize(SIZE, SIZE).png().toBuffer()
await fs.writeFile(path.join(publicDir, 'favicon.png'), pngBuf)

const icoBuf = await pngToIco([pngBuf])
await fs.writeFile(path.join(publicDir, 'favicon.ico'), icoBuf)

console.log(`[favicon] Wrote public/favicon.png (${SIZE}×${SIZE}) and public/favicon.ico`)
