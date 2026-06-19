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

export function classicAudioFileNoteLabel(filename) {
  const m = /^b\d+-([A-G])\.mp3$/i.exec(filename)
  return m ? m[1].toUpperCase() : ''
}

export function octaveBandLabelForAudioIndex(index) {
  if (index >= 1 && index <= 7) return 'primeira oitava'
  if (index >= 8 && index <= 14) return 'segunda oitava'
  return ''
}

export const ALL_CLASSIC_EXERCISE_AUDIO_FILES = EXERCISE_AUDIO_INDICES_LOW.map(
  (n) => audioFileForIndex(n),
).concat(EXERCISE_AUDIO_INDICES_HIGH.map((n) => audioFileForIndex(n)))

export const EXERCISE_5_VALID_PAIRS = [
  [0, 1],
  [0, 2],
  [1, 2],
]

export const EXERCISE_9_VALID_PAIRS = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [1, 3],
  [2, 3],
]

export const EXERCISE_13_VALID_PAIRS = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 3],
  [2, 4],
  [3, 4],
]

export const EXERCISE_18_VALID_PAIRS = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [2, 3],
  [2, 4],
  [2, 5],
  [3, 4],
  [3, 5],
  [4, 5],
]

export const EXERCISE_22_VALID_PAIRS = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [1, 6],
  [2, 3],
  [2, 4],
  [2, 5],
  [2, 6],
  [3, 4],
  [3, 5],
  [3, 6],
  [4, 5],
  [4, 6],
  [5, 6],
]

export const EXERCISE_42_DIMINISHED_PAIRS = [
  [1, 3], // D–F
  [1, 6], // D–B
  [3, 6], // F–B
]

export const EXERCISE_44_DIMINISHED_PAIRS = [
  [1, 3], // D–F
  [1, 6], // D–B
  [3, 6], // F–B
]

export const EXERCISE_48_DIMINISHED_PAIRS = [
  [0, 5], // C–A
]

const EXERCISE_25_MA_SPECS = EXERCISE_22_VALID_PAIRS.map((pair) => ({
  type: 'ww',
  pair,
}))
  .concat(
    [0, 1, 2, 3, 4].map((w) => ({
      type: 'wg',
      w,
    })),
  )
  .concat(
    [5, 6].map((w) => ({
      type: 'gw',
      w,
    })),
  )

const EXERCISE_29_MA_SPECS = EXERCISE_22_VALID_PAIRS.map((pair) => ({
  type: 'ww',
  pair,
}))
  .concat(
    [0, 1, 2, 3].map((w) => ({
      type: 'wf',
      w,
    })),
  )
  .concat(
    [4, 5, 6].map((w) => ({
      type: 'fw',
      w,
    })),
  )

const EXERCISE_33_MA_SPECS = EXERCISE_22_VALID_PAIRS.map((pair) => ({
  type: 'ww',
  pair,
}))
  .concat(
    [0, 1].map((w) => ({
      type: 'wd',
      w,
    })),
  )
  .concat(
    [2, 3, 4, 5, 6].map((w) => ({
      type: 'dw',
      w,
    })),
  )

const EXERCISE_37_MA_SPECS = EXERCISE_22_VALID_PAIRS.map((pair) => ({
  type: 'ww',
  pair,
}))
  .concat(
    [0].map((w) => ({
      type: 'wc',
      w,
    })),
  )
  .concat(
    [1, 2, 3, 4, 5, 6].map((w) => ({
      type: 'cw',
      w,
    })),
  )

const EXERCISE_43_MA_SPECS = EXERCISE_22_VALID_PAIRS.map((pair) => ({
  type: 'ww',
  pair,
}))
  .concat(
    [0, 1, 2, 3, 4, 5].map((w) => ({
      type: 'wa',
      w,
    })),
  )
  .concat(
    [6].map((w) => ({
      type: 'aw',
      w,
    })),
  )

const EXERCISE_42_MA_SPECS = EXERCISE_42_DIMINISHED_PAIRS.map((pair) => ({
  type: 'ww',
  pair,
}))
  .concat(
    [1, 3].map((w) => ({ type: 'wg', w })), // D–G#, F–G#
  )
  .concat(
    [6].map((w) => ({ type: 'gw', w })),    // G#–B
  )

const EXERCISE_44_MA_SPECS = EXERCISE_44_DIMINISHED_PAIRS.map((pair) => ({
  type: 'ww',
  pair,
}))
  .concat(
    [1, 3].map((w) => ({ type: 'wg', w })), // D–G#, F–G#
  )
  .concat(
    [6].map((w) => ({ type: 'gw', w })),    // G#–B
  )

const EXERCISE_45_MD_SPECS = EXERCISE_44_DIMINISHED_PAIRS.map((pair) => ({
  type: 'ww',
  pair,
}))
  .concat(
    [1, 3].map((w) => ({ type: 'wg', w })),
  )
  .concat(
    [6].map((w) => ({ type: 'gw', w })),
  )

const EXERCISE_48_MA_SPECS = EXERCISE_48_DIMINISHED_PAIRS.map((pair) => ({
  type: 'ww',
  pair,
}))
  .concat([{ type: 'wd', w: 0 }])
  .concat([{ type: 'wf', w: 0 }])
  .concat([{ type: 'da', w: 5 }])
  .concat([{ type: 'fa', w: 5 }])

export const EXERCISE_52_DIMINISHED_PAIRS = [
  [2, 4], // E–G
]

const EXERCISE_52_MA_SPECS = EXERCISE_52_DIMINISHED_PAIRS.map((pair) => ({
  type: 'ww',
  pair,
}))
  .concat([{ type: 'ce', w: 2 }])
  .concat([{ type: 'cg', w: 4 }])
  .concat([{ type: 'wa', w: 2 }])
  .concat([{ type: 'wa', w: 4 }])

export const EXERCISE_56_DIMINISHED_PAIRS = [
  [0, 1], // C–D
  [0, 3], // C–F
  [0, 5], // C–A
  [0, 6], // C–B
  [1, 3], // D–F
  [1, 5], // D–A
  [1, 6], // D–B
  [3, 5], // F–A
  [3, 6], // F–B
  [5, 6], // A–B
]

