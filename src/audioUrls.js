import { ALL_CLASSIC_EXERCISE_AUDIO_FILES } from './classicExercises.js'
import { BLACK_KEYS, WHITE_KEYS } from './pianoKeys.js'

export function publicAudioUrl(fileName) {
  const base = import.meta.env.BASE_URL ?? '/'
  const root = base.endsWith('/') ? base : `${base}/`
  return `${root}assets/audios/${encodeURIComponent(fileName)}`
}

const exerciseAudioFiles = ALL_CLASSIC_EXERCISE_AUDIO_FILES

const FILES = [
  ...new Set([
    ...WHITE_KEYS.map((k) => k.audioFile),
    ...BLACK_KEYS.map((k) => k.audioFile),
    ...exerciseAudioFiles,
  ]),
]

export const AUDIO_URL_BY_FILE = Object.fromEntries(
  FILES.map((fileName) => [fileName, publicAudioUrl(fileName)]),
)
