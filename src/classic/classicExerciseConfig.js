import { BLACK_KEYS } from '../pianoKeys.js'

export const VERIFICATION_TARGET = 20

const CLASSIC_CD_WHITE_INDICES = new Set([0, 1])
const CLASSIC_CDE_WHITE_INDICES = new Set([0, 1, 2])
const CLASSIC_CDEF_WHITE_INDICES = new Set([0, 1, 2, 3])
const CLASSIC_CDEFG_WHITE_INDICES = new Set([0, 1, 2, 3, 4])
const CLASSIC_CDEFGA_WHITE_INDICES = new Set([0, 1, 2, 3, 4, 5])
const CLASSIC_CDEFGAB_WHITE_INDICES = new Set([0, 1, 2, 3, 4, 5, 6])
const CLASSIC_DIMINISHED1_WHITE_INDICES = new Set([1, 3, 6])
const CLASSIC_DIMINISHED2_WHITE_INDICES = new Set([0, 5])
const CLASSIC_DIMINISHED3_WHITE_INDICES = new Set([2, 4])

const CLASSIC_EX24_EX25_ALLOWED_BLACK_INDICES = new Set([
  BLACK_KEYS.findIndex((k) => k.sharp === 'G#'),
])

const CLASSIC_EX28_ALLOWED_BLACK_INDICES = new Set([
  BLACK_KEYS.findIndex((k) => k.sharp === 'F#'),
])

const CLASSIC_EX32_ALLOWED_BLACK_INDICES = new Set([
  BLACK_KEYS.findIndex((k) => k.sharp === 'D#'),
])

const CLASSIC_EX36_EX37_ALLOWED_BLACK_INDICES = new Set([
  BLACK_KEYS.findIndex((k) => k.sharp === 'C#'),
])

const CLASSIC_EX40_EX41_ALLOWED_BLACK_INDICES = new Set([
  BLACK_KEYS.findIndex((k) => k.sharp === 'A#'),
])

const CLASSIC_EX47_ALLOWED_BLACK_INDICES = new Set([
  BLACK_KEYS.findIndex((k) => k.sharp === 'D#'),
  BLACK_KEYS.findIndex((k) => k.sharp === 'F#'),
])

const CLASSIC_EX51_ALLOWED_BLACK_INDICES = new Set([
  BLACK_KEYS.findIndex((k) => k.sharp === 'C#'),
  BLACK_KEYS.findIndex((k) => k.sharp === 'A#'),
])

export const BETWEEN_NOTES_MS = 1000

export function rollVerificationHalf(halfRef) {
  halfRef.current = Math.random() < 0.5 ? 'low' : 'high'
}

export function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export const CLASSIC_EXERCISE_IDS_IN_ORDER = [
  1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
  24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 43, 42, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54
]

export const CLASSIC_EXERCISE_COUNT = CLASSIC_EXERCISE_IDS_IN_ORDER.length

const CLASSIC_EXERCISE_DISPLAY_NUM = new Map(
  CLASSIC_EXERCISE_IDS_IN_ORDER.map((id, i) => [id, i + 1]),
)

export function classicExerciseDisplayNumber(internalId) {
  const n = CLASSIC_EXERCISE_DISPLAY_NUM.get(internalId)
  return n !== undefined ? n : internalId
}

export function classicAllowedWhiteIndices(exerciseId) {
  if (exerciseId === 51 || exerciseId === 52 || exerciseId === 53 || exerciseId === 54) {
    return CLASSIC_DIMINISHED3_WHITE_INDICES
  }
  if (exerciseId === 47 || exerciseId === 48 || exerciseId === 49 || exerciseId === 50) {
    return CLASSIC_DIMINISHED2_WHITE_INDICES
  }
  if (
    exerciseId === 42 ||
    exerciseId === 44 ||
    exerciseId === 45 ||
    exerciseId === 46
  ) {
    return CLASSIC_DIMINISHED1_WHITE_INDICES
  }
  if (
    (exerciseId >= 20 && exerciseId <= 41) ||
    exerciseId === 43
  ) {
    return CLASSIC_CDEFGAB_WHITE_INDICES
  }
  if (exerciseId >= 16 && exerciseId <= 19) return CLASSIC_CDEFGA_WHITE_INDICES
  if (exerciseId >= 12 && exerciseId <= 15) return CLASSIC_CDEFG_WHITE_INDICES
  if (exerciseId >= 8 && exerciseId <= 11) return CLASSIC_CDEF_WHITE_INDICES
  if (exerciseId >= 4 && exerciseId <= 7) return CLASSIC_CDE_WHITE_INDICES
  return CLASSIC_CD_WHITE_INDICES
}

