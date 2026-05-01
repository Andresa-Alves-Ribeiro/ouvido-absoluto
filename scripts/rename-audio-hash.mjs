#!/usr/bin/env node
/** Renomeia # → sharp nos .mp3 (evita DEMUXER/404 ao servir pelo Vite no Windows). */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dir = path.join(__dirname, '..', 'public', 'assets', 'audios')

if (!fs.existsSync(dir)) {
  console.error('Pasta inexistente:', dir)
  process.exit(1)
}

for (const f of fs.readdirSync(dir)) {
  if (!f.includes('#') || !f.toLowerCase().endsWith('.mp3')) continue
  const to = f.replace(/#/g, 'sharp')
  const fromPath = path.join(dir, f)
  const toPath = path.join(dir, to)
  if (fs.existsSync(toPath)) {
    console.warn('Ignorado (destino já existe):', to)
    continue
  }
  fs.renameSync(fromPath, toPath)
  console.log('Renomeado:', f, '→', to)
}