const EXERCISE_56_MA_SPECS = EXERCISE_56_DIMINISHED_PAIRS.map((pair) => ({
  type: 'ww',
  pair,
}))
  .concat([0, 1, 3].map((w) => ({ type: 'wg', w })))
  .concat([0, 1].map((w) => ({ type: 'wd', w })))
  .concat([0, 1, 3].map((w) => ({ type: 'wf', w })))
  .concat([5, 6].map((w) => ({ type: 'gw', w })))
  .concat([3, 5, 6].map((w) => ({ type: 'da', w })))
  .concat([5, 6].map((w) => ({ type: 'fa', w })))

export function exercise58PickRound(opts) {
  return exercise56PickRound(opts)
}

export function exercise57PickRound(opts) {
  return exercise56PickRound(opts)
}

export function exercise56PickRound({ streak }) {
  const spec = pickByVerificationTarget(
    EXERCISE_56_MA_SPECS,
    (candidate) => candidate.type !== 'ww',
    streak,
  )
  const gsharpFile = CLASSIC_ONE_NOTE_EX24_BLACK.audioFile
  const dsharpFile = CLASSIC_ONE_NOTE_EX32_BLACK.audioFile
  const fsharpFile = CLASSIC_ONE_NOTE_EX28_BLACK.audioFile
  if (spec.type === 'ww') {
    const [lowW, highW] = spec.pair
    const iLow = exercise25WhiteAudioIndexForLowNote(lowW, streak)
    const iHigh = exercise25WhiteAudioIndexForHighNote(highW, streak)
    return {
      audioFileLow: audioFileForIndex(iLow),
      audioFileHigh: audioFileForIndex(iHigh),
      slot0: { kind: 'white', index: lowW },
      slot1: { kind: 'white', index: highW },
    }
  }
  if (spec.type === 'wg') {
    const w = spec.w
    const iWhite = exercise25WhiteAudioIndexForLowNote(w, streak)
    return {
      audioFileLow: audioFileForIndex(iWhite),
      audioFileHigh: gsharpFile,
      slot0: { kind: 'white', index: w },
      slot1: { kind: 'gsharp' },
    }
  }
  if (spec.type === 'wd') {
    const w = spec.w
    const iWhite = exercise25WhiteAudioIndexForLowNote(w, streak)
    return {
      audioFileLow: audioFileForIndex(iWhite),
      audioFileHigh: dsharpFile,
      slot0: { kind: 'white', index: w },
      slot1: { kind: 'dsharp' },
    }
  }
  if (spec.type === 'wf') {
    const w = spec.w
    const iWhite = exercise25WhiteAudioIndexForLowNote(w, streak)
    return {
      audioFileLow: audioFileForIndex(iWhite),
      audioFileHigh: fsharpFile,
      slot0: { kind: 'white', index: w },
      slot1: { kind: 'fsharp' },
    }
  }
  if (spec.type === 'gw') {
    const w = spec.w
    const iWhite = exercise25WhiteAudioIndexForHighNote(w, streak)
    return {
      audioFileLow: gsharpFile,
      audioFileHigh: audioFileForIndex(iWhite),
      slot0: { kind: 'gsharp' },
      slot1: { kind: 'white', index: w },
    }
  }
  if (spec.type === 'da') {
    const w = spec.w
    const iWhite = exercise25WhiteAudioIndexForHighNote(w, streak)
    return {
      audioFileLow: dsharpFile,
      audioFileHigh: audioFileForIndex(iWhite),
      slot0: { kind: 'dsharp' },
      slot1: { kind: 'white', index: w },
    }
  }
  const w = spec.w
  const iWhite = exercise25WhiteAudioIndexForHighNote(w, streak)
  return {
    audioFileLow: fsharpFile,
    audioFileHigh: audioFileForIndex(iWhite),
    slot0: { kind: 'fsharp' },
    slot1: { kind: 'white', index: w },
  }
}

export function exercise45PickRound({ streak }) {
  const spec = pickByVerificationTarget(
    EXERCISE_45_MD_SPECS,
    (candidate) => candidate.type !== 'ww',
    streak,
  )
  const gsharpFile = CLASSIC_ONE_NOTE_EX24_BLACK.audioFile
  if (spec.type === 'ww') {
    const [lowW, highW] = spec.pair
    const iLow = exercise25WhiteAudioIndexForLowNote(lowW, streak)
    const iHigh = exercise25WhiteAudioIndexForHighNote(highW, streak)
    return {
      audioFileLow: audioFileForIndex(iLow),
      audioFileHigh: audioFileForIndex(iHigh),
      slot0: { kind: 'white', index: lowW },
      slot1: { kind: 'white', index: highW },
    }
  }
  if (spec.type === 'wg') {
    const w = spec.w
    const iWhite = exercise25WhiteAudioIndexForLowNote(w, streak)
    return {
      audioFileLow: audioFileForIndex(iWhite),
      audioFileHigh: gsharpFile,
      slot0: { kind: 'white', index: w },
      slot1: { kind: 'gsharp' },
    }
  }
  const w = spec.w
  const iWhite = exercise25WhiteAudioIndexForHighNote(w, streak)
  return {
    audioFileLow: gsharpFile,
    audioFileHigh: audioFileForIndex(iWhite),
    slot0: { kind: 'gsharp' },
    slot1: { kind: 'white', index: w },
  }
}

export function exercise44PickRound({ streak }) {
  const spec = pickByVerificationTarget(
    EXERCISE_44_MA_SPECS,
    (candidate) => candidate.type !== 'ww',
    streak,
  )
  const gsharpFile = CLASSIC_ONE_NOTE_EX24_BLACK.audioFile
  if (spec.type === 'ww') {
    const [lowW, highW] = spec.pair
    const iLow = exercise25WhiteAudioIndexForLowNote(lowW, streak)
    const iHigh = exercise25WhiteAudioIndexForHighNote(highW, streak)
    return {
      audioFileLow: audioFileForIndex(iLow),
      audioFileHigh: audioFileForIndex(iHigh),
      slot0: { kind: 'white', index: lowW },
      slot1: { kind: 'white', index: highW },
    }
  }
  if (spec.type === 'wg') {
    const w = spec.w
    const iWhite = exercise25WhiteAudioIndexForLowNote(w, streak)
    return {
      audioFileLow: audioFileForIndex(iWhite),
      audioFileHigh: gsharpFile,
      slot0: { kind: 'white', index: w },
      slot1: { kind: 'gsharp' },
    }
  }
  const w = spec.w
  const iWhite = exercise25WhiteAudioIndexForHighNote(w, streak)
  return {
    audioFileLow: gsharpFile,
    audioFileHigh: audioFileForIndex(iWhite),
    slot0: { kind: 'gsharp' },
    slot1: { kind: 'white', index: w },
  }
}