export function classicAllowedBlackIndices(exerciseId) {
  if (exerciseId === 51 || exerciseId === 52 || exerciseId === 53 || exerciseId === 54) {
    return CLASSIC_EX51_ALLOWED_BLACK_INDICES
  }
  if (exerciseId === 47 || exerciseId === 48 || exerciseId === 49 || exerciseId === 50) {
    return CLASSIC_EX47_ALLOWED_BLACK_INDICES
  }
  if (exerciseId === 40 || exerciseId === 43) {
    return CLASSIC_EX40_EX41_ALLOWED_BLACK_INDICES
  }
  if (exerciseId === 41 || exerciseId === 42) {
    return CLASSIC_EX24_EX25_ALLOWED_BLACK_INDICES
  }
  if (exerciseId >= 36 && exerciseId <= 39) {
    return CLASSIC_EX36_EX37_ALLOWED_BLACK_INDICES
  }
  if (exerciseId >= 32 && exerciseId <= 35) {
    return CLASSIC_EX32_ALLOWED_BLACK_INDICES
  }
  if (exerciseId >= 28 && exerciseId <= 31) {
    return CLASSIC_EX28_ALLOWED_BLACK_INDICES
  }
  if (
    exerciseId === 24 ||
    exerciseId === 25 ||
    exerciseId === 26 ||
    exerciseId === 27 ||
    exerciseId === 44 ||
    exerciseId === 45 ||
    exerciseId === 46
  ) {
    return CLASSIC_EX24_EX25_ALLOWED_BLACK_INDICES
  }
  return null
}

const CLASSIC_INSTRUCTION_ROWS = [
  ['Notas C e D - 1 nota', 'uma nota (C e D)'],
  ['Notas C, D e E - 1 nota', 'uma nota (C, D e E)'],
  ['Notas C, D e E - 2 notas (MA)', 'duas notas C, D e E (MA)'],
  ['Notas C, D e E - 2 notas (MD)', 'duas notas C, D e E (MD)'],
  ['Notas C, D e E - 2 notas (H)', 'duas notas C, D e E (harmónico)'],
  ['Notas C, D, E e F - 1 nota', 'uma nota (C, D, E e F)'],
  ['Notas C, D, E e F - 2 notas (MA)', 'duas notas C, D, E e F (MA)'],
  ['Notas C, D, E e F - 2 notas (MD)', 'duas notas C, D, E e F (MD)'],
  ['Notas C, D, E e F - 2 notas (H)', 'duas notas C, D, E e F (harmónico)'],
  ['Notas C, D, E, F e G - 1 nota', 'uma nota (C, D, E, F e G)'],
  ['Notas C, D, E, F e G - 2 notas (MA)', 'duas notas C, D, E, F e G (MA)'],
  ['Notas C, D, E, F e G - 2 notas (MD)', 'duas notas C, D, E, F e G (MD)'],
  ['Notas C, D, E, F e G - 2 notas (H)', 'duas notas C, D, E, F e G (harmónico)'],
  ['Notas C, D, E, F, G e A - 1 nota', 'uma nota (C, D, E, F, G e A)'],
  ['Notas C, D, E, F, G e A - 2 notas (MA)', 'duas notas C, D, E, F, G e A (MA)'],
  ['Notas C, D, E, F, G e A - 2 notas (MD)', 'duas notas C, D, E, F, G e A (MD)'],
  ['Notas C, D, E, F, G e A - 2 notas (H)', 'duas notas C, D, E, F, G e A (harmónico)'],
  ['Notas C, D, E, F, G, A e B - 1 nota', 'uma nota (C, D, E, F, G, A e B)'],
  ['Notas C, D, E, F, G, A e B - 2 notas (MA)', 'duas notas C, D, E, F, G, A e B (MA)'],
  ['Notas C, D, E, F, G, A e B - 2 notas (MD)', 'duas notas C, D, E, F, G, A e B (MD)'],
  ['Notas C, D, E, F, G, A e B - 2 notas (H)', 'duas notas C, D, E, F, G, A e B (harmónico)'],
  ['Notas C, D, E, F, G, A, B e G#-Ab - 1 nota', 'uma nota C, D, E, F, G, A, B e G#-Ab'],
  ['Notas C, D, E, F, G, A, B e G#-Ab - 2 notas (MA)', 'duas notas C…B e G#-Ab (MA)'],
  ['Notas C, D, E, F, G e A, B e G#-Ab - 2 notas (MD)', 'duas notas C…B e G#-Ab (MD)'],
  ['Notas C, D, E, F, G e A e G#-Ab - 2 notas (H)', 'duas notas C…B e G#-Ab (harmónico)'],
  ['Notas C, D, E, F, G, A, B e F#-Gb - 1 nota', 'uma nota C…B e F#-Gb'],
  ['Notas C, D, E, F, G, A, B e F#-Gb - 2 notas (MA)', 'duas notas C…B e F#-Gb (MA)'],
  ['Notas C, D, E, F, G e A, B e F#-Gb - 2 notas (MD)', 'duas notas C…B e F#-Gb (MD)'],
  ['Notas C, D, E, F, G e A e F#-Gb - 2 notas (H)', 'duas notas C…B e F#-Gb (harmónico)'],
  ['Notas C, D, E, F, G, A, B e D#-Eb - 1 nota', 'uma nota C…B e D#-Eb'],
  ['Notas C, D, E, F, G, A, B e D#-Eb - 2 notas (MA)', 'duas notas C…B e D#-Eb (MA)'],
  ['Notas C, D, E, F, G e A, B e D#-Eb - 2 notas (MD)', 'duas notas C…B e D#-Eb (MD)'],
  ['Notas C, D, E, F, G e A e D#-Eb - 2 notas (H)', 'duas notas C…B e D#-Eb (harmónico)'],
  ['Notas C, D, E, F, G, A, B e C#-Db - 1 nota', 'uma nota C…B e C#-Db'],
  ['Notas C, D, E, F, G, A, B e C#-Db - 2 notas (MA)', 'duas notas C…B e C#-Db (MA)'],
  ['Notas C, D, E, F, G e A, B e C#-Db - 2 notas (MD)', 'duas notas C…B e C#-Db (MD)'],
  ['Notas C, D, E, F, G e A e C#-Db - 2 notas (H)', 'duas notas C…B e C#-Db (harmónico)'],
  ['Notas C, D, E, F, G, A, B e A#-Bb - 1 nota', 'uma nota C…B e A#-Bb'],
  ['Notas C, D, E, F, G, A, B e G#-Ab - 2 notas (MA)', 'duas notas C…B e G#-Ab (MA)'],
  ['Notas C, D, E, F, G e A e A#-Bb - 2 notas (H)', 'duas notas C…B e A#-Bb (harmónico)'],
  ['Acorde diminuto 1: D, F, G#-Ab, B - 1 nota', 'uma nota diminuto 1 (D, F, G#-Ab, B)'],
  ['Acorde diminuto 1: D, F, G#-Ab, B - 2 notas (MA)', 'duas notas diminuto 1 (D, F, G#-Ab, B) (MA)'],
  ['Acorde diminuto 1: D, F, G#-Ab, B - 2 notas (MD)', 'duas notas diminuto 1 (D, F, G#-Ab, B) (MD)'],
  ['Acorde diminuto 1: D, F, G#-Ab, B - 2 notas (H)', 'duas notas diminuto 1 (D, F, G#-Ab, B) (harmonico)'],
  ['Acorde diminuto 2: C, D#-Eb, F#-Gb, A - 1 nota', 'uma nota diminuto 2 (C, D#-Eb, F#-Gb, A)'],
  ['Acorde diminuto 2: C, D#-Eb, F#-Gb, A - 2 notas (MA)', 'duas notas diminuto 2 (C, D#-Eb, F#-Gb, A) (MA)'],
  ['Acorde diminuto 2: C, D#-Eb, F#-Gb, A - 2 notas (MD)', 'duas notas diminuto 2 (C, D#-Eb, F#-Gb, A) (MD)'],
  ['Acorde diminuto 2: C, D#-Eb, F#-Gb, A - 2 notas (H)', 'duas notas diminuto 2 (C, D#-Eb, F#-Gb, A) (harmonico)'],
  ['Acorde diminuto 3: C#-Db, E, G, A#-Bb - 1 nota', 'uma nota diminuto 3 (C#-Db, E, G, A#-Bb)'],
  ['Acorde diminuto 3: C#-Db, E, G, A#-Bb - 2 notas (MA)', 'duas notas diminuto 3 (C#-Db, E, G, A#-Bb) (MA)'],
  ['Acorde diminuto 3: C#-Db, E, G, A#-Bb - 2 notas (MD)', 'duas notas diminuto 3 (C#-Db, E, G, A#-Bb) (MD)'],
  ['Acorde diminuto 3: C#-Db, E, G, A#-Bb - 2 notas (H)', 'duas notas diminuto 3 (C#-Db, E, G, A#-Bb) (harmonico)'],
]

