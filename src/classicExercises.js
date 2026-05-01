/**
 * Exercício 1 — clássico: ouvir C ou D; clicar qualquer C ou D correto.
 * Exercício 2 — dois sons MA (grave → agudo): um C e um D em índices distintos.
 * Exercício 3 — dois sons MD (agudo → grave): mesmos pares C/D que o Ex. 2, ordem invertida.
 * `exercise2PickRound()` serve aos exercícios 2 e 3. Áudios em public/assets/audios/.
 */
export const EXERCISE_1_AUDIO_POOL = {
  C: ['b1-C.mp3', 'b8-C.mp3', 'b15-C.mp3'],
  D: ['b2-D.mp3', 'b9-D.mp3'],
}

/** Índices das brancas no teclado: um C e um D por par, low < high. */
export const EXERCISE_2_VALID_PAIRS = [
  [0, 1],
  [0, 8],
  [1, 7],
  [1, 14],
  [7, 8],
  [8, 14],
]

/** Um ficheiro de áudio por índice de tecla branca usado no modo clássico (C/D). */
const WHITE_INDEX_TO_EXERCISE_AUDIO = {
  0: 'b1-C.mp3',
  1: 'b2-D.mp3',
  7: 'b8-C.mp3',
  8: 'b9-D.mp3',
  14: 'b15-C.mp3',
}

export function exercise1PickTarget() {
  return Math.random() < 0.5 ? 'C' : 'D'
}

export function exercise1PickAudioFile(target) {
  const pool = EXERCISE_1_AUDIO_POOL[target]
  return pool[Math.floor(Math.random() * pool.length)]
}

/**
 * @returns {{ lowIndex: number, highIndex: number, audioFileLow: string, audioFileHigh: string }}
 */
export function exercise2PickRound() {
  const pairs = EXERCISE_2_VALID_PAIRS
  const [lowIndex, highIndex] =
    pairs[Math.floor(Math.random() * pairs.length)]
  return {
    lowIndex,
    highIndex,
    audioFileLow: WHITE_INDEX_TO_EXERCISE_AUDIO[lowIndex],
    audioFileHigh: WHITE_INDEX_TO_EXERCISE_AUDIO[highIndex],
  }
}