export function exercise48PickRound({ streak }) {
  const spec = pickByVerificationTarget(
    EXERCISE_48_MA_SPECS,
    (candidate) => candidate.type !== 'ww',
    streak,
  )
  const dsharpFile = CLASSIC_ONE_NOTE_EX32_BLACK.audioFile
  const fsharpFile = CLASSIC_ONE_NOTE_EX28_BLACK.audioFile
  if (spec.type === 'ww') {
    const [lowW, highW] = spec.pair
    const iLow = exercise25WhiteAudioIndexForLowNote(lowW, streak)
    const iHigh = exercise25WhiteAudioIndexForHighNote(highW, streak)
    return {
      audioFileLow: audioFileForIndex(iLow),
      audioFileHigh: audioFileForIndex(iHigh),
      slot0: { kind: 'white', index: lowW },
      slot1: { kind: 'white', index: highW },
    }
  }
  if (spec.type === 'wd') {
    const w = spec.w
    const iWhite = exercise25WhiteAudioIndexForLowNote(w, streak)
    return {
      audioFileLow: audioFileForIndex(iWhite),
      audioFileHigh: dsharpFile,
      slot0: { kind: 'white', index: w },
      slot1: { kind: 'dsharp' },
    }
  }
  if (spec.type === 'wf') {
    const w = spec.w
    const iWhite = exercise25WhiteAudioIndexForLowNote(w, streak)
    return {
      audioFileLow: audioFileForIndex(iWhite),
      audioFileHigh: fsharpFile,
      slot0: { kind: 'white', index: w },
      slot1: { kind: 'fsharp' },
    }
  }
  if (spec.type === 'da') {
    const w = spec.w
    const iWhite = exercise25WhiteAudioIndexForHighNote(w, streak)
    return {
      audioFileLow: dsharpFile,
      audioFileHigh: audioFileForIndex(iWhite),
      slot0: { kind: 'dsharp' },
      slot1: { kind: 'white', index: w },
    }
  }
  const w = spec.w
  const iWhite = exercise25WhiteAudioIndexForHighNote(w, streak)
  return {
    audioFileLow: fsharpFile,
    audioFileHigh: audioFileForIndex(iWhite),
    slot0: { kind: 'fsharp' },
    slot1: { kind: 'white', index: w },
  }
}

export function exercise49PickRound(opts) {
  return exercise48PickRound(opts)
}

export function exercise50PickRound(opts) {
  return exercise48PickRound(opts)
}

export function exercise54PickRound(opts) {
  return exercise52PickRound(opts)
}

export function exercise53PickRound(opts) {
  return exercise52PickRound(opts)
}

export function exercise52PickRound({ streak }) {
  const spec = pickByVerificationTarget(
    EXERCISE_52_MA_SPECS,
    (candidate) => candidate.type !== 'ww',
    streak,
  )
  const csharpFile = CLASSIC_ONE_NOTE_EX36_BLACK.audioFile
  const asharpFile = CLASSIC_ONE_NOTE_EX40_BLACK.audioFile
  if (spec.type === 'ww') {
    const [lowW, highW] = spec.pair
    const iLow = exercise25WhiteAudioIndexForLowNote(lowW, streak)
    const iHigh = exercise25WhiteAudioIndexForHighNote(highW, streak)
    return {
      audioFileLow: audioFileForIndex(iLow),
      audioFileHigh: audioFileForIndex(iHigh),
      slot0: { kind: 'white', index: lowW },
      slot1: { kind: 'white', index: highW },
    }
  }
  if (spec.type === 'ce' || spec.type === 'cg') {
    const w = spec.w
    const iWhite = exercise25WhiteAudioIndexForHighNote(w, streak)
    return {
      audioFileLow: csharpFile,
      audioFileHigh: audioFileForIndex(iWhite),
      slot0: { kind: 'csharp' },
      slot1: { kind: 'white', index: w },
    }
  }
  const w = spec.w
  const iWhite = exercise25WhiteAudioIndexForLowNote(w, streak)
  return {
    audioFileLow: audioFileForIndex(iWhite),
    audioFileHigh: asharpFile,
    slot0: { kind: 'white', index: w },
    slot1: { kind: 'asharp' },
  }
}

export function exercise42PickRound({ streak }) {
  const spec = pickByVerificationTarget(
    EXERCISE_42_MA_SPECS,
    (candidate) => candidate.type !== 'ww',
    streak,
  )
  const gsharpFile = CLASSIC_ONE_NOTE_EX24_BLACK.audioFile
  if (spec.type === 'ww') {
    const [lowW, highW] = spec.pair
    const iLow = exercise25WhiteAudioIndexForLowNote(lowW, streak)
    const iHigh = exercise25WhiteAudioIndexForHighNote(highW, streak)
    return {
      audioFileLow: audioFileForIndex(iLow),
      audioFileHigh: audioFileForIndex(iHigh),
      slot0: { kind: 'white', index: lowW },
      slot1: { kind: 'white', index: highW },
    }
  }
  if (spec.type === 'wg') {
    const w = spec.w
    const iWhite = exercise25WhiteAudioIndexForLowNote(w, streak)
    return {
      audioFileLow: audioFileForIndex(iWhite),
      audioFileHigh: gsharpFile,
      slot0: { kind: 'white', index: w },
      slot1: { kind: 'gsharp' },
    }
  }
  // type === 'gw'
  const w = spec.w
  const iWhite = exercise25WhiteAudioIndexForHighNote(w, streak)
  return {
    audioFileLow: gsharpFile,
    audioFileHigh: audioFileForIndex(iWhite),
    slot0: { kind: 'gsharp' },
    slot1: { kind: 'white', index: w },
  }
}

/** @param {number} whiteIdx índice da branca 0…6; @param {number} streak */
function exercise25WhiteAudioIndexForLowNote(whiteIdx, streak) {
  const restricted = streak < 10
  if (restricted) {
    const usePrimeiraOitava = streak % 2 === 0
    return usePrimeiraOitava ? 1 + whiteIdx : 8 + whiteIdx
  }
  const everyRound = streak % 2
  const everyTwoRounds = Math.floor(streak / 2) % 2
  const baseCross = everyRound ^ everyTwoRounds
  return baseCross === 0 ? 1 + whiteIdx : 8 + whiteIdx
}

