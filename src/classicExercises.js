/**
 * Exercício 1 — clássico: ouvir C ou D; clicar a tecla certa.
 * Exercícios 2 e 3 — dois sons (MA / MD): C (índice 0) e D (índice 1), ordem conforme o exercício.
 * Áudios: `b{n}-C.mp3` e `b{n}-D.mp3` com n = 1…14 em public/assets/audios/.
 * Série de 20: com streak < 10 usa-se só n ∈ [1..7] ou só [8..14] (metade escolhida ao reiniciar a série);
 * com streak ≥ 10 pode misturar todo o intervalo 1–14.
 */
export const EXERCISE_AUDIO_INDICES_LOW = [1, 2, 3, 4, 5, 6, 7]
export const EXERCISE_AUDIO_INDICES_HIGH = [8, 9, 10, 11, 12, 13, 14]

export const ALL_CLASSIC_EXERCISE_AUDIO_FILES = Array.from(
  { length: 14 },
  (_, k) => {
    const n = k + 1
    return [`b${n}-C.mp3`, `b${n}-D.mp3`]
  },
).flat()

/** Único par possível com uma oitava: dó (0) mais à esquerda, ré (1). */
export const EXERCISE_2_VALID_PAIRS = [[0, 1]]

function pickFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function audioFileFor(note, index) {
  return `b${index}-${note}.mp3`
}

export function exercise1PickTarget() {
  return Math.random() < 0.5 ? 'C' : 'D'
}

/**
 * @param {'C' | 'D'} target
 * @param {{ streak: number, half: 'low' | 'high' }} opts
 *   `streak` = acertos já acumulados ao preparar esta rodada (restrito enquanto < 10)
 */
export function exercise1PickAudioFile(target, { streak, half }) {
  const restricted = streak < 10
  const indices = restricted
    ? half === 'low'
      ? EXERCISE_AUDIO_INDICES_LOW
      : EXERCISE_AUDIO_INDICES_HIGH
    : [...EXERCISE_AUDIO_INDICES_LOW, ...EXERCISE_AUDIO_INDICES_HIGH]
  const i = pickFrom(indices)
  return audioFileFor(target, i)
}

/**
 * @param {{ streak: number, half: 'low' | 'high' }} opts
 * @returns {{ lowIndex: number, highIndex: number, audioFileLow: string, audioFileHigh: string }}
 */
export function exercise2PickRound({ streak, half }) {
  const [lowIndex, highIndex] = EXERCISE_2_VALID_PAIRS[0]
  const restricted = streak < 10
  if (restricted) {
    const indices =
      half === 'low' ? EXERCISE_AUDIO_INDICES_LOW : EXERCISE_AUDIO_INDICES_HIGH
    const i = pickFrom(indices)
    return {
      lowIndex,
      highIndex,
      audioFileLow: audioFileFor('C', i),
      audioFileHigh: audioFileFor('D', i),
    }
  }
  const all = [...EXERCISE_AUDIO_INDICES_LOW, ...EXERCISE_AUDIO_INDICES_HIGH]
  const iC = pickFrom(all)
  const iD = pickFrom(all)
  return {
    lowIndex,
    highIndex,
    audioFileLow: audioFileFor('C', iC),
    audioFileHigh: audioFileFor('D', iD),
  }
}