export const CLASSIC_INSTRUCTION_BODY_BY_ID = Object.fromEntries(
  CLASSIC_EXERCISE_IDS_IN_ORDER.map((id, i) => [id, CLASSIC_INSTRUCTION_ROWS[i][0]]),
)

export const CLASSIC_SELECT_SHORT_LABEL_BY_ID = Object.fromEntries(
  CLASSIC_EXERCISE_IDS_IN_ORDER.map((id, i) => [id, CLASSIC_INSTRUCTION_ROWS[i][1]]),
)

const CLASSIC_ONE_NOTE_EXERCISE_IDS = new Set([
  1, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 42,
])

const CLASSIC_HARMONIC_EXERCISE_IDS = new Set([
  7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 50, 54,
])

const CLASSIC_MA_EXERCISE_IDS = new Set([
  5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 48, 52,
])

export function getClassicReplayAriaLabel(exerciseId) {
  if (CLASSIC_ONE_NOTE_EXERCISE_IDS.has(exerciseId)) {
    return 'Reproduzir o áudio da nota desta rodada'
  }
  if (CLASSIC_HARMONIC_EXERCISE_IDS.has(exerciseId)) {
    return 'Reproduzir as duas notas desta rodada em simultâneo (harmónico)'
  }
  if (CLASSIC_MA_EXERCISE_IDS.has(exerciseId)) {
    return 'Reproduzir as duas notas desta rodada na ordem grave a agudo'
  }
  return 'Reproduzir as duas notas desta rodada na ordem agudo a grave'
}

export function classicBlackKeysEnabled(exerciseId) {
  return exerciseId >= 24 && exerciseId <= 54
}