/** @param {number} whiteIdx @param {number} streak */
function exercise25WhiteAudioIndexForHighNote(whiteIdx, streak) {
  const restricted = streak < 10
  if (restricted) {
    const usePrimeiraOitava = streak % 2 === 0
    return usePrimeiraOitava ? 1 + whiteIdx : 8 + whiteIdx
  }
  const everyRound = streak % 2
  const everyTwoRounds = Math.floor(streak / 2) % 2
  const baseCross = everyRound ^ everyTwoRounds
  return baseCross === 0 ? 8 + whiteIdx : 1 + whiteIdx
}

/**
 * Ex. 25 — mesmas regras de oitava que o Ex. 21 nos bi-ficheiros das brancas; pares = Ex. 21 ∪ {branca,G#/Ab}.
 *
 * @param {{ streak: number }} opts
 * @returns {{ audioFileLow: string, audioFileHigh: string, slot0: {kind:'white',index:number}|{kind:'gsharp'}, slot1: {kind:'white',index:number}|{kind:'gsharp'} }}
 */
export function exercise25PickRound({ streak }) {
  const spec = pickByVerificationTarget(
    EXERCISE_25_MA_SPECS,
    (candidate) => candidate.type !== 'ww',
    streak,
  )
  const gsharpFile = CLASSIC_ONE_NOTE_EX24_BLACK.audioFile
  if (spec.type === 'ww') {
    const [lowW, highW] = spec.pair
    const iLow = exercise25WhiteAudioIndexForLowNote(lowW, streak)
    const iHigh = exercise25WhiteAudioIndexForHighNote(highW, streak)
    return {
      audioFileLow: audioFileForIndex(iLow),
      audioFileHigh: audioFileForIndex(iHigh),
      slot0: { kind: 'white', index: lowW },
      slot1: { kind: 'white', index: highW },
    }
  }
  if (spec.type === 'wg') {
    const w = spec.w
    const iWhite = exercise25WhiteAudioIndexForLowNote(w, streak)
    return {
      audioFileLow: audioFileForIndex(iWhite),
      audioFileHigh: gsharpFile,
      slot0: { kind: 'white', index: w },
      slot1: { kind: 'gsharp' },
    }
  }
  const w = spec.w
  const iWhite = exercise25WhiteAudioIndexForHighNote(w, streak)
  return {
    audioFileLow: gsharpFile,
    audioFileHigh: audioFileForIndex(iWhite),
    slot0: { kind: 'gsharp' },
    slot1: { kind: 'white', index: w },
  }
}

/**
 * Ex. 29 — mesmas regras de oitava nos bi-ficheiros das brancas que o Ex. 21; pares = Ex. 21 ∪ {branca,F#/Gb}.
 *
 * @param {{ streak: number }} opts
 * @returns {{ audioFileLow: string, audioFileHigh: string, slot0: {kind:'white',index:number}|{kind:'fsharp'}, slot1: {kind:'white',index:number}|{kind:'fsharp'} }}
 */
export function exercise29PickRound({ streak }) {
  const spec = pickByVerificationTarget(
    EXERCISE_29_MA_SPECS,
    (candidate) => candidate.type !== 'ww',
    streak,
  )
  const fsharpFile = CLASSIC_ONE_NOTE_EX28_BLACK.audioFile
  if (spec.type === 'ww') {
    const [lowW, highW] = spec.pair
    const iLow = exercise25WhiteAudioIndexForLowNote(lowW, streak)
    const iHigh = exercise25WhiteAudioIndexForHighNote(highW, streak)
    return {
      audioFileLow: audioFileForIndex(iLow),
      audioFileHigh: audioFileForIndex(iHigh),
      slot0: { kind: 'white', index: lowW },
      slot1: { kind: 'white', index: highW },
    }
  }
  if (spec.type === 'wf') {
    const w = spec.w
    const iWhite = exercise25WhiteAudioIndexForLowNote(w, streak)
    return {
      audioFileLow: audioFileForIndex(iWhite),
      audioFileHigh: fsharpFile,
      slot0: { kind: 'white', index: w },
      slot1: { kind: 'fsharp' },
    }
  }
  const w = spec.w
  const iWhite = exercise25WhiteAudioIndexForHighNote(w, streak)
  return {
    audioFileLow: fsharpFile,
    audioFileHigh: audioFileForIndex(iWhite),
    slot0: { kind: 'fsharp' },
    slot1: { kind: 'white', index: w },
  }
}

/**
 * Ex. 33 (MA), Ex. 34 (MD em App.jsx com `twoMd`) e Ex. 35 (H em App.jsx com `twoH`) — mesmas regras de oitava nas brancas que o Ex. 21; pares = Ex. 21 ∪ {branca,D#/Eb}.
 *
 * @param {{ streak: number }} opts
 * @returns {{ audioFileLow: string, audioFileHigh: string, slot0: {kind:'white',index:number}|{kind:'dsharp'}, slot1: {kind:'white',index:number}|{kind:'dsharp'} }}
 */
export function exercise33PickRound({ streak }) {
  const spec = pickByVerificationTarget(
    EXERCISE_33_MA_SPECS,
    (candidate) => candidate.type !== 'ww',
    streak,
  )
  const dsharpFile = CLASSIC_ONE_NOTE_EX32_BLACK.audioFile
  if (spec.type === 'ww') {
    const [lowW, highW] = spec.pair
    const iLow = exercise25WhiteAudioIndexForLowNote(lowW, streak)
    const iHigh = exercise25WhiteAudioIndexForHighNote(highW, streak)
    return {
      audioFileLow: audioFileForIndex(iLow),
      audioFileHigh: audioFileForIndex(iHigh),
      slot0: { kind: 'white', index: lowW },
      slot1: { kind: 'white', index: highW },
    }
  }
  if (spec.type === 'wd') {
    const w = spec.w
    const iWhite = exercise25WhiteAudioIndexForLowNote(w, streak)
    return {
      audioFileLow: audioFileForIndex(iWhite),
      audioFileHigh: dsharpFile,
      slot0: { kind: 'white', index: w },
      slot1: { kind: 'dsharp' },
    }
  }
  const w = spec.w
  const iWhite = exercise25WhiteAudioIndexForHighNote(w, streak)
  return {
    audioFileLow: dsharpFile,
    audioFileHigh: audioFileForIndex(iWhite),
    slot0: { kind: 'dsharp' },
    slot1: { kind: 'white', index: w },
  }
}

