import { useCallback, useRef } from 'react'

import { AUDIO_URL_BY_FILE } from './audioUrls.js'

function waitUntilPlayable(audio) {
  return new Promise((resolve) => {
    if (audio.error) {
      resolve()
      return
    }
    if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      resolve()
      return
    }
    const done = () => {
      audio.removeEventListener('canplay', done)
      audio.removeEventListener('error', onErr)
      resolve()
    }
    const onErr = () => {
      audio.removeEventListener('canplay', done)
      resolve()
    }
    audio.addEventListener('canplay', done, { once: true })
    audio.addEventListener('error', onErr, { once: true })
  })
}

export function useNoteAudio() {
  const cache = useRef(new Map())

  /**
   * @param {string} audioFile
   * @param {{ immediate?: boolean }} [opts] — `immediate`: tenta `play()` já (útil ligado a um clique; sem esperar `canplay`).
   * @returns {Promise<boolean>}
   */
  const playFile = useCallback((audioFile, opts = {}) => {
    const immediate = opts.immediate === true
    const src = AUDIO_URL_BY_FILE[audioFile]
    if (!src) return Promise.resolve(false)

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

    const runPlay = () =>
      audio.play().then(() => true).catch(() => false)

    if (immediate) {
      return runPlay()
    }

    return waitUntilPlayable(audio).then(runPlay)
  }, [])

  const pauseAll = useCallback(() => {
    for (const audio of cache.current.values()) {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  return { playFile, pauseAll }
}
