import { BLACK_KEYS, WHITE_KEYS } from './pianoKeys.js'

/**
 * Vite deixa BASE_URL com barra final (ex.: '/', '/subdir/', './').
 * @see https://vite.dev/guide/build#public-base-path
 */
export function publicAudioUrl(fileName) {
  const base = import.meta.env.BASE_URL ?? '/'
  const root = base.endsWith('/') ? base : `${base}/`
  return `${root}assets/audios/${encodeURIComponent(fileName)}`
}

const FILES = [...new Set([...WHITE_KEYS, ...BLACK_KEYS].map((k) => k.audioFile))]

/** Um URL por nome de ficheiro (várias teclas podem partilhar o mesmo ficheiro). */
export const AUDIO_URL_BY_FILE = Object.fromEntries(
  FILES.map((fileName) => [fileName, publicAudioUrl(fileName)]),
)