/**
 * Ex. 35 — harmónico (H): mesmos pares e oitavas que o Ex. 33 (`exercise33PickRound`); os dois sons em simultâneo; ordem dos cliques livre (como o Ex. 23).
 *
 * @param {{ streak: number }} opts
 * @returns {{ audioFileLow: string, audioFileHigh: string, slot0: {kind:'white',index:number}|{kind:'dsharp'}, slot1: {kind:'white',index:number}|{kind:'dsharp'} }}
 */
export function exercise35PickRound(opts) {
  return exercise33PickRound(opts)
}

/**
 * Ex. 37 (MA), Ex. 38 (MD em App.jsx com `twoMd`) e Ex. 39 (H em App.jsx com `twoH`) — mesmas regras de oitava nas brancas que o Ex. 21; pares = Ex. 21 ∪ {branca,C#/Db}.
 *
 * @param {{ streak: number }} opts
 * @returns {{ audioFileLow: string, audioFileHigh: string, slot0: {kind:'white',index:number}|{kind:'csharp'}, slot1: {kind:'white',index:number}|{kind:'csharp'} }}
 */
export function exercise37PickRound({ streak }) {
  const spec = pickByVerificationTarget(
    EXERCISE_37_MA_SPECS,
    (candidate) => candidate.type !== 'ww',
    streak,
  )
  const csharpFile = CLASSIC_ONE_NOTE_EX36_BLACK.audioFile
  if (spec.type === 'ww') {
    const [lowW, highW] = spec.pair
    const iLow = exercise25WhiteAudioIndexForLowNote(lowW, streak)
    const iHigh = exercise25WhiteAudioIndexForHighNote(highW, streak)
    return {
      audioFileLow: audioFileForIndex(iLow),
      audioFileHigh: audioFileForIndex(iHigh),
      slot0: { kind: 'white', index: lowW },
      slot1: { kind: 'white', index: highW },
    }
  }
  if (spec.type === 'wc') {
    const w = spec.w
    const iWhite = exercise25WhiteAudioIndexForLowNote(w, streak)
    return {
      audioFileLow: audioFileForIndex(iWhite),
      audioFileHigh: csharpFile,
      slot0: { kind: 'white', index: w },
      slot1: { kind: 'csharp' },
    }
  }
  const w = spec.w
  const iWhite = exercise25WhiteAudioIndexForHighNote(w, streak)
  return {
    audioFileLow: csharpFile,
    audioFileHigh: audioFileForIndex(iWhite),
    slot0: { kind: 'csharp' },
    slot1: { kind: 'white', index: w },
  }
}

/**
 * Ex. 39 — harmónico (H): mesmos pares e oitavas que o Ex. 37 (`exercise37PickRound`); os dois sons em simultâneo; ordem dos cliques livre (como o Ex. 23).
 *
 * @param {{ streak: number }} opts
 * @returns {{ audioFileLow: string, audioFileHigh: string, slot0: {kind:'white',index:number}|{kind:'csharp'}, slot1: {kind:'white',index:number}|{kind:'csharp'} }}
 */
export function exercise39PickRound(opts) {
  return exercise37PickRound(opts)
}

/**
 * Ex. 41 (MA) — mesmas regras de oitava nas brancas e pares com G#/Ab que o Ex. 25 (`exercise25PickRound`); única preta tocável: G#/Ab.
 *
 * @param {{ streak: number }} opts
 */
export function exercise41PickRound(opts) {
  return exercise25PickRound(opts)
}

/**
 * Ex. 43 (H) — mesmos pares e oitavas que o conjunto A#/Bb (`EXERCISE_43_MA_SPECS`); os dois sons em simultâneo; ordem dos cliques livre (como o Ex. 23).
 *
 * @param {{ streak: number }} opts
 * @returns {{ audioFileLow: string, audioFileHigh: string, slot0: {kind:'white',index:number}|{kind:'asharp'}, slot1: {kind:'white',index:number}|{kind:'asharp'} }}
 */
export function exercise43PickRound({ streak }) {
  const spec = pickByVerificationTarget(
    EXERCISE_43_MA_SPECS,
    (candidate) => candidate.type !== 'ww',
    streak,
  )
  const asharpFile = CLASSIC_ONE_NOTE_EX40_BLACK.audioFile
  if (spec.type === 'ww') {
    const [lowW, highW] = spec.pair
    const iLow = exercise25WhiteAudioIndexForLowNote(lowW, streak)
    const iHigh = exercise25WhiteAudioIndexForHighNote(highW, streak)
    return {
      audioFileLow: audioFileForIndex(iLow),
      audioFileHigh: audioFileForIndex(iHigh),
      slot0: { kind: 'white', index: lowW },
      slot1: { kind: 'white', index: highW },
    }
  }
  if (spec.type === 'wa') {
    const w = spec.w
    const iWhite = exercise25WhiteAudioIndexForLowNote(w, streak)
    return {
      audioFileLow: audioFileForIndex(iWhite),
      audioFileHigh: asharpFile,
      slot0: { kind: 'white', index: w },
      slot1: { kind: 'asharp' },
    }
  }
  const w = spec.w
  const iWhite = exercise25WhiteAudioIndexForHighNote(w, streak)
  return {
    audioFileLow: asharpFile,
    audioFileHigh: audioFileForIndex(iWhite),
    slot0: { kind: 'asharp' },
    slot1: { kind: 'white', index: w },
  }
}

function pickFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const VERIFICATION_SERIES_LENGTH = 20
const TARGET_VERIFICATION_SLOTS = [0, 3, 6, 9, 12, 15, 18]

function verificationStreakIndex(streak) {
  return ((streak % VERIFICATION_SERIES_LENGTH) + VERIFICATION_SERIES_LENGTH) %
    VERIFICATION_SERIES_LENGTH
}

function targetVerificationSlotIndex(streak) {
  return TARGET_VERIFICATION_SLOTS.indexOf(verificationStreakIndex(streak))
}

function pickByVerificationTarget(items, isTargetItem, streak) {
  const targetSlot = targetVerificationSlotIndex(streak)
  const targetItems = items.filter(isTargetItem)
  const otherItems = items.filter((item) => !isTargetItem(item))
  if (targetSlot >= 0 && targetItems.length > 0) {
    return targetItems[targetSlot % targetItems.length]
  }
  if (otherItems.length > 0) return pickFrom(otherItems)
  return pickFrom(items)
}

function poolIndices(streak, half) {
  const restricted = streak < 10
  if (!restricted) {
    return [...EXERCISE_AUDIO_INDICES_LOW, ...EXERCISE_AUDIO_INDICES_HIGH]
  }
  return half === 'low' ? EXERCISE_AUDIO_INDICES_LOW : EXERCISE_AUDIO_INDICES_HIGH
}

