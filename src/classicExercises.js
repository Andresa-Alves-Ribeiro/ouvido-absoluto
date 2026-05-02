/**
 * Exercício 1 — clássico: ouvir C ou D; clicar a tecla certa.
 * Exercício 4 — mesma regra que o 1, com C, D ou E.
 * Exercícios 2 e 3 — dois sons (MA / MD): C (índice 0) e D (índice 1), ordem conforme o exercício.
 *
 * Nomenclatura dos ficheiros: n = 1…7 → primeira oitava; n = 8…14 → segunda oitava.
 *
 * Ficheiros reais: `b{n}-{Nota}.mp3` com n = 1…14; a nota segue duas oitavas de escala maior
 * (C D E F G A B repetido). Não existe `b{n}-C.mp3` e `b{n}-D.mp3` para o mesmo n.
 *
 * Série de 20: com streak < 10 usa-se só n ∈ [1..7] ou só [8..14]; no Exercício 1 a metade (grave/agudo) é
 * sorteada em `pickNewRound` (App.jsx) no início de cada par de acertos (e ao reiniciar após erro), não uma vez por série longa.
 * Com streak ≥ 10 pode misturar todo o intervalo 1–14 (no Ex. 1 e 4 usam-se os índices onde a nota é a alvo).
 */
export const EXERCISE_AUDIO_INDICES_LOW = [1, 2, 3, 4, 5, 6, 7]
export const EXERCISE_AUDIO_INDICES_HIGH = [8, 9, 10, 11, 12, 13, 14]

const NOTE_BY_INDEX = [
  '',
  'C',
  'D',
  'E',
  'F',
  'G',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'A',
  'B',
]

/** @param {number} index 1…14 */
export function audioFileForIndex(index) {
  return `b${index}-${NOTE_BY_INDEX[index]}.mp3`
}

/** Extrai a letra da nota de `b{n}-{Nota}.mp3` — deve coincidir com o som desse ficheiro. */
export function classicAudioFileNoteLabel(filename) {
  const m = /^b\d+-([A-G])\.mp3$/i.exec(filename)
  return m ? m[1].toUpperCase() : ''
}

/** Áudios 1–7: primeira oitava; 8–14: segunda oitava. */
export function octaveBandLabelForAudioIndex(index) {
  if (index >= 1 && index <= 7) return 'primeira oitava'
  if (index >= 8 && index <= 14) return 'segunda oitava'
  return ''
}

export const ALL_CLASSIC_EXERCISE_AUDIO_FILES = EXERCISE_AUDIO_INDICES_LOW.map(
  (n) => audioFileForIndex(n),
).concat(EXERCISE_AUDIO_INDICES_HIGH.map((n) => audioFileForIndex(n)))

/** Único par possível com uma oitava: dó (0) mais à esquerda, ré (1). */
export const EXERCISE_2_VALID_PAIRS = [[0, 1]]

function pickFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function poolIndices(streak, half) {
  const restricted = streak < 10
  if (!restricted) {
    return [...EXERCISE_AUDIO_INDICES_LOW, ...EXERCISE_AUDIO_INDICES_HIGH]
  }
  return half === 'low' ? EXERCISE_AUDIO_INDICES_LOW : EXERCISE_AUDIO_INDICES_HIGH
}

/** Notas permitidas nos exercícios de uma só nota (áudio `b{n}-Nota.mp3`). */
export const CLASSIC_ONE_NOTE_EX1_LABELS = ['C', 'D']
export const CLASSIC_ONE_NOTE_EX4_LABELS = ['C', 'D', 'E']

/**
 * Uma rodada = um ficheiro de áudio; o alvo é a nota desse ficheiro (nunca escolhas independentes).
 *
 * @param {readonly ('C' | 'D' | 'E')[]} allowedNoteLabels
 * @param {{ streak: number, half: 'low' | 'high' }} opts
 * @returns {{ target: string, audioFile: string }}
 */
export function pickClassicOneNoteRound(allowedNoteLabels, { streak, half }) {
  const allowed = new Set(allowedNoteLabels)
  const pool = poolIndices(streak, half)
  let candidates = pool.filter((i) => allowed.has(NOTE_BY_INDEX[i]))
  if (candidates.length === 0) {
    const full = [
      ...EXERCISE_AUDIO_INDICES_LOW,
      ...EXERCISE_AUDIO_INDICES_HIGH,
    ]
    candidates = full.filter((i) => allowed.has(NOTE_BY_INDEX[i]))
  }
  const i = pickFrom(candidates)
  const audioFile = audioFileForIndex(i)
  const target = classicAudioFileNoteLabel(audioFile) || NOTE_BY_INDEX[i]
  return { target, audioFile }
}

/**
 * Ex. 2 — escolha dos MP3 (C = audioFileLow, D = audioFileHigh no MA):
 * - streak &lt; 10: alterna a cada rodada (cada rodada = duas notas ouvidas) entre par só na
 *   primeira oitava (1,2) e par só na segunda (8,9).
 * - streak ≥ 10: sempre uma nota em cada oitava; alterna (1,9) ↔ (8,2) a cada rodada (cada nota
 *   muda de registo) e a cada duas rodadas reforça o ciclo com `floor(streak/2) % 2`.
 *
 * @param {{ streak: number, half?: 'low' | 'high' }} opts
 *   O objeto pode incluir `half` (como no Ex. 1); neste exercício só `streak` é usado.
 * @returns {{ lowIndex: number, highIndex: number, audioFileLow: string, audioFileHigh: string }}
 */
export function exercise2PickRound({ streak }) {
  const [lowIndex, highIndex] = EXERCISE_2_VALID_PAIRS[0]
  const restricted = streak < 10
  if (restricted) {
    const usePrimeiraOitava = streak % 2 === 0
    const indexC = usePrimeiraOitava ? 1 : 8
    const indexD = usePrimeiraOitava ? 2 : 9
    return {
      lowIndex,
      highIndex,
      audioFileLow: audioFileForIndex(indexC),
      audioFileHigh: audioFileForIndex(indexD),
    }
  }
  const everyRound = streak % 2
  const everyTwoRounds = Math.floor(streak / 2) % 2
  const baseCross = everyRound ^ everyTwoRounds
  const iC = baseCross === 0 ? 1 : 8
  const iD = baseCross === 0 ? 9 : 2
  return {
    lowIndex,
    highIndex,
    audioFileLow: audioFileForIndex(iC),
    audioFileHigh: audioFileForIndex(iD),
  }
}
