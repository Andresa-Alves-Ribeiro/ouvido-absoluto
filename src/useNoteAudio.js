import { useCallback, useRef } from 'react'

import { AUDIO_URL_BY_FILE } from './audioUrls.js'

export function useNoteAudio() {
  const cache = useRef(new Map())

  const playFile = useCallback((audioFile) => {
    const src = AUDIO_URL_BY_FILE[audioFile]
    if (!src) return

    let audio = cache.current.get(src)
    if (!audio) {
      audio = new Audio()
      audio.preload = 'auto'
      audio.addEventListener('error', () => cache.current.delete(src), {
        once: true,
      })
      audio.src = src
      cache.current.set(src, audio)
    }

    audio.pause()
    audio.currentTime = 0
    audio.play().catch(() => {})
  }, [])

  return playFile
}