function whiteChoicesForOneNoteRound(whiteLabels, { streak, half }) {
  const pool = poolIndices(streak, half)
  let whiteCandidates = pool.filter((i) => whiteLabels.includes(NOTE_BY_INDEX[i]))
  if (whiteCandidates.length === 0) {
    const full = [
      ...EXERCISE_AUDIO_INDICES_LOW,
      ...EXERCISE_AUDIO_INDICES_HIGH,
    ]
    whiteCandidates = full.filter((i) => whiteLabels.includes(NOTE_BY_INDEX[i]))
  }
  return whiteCandidates.map((i) => ({
    target: NOTE_BY_INDEX[i],
    audioFile: audioFileForIndex(i),
  }))
}

function pickOneNoteChoiceByTarget(choices, targetNote, streak) {
  return pickByVerificationTarget(
    choices,
    (choice) => choice.target === targetNote,
    streak,
  )
}

export const CLASSIC_ONE_NOTE_EX1_LABELS = ['C', 'D']
export const CLASSIC_ONE_NOTE_EX4_LABELS = ['C', 'D', 'E']
export const CLASSIC_ONE_NOTE_EX8_LABELS = ['C', 'D', 'E', 'F']
export const CLASSIC_ONE_NOTE_EX12_LABELS = ['C', 'D', 'E', 'F', 'G']

export const CLASSIC_ONE_NOTE_EX17_LABELS = ['C', 'D', 'E', 'F', 'G', 'A']

export const CLASSIC_ONE_NOTE_EX21_LABELS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

export const CLASSIC_ONE_NOTE_DIMINISHED1_WHITE_LABELS = ['D', 'F', 'B']

export const CLASSIC_ONE_NOTE_EX42_LABELS = ['D', 'F', 'B']

export const CLASSIC_ONE_NOTE_EX47_LABELS = ['C', 'A']

export const CLASSIC_ONE_NOTE_EX55_LABELS = ['C', 'D', 'F', 'A', 'B']

export const CLASSIC_ONE_NOTE_EX51_LABELS = ['E', 'G']


export const CLASSIC_ONE_NOTE_EX24_BLACK = {
  target: 'G#',
  audioFile: 'p4-Gsharp-Ab.mp3',
}

export const CLASSIC_ONE_NOTE_EX28_BLACK = {
  target: 'F#',
  audioFile: 'p3-Fsharp-Gb.mp3',
}

export const CLASSIC_ONE_NOTE_EX32_BLACK = {
  target: 'D#',
  audioFile: 'p2-Dsharp-Eb.mp3',
}

export const CLASSIC_ONE_NOTE_EX36_BLACK = {
  target: 'C#',
  audioFile: 'p1-Csharp-Db.mp3',
}

export const CLASSIC_ONE_NOTE_EX40_BLACK = {
  target: 'A#',
  audioFile: 'p5-Asharp-Bb.mp3',
}

/**
 * Uma rodada = um ficheiro de áudio; o alvo é a nota desse ficheiro (nunca escolhas independentes).
 *
 * @param {readonly string[]} allowedNoteLabels — p. ex. Ex. 1 (C,D), Ex. 4 (+E), Ex. 8 (+F), Ex. 12 (+G), Ex. 16 (+A), Ex. 20 (+B); nos Ex. 24, 28, 32, 36 e 40 usa-se um picker específico com preta extra.
 * @param {{ streak: number, half: 'low' | 'high' }} opts
 * @returns {{ target: string, audioFile: string }}
 */
export function pickClassicOneNoteRound(allowedNoteLabels, { streak, half }) {
  const choices = whiteChoicesForOneNoteRound(allowedNoteLabels, { streak, half })
  const targetNote = allowedNoteLabels[allowedNoteLabels.length - 1]
  const picked = pickOneNoteChoiceByTarget(choices, targetNote, streak)
  return { target: picked.target, audioFile: picked.audioFile }
}

/**
 * Ex. 24 — uma nota: mesmas brancas que o Ex. 20 + G#/Ab (uma opção extra no sorteio por rodada).
 *
 * @param {{ streak: number, half: 'low' | 'high' }} opts
 * @returns {{ target: string, audioFile: string }}
 */
export function pickClassicOneNoteRoundEx24({ streak, half }) {
  const whiteChoices = whiteChoicesForOneNoteRound(
    CLASSIC_ONE_NOTE_EX21_LABELS,
    { streak, half },
  )
  const allChoices = whiteChoices.concat([CLASSIC_ONE_NOTE_EX24_BLACK])
  const picked = pickOneNoteChoiceByTarget(
    allChoices,
    CLASSIC_ONE_NOTE_EX24_BLACK.target,
    streak,
  )
  return { target: picked.target, audioFile: picked.audioFile }
}

/**
 * Ex. 28 — uma nota: mesmas brancas que o Ex. 20 + F#/Gb (uma opção extra no sorteio por rodada).
 *
 * @param {{ streak: number, half: 'low' | 'high' }} opts
 * @returns {{ target: string, audioFile: string }}
 */
export function pickClassicOneNoteRoundEx28({ streak, half }) {
  const whiteChoices = whiteChoicesForOneNoteRound(
    CLASSIC_ONE_NOTE_EX21_LABELS,
    { streak, half },
  )
  const allChoices = whiteChoices.concat([CLASSIC_ONE_NOTE_EX28_BLACK])
  const picked = pickOneNoteChoiceByTarget(
    allChoices,
    CLASSIC_ONE_NOTE_EX28_BLACK.target,
    streak,
  )
  return { target: picked.target, audioFile: picked.audioFile }
}

/**
 * Ex. 32 — uma nota: mesmas brancas que o Ex. 20 + D#/Eb (uma opção extra no sorteio por rodada).
 *
 * @param {{ streak: number, half: 'low' | 'high' }} opts
 * @returns {{ target: string, audioFile: string }}
 */
export function pickClassicOneNoteRoundEx32({ streak, half }) {
  const whiteChoices = whiteChoicesForOneNoteRound(
    CLASSIC_ONE_NOTE_EX21_LABELS,
    { streak, half },
  )
  const allChoices = whiteChoices.concat([CLASSIC_ONE_NOTE_EX32_BLACK])
  const picked = pickOneNoteChoiceByTarget(
    allChoices,
    CLASSIC_ONE_NOTE_EX32_BLACK.target,
    streak,
  )
  return { target: picked.target, audioFile: picked.audioFile }
}

/**
 * Ex. 36 — uma nota: mesmas brancas que o Ex. 20 + C#/Db (uma opção extra no sorteio por rodada).
 *
 * @param {{ streak: number, half: 'low' | 'high' }} opts
 * @returns {{ target: string, audioFile: string }}
 */
export function pickClassicOneNoteRoundEx36({ streak, half }) {
  const whiteChoices = whiteChoicesForOneNoteRound(
    CLASSIC_ONE_NOTE_EX21_LABELS,
    { streak, half },
  )
  const allChoices = whiteChoices.concat([CLASSIC_ONE_NOTE_EX36_BLACK])
  const picked = pickOneNoteChoiceByTarget(
    allChoices,
    CLASSIC_ONE_NOTE_EX36_BLACK.target,
    streak,
  )
  return { target: picked.target, audioFile: picked.audioFile }
}

/**
 * Ex. 40 — uma nota: mesmas brancas que o Ex. 20 + A#/Bb (uma opção extra no sorteio por rodada).
 *
 * @param {{ streak: number, half: 'low' | 'high' }} opts
 * @returns {{ target: string, audioFile: string }}
 */
export function pickClassicOneNoteRoundEx40({ streak, half }) {
  const whiteChoices = whiteChoicesForOneNoteRound(
    CLASSIC_ONE_NOTE_EX21_LABELS,
    { streak, half },
  )
  const allChoices = whiteChoices.concat([CLASSIC_ONE_NOTE_EX40_BLACK])
  const picked = pickOneNoteChoiceByTarget(
    allChoices,
    CLASSIC_ONE_NOTE_EX40_BLACK.target,
    streak,
  )
  return { target: picked.target, audioFile: picked.audioFile }
}

export function pickClassicOneNoteRoundEx47({ streak, half }) {
  const whiteChoices = whiteChoicesForOneNoteRound(
    CLASSIC_ONE_NOTE_EX47_LABELS,
    { streak, half },
  )
  const allChoices = whiteChoices
    .concat([CLASSIC_ONE_NOTE_EX32_BLACK])  // D#/Eb
    .concat([CLASSIC_ONE_NOTE_EX28_BLACK])  // F#/Gb
  const picked = pickOneNoteChoiceByTarget(
    allChoices,
    CLASSIC_ONE_NOTE_EX32_BLACK.target,
    streak,
  )
  return { target: picked.target, audioFile: picked.audioFile }
}

export function pickClassicOneNoteRoundEx55({ streak, half }) {
  const whiteChoices = whiteChoicesForOneNoteRound(
    CLASSIC_ONE_NOTE_EX55_LABELS,
    { streak, half },
  )
  const allChoices = whiteChoices
    .concat([CLASSIC_ONE_NOTE_EX24_BLACK])
    .concat([CLASSIC_ONE_NOTE_EX32_BLACK])
    .concat([CLASSIC_ONE_NOTE_EX28_BLACK])
  const picked = pickByVerificationTarget(
    allChoices,
    (choice) =>
      choice.target === 'G#' ||
      choice.target === 'D#' ||
      choice.target === 'F#',
    streak,
  )
  return { target: picked.target, audioFile: picked.audioFile }
}

export function pickClassicOneNoteRoundEx51({ streak, half }) {
  const whiteChoices = whiteChoicesForOneNoteRound(
    CLASSIC_ONE_NOTE_EX51_LABELS,
    { streak, half },
  )
  const allChoices = whiteChoices
    .concat([CLASSIC_ONE_NOTE_EX36_BLACK])
    .concat([CLASSIC_ONE_NOTE_EX40_BLACK])
  const picked = pickOneNoteChoiceByTarget(
    allChoices,
    CLASSIC_ONE_NOTE_EX36_BLACK.target,
    streak,
  )
  return { target: picked.target, audioFile: picked.audioFile }
}

/**
 * Ex. 5 — streak &lt; 10: alterna oitava inteira a cada rodada; streak ≥ 10: notas em oitavas cruzadas;
 * par aleatório em {C–D, C–E, D–E}; MA = primeiro o mais grave, depois o mais agudo.
 *
 * @param {{ streak: number }} opts
 * @returns {{ lowIndex: number, highIndex: number, audioFileLow: string, audioFileHigh: string }}
 */
export function exercise5PickRound({ streak }) {
  const pair = pickByVerificationTarget(
    EXERCISE_5_VALID_PAIRS,
    ([lowIndex, highIndex]) => lowIndex === 2 || highIndex === 2,
    streak,
  )
  const [lowIndex, highIndex] = pair
  const restricted = streak < 10
  if (restricted) {
    const usePrimeiraOitava = streak % 2 === 0
    const iLow = usePrimeiraOitava ? 1 + lowIndex : 8 + lowIndex
    const iHigh = usePrimeiraOitava ? 1 + highIndex : 8 + highIndex
    return {
      lowIndex,
      highIndex,
      audioFileLow: audioFileForIndex(iLow),
      audioFileHigh: audioFileForIndex(iHigh),
    }
  }
  const everyRound = streak % 2
  const everyTwoRounds = Math.floor(streak / 2) % 2
  const baseCross = everyRound ^ everyTwoRounds
  const iLow = baseCross === 0 ? 1 + lowIndex : 8 + lowIndex
  const iHigh = baseCross === 0 ? 8 + highIndex : 1 + highIndex
  return {
    lowIndex,
    highIndex,
    audioFileLow: audioFileForIndex(iLow),
    audioFileHigh: audioFileForIndex(iHigh),
  }
}

/**
 * @param {{ streak: number, half: 'low' | 'high' }} opts
 * @returns {{ target: string, audioFile: string }}
 */

export function pickClassicOneNoteRoundEx42({ streak, half }) {
  const whiteChoices = whiteChoicesForOneNoteRound(
    CLASSIC_ONE_NOTE_EX42_LABELS,
    { streak, half },
  )
  const allChoices = whiteChoices.concat([CLASSIC_ONE_NOTE_EX24_BLACK])
  const picked = pickOneNoteChoiceByTarget(
    allChoices,
    CLASSIC_ONE_NOTE_EX24_BLACK.target,
    streak,
  )
  return { target: picked.target, audioFile: picked.audioFile }
}

export function exercise46PickRound(opts) {
  return exercise44PickRound(opts)
}

function pickTwoMaRoundFromPairs(validPairs, targetIndex, { streak }) {
  const pair = pickByVerificationTarget(
    validPairs,
    ([lowIndex, highIndex]) =>
      lowIndex === targetIndex || highIndex === targetIndex,
    streak,
  )
  const [lowIndex, highIndex] = pair
  const restricted = streak < 10
  if (restricted) {
    const usePrimeiraOitava = streak % 2 === 0
    const iLow = usePrimeiraOitava ? 1 + lowIndex : 8 + lowIndex
    const iHigh = usePrimeiraOitava ? 1 + highIndex : 8 + highIndex
    return {
      lowIndex,
      highIndex,
      audioFileLow: audioFileForIndex(iLow),
      audioFileHigh: audioFileForIndex(iHigh),
    }
  }
  const everyRound = streak % 2
  const everyTwoRounds = Math.floor(streak / 2) % 2
  const baseCross = everyRound ^ everyTwoRounds
  const iLow = baseCross === 0 ? 1 + lowIndex : 8 + lowIndex
  const iHigh = baseCross === 0 ? 8 + highIndex : 1 + highIndex
  return {
    lowIndex,
    highIndex,
    audioFileLow: audioFileForIndex(iLow),
    audioFileHigh: audioFileForIndex(iHigh),
  }
}

/**
 * Ex. 9 — mesmas regras de oitava que o Ex. 5, com par aleatório em {C–D, C–E, C–F, D–E, D–F, E–F}; MA = grave → agudo.
 *
 * @param {{ streak: number }} opts
 * @returns {{ lowIndex: number, highIndex: number, audioFileLow: string, audioFileHigh: string }}
 */
export function exercise9PickRound(opts) {
  return pickTwoMaRoundFromPairs(EXERCISE_9_VALID_PAIRS, 3, opts)
}

/**
 * Ex. 13 — mesmas regras de oitava que o Ex. 9, com par aleatório em todos os pares C–…–G; MA = grave → agudo.
 *
 * @param {{ streak: number }} opts
 * @returns {{ lowIndex: number, highIndex: number, audioFileLow: string, audioFileHigh: string }}
 */
export function exercise13PickRound(opts) {
  return pickTwoMaRoundFromPairs(EXERCISE_13_VALID_PAIRS, 4, opts)
}

/**
 * Ex. 10 — mesmas regras de oitava e pares que o Ex. 9; MD = áudio agudo → grave (igual ao Ex. 6).
 *
 * @param {{ streak: number }} opts
 * @returns {{ lowIndex: number, highIndex: number, audioFileLow: string, audioFileHigh: string }}
 */
export function exercise10PickRound(opts) {
  return exercise9PickRound(opts)
}

/**
 * Ex. 14 — mesmas regras de oitava e pares que o Ex. 13; MD = áudio agudo → grave (igual ao Ex. 10).
 *
 * @param {{ streak: number }} opts
 * @returns {{ lowIndex: number, highIndex: number, audioFileLow: string, audioFileHigh: string }}
 */
export function exercise14PickRound(opts) {
  return exercise13PickRound(opts)
}

/**
 * Ex. 17 — mesmas regras de oitava e pares que o Ex. 13, com todos os pares C–…–A; MA = grave → agudo (como o Ex. 13).
 *
 * @param {{ streak: number }} opts
 * @returns {{ lowIndex: number, highIndex: number, audioFileLow: string, audioFileHigh: string }}
 */
export function exercise18PickRound(opts) {
  return pickTwoMaRoundFromPairs(EXERCISE_18_VALID_PAIRS, 5, opts)
}

/**
 * Ex. 21 — mesmas regras de oitava e pares que o Ex. 17, com todos os pares C–…–B; MA = grave → agudo.
 *
 * @param {{ streak: number }} opts
 * @returns {{ lowIndex: number, highIndex: number, audioFileLow: string, audioFileHigh: string }}
 */
export function exercise22PickRound(opts) {
  return pickTwoMaRoundFromPairs(EXERCISE_22_VALID_PAIRS, 6, opts)
}

/**
 * Ex. 18 — mesmas regras de oitava e pares que o Ex. 17; MD = áudio agudo → grave (igual ao Ex. 14).
 *
 * @param {{ streak: number }} opts
 * @returns {{ lowIndex: number, highIndex: number, audioFileLow: string, audioFileHigh: string }}
 */
export function exercise19PickRound(opts) {
  return exercise18PickRound(opts)
}

/**
 * Ex. 22 — mesmas regras de oitava e pares que o Ex. 21; MD = áudio agudo → grave (igual ao Ex. 18).
 *
 * @param {{ streak: number }} opts
 * @returns {{ lowIndex: number, highIndex: number, audioFileLow: string, audioFileHigh: string }}
 */
export function exercise23PickRound(opts) {
  return exercise22PickRound(opts)
}

/**
 * Ex. 11 — mesmas regras de oitava e pares que o Ex. 9; H = simultâneo (igual ao Ex. 7).
 *
 * @param {{ streak: number }} opts
 * @returns {{ lowIndex: number, highIndex: number, audioFileLow: string, audioFileHigh: string }}
 */
export function exercise11PickRound(opts) {
  return exercise9PickRound(opts)
}

/**
 * Ex. 15 — mesmas regras de oitava e pares que o Ex. 13; H = simultâneo (igual ao Ex. 11).
 *
 * @param {{ streak: number }} opts
 * @returns {{ lowIndex: number, highIndex: number, audioFileLow: string, audioFileHigh: string }}
 */
export function exercise15PickRound(opts) {
  return exercise13PickRound(opts)
}

/**
 * Ex. 19 — mesmas regras de oitava e pares que o Ex. 17; H simultâneo (como os Ex. 11 e 15).
 *
 * @param {{ streak: number }} opts
 * @returns {{ lowIndex: number, highIndex: number, audioFileLow: string, audioFileHigh: string }}
 */
export function exercise20PickRound(opts) {
  return pickTwoMaRoundFromPairs(EXERCISE_18_VALID_PAIRS, 5, opts)
}

/**
 * Ex. 23 — mesmas regras de oitava e pares que o Ex. 21; H simultâneo (como os Ex. 11, 15 e 19).
 *
 * @param {{ streak: number }} opts
 * @returns {{ lowIndex: number, highIndex: number, audioFileLow: string, audioFileHigh: string }}
 */
export function exercise24PickRound(opts) {
  return pickTwoMaRoundFromPairs(EXERCISE_22_VALID_PAIRS, 6, opts)
}