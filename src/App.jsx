import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import './App.css'

import {
  CLASSIC_ONE_NOTE_EX1_LABELS,
  CLASSIC_ONE_NOTE_EX4_LABELS,
  CLASSIC_ONE_NOTE_EX8_LABELS,
  CLASSIC_ONE_NOTE_EX12_LABELS,
  CLASSIC_ONE_NOTE_EX17_LABELS,
  CLASSIC_ONE_NOTE_EX21_LABELS,
  pickClassicOneNoteRoundEx24,
  pickClassicOneNoteRoundEx28,
  pickClassicOneNoteRoundEx32,
  pickClassicOneNoteRoundEx36,
  pickClassicOneNoteRoundEx40,
  exercise5PickRound,
  exercise9PickRound,
  exercise10PickRound,
  exercise11PickRound,
  exercise13PickRound,
  exercise14PickRound,
  exercise15PickRound,
  exercise18PickRound,
  exercise19PickRound,
  exercise20PickRound,
  exercise22PickRound,
  exercise23PickRound,
  exercise24PickRound,
  exercise25PickRound,
  exercise29PickRound,
  exercise33PickRound,
  exercise35PickRound,
  exercise37PickRound,
  exercise39PickRound,
  exercise41PickRound,
  exercise43PickRound,
  pickClassicOneNoteRound,
  pickClassicOneNoteRoundEx42,
  exercise44PickRound,
} from './classicExercises.js'
import { PianoKeyboard } from './components/PianoKeyboard.jsx'
import { BLACK_KEYS, WHITE_KEYS } from './pianoKeys.js'
import { useNoteAudio } from './useNoteAudio.js'

const VERIFICATION_TARGET = 20

/** Índices das brancas C e D (ex. 1); nos ex. 4–7 inclui-se E; nos ex. 8–11 também F; nos ex. 12–15 também G; nos ex. 16–19 também A; nos ex. 20–23 também B (G#/Ab nos ex. 24–27 e 41 MA; F#/Gb nos ex. 28–31; D#/Eb no ex. 32 uma nota e nos ex. 33–35 dois sons MA, MD e H; C#/Db no ex. 36 uma nota e nos ex. 37–39 dois sons MA, MD e H; A#/Bb no ex. 40 uma nota e no 43 H; ex. 42 uma nota no acorde diminuto 1 com G#/Ab como única preta). */
const CLASSIC_CD_WHITE_INDICES = new Set([0, 1])
const CLASSIC_CDE_WHITE_INDICES = new Set([0, 1, 2])
const CLASSIC_CDEF_WHITE_INDICES = new Set([0, 1, 2, 3])
const CLASSIC_CDEFG_WHITE_INDICES = new Set([0, 1, 2, 3, 4])
const CLASSIC_CDEFGA_WHITE_INDICES = new Set([0, 1, 2, 3, 4, 5])
const CLASSIC_CDEFGAB_WHITE_INDICES = new Set([0, 1, 2, 3, 4, 5, 6])
const CLASSIC_DIMINISHED1_WHITE_INDICES = new Set([1, 3, 6])

/** Índice em BLACK_KEYS — só a G#/Ab fica clicável nos ex. 24 a 27 e 41 a 42; só F#/Gb nos ex. 28 a 31; só D#/Eb nos ex. 32 (uma nota) e 33–35 (dois sons MA, MD e H); só C#/Db nos ex. 36 (uma nota) e 37–39 (dois sons MA, MD e H); só A#/Bb nos ex. 40 (uma nota) e 43 (H). */
const CLASSIC_EX24_EX25_ALLOWED_BLACK_INDICES = new Set([
  BLACK_KEYS.findIndex((k) => k.sharp === 'G#'),
])

/** Só F#/Gb (ex. 28, uma nota). */
const CLASSIC_EX28_ALLOWED_BLACK_INDICES = new Set([
  BLACK_KEYS.findIndex((k) => k.sharp === 'F#'),
])

/** Só D#/Eb (ex. 32 uma nota; ex. 33 MA, 34 MD e 35 H). */
const CLASSIC_EX32_ALLOWED_BLACK_INDICES = new Set([
  BLACK_KEYS.findIndex((k) => k.sharp === 'D#'),
])

/** Só C#/Db (ex. 36 uma nota; ex. 37 MA, 38 MD e 39 H). */
const CLASSIC_EX36_EX37_ALLOWED_BLACK_INDICES = new Set([
  BLACK_KEYS.findIndex((k) => k.sharp === 'C#'),
])

/** Só A#/Bb (ex. 40 uma nota; ex. 43 H). */
const CLASSIC_EX40_EX41_ALLOWED_BLACK_INDICES = new Set([
  BLACK_KEYS.findIndex((k) => k.sharp === 'A#'),
])

const BETWEEN_NOTES_MS = 1000

function rollVerificationHalf(halfRef) {
  halfRef.current = Math.random() < 0.5 ? 'low' : 'high'
}

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

/** IDs internos na ordem do percurso (ex. 2 e 3 omitidos). */
const CLASSIC_EXERCISE_IDS_IN_ORDER = [
  1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
  24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 43, 42, 44
]

const CLASSIC_EXERCISE_COUNT = CLASSIC_EXERCISE_IDS_IN_ORDER.length

const CLASSIC_EXERCISE_DISPLAY_NUM = new Map(
  CLASSIC_EXERCISE_IDS_IN_ORDER.map((id, i) => [id, i + 1]),
)

function classicExerciseDisplayNumber(internalId) {
  const n = CLASSIC_EXERCISE_DISPLAY_NUM.get(internalId)
  return n !== undefined ? n : internalId
}

/**
 * Corpo do título (após «Exercício n: ») e rótulo curto do select, na mesma ordem
 * que CLASSIC_EXERCISE_IDS_IN_ORDER (1.º percurso … 41.º).
 */
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
  ['Acorde diminuto 1: D, F, G#-Ab, B - 2 notas (MA)', 'duas notas diminuto 1 (D, F, G#-Ab, B) (MA)']
]

const CLASSIC_INSTRUCTION_BODY_BY_ID = Object.fromEntries(
  CLASSIC_EXERCISE_IDS_IN_ORDER.map((id, i) => [id, CLASSIC_INSTRUCTION_ROWS[i][0]]),
)

const CLASSIC_SELECT_SHORT_LABEL_BY_ID = Object.fromEntries(
  CLASSIC_EXERCISE_IDS_IN_ORDER.map((id, i) => [id, CLASSIC_INSTRUCTION_ROWS[i][1]]),
)

export default function App() {
  const { playFile: play, pauseAll: pauseAllNoteAudio } = useNoteAudio()

  const [gameMode, setGameMode] = useState('classic')
  const [classicExerciseId, setClassicExerciseId] = useState(1)

  const [streak, setStreak] = useState(0)
  const [exerciseComplete, setExerciseComplete] = useState(false)
  const [whiteFeedback, setWhiteFeedback] = useState({})
  const [blackFeedback, setBlackFeedback] = useState({})
  /** Índice da branca → passo 1 ou 2 (revelação em erros com ordem fixa de dois sons). */
  const [orderedRevealSteps, setOrderedRevealSteps] = useState(null)
  /** Índice em BLACK_KEYS → passo na revelação (ex. 25 com G#). */
  const [orderedRevealBlackSteps, setOrderedRevealBlackSteps] = useState(null)

  const [showCorrectNotice, setShowCorrectNotice] = useState(false)

  const clearRevealOrdering = useCallback(() => {
    setOrderedRevealSteps(null)
    setOrderedRevealBlackSteps(null)
  }, [])

  const roundRef = useRef({
    kind: 'one',
    target: 'C',
    audioFile: 'b1-C.mp3',
  })

  const frozenRef = useRef(false)
  /** Após erro: revelações ficam até o utilizador carregar «Reproduzir áudio». */
  const wrongRevealAwaitingReplayRef = useRef(false)
  const exerciseCompleteRef = useRef(false)
  const gameModeRef = useRef(gameMode)
  const prevModeRef = useRef(gameMode)
  const classicExerciseIdRef = useRef(1)
  const answerPhaseRef = useRef(0)
  /** Índice da primeira tecla certa em exercícios com dois sons e ordem fixa (MA/MD). */
  const exercise2FirstCorrectIndexRef = useRef(null)
  /** Primeira nota correcta foi G#/Ab (ex. 25, 26, 27 e 41 MA), F#/Gb (ex. 29, 30 e 31), D#/Eb (ex. 33 MA, 34 MD e 35 H), C#/Db (ex. 37 MA, 38 MD e 39 H) ou A#/Bb (ex. 43 H). */
  const exercise2FirstCorrectBlackKeyRef = useRef(null)
  const streakRef = useRef(0)
  /** Com streak < 10 no Ex. 1, 4, 8, 12, 16, 20, 24, 28, 32, 36 e 40: só b1–b7 (`low`) ou b8–b14 (`high`); renove-se a cada par de acertos e ao zerar a série. */
  const verificationHalfRef = useRef(null)

  /** Incrementa sempre que uma nova rodada invalida playback em curso (`playRoundAudio` interrompido após awaits). */
  const roundPlaybackGenRef = useRef(0)
  /** Cada novo clique em «Reproduzir áudio» invalida a invocação anterior (evita sobreposição em qualquer exercício). */
  const replayInvocationRef = useRef(0)

  const [playAudioHint, setPlayAudioHint] = useState(false)

  useLayoutEffect(() => {
    exerciseCompleteRef.current = exerciseComplete
  }, [exerciseComplete])

  useLayoutEffect(() => {
    gameModeRef.current = gameMode
  }, [gameMode])

  useLayoutEffect(() => {
    classicExerciseIdRef.current = classicExerciseId
  }, [classicExerciseId])

  useLayoutEffect(() => {
    streakRef.current = streak
  }, [streak])

  /** Escolhe nota(s) e ficheiro(s); não reproduz som. */
  const pickNewRound = useCallback(() => {
    roundPlaybackGenRef.current += 1
    pauseAllNoteAudio()
    answerPhaseRef.current = 0
    exercise2FirstCorrectIndexRef.current = null
    exercise2FirstCorrectBlackKeyRef.current = null
    const streakNow = streakRef.current
    if (
      (classicExerciseIdRef.current === 1 ||
        classicExerciseIdRef.current === 4 ||
        classicExerciseIdRef.current === 8 ||
        classicExerciseIdRef.current === 12 ||
        classicExerciseIdRef.current === 16 ||
        classicExerciseIdRef.current === 20 ||
        classicExerciseIdRef.current === 24 ||
        classicExerciseIdRef.current === 28 ||
        classicExerciseIdRef.current === 32 ||
        classicExerciseIdRef.current === 36 ||
        classicExerciseIdRef.current === 40 ||
        classicExerciseIdRef.current === 42) &&
      streakNow < 10 &&
      streakNow % 2 === 0
    ) {
      rollVerificationHalf(verificationHalfRef)
    }
    let half = verificationHalfRef.current
    if (half !== 'low' && half !== 'high') {
      rollVerificationHalf(verificationHalfRef)
      half = verificationHalfRef.current
    }
    const ctx = { streak: streakNow, half }

    if (classicExerciseIdRef.current === 1) {
      const { target, audioFile } = pickClassicOneNoteRound(
        CLASSIC_ONE_NOTE_EX1_LABELS,
        ctx,
      )
      roundRef.current = { kind: 'one', target, audioFile }
      return
    }
    if (classicExerciseIdRef.current === 4) {
      const { target, audioFile } = pickClassicOneNoteRound(
        CLASSIC_ONE_NOTE_EX4_LABELS,
        ctx,
      )
      roundRef.current = { kind: 'one', target, audioFile }
      return
    }
    if (classicExerciseIdRef.current === 8) {
      const { target, audioFile } = pickClassicOneNoteRound(
        CLASSIC_ONE_NOTE_EX8_LABELS,
        ctx,
      )
      roundRef.current = { kind: 'one', target, audioFile }
      return
    }
    if (classicExerciseIdRef.current === 12) {
      const { target, audioFile } = pickClassicOneNoteRound(
        CLASSIC_ONE_NOTE_EX12_LABELS,
        ctx,
      )
      roundRef.current = { kind: 'one', target, audioFile }
      return
    }
    if (classicExerciseIdRef.current === 16) {
      const { target, audioFile } = pickClassicOneNoteRound(
        CLASSIC_ONE_NOTE_EX17_LABELS,
        ctx,
      )
      roundRef.current = { kind: 'one', target, audioFile }
      return
    }
    if (classicExerciseIdRef.current === 20) {
      const { target, audioFile } = pickClassicOneNoteRound(
        CLASSIC_ONE_NOTE_EX21_LABELS,
        ctx,
      )
      roundRef.current = { kind: 'one', target, audioFile }
      return
    }
    if (classicExerciseIdRef.current === 24) {
      const { target, audioFile } = pickClassicOneNoteRoundEx24(ctx)
      roundRef.current = { kind: 'one', target, audioFile }
      return
    }
    if (classicExerciseIdRef.current === 28) {
      const { target, audioFile } = pickClassicOneNoteRoundEx28(ctx)
      roundRef.current = { kind: 'one', target, audioFile }
      return
    }
    if (classicExerciseIdRef.current === 32) {
      const { target, audioFile } = pickClassicOneNoteRoundEx32(ctx)
      roundRef.current = { kind: 'one', target, audioFile }
      return
    }
    if (classicExerciseIdRef.current === 36) {
      const { target, audioFile } = pickClassicOneNoteRoundEx36(ctx)
      roundRef.current = { kind: 'one', target, audioFile }
      return
    }
    if (classicExerciseIdRef.current === 40) {
      const { target, audioFile } = pickClassicOneNoteRoundEx40(ctx)
      roundRef.current = { kind: 'one', target, audioFile }
      return
    }
    if (classicExerciseIdRef.current === 5) {
      const r = exercise5PickRound(ctx)
      roundRef.current = {
        kind: 'twoMa',
        lowIndex: r.lowIndex,
        highIndex: r.highIndex,
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 6) {
      const r = exercise5PickRound(ctx)
      roundRef.current = {
        kind: 'twoMd',
        lowIndex: r.lowIndex,
        highIndex: r.highIndex,
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 7) {
      const r = exercise5PickRound(ctx)
      roundRef.current = {
        kind: 'twoH',
        lowIndex: r.lowIndex,
        highIndex: r.highIndex,
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 9) {
      const r = exercise9PickRound(ctx)
      roundRef.current = {
        kind: 'twoMa',
        lowIndex: r.lowIndex,
        highIndex: r.highIndex,
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 10) {
      const r = exercise10PickRound(ctx)
      roundRef.current = {
        kind: 'twoMd',
        lowIndex: r.lowIndex,
        highIndex: r.highIndex,
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 11) {
      const r = exercise11PickRound(ctx)
      roundRef.current = {
        kind: 'twoH',
        lowIndex: r.lowIndex,
        highIndex: r.highIndex,
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 13) {
      const r = exercise13PickRound(ctx)
      roundRef.current = {
        kind: 'twoMa',
        lowIndex: r.lowIndex,
        highIndex: r.highIndex,
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 14) {
      const r = exercise14PickRound(ctx)
      roundRef.current = {
        kind: 'twoMd',
        lowIndex: r.lowIndex,
        highIndex: r.highIndex,
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 15) {
      const r = exercise15PickRound(ctx)
      roundRef.current = {
        kind: 'twoH',
        lowIndex: r.lowIndex,
        highIndex: r.highIndex,
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 17) {
      const r = exercise18PickRound(ctx)
      roundRef.current = {
        kind: 'twoMa',
        lowIndex: r.lowIndex,
        highIndex: r.highIndex,
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 21) {
      const r = exercise22PickRound(ctx)
      roundRef.current = {
        kind: 'twoMa',
        lowIndex: r.lowIndex,
        highIndex: r.highIndex,
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 18) {
      const r = exercise19PickRound(ctx)
      roundRef.current = {
        kind: 'twoMd',
        lowIndex: r.lowIndex,
        highIndex: r.highIndex,
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 22) {
      const r = exercise23PickRound(ctx)
      roundRef.current = {
        kind: 'twoMd',
        lowIndex: r.lowIndex,
        highIndex: r.highIndex,
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 19) {
      const r = exercise20PickRound(ctx)
      roundRef.current = {
        kind: 'twoH',
        lowIndex: r.lowIndex,
        highIndex: r.highIndex,
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 23) {
      const r = exercise24PickRound(ctx)
      roundRef.current = {
        kind: 'twoH',
        lowIndex: r.lowIndex,
        highIndex: r.highIndex,
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 25) {
      const r = exercise25PickRound(ctx)
      roundRef.current = {
        kind: 'twoMa',
        exercise25Slots: { slot0: r.slot0, slot1: r.slot1 },
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 26) {
      const r = exercise25PickRound(ctx)
      roundRef.current = {
        kind: 'twoMd',
        exercise25Slots: { slot0: r.slot0, slot1: r.slot1 },
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 27) {
      const r = exercise25PickRound(ctx)
      roundRef.current = {
        kind: 'twoH',
        exercise25Slots: { slot0: r.slot0, slot1: r.slot1 },
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 29) {
      const r = exercise29PickRound(ctx)
      roundRef.current = {
        kind: 'twoMa',
        exercise25Slots: { slot0: r.slot0, slot1: r.slot1 },
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 30) {
      const r = exercise29PickRound(ctx)
      roundRef.current = {
        kind: 'twoMd',
        exercise25Slots: { slot0: r.slot0, slot1: r.slot1 },
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 31) {
      const r = exercise29PickRound(ctx)
      roundRef.current = {
        kind: 'twoH',
        exercise25Slots: { slot0: r.slot0, slot1: r.slot1 },
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 33) {
      const r = exercise33PickRound(ctx)
      roundRef.current = {
        kind: 'twoMa',
        exercise25Slots: { slot0: r.slot0, slot1: r.slot1 },
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 34) {
      const r = exercise33PickRound(ctx)
      roundRef.current = {
        kind: 'twoMd',
        exercise25Slots: { slot0: r.slot0, slot1: r.slot1 },
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 35) {
      const r = exercise35PickRound(ctx)
      roundRef.current = {
        kind: 'twoH',
        exercise25Slots: { slot0: r.slot0, slot1: r.slot1 },
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 37) {
      const r = exercise37PickRound(ctx)
      roundRef.current = {
        kind: 'twoMa',
        exercise25Slots: { slot0: r.slot0, slot1: r.slot1 },
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 38) {
      const r = exercise37PickRound(ctx)
      roundRef.current = {
        kind: 'twoMd',
        exercise25Slots: { slot0: r.slot0, slot1: r.slot1 },
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 39) {
      const r = exercise39PickRound(ctx)
      roundRef.current = {
        kind: 'twoH',
        exercise25Slots: { slot0: r.slot0, slot1: r.slot1 },
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 41) {
      const r = exercise41PickRound(ctx)
      roundRef.current = {
        kind: 'twoMa',
        exercise25Slots: { slot0: r.slot0, slot1: r.slot1 },
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 42) {
      const { target, audioFile } = pickClassicOneNoteRoundEx42(ctx)
      roundRef.current = { kind: 'one', target, audioFile }
      return
    }
    if (classicExerciseIdRef.current === 43) {
      const r = exercise43PickRound(ctx)
      roundRef.current = {
        kind: 'twoH',
        exercise25Slots: { slot0: r.slot0, slot1: r.slot1 },
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
    if (classicExerciseIdRef.current === 44) {
      const r = exercise44PickRound(ctx)
      roundRef.current = {
        kind: 'twoMa',
        exercise25Slots: { slot0: r.slot0, slot1: r.slot1 },
        audioFileLow: r.audioFileLow,
        audioFileHigh: r.audioFileHigh,
      }
      return
    }
  }, [pauseAllNoteAudio])

  /** Reproduz o áudio da rodada atual (apenas ao clicar no botão). */
  const playRoundAudio = useCallback(async () => {
    const roundGenSnap = roundPlaybackGenRef.current

    if (wrongRevealAwaitingReplayRef.current) {
      wrongRevealAwaitingReplayRef.current = false
      frozenRef.current = false
      setWhiteFeedback({})
      setBlackFeedback({})
      clearRevealOrdering()
    }

    replayInvocationRef.current += 1
    const replaySnap = replayInvocationRef.current
    pauseAllNoteAudio()

    const isStalePlayback = () =>
      replaySnap !== replayInvocationRef.current ||
      roundGenSnap !== roundPlaybackGenRef.current

    const round = roundRef.current
    if (isStalePlayback()) return

    if (round.kind === 'twoH') {
      const a = round.audioFileLow
      const b = round.audioFileHigh
      const p1 = (async () => {
        let ok = await play(a, { immediate: true })
        if (isStalePlayback()) return false
        if (!ok) ok = await play(a)
        if (isStalePlayback()) return false
        return ok
      })()
      const p2 = (async () => {
        let ok = await play(b, { immediate: true })
        if (isStalePlayback()) return false
        if (!ok) ok = await play(b)
        if (isStalePlayback()) return false
        return ok
      })()
      const [ok1, ok2] = await Promise.all([p1, p2])
      if (isStalePlayback()) return
      const allOk = ok1 && ok2
      if (!allOk) setPlayAudioHint(true)
      else setPlayAudioHint(false)
      return allOk
    }
    if (round.kind === 'twoMa' || round.kind === 'twoMd') {
      const first =
        round.kind === 'twoMa' ? round.audioFileLow : round.audioFileHigh
      const second =
        round.kind === 'twoMa' ? round.audioFileHigh : round.audioFileLow
      let ok = await play(first, { immediate: true })
      if (isStalePlayback()) return
      if (!ok) ok = await play(first)
      if (isStalePlayback()) return
      await delay(BETWEEN_NOTES_MS)
      if (isStalePlayback()) return
      let ok2 = await play(second, { immediate: true })
      if (isStalePlayback()) return
      if (!ok2) ok2 = await play(second)
      if (isStalePlayback()) return
      const allOk = ok && ok2
      if (!allOk) setPlayAudioHint(true)
      else setPlayAudioHint(false)
      return allOk
    }

    let ok = await play(round.audioFile, { immediate: true })
    if (isStalePlayback()) return
    if (!ok) ok = await play(round.audioFile)
    if (isStalePlayback()) return
    if (!ok) setPlayAudioHint(true)
    else setPlayAudioHint(false)
    return ok
  }, [play, clearRevealOrdering, pauseAllNoteAudio])

  useEffect(() => {
    const was = prevModeRef.current
    prevModeRef.current = gameMode

    if (was === 'alternative' && gameMode === 'classic') {
      classicExerciseIdRef.current = 1
      setClassicExerciseId(1)
      rollVerificationHalf(verificationHalfRef)
      setStreak(0)
      setExerciseComplete(false)
      setWhiteFeedback({})
      setBlackFeedback({})
      clearRevealOrdering()
      setShowCorrectNotice(false)
      frozenRef.current = false
      wrongRevealAwaitingReplayRef.current = false
      answerPhaseRef.current = 0
      exercise2FirstCorrectIndexRef.current = null
      exercise2FirstCorrectBlackKeyRef.current = null
    }

    if (gameMode === 'alternative') {
      frozenRef.current = false
      wrongRevealAwaitingReplayRef.current = false
    }
  }, [gameMode, clearRevealOrdering])

  /** Nova rodada sem áudio automático: só escolhe alvo ao entrar no modo ou após resposta. */
  useEffect(() => {
    if (gameMode !== 'classic') return
    if (exerciseComplete) return
    pickNewRound()
  }, [gameMode, exerciseComplete, pickNewRound])

  const handleWrongAnswer = useCallback(() => {
    rollVerificationHalf(verificationHalfRef)
    setStreak(0)
    answerPhaseRef.current = 0
    exercise2FirstCorrectIndexRef.current = null
    exercise2FirstCorrectBlackKeyRef.current = null
    const round = roundRef.current
    const reveal = {}
    let blackReveal = {}
    let steps = null

    if (round.kind === 'twoMa' || round.kind === 'twoMd') {
      if (round.exercise25Slots) {
        const { slot0, slot1 } = round.exercise25Slots
        const gsharpBi = BLACK_KEYS.findIndex((k) => k.sharp === 'G#')
        const fsharpBi = BLACK_KEYS.findIndex((k) => k.sharp === 'F#')
        const dsharpBi = BLACK_KEYS.findIndex((k) => k.sharp === 'D#')
        const csharpBi = BLACK_KEYS.findIndex((k) => k.sharp === 'C#')
        const asharpBi = BLACK_KEYS.findIndex((k) => k.sharp === 'A#')
        const stepsW = {}
        const stepsB = {}
        const revealSlot = (slot, stepNum) => {
          if (slot.kind === 'white') {
            stepsW[slot.index] = stepNum
            reveal[slot.index] = 'reveal'
          } else {
            const bi =
              slot.kind === 'gsharp'
                ? gsharpBi
                : slot.kind === 'fsharp'
                  ? fsharpBi
                  : slot.kind === 'dsharp'
                    ? dsharpBi
                    : slot.kind === 'csharp'
                      ? csharpBi
                      : slot.kind === 'asharp'
                        ? asharpBi
                        : -1
            if (bi >= 0) {
              stepsB[bi] = stepNum
              blackReveal[bi] = 'reveal'
            }
          }
        }
        if (round.kind === 'twoMa') {
          revealSlot(slot0, 1)
          revealSlot(slot1, 2)
        } else {
          revealSlot(slot1, 1)
          revealSlot(slot0, 2)
        }
        wrongRevealAwaitingReplayRef.current = true
        setOrderedRevealSteps(
          Object.keys(stepsW).length > 0 ? stepsW : null,
        )
        setOrderedRevealBlackSteps(
          Object.keys(stepsB).length > 0 ? stepsB : null,
        )
        setWhiteFeedback(reveal)
        setBlackFeedback(blackReveal)
        return
      }
      const lowLabel = WHITE_KEYS[round.lowIndex].label
      const highLabel = WHITE_KEYS[round.highIndex].label
      const firstLabel = round.kind === 'twoMa' ? lowLabel : highLabel
      const secondLabel = round.kind === 'twoMa' ? highLabel : lowLabel
      const firstIdx = WHITE_KEYS.findIndex((k) => k.label === firstLabel)
      const secondIdx = WHITE_KEYS.findIndex((k) => k.label === secondLabel)
      if (firstIdx >= 0 && secondIdx >= 0) {
        steps = { [firstIdx]: 1, [secondIdx]: 2 }
      }
      WHITE_KEYS.forEach((k, i) => {
        if (k.label === lowLabel || k.label === highLabel) reveal[i] = 'reveal'
      })
    } else if (round.kind === 'twoH') {
      if (round.exercise25Slots) {
        const { slot0, slot1 } = round.exercise25Slots
        const gsharpBi = BLACK_KEYS.findIndex((k) => k.sharp === 'G#')
        const fsharpBi = BLACK_KEYS.findIndex((k) => k.sharp === 'F#')
        const dsharpBi = BLACK_KEYS.findIndex((k) => k.sharp === 'D#')
        const csharpBi = BLACK_KEYS.findIndex((k) => k.sharp === 'C#')
        const asharpBi = BLACK_KEYS.findIndex((k) => k.sharp === 'A#')
        if (slot0.kind === 'white') reveal[slot0.index] = 'reveal'
        else if (slot0.kind === 'gsharp' && gsharpBi >= 0)
          blackReveal[gsharpBi] = 'reveal'
        else if (slot0.kind === 'fsharp' && fsharpBi >= 0)
          blackReveal[fsharpBi] = 'reveal'
        else if (slot0.kind === 'dsharp' && dsharpBi >= 0)
          blackReveal[dsharpBi] = 'reveal'
        else if (slot0.kind === 'csharp' && csharpBi >= 0)
          blackReveal[csharpBi] = 'reveal'
        else if (slot0.kind === 'asharp' && asharpBi >= 0)
          blackReveal[asharpBi] = 'reveal'
        if (slot1.kind === 'white') reveal[slot1.index] = 'reveal'
        else if (slot1.kind === 'gsharp' && gsharpBi >= 0)
          blackReveal[gsharpBi] = 'reveal'
        else if (slot1.kind === 'fsharp' && fsharpBi >= 0)
          blackReveal[fsharpBi] = 'reveal'
        else if (slot1.kind === 'dsharp' && dsharpBi >= 0)
          blackReveal[dsharpBi] = 'reveal'
        else if (slot1.kind === 'csharp' && csharpBi >= 0)
          blackReveal[csharpBi] = 'reveal'
        else if (slot1.kind === 'asharp' && asharpBi >= 0)
          blackReveal[asharpBi] = 'reveal'
      } else {
        const lowLabel = WHITE_KEYS[round.lowIndex].label
        const highLabel = WHITE_KEYS[round.highIndex].label
        WHITE_KEYS.forEach((k, i) => {
          if (k.label === lowLabel || k.label === highLabel) reveal[i] = 'reveal'
        })
      }
      steps = null
    } else {
      const { target } = round
      if (target === 'G#') {
        const bi = BLACK_KEYS.findIndex((k) => k.sharp === 'G#')
        if (bi >= 0) blackReveal = { [bi]: 'reveal' }
      } else if (target === 'F#') {
        const bi = BLACK_KEYS.findIndex((k) => k.sharp === 'F#')
        if (bi >= 0) blackReveal = { [bi]: 'reveal' }
      } else if (target === 'D#') {
        const bi = BLACK_KEYS.findIndex((k) => k.sharp === 'D#')
        if (bi >= 0) blackReveal = { [bi]: 'reveal' }
      } else if (target === 'C#') {
        const bi = BLACK_KEYS.findIndex((k) => k.sharp === 'C#')
        if (bi >= 0) blackReveal = { [bi]: 'reveal' }
      } else if (target === 'A#') {
        const bi = BLACK_KEYS.findIndex((k) => k.sharp === 'A#')
        if (bi >= 0) blackReveal = { [bi]: 'reveal' }
      } else {
        WHITE_KEYS.forEach((k, i) => {
          if (k.label === target) reveal[i] = 'reveal'
        })
      }
    }

    wrongRevealAwaitingReplayRef.current = true
    setOrderedRevealSteps(steps)
    setOrderedRevealBlackSteps(null)
    setWhiteFeedback(reveal)
    setBlackFeedback(blackReveal)
  }, [])

  const handleClassicExerciseSelectChange = useCallback(
    (e) => {
      const raw = Number(e.target.value)
      let id = raw >= 1 && raw <= 44 ? raw : 1
      if (id === 2 || id === 3) id = 4

      classicExerciseIdRef.current = id
      setClassicExerciseId(id)
      rollVerificationHalf(verificationHalfRef)
      setStreak(0)
      setWhiteFeedback({})
      setBlackFeedback({})
      clearRevealOrdering()
      setShowCorrectNotice(false)
      frozenRef.current = false
      wrongRevealAwaitingReplayRef.current = false
      answerPhaseRef.current = 0
      exercise2FirstCorrectIndexRef.current = null
      exercise2FirstCorrectBlackKeyRef.current = null

      if (exerciseCompleteRef.current) {
        setExerciseComplete(false)
      } else {
        pickNewRound()
      }
    },
    [pickNewRound, clearRevealOrdering],
  )

  const handleWhitePress = useCallback(
    (index, label) => {
      if (gameMode !== 'classic' || exerciseComplete || frozenRef.current)
        return

      const round = roundRef.current

      if (round.kind === 'one') {
        const { target } = round
        frozenRef.current = true

        if (label === target) {
          setShowCorrectNotice(true)
          setWhiteFeedback({ [index]: 'correct' })
          setBlackFeedback({})

          setStreak((s) => {
            const next = s + 1

            if (
              next >= VERIFICATION_TARGET &&
              classicExerciseIdRef.current === 1
            ) {
              window.setTimeout(() => {
                classicExerciseIdRef.current = 4
                setClassicExerciseId(4)
                rollVerificationHalf(verificationHalfRef)
                setStreak(0)
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setBlackFeedback({})
                clearRevealOrdering()
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                pickNewRound()
              }, 650)
              return next
            }

            if (
              next >= VERIFICATION_TARGET &&
              classicExerciseIdRef.current === 4
            ) {
              window.setTimeout(() => {
                classicExerciseIdRef.current = 5
                setClassicExerciseId(5)
                rollVerificationHalf(verificationHalfRef)
                setStreak(0)
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setBlackFeedback({})
                clearRevealOrdering()
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                pickNewRound()
              }, 650)
              return next
            }

            if (
              next >= VERIFICATION_TARGET &&
              classicExerciseIdRef.current === 8
            ) {
              window.setTimeout(() => {
                classicExerciseIdRef.current = 9
                setClassicExerciseId(9)
                rollVerificationHalf(verificationHalfRef)
                setStreak(0)
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setBlackFeedback({})
                clearRevealOrdering()
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                pickNewRound()
              }, 650)
              return next
            }

            if (
              next >= VERIFICATION_TARGET &&
              classicExerciseIdRef.current === 12
            ) {
              window.setTimeout(() => {
                classicExerciseIdRef.current = 13
                setClassicExerciseId(13)
                rollVerificationHalf(verificationHalfRef)
                setStreak(0)
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setBlackFeedback({})
                clearRevealOrdering()
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                pickNewRound()
              }, 650)
              return next
            }

            if (
              next >= VERIFICATION_TARGET &&
              classicExerciseIdRef.current === 16
            ) {
              window.setTimeout(() => {
                classicExerciseIdRef.current = 17
                setClassicExerciseId(17)
                rollVerificationHalf(verificationHalfRef)
                setStreak(0)
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setBlackFeedback({})
                clearRevealOrdering()
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                pickNewRound()
              }, 650)
              return next
            }

            if (
              next >= VERIFICATION_TARGET &&
              classicExerciseIdRef.current === 20
            ) {
              window.setTimeout(() => {
                classicExerciseIdRef.current = 21
                setClassicExerciseId(21)
                rollVerificationHalf(verificationHalfRef)
                setStreak(0)
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setBlackFeedback({})
                clearRevealOrdering()
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                pickNewRound()
              }, 650)
              return next
            }

            if (
              next >= VERIFICATION_TARGET &&
              classicExerciseIdRef.current === 24
            ) {
              window.setTimeout(() => {
                classicExerciseIdRef.current = 25
                setClassicExerciseId(25)
                rollVerificationHalf(verificationHalfRef)
                setStreak(0)
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setBlackFeedback({})
                clearRevealOrdering()
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                exercise2FirstCorrectBlackKeyRef.current = null
                pickNewRound()
              }, 650)
              return next
            }

            if (
              next >= VERIFICATION_TARGET &&
              classicExerciseIdRef.current === 28
            ) {
              window.setTimeout(() => {
                classicExerciseIdRef.current = 29
                setClassicExerciseId(29)
                rollVerificationHalf(verificationHalfRef)
                setStreak(0)
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setBlackFeedback({})
                clearRevealOrdering()
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                exercise2FirstCorrectBlackKeyRef.current = null
                pickNewRound()
              }, 650)
              return next
            }

            if (
              next >= VERIFICATION_TARGET &&
              classicExerciseIdRef.current === 32
            ) {
              window.setTimeout(() => {
                classicExerciseIdRef.current = 33
                setClassicExerciseId(33)
                rollVerificationHalf(verificationHalfRef)
                setStreak(0)
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setBlackFeedback({})
                clearRevealOrdering()
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                exercise2FirstCorrectBlackKeyRef.current = null
                pickNewRound()
              }, 650)
              return next
            }

            if (
              next >= VERIFICATION_TARGET &&
              classicExerciseIdRef.current === 36
            ) {
              window.setTimeout(() => {
                classicExerciseIdRef.current = 37
                setClassicExerciseId(37)
                rollVerificationHalf(verificationHalfRef)
                setStreak(0)
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setBlackFeedback({})
                clearRevealOrdering()
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                exercise2FirstCorrectBlackKeyRef.current = null
                pickNewRound()
              }, 650)
              return next
            }

            if (
              next >= VERIFICATION_TARGET &&
              classicExerciseIdRef.current === 40
            ) {
              window.setTimeout(() => {
                classicExerciseIdRef.current = 41
                setClassicExerciseId(41)
                rollVerificationHalf(verificationHalfRef)
                setStreak(0)
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setBlackFeedback({})
                clearRevealOrdering()
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                exercise2FirstCorrectBlackKeyRef.current = null
                pickNewRound()
              }, 650)
              return next
            }

            if (
              next >= VERIFICATION_TARGET &&
              classicExerciseIdRef.current === 42
            ) {
              window.setTimeout(() => {
                classicExerciseIdRef.current = 44
                setClassicExerciseId(44)
                rollVerificationHalf(verificationHalfRef)
                setStreak(0)
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setBlackFeedback({})
                clearRevealOrdering()
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                exercise2FirstCorrectBlackKeyRef.current = null
                pickNewRound()
              }, 650)
              return next
            }

            if (
              next >= VERIFICATION_TARGET &&
              classicExerciseIdRef.current === 43
            ) {
              window.setTimeout(() => {
                classicExerciseIdRef.current = 44
                setClassicExerciseId(44)
                rollVerificationHalf(verificationHalfRef)
                setStreak(0)
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setBlackFeedback({})
                clearRevealOrdering()
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                exercise2FirstCorrectBlackKeyRef.current = null
                pickNewRound()
              }, 650)
              return next
            }

            window.setTimeout(() => {
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              if (gameModeRef.current === 'classic') pickNewRound()
            }, 650)

            return next
          })
        } else {
          handleWrongAnswer()
        }

        return
      }

      /* Exercício 7 — harmônico (H): duas notas ao mesmo tempo; ordem dos cliques livre */
      if (round.kind === 'twoH') {
        if (
          round.exercise25Slots &&
          (classicExerciseIdRef.current === 27 ||
            classicExerciseIdRef.current === 31 ||
            classicExerciseIdRef.current === 35 ||
            classicExerciseIdRef.current === 39 ||
            classicExerciseIdRef.current === 43)
        ) {
          const { slot0, slot1 } = round.exercise25Slots
          const whiteMatches = (slot, idx) =>
            slot.kind === 'white' && idx === slot.index
          const isWhiteAllowed =
            whiteMatches(slot0, index) || whiteMatches(slot1, index)

          if (answerPhaseRef.current === 0) {
            if (!isWhiteAllowed) {
              frozenRef.current = true
              handleWrongAnswer()
              return
            }
            answerPhaseRef.current = 1
            exercise2FirstCorrectIndexRef.current = index
            exercise2FirstCorrectBlackKeyRef.current = null
            setWhiteFeedback({ [index]: 'correct' })
            setBlackFeedback({})
            setShowCorrectNotice(false)
            return
          }

          const firstWi = exercise2FirstCorrectIndexRef.current
          const firstBi = exercise2FirstCorrectBlackKeyRef.current

          if (firstBi != null) {
            frozenRef.current = true
            const whiteSlot = slot0.kind === 'white' ? slot0 : slot1
            if (whiteSlot.kind !== 'white' || index !== whiteSlot.index) {
              handleWrongAnswer()
              return
            }

            setShowCorrectNotice(true)
            setWhiteFeedback({ [index]: 'correct' })
            setBlackFeedback({ [firstBi]: 'correct' })

            setStreak((s) => {
              const next = s + 1

              if (
                next >= VERIFICATION_TARGET &&
                classicExerciseIdRef.current === 27
              ) {
                window.setTimeout(() => {
                  classicExerciseIdRef.current = 28
                  setClassicExerciseId(28)
                  rollVerificationHalf(verificationHalfRef)
                  setStreak(0)
                  frozenRef.current = false
                  setShowCorrectNotice(false)
                  setWhiteFeedback({})
                  setBlackFeedback({})
                  clearRevealOrdering()
                  answerPhaseRef.current = 0
                  exercise2FirstCorrectIndexRef.current = null
                  exercise2FirstCorrectBlackKeyRef.current = null
                  pickNewRound()
                }, 650)
                return next
              }

              if (
                next >= VERIFICATION_TARGET &&
                classicExerciseIdRef.current === 31
              ) {
                window.setTimeout(() => {
                  classicExerciseIdRef.current = 32
                  setClassicExerciseId(32)
                  rollVerificationHalf(verificationHalfRef)
                  setStreak(0)
                  frozenRef.current = false
                  setShowCorrectNotice(false)
                  setWhiteFeedback({})
                  setBlackFeedback({})
                  clearRevealOrdering()
                  answerPhaseRef.current = 0
                  exercise2FirstCorrectIndexRef.current = null
                  exercise2FirstCorrectBlackKeyRef.current = null
                  pickNewRound()
                }, 650)
                return next
              }

              if (
                next >= VERIFICATION_TARGET &&
                classicExerciseIdRef.current === 35
              ) {
                window.setTimeout(() => {
                  classicExerciseIdRef.current = 36
                  setClassicExerciseId(36)
                  rollVerificationHalf(verificationHalfRef)
                  setStreak(0)
                  frozenRef.current = false
                  setShowCorrectNotice(false)
                  setWhiteFeedback({})
                  setBlackFeedback({})
                  clearRevealOrdering()
                  answerPhaseRef.current = 0
                  exercise2FirstCorrectIndexRef.current = null
                  exercise2FirstCorrectBlackKeyRef.current = null
                  pickNewRound()
                }, 650)
                return next
              }

              if (
                next >= VERIFICATION_TARGET &&
                classicExerciseIdRef.current === 39
              ) {
                window.setTimeout(() => {
                  classicExerciseIdRef.current = 40
                  setClassicExerciseId(40)
                  rollVerificationHalf(verificationHalfRef)
                  setStreak(0)
                  frozenRef.current = false
                  setShowCorrectNotice(false)
                  setWhiteFeedback({})
                  setBlackFeedback({})
                  clearRevealOrdering()
                  answerPhaseRef.current = 0
                  exercise2FirstCorrectIndexRef.current = null
                  exercise2FirstCorrectBlackKeyRef.current = null
                  pickNewRound()
                }, 650)
                return next
              }

              if (
                next >= VERIFICATION_TARGET &&
                classicExerciseIdRef.current === 43
              ) {
                window.setTimeout(() => {
                  setExerciseComplete(true)
                  frozenRef.current = false
                  setShowCorrectNotice(false)
                  setWhiteFeedback({})
                  setBlackFeedback({})
                  clearRevealOrdering()
                  answerPhaseRef.current = 0
                  exercise2FirstCorrectIndexRef.current = null
                  exercise2FirstCorrectBlackKeyRef.current = null
                }, 650)
                return next
              }

              window.setTimeout(() => {
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setBlackFeedback({})
                clearRevealOrdering()
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                exercise2FirstCorrectBlackKeyRef.current = null
                if (gameModeRef.current === 'classic') pickNewRound()
              }, 650)

              return next
            })
            return
          }

          if (firstWi == null) {
            frozenRef.current = true
            handleWrongAnswer()
            return
          }

          if (index === firstWi) {
            frozenRef.current = true
            handleWrongAnswer()
            return
          }

          if (slot0.kind === 'white' && slot1.kind === 'white') {
            if (!isWhiteAllowed) {
              frozenRef.current = true
              handleWrongAnswer()
              return
            }

            frozenRef.current = true
            setShowCorrectNotice(true)
            setWhiteFeedback({
              [firstWi]: 'correct',
              [index]: 'correct',
            })
            setBlackFeedback({})

            setStreak((s) => {
              const next = s + 1

              if (
                next >= VERIFICATION_TARGET &&
                classicExerciseIdRef.current === 27
              ) {
                window.setTimeout(() => {
                  classicExerciseIdRef.current = 28
                  setClassicExerciseId(28)
                  rollVerificationHalf(verificationHalfRef)
                  setStreak(0)
                  frozenRef.current = false
                  setShowCorrectNotice(false)
                  setWhiteFeedback({})
                  setBlackFeedback({})
                  clearRevealOrdering()
                  answerPhaseRef.current = 0
                  exercise2FirstCorrectIndexRef.current = null
                  exercise2FirstCorrectBlackKeyRef.current = null
                  pickNewRound()
                }, 650)
                return next
              }

              if (
                next >= VERIFICATION_TARGET &&
                classicExerciseIdRef.current === 31
              ) {
                window.setTimeout(() => {
                  classicExerciseIdRef.current = 32
                  setClassicExerciseId(32)
                  rollVerificationHalf(verificationHalfRef)
                  setStreak(0)
                  frozenRef.current = false
                  setShowCorrectNotice(false)
                  setWhiteFeedback({})
                  setBlackFeedback({})
                  clearRevealOrdering()
                  answerPhaseRef.current = 0
                  exercise2FirstCorrectIndexRef.current = null
                  exercise2FirstCorrectBlackKeyRef.current = null
                  pickNewRound()
                }, 650)
                return next
              }

              if (
                next >= VERIFICATION_TARGET &&
                classicExerciseIdRef.current === 35
              ) {
                window.setTimeout(() => {
                  classicExerciseIdRef.current = 36
                  setClassicExerciseId(36)
                  rollVerificationHalf(verificationHalfRef)
                  setStreak(0)
                  frozenRef.current = false
                  setShowCorrectNotice(false)
                  setWhiteFeedback({})
                  setBlackFeedback({})
                  clearRevealOrdering()
                  answerPhaseRef.current = 0
                  exercise2FirstCorrectIndexRef.current = null
                  exercise2FirstCorrectBlackKeyRef.current = null
                  pickNewRound()
                }, 650)
                return next
              }

              if (
                next >= VERIFICATION_TARGET &&
                classicExerciseIdRef.current === 39
              ) {
                window.setTimeout(() => {
                  classicExerciseIdRef.current = 40
                  setClassicExerciseId(40)
                  rollVerificationHalf(verificationHalfRef)
                  setStreak(0)
                  frozenRef.current = false
                  setShowCorrectNotice(false)
                  setWhiteFeedback({})
                  setBlackFeedback({})
                  clearRevealOrdering()
                  answerPhaseRef.current = 0
                  exercise2FirstCorrectIndexRef.current = null
                  exercise2FirstCorrectBlackKeyRef.current = null
                  pickNewRound()
                }, 650)
                return next
              }

              if (
                next >= VERIFICATION_TARGET &&
                classicExerciseIdRef.current === 43
              ) {
                window.setTimeout(() => {
                  setExerciseComplete(true)
                  frozenRef.current = false
                  setShowCorrectNotice(false)
                  setWhiteFeedback({})
                  setBlackFeedback({})
                  clearRevealOrdering()
                  answerPhaseRef.current = 0
                  exercise2FirstCorrectIndexRef.current = null
                  exercise2FirstCorrectBlackKeyRef.current = null
                }, 650)
                return next
              }

              window.setTimeout(() => {
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setBlackFeedback({})
                clearRevealOrdering()
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                exercise2FirstCorrectBlackKeyRef.current = null
                if (gameModeRef.current === 'classic') pickNewRound()
              }, 650)

              return next
            })
            return
          }

          frozenRef.current = true
          handleWrongAnswer()
          return
        }

        const { lowIndex, highIndex } = round
        const lowLabel = WHITE_KEYS[lowIndex].label
        const highLabel = WHITE_KEYS[highIndex].label
        const isAllowed = label === lowLabel || label === highLabel

        if (answerPhaseRef.current === 0) {
          if (!isAllowed) {
            frozenRef.current = true
            handleWrongAnswer()
            return
          }
          answerPhaseRef.current = 1
          exercise2FirstCorrectIndexRef.current = index
          setWhiteFeedback({ [index]: 'correct' })
          setBlackFeedback({})
          setShowCorrectNotice(false)
          return
        }

        const firstIdx = exercise2FirstCorrectIndexRef.current
        const firstLabel = firstIdx != null ? WHITE_KEYS[firstIdx].label : null

        if (index === firstIdx || label === firstLabel) {
          frozenRef.current = true
          handleWrongAnswer()
          return
        }
        if (!isAllowed) {
          frozenRef.current = true
          handleWrongAnswer()
          return
        }

        frozenRef.current = true
        setShowCorrectNotice(true)
        setWhiteFeedback({
          ...(firstIdx !== null ? { [firstIdx]: 'correct' } : {}),
          [index]: 'correct',
        })
        setBlackFeedback({})

        setStreak((s) => {
          const next = s + 1

          if (next >= VERIFICATION_TARGET) {
            if (classicExerciseIdRef.current === 7) {
              window.setTimeout(() => {
                classicExerciseIdRef.current = 8
                setClassicExerciseId(8)
                rollVerificationHalf(verificationHalfRef)
                setStreak(0)
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setBlackFeedback({})
                clearRevealOrdering()
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                pickNewRound()
              }, 650)
              return next
            }

            if (classicExerciseIdRef.current === 11) {
              window.setTimeout(() => {
                classicExerciseIdRef.current = 12
                setClassicExerciseId(12)
                rollVerificationHalf(verificationHalfRef)
                setStreak(0)
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setBlackFeedback({})
                clearRevealOrdering()
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                pickNewRound()
              }, 650)
              return next
            }

            if (classicExerciseIdRef.current === 15) {
              window.setTimeout(() => {
                classicExerciseIdRef.current = 16
                setClassicExerciseId(16)
                rollVerificationHalf(verificationHalfRef)
                setStreak(0)
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setBlackFeedback({})
                clearRevealOrdering()
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                pickNewRound()
              }, 650)
              return next
            }

            if (classicExerciseIdRef.current === 19) {
              window.setTimeout(() => {
                classicExerciseIdRef.current = 20
                setClassicExerciseId(20)
                rollVerificationHalf(verificationHalfRef)
                setStreak(0)
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setBlackFeedback({})
                clearRevealOrdering()
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                pickNewRound()
              }, 650)
              return next
            }

            if (classicExerciseIdRef.current === 23) {
              window.setTimeout(() => {
                classicExerciseIdRef.current = 24
                setClassicExerciseId(24)
                rollVerificationHalf(verificationHalfRef)
                setStreak(0)
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setBlackFeedback({})
                clearRevealOrdering()
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                pickNewRound()
              }, 650)
              return next
            }
          }

          window.setTimeout(() => {
            frozenRef.current = false
            setShowCorrectNotice(false)
            setWhiteFeedback({})
            setBlackFeedback({})
            clearRevealOrdering()
            answerPhaseRef.current = 0
            if (gameModeRef.current === 'classic') pickNewRound()
          }, 650)

          return next
        })
        return
      }

      /* Exercício 25, 29, 33, 37 e 41 — MA com slots de brancas ± G#/Ab (25 e 41), F#/Gb (29), D#/Eb (33) ou C#/Db (37); ordem grave → agudo. */
      if (
        round.kind === 'twoMa' &&
        round.exercise25Slots &&
        (classicExerciseIdRef.current === 25 ||
          classicExerciseIdRef.current === 29 ||
          classicExerciseIdRef.current === 33 ||
          classicExerciseIdRef.current === 37 ||
          classicExerciseIdRef.current === 41 ||
          classicExerciseIdRef.current === 44
        )
      ) {
        const { slot0, slot1 } = round.exercise25Slots
        const id = classicExerciseIdRef.current
        const blackKind =
          id === 25 || id === 41 || id === 44
            ? 'gsharp'
            : id === 29
              ? 'fsharp'
              : id === 37
                ? 'csharp'
                : 'dsharp'

        if (answerPhaseRef.current === 0) {
          if (slot0.kind === blackKind) {
            frozenRef.current = true
            handleWrongAnswer()
            return
          }
          if (slot0.kind !== 'white' || index !== slot0.index) {
            frozenRef.current = true
            handleWrongAnswer()
            return
          }
          answerPhaseRef.current = 1
          exercise2FirstCorrectIndexRef.current = index
          exercise2FirstCorrectBlackKeyRef.current = null
          setWhiteFeedback({ [index]: 'correct' })
          setBlackFeedback({})
          setShowCorrectNotice(false)
          return
        }

        frozenRef.current = true
        if (slot1.kind === blackKind) {
          handleWrongAnswer()
          return
        }
        if (slot1.kind !== 'white' || index !== slot1.index) {
          handleWrongAnswer()
          return
        }

        const firstIdx = exercise2FirstCorrectIndexRef.current
        const firstBlackBi = exercise2FirstCorrectBlackKeyRef.current
        setShowCorrectNotice(true)
        setWhiteFeedback({
          ...(firstIdx !== null ? { [firstIdx]: 'correct' } : {}),
          [index]: 'correct',
        })
        setBlackFeedback(
          firstBlackBi !== null ? { [firstBlackBi]: 'correct' } : {},
        )

        setStreak((s) => {
          const next = s + 1

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 25
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 26
              setClassicExerciseId(26)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 29
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 30
              setClassicExerciseId(30)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 33
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 34
              setClassicExerciseId(34)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 37
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 38
              setClassicExerciseId(38)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 41
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 42
              setClassicExerciseId(42)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          window.setTimeout(() => {
            frozenRef.current = false
            setShowCorrectNotice(false)
            setWhiteFeedback({})
            setBlackFeedback({})
            clearRevealOrdering()
            answerPhaseRef.current = 0
            exercise2FirstCorrectIndexRef.current = null
            exercise2FirstCorrectBlackKeyRef.current = null
            if (gameModeRef.current === 'classic') pickNewRound()
          }, 650)

          return next
        })
        return
      }

      /* Exercício 26, 30, 34 e 38 — MD: mesmos pares que o 25 (26), 29 (30), 33 (34) ou 37 (38). */
      if (
        round.kind === 'twoMd' &&
        round.exercise25Slots &&
        (classicExerciseIdRef.current === 26 ||
          classicExerciseIdRef.current === 30 ||
          classicExerciseIdRef.current === 34 ||
          classicExerciseIdRef.current === 38)
      ) {
        const { slot0, slot1 } = round.exercise25Slots
        const idMd = classicExerciseIdRef.current
        const blackKind =
          idMd === 26
            ? 'gsharp'
            : idMd === 30
              ? 'fsharp'
              : idMd === 38
                ? 'csharp'
                : 'dsharp'

        if (answerPhaseRef.current === 0) {
          if (slot1.kind === blackKind) {
            frozenRef.current = true
            handleWrongAnswer()
            return
          }
          if (slot1.kind !== 'white' || index !== slot1.index) {
            frozenRef.current = true
            handleWrongAnswer()
            return
          }
          answerPhaseRef.current = 1
          exercise2FirstCorrectIndexRef.current = index
          exercise2FirstCorrectBlackKeyRef.current = null
          setWhiteFeedback({ [index]: 'correct' })
          setBlackFeedback({})
          setShowCorrectNotice(false)
          return
        }

        frozenRef.current = true
        if (slot0.kind === blackKind) {
          handleWrongAnswer()
          return
        }
        if (slot0.kind !== 'white' || index !== slot0.index) {
          handleWrongAnswer()
          return
        }

        const firstIdx = exercise2FirstCorrectIndexRef.current
        const firstBlackBi = exercise2FirstCorrectBlackKeyRef.current
        setShowCorrectNotice(true)
        setWhiteFeedback({
          ...(firstIdx !== null ? { [firstIdx]: 'correct' } : {}),
          [index]: 'correct',
        })
        setBlackFeedback(
          firstBlackBi !== null ? { [firstBlackBi]: 'correct' } : {},
        )

        setStreak((s) => {
          const next = s + 1

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 26
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 27
              setClassicExerciseId(27)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 30
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 31
              setClassicExerciseId(31)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 34
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 35
              setClassicExerciseId(35)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 38
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 39
              setClassicExerciseId(39)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          window.setTimeout(() => {
            frozenRef.current = false
            setShowCorrectNotice(false)
            setWhiteFeedback({})
            setBlackFeedback({})
            clearRevealOrdering()
            answerPhaseRef.current = 0
            exercise2FirstCorrectIndexRef.current = null
            exercise2FirstCorrectBlackKeyRef.current = null
            if (gameModeRef.current === 'classic') pickNewRound()
          }, 650)

          return next
        })
        return
      }

      /* Exercícios 5, 6, 9, 10, 13, 14, 17, 18, 21 e 22 — dois cliques na ordem do áudio; 7, 11, 15, 19, 23, 27, 31, 35, 39 e 43 são harmónicos (twoH) */
      const { kind, lowIndex, highIndex } = round
      const lowLabel = WHITE_KEYS[lowIndex].label
      const highLabel = WHITE_KEYS[highIndex].label
      const firstLabel = kind === 'twoMa' ? lowLabel : highLabel
      const secondLabel = kind === 'twoMa' ? highLabel : lowLabel

      if (answerPhaseRef.current === 0) {
        if (label !== firstLabel) {
          frozenRef.current = true
          handleWrongAnswer()
          return
        }
        answerPhaseRef.current = 1
        exercise2FirstCorrectIndexRef.current = index
        setWhiteFeedback({ [index]: 'correct' })
        setBlackFeedback({})
        setShowCorrectNotice(false)
        return
      }

      frozenRef.current = true

      if (label !== secondLabel) {
        handleWrongAnswer()
        return
      }

      const firstIdx = exercise2FirstCorrectIndexRef.current
      setShowCorrectNotice(true)
      setWhiteFeedback({
        ...(firstIdx !== null ? { [firstIdx]: 'correct' } : {}),
        [index]: 'correct',
      })
      setBlackFeedback({})

      setStreak((s) => {
        const next = s + 1

        if (next >= VERIFICATION_TARGET) {
          if (classicExerciseIdRef.current === 5) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 6
              setClassicExerciseId(6)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (classicExerciseIdRef.current === 6) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 7
              setClassicExerciseId(7)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (classicExerciseIdRef.current === 9) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 10
              setClassicExerciseId(10)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (classicExerciseIdRef.current === 10) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 11
              setClassicExerciseId(11)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (classicExerciseIdRef.current === 13) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 14
              setClassicExerciseId(14)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (classicExerciseIdRef.current === 14) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 15
              setClassicExerciseId(15)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (classicExerciseIdRef.current === 17) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 18
              setClassicExerciseId(18)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (classicExerciseIdRef.current === 18) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 19
              setClassicExerciseId(19)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (classicExerciseIdRef.current === 21) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 22
              setClassicExerciseId(22)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (classicExerciseIdRef.current === 22) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 23
              setClassicExerciseId(23)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          return next
        }

        window.setTimeout(() => {
          frozenRef.current = false
          setShowCorrectNotice(false)
          setWhiteFeedback({})
          setBlackFeedback({})
          clearRevealOrdering()
          answerPhaseRef.current = 0
          if (gameModeRef.current === 'classic') pickNewRound()
        }, 650)

        return next
      })
    },
    [gameMode, exerciseComplete, handleWrongAnswer, pickNewRound, clearRevealOrdering],
  )

  const handleBlackPress = useCallback(
    (blackKeyIndex) => {
      if (gameMode !== 'classic' || exerciseComplete || frozenRef.current)
        return

      const round = roundRef.current
      const gsharpIdx = BLACK_KEYS.findIndex((k) => k.sharp === 'G#')
      const fsharpIdx = BLACK_KEYS.findIndex((k) => k.sharp === 'F#')
      const dsharpIdx = BLACK_KEYS.findIndex((k) => k.sharp === 'D#')
      const csharpIdx = BLACK_KEYS.findIndex((k) => k.sharp === 'C#')
      const asharpIdx = BLACK_KEYS.findIndex((k) => k.sharp === 'A#')

      if (classicExerciseIdRef.current === 28 && round.kind === 'one') {
        if (blackKeyIndex !== fsharpIdx || round.target !== 'F#') {
          frozenRef.current = true
          handleWrongAnswer()
          return
        }

        frozenRef.current = true
        setShowCorrectNotice(true)
        setBlackFeedback({ [blackKeyIndex]: 'correct' })
        setWhiteFeedback({})

        setStreak((s) => {
          const next = s + 1

          if (next >= VERIFICATION_TARGET && classicExerciseIdRef.current === 28) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 29
              setClassicExerciseId(29)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          window.setTimeout(() => {
            frozenRef.current = false
            setShowCorrectNotice(false)
            setWhiteFeedback({})
            setBlackFeedback({})
            clearRevealOrdering()
            if (gameModeRef.current === 'classic') pickNewRound()
          }, 650)

          return next
        })
        return
      }

      if (classicExerciseIdRef.current === 32 && round.kind === 'one') {
        if (blackKeyIndex !== dsharpIdx || round.target !== 'D#') {
          frozenRef.current = true
          handleWrongAnswer()
          return
        }

        frozenRef.current = true
        setShowCorrectNotice(true)
        setBlackFeedback({ [blackKeyIndex]: 'correct' })
        setWhiteFeedback({})

        setStreak((s) => {
          const next = s + 1

          if (next >= VERIFICATION_TARGET && classicExerciseIdRef.current === 32) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 33
              setClassicExerciseId(33)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          window.setTimeout(() => {
            frozenRef.current = false
            setShowCorrectNotice(false)
            setWhiteFeedback({})
            setBlackFeedback({})
            clearRevealOrdering()
            if (gameModeRef.current === 'classic') pickNewRound()
          }, 650)

          return next
        })
        return
      }

      if (classicExerciseIdRef.current === 36 && round.kind === 'one') {
        if (blackKeyIndex !== csharpIdx || round.target !== 'C#') {
          frozenRef.current = true
          handleWrongAnswer()
          return
        }

        frozenRef.current = true
        setShowCorrectNotice(true)
        setBlackFeedback({ [blackKeyIndex]: 'correct' })
        setWhiteFeedback({})

        setStreak((s) => {
          const next = s + 1

          if (next >= VERIFICATION_TARGET && classicExerciseIdRef.current === 36) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 37
              setClassicExerciseId(37)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          window.setTimeout(() => {
            frozenRef.current = false
            setShowCorrectNotice(false)
            setWhiteFeedback({})
            setBlackFeedback({})
            clearRevealOrdering()
            if (gameModeRef.current === 'classic') pickNewRound()
          }, 650)

          return next
        })
        return
      }

      if (classicExerciseIdRef.current === 40 && round.kind === 'one') {
        if (blackKeyIndex !== asharpIdx || round.target !== 'A#') {
          frozenRef.current = true
          handleWrongAnswer()
          return
        }

        frozenRef.current = true
        setShowCorrectNotice(true)
        setBlackFeedback({ [blackKeyIndex]: 'correct' })
        setWhiteFeedback({})

        setStreak((s) => {
          const next = s + 1

          if (next >= VERIFICATION_TARGET && classicExerciseIdRef.current === 40) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 41
              setClassicExerciseId(41)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          window.setTimeout(() => {
            frozenRef.current = false
            setShowCorrectNotice(false)
            setWhiteFeedback({})
            setBlackFeedback({})
            clearRevealOrdering()
            if (gameModeRef.current === 'classic') pickNewRound()
          }, 650)

          return next
        })
        return
      }

      if (
        (classicExerciseIdRef.current === 24 ||
          classicExerciseIdRef.current === 42) &&
        round.kind === 'one'
      ) {
        if (blackKeyIndex !== gsharpIdx || round.target !== 'G#') {
          frozenRef.current = true
          handleWrongAnswer()
          return
        }

        frozenRef.current = true
        setShowCorrectNotice(true)
        setBlackFeedback({ [blackKeyIndex]: 'correct' })
        setWhiteFeedback({})

        setStreak((s) => {
          const next = s + 1

          if (next >= VERIFICATION_TARGET && classicExerciseIdRef.current === 24) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 25
              setClassicExerciseId(25)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (next >= VERIFICATION_TARGET && classicExerciseIdRef.current === 42) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 44
              setClassicExerciseId(44)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          window.setTimeout(() => {
            frozenRef.current = false
            setShowCorrectNotice(false)
            setWhiteFeedback({})
            setBlackFeedback({})
            clearRevealOrdering()
            if (gameModeRef.current === 'classic') pickNewRound()
          }, 650)

          return next
        })
        return
      }

      if (
        (classicExerciseIdRef.current === 25 ||
          classicExerciseIdRef.current === 29 ||
          classicExerciseIdRef.current === 33 ||
          classicExerciseIdRef.current === 37 ||
          classicExerciseIdRef.current === 41) &&
        round.kind === 'twoMa' &&
        round.exercise25Slots
      ) {
        const id = classicExerciseIdRef.current
        const blackKind =
          id === 25 || id === 41
            ? 'gsharp'
            : id === 29
              ? 'fsharp'
              : id === 37
                ? 'csharp'
                : 'dsharp'
        const wantSharpIdx =
          id === 25 || id === 41
            ? gsharpIdx
            : id === 29
              ? fsharpIdx
              : id === 37
                ? csharpIdx
                : dsharpIdx

        if (blackKeyIndex !== wantSharpIdx) {
          frozenRef.current = true
          handleWrongAnswer()
          return
        }

        const { slot0, slot1 } = round.exercise25Slots

        if (answerPhaseRef.current === 0) {
          if (slot0.kind !== blackKind) {
            frozenRef.current = true
            handleWrongAnswer()
            return
          }
          answerPhaseRef.current = 1
          exercise2FirstCorrectIndexRef.current = null
          exercise2FirstCorrectBlackKeyRef.current = blackKeyIndex
          setBlackFeedback({ [blackKeyIndex]: 'correct' })
          setWhiteFeedback({})
          setShowCorrectNotice(false)
          return
        }

        frozenRef.current = true
        if (slot1.kind !== blackKind) {
          handleWrongAnswer()
          return
        }

        const firstBi = exercise2FirstCorrectBlackKeyRef.current
        const firstWi = exercise2FirstCorrectIndexRef.current
        setShowCorrectNotice(true)
        setBlackFeedback({
          ...(firstBi !== null ? { [firstBi]: 'correct' } : {}),
          [blackKeyIndex]: 'correct',
        })
        setWhiteFeedback(
          firstWi !== null ? { [firstWi]: 'correct' } : {},
        )

        setStreak((s) => {
          const next = s + 1

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 25
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 26
              setClassicExerciseId(26)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 29
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 30
              setClassicExerciseId(30)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 33
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 34
              setClassicExerciseId(34)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 37
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 38
              setClassicExerciseId(38)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 41
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 42
              setClassicExerciseId(42)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          window.setTimeout(() => {
            frozenRef.current = false
            setShowCorrectNotice(false)
            setWhiteFeedback({})
            setBlackFeedback({})
            clearRevealOrdering()
            answerPhaseRef.current = 0
            exercise2FirstCorrectIndexRef.current = null
            exercise2FirstCorrectBlackKeyRef.current = null
            if (gameModeRef.current === 'classic') pickNewRound()
          }, 650)

          return next
        })
        return
      }

      if (
        (classicExerciseIdRef.current === 26 ||
          classicExerciseIdRef.current === 30 ||
          classicExerciseIdRef.current === 34 ||
          classicExerciseIdRef.current === 38) &&
        round.kind === 'twoMd' &&
        round.exercise25Slots
      ) {
        const idMd = classicExerciseIdRef.current
        const wantSharpIdx =
          idMd === 26
            ? gsharpIdx
            : idMd === 30
              ? fsharpIdx
              : idMd === 38
                ? csharpIdx
                : dsharpIdx
        const blackKind =
          idMd === 26
            ? 'gsharp'
            : idMd === 30
              ? 'fsharp'
              : idMd === 38
                ? 'csharp'
                : 'dsharp'

        if (blackKeyIndex !== wantSharpIdx) {
          frozenRef.current = true
          handleWrongAnswer()
          return
        }

        const { slot0, slot1 } = round.exercise25Slots

        if (answerPhaseRef.current === 0) {
          if (slot1.kind !== blackKind) {
            frozenRef.current = true
            handleWrongAnswer()
            return
          }
          answerPhaseRef.current = 1
          exercise2FirstCorrectIndexRef.current = null
          exercise2FirstCorrectBlackKeyRef.current = blackKeyIndex
          setBlackFeedback({ [blackKeyIndex]: 'correct' })
          setWhiteFeedback({})
          setShowCorrectNotice(false)
          return
        }

        frozenRef.current = true
        if (slot0.kind !== blackKind) {
          handleWrongAnswer()
          return
        }

        const firstBi = exercise2FirstCorrectBlackKeyRef.current
        const firstWi = exercise2FirstCorrectIndexRef.current
        setShowCorrectNotice(true)
        setBlackFeedback({
          ...(firstBi !== null ? { [firstBi]: 'correct' } : {}),
          [blackKeyIndex]: 'correct',
        })
        setWhiteFeedback(
          firstWi !== null ? { [firstWi]: 'correct' } : {},
        )

        setStreak((s) => {
          const next = s + 1

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 26
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 27
              setClassicExerciseId(27)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 30
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 31
              setClassicExerciseId(31)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 34
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 35
              setClassicExerciseId(35)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 38
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 39
              setClassicExerciseId(39)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          window.setTimeout(() => {
            frozenRef.current = false
            setShowCorrectNotice(false)
            setWhiteFeedback({})
            setBlackFeedback({})
            clearRevealOrdering()
            answerPhaseRef.current = 0
            exercise2FirstCorrectIndexRef.current = null
            exercise2FirstCorrectBlackKeyRef.current = null
            if (gameModeRef.current === 'classic') pickNewRound()
          }, 650)

          return next
        })
        return
      }

      if (
        (classicExerciseIdRef.current === 27 ||
          classicExerciseIdRef.current === 31 ||
          classicExerciseIdRef.current === 35 ||
          classicExerciseIdRef.current === 39 ||
          classicExerciseIdRef.current === 43) &&
        round.kind === 'twoH' &&
        round.exercise25Slots
      ) {
        const idH = classicExerciseIdRef.current
        const wantSharpIdx =
          idH === 43
            ? asharpIdx
            : idH === 35
              ? dsharpIdx
              : idH === 39
                ? csharpIdx
                : idH === 31
                  ? fsharpIdx
                  : gsharpIdx
        const sharpKind =
          idH === 43
            ? 'asharp'
            : idH === 35
              ? 'dsharp'
              : idH === 39
                ? 'csharp'
                : idH === 31
                  ? 'fsharp'
                  : 'gsharp'

        if (blackKeyIndex !== wantSharpIdx) {
          frozenRef.current = true
          handleWrongAnswer()
          return
        }

        const { slot0, slot1 } = round.exercise25Slots
        const pairHasSharp =
          slot0.kind === sharpKind || slot1.kind === sharpKind

        if (answerPhaseRef.current === 0) {
          if (!pairHasSharp) {
            frozenRef.current = true
            handleWrongAnswer()
            return
          }
          answerPhaseRef.current = 1
          exercise2FirstCorrectIndexRef.current = null
          exercise2FirstCorrectBlackKeyRef.current = blackKeyIndex
          setBlackFeedback({ [blackKeyIndex]: 'correct' })
          setWhiteFeedback({})
          setShowCorrectNotice(false)
          return
        }

        if (exercise2FirstCorrectBlackKeyRef.current != null) {
          frozenRef.current = true
          handleWrongAnswer()
          return
        }

        frozenRef.current = true
        if (!pairHasSharp) {
          handleWrongAnswer()
          return
        }

        const whiteSlot = slot0.kind === 'white' ? slot0 : slot1
        const firstWi = exercise2FirstCorrectIndexRef.current
        if (
          whiteSlot.kind !== 'white' ||
          firstWi == null ||
          whiteSlot.index !== firstWi
        ) {
          handleWrongAnswer()
          return
        }

        setShowCorrectNotice(true)
        setBlackFeedback({ [blackKeyIndex]: 'correct' })
        setWhiteFeedback({ [firstWi]: 'correct' })

        setStreak((s) => {
          const next = s + 1

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 27
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 28
              setClassicExerciseId(28)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 31
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 32
              setClassicExerciseId(32)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 35
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 36
              setClassicExerciseId(36)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 39
          ) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 40
              setClassicExerciseId(40)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (
            next >= VERIFICATION_TARGET &&
            classicExerciseIdRef.current === 43
          ) {
            window.setTimeout(() => {
              setExerciseComplete(true)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setBlackFeedback({})
              clearRevealOrdering()
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              exercise2FirstCorrectBlackKeyRef.current = null
            }, 650)
            return next
          }

          window.setTimeout(() => {
            frozenRef.current = false
            setShowCorrectNotice(false)
            setWhiteFeedback({})
            setBlackFeedback({})
            clearRevealOrdering()
            answerPhaseRef.current = 0
            exercise2FirstCorrectIndexRef.current = null
            exercise2FirstCorrectBlackKeyRef.current = null
            if (gameModeRef.current === 'classic') pickNewRound()
          }, 650)

          return next
        })
        return
      }

      frozenRef.current = true
      handleWrongAnswer()
    },
    [gameMode, exerciseComplete, handleWrongAnswer, pickNewRound, clearRevealOrdering],
  )

  const classicDisabled = exerciseComplete

  const instructionsTitle = `Exercício ${classicExerciseDisplayNumber(classicExerciseId)}: ${CLASSIC_INSTRUCTION_BODY_BY_ID[classicExerciseId] ?? ''}`

  const replayAriaLabel =
    classicExerciseId === 1 ||
      classicExerciseId === 4 ||
      classicExerciseId === 8 ||
      classicExerciseId === 12 ||
      classicExerciseId === 16 ||
      classicExerciseId === 20 ||
      classicExerciseId === 24 ||
      classicExerciseId === 28 ||
      classicExerciseId === 32 ||
      classicExerciseId === 36 ||
      classicExerciseId === 40 ||
      classicExerciseId === 42
      ? 'Reproduzir o áudio da nota desta rodada'
      : classicExerciseId === 7 ||
        classicExerciseId === 11 ||
        classicExerciseId === 15 ||
        classicExerciseId === 19 ||
        classicExerciseId === 23 ||
        classicExerciseId === 27 ||
        classicExerciseId === 31 ||
        classicExerciseId === 35 ||
        classicExerciseId === 39 ||
        classicExerciseId === 43
        ? 'Reproduzir as duas notas desta rodada em simultâneo (harmónico)'
        : classicExerciseId === 5 ||
          classicExerciseId === 9 ||
          classicExerciseId === 13 ||
          classicExerciseId === 17 ||
          classicExerciseId === 21 ||
          classicExerciseId === 25 ||
          classicExerciseId === 29 ||
          classicExerciseId === 33 ||
          classicExerciseId === 37 ||
          classicExerciseId === 41
          ? 'Reproduzir as duas notas desta rodada na ordem grave a agudo'
          : 'Reproduzir as duas notas desta rodada na ordem agudo a grave'

  const orderedRevealHintText = (() => {
    const w = orderedRevealSteps ?? {}
    const b = orderedRevealBlackSteps ?? {}
    const parts = [
      ...Object.entries(w).map(([idx, step]) => ({
        step,
        text: `${step} — ${WHITE_KEYS[Number(idx)].label}`,
      })),
      ...Object.entries(b).map(([idx, step]) => {
        const k = BLACK_KEYS[Number(idx)]
        return {
          step,
          text: `${step} — ${k.sharp}-${k.flat}`,
        }
      }),
    ]
      .sort((a, b) => a.step - b.step)
      .map((p) => p.text)
    return parts.length > 0 ? parts.join(', ') : ''
  })()

  return (
    <div className="app-screen">
      <h1 className="app-title">Ouvido Absoluto</h1>

      <div className="app-mode-tabs" role="tablist" aria-label="Modo de jogo">
        <button
          type="button"
          role="tab"
          aria-selected={gameMode === 'classic'}
          className={`app-mode-tab ${gameMode === 'classic' ? 'is-active' : ''}`}
          onClick={() => setGameMode('classic')}
        >
          Modo clássico
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={gameMode === 'alternative'}
          className={`app-mode-tab ${gameMode === 'alternative' ? 'is-active' : ''}`}
          onClick={() => setGameMode('alternative')}
        >
          Modo alternativo
        </button>
      </div>

      {gameMode === 'classic' ? (
        <>
          <div className="app-classic-exercise-row">
            <label className="app-classic-exercise-label" htmlFor="classic-exercise-select">
              Exercício
            </label>
            <select
              id="classic-exercise-select"
              className="app-classic-exercise-select"
              aria-label="Escolher exercício no modo clássico"
              value={classicExerciseId}
              onChange={handleClassicExerciseSelectChange}
            >
              {CLASSIC_EXERCISE_IDS_IN_ORDER.map((id) => (
                <option key={id} value={id}>
                  Exercício {classicExerciseDisplayNumber(id)} —{' '}
                  {CLASSIC_SELECT_SHORT_LABEL_BY_ID[id]}
                </option>
              ))}
            </select>
          </div>

          <p className="app-instructions">{instructionsTitle}</p>

          <span className="app-counter" aria-live="polite">
            Série de verificação: {Math.min(streak, VERIFICATION_TARGET)} /{' '}
            {VERIFICATION_TARGET}
          </span>

          {exerciseComplete ? (
            <p className="app-success app-muted">
              Percurso clássico concluído — série de verificação completa nos{' '}
              {CLASSIC_EXERCISE_COUNT} exercícios.
            </p>
          ) : null}

          <div className="app-audio-actions">
            <button
              type="button"
              className="app-audio-replay"
              onClick={() => void playRoundAudio()}
              disabled={classicDisabled}
              aria-label={replayAriaLabel}
            >
              Reproduzir áudio
            </button>
          </div>

          {playAudioHint ? (
            <p className="app-autoplay-hint app-muted" role="status">
              Não foi possível reproduzir. Confira os ficheiros em{' '}
              <code className="app-code-inline">public/assets/audios/</code>.
            </p>
          ) : null}

          {orderedRevealHintText ? (
            <p
              className="app-ordered-reveal-hint"
              role="status"
              aria-live="polite"
            >
              Ordem correta: {orderedRevealHintText}
            </p>
          ) : null}

          <PianoKeyboard
            whiteFeedback={whiteFeedback}
            whiteRevealOrder={orderedRevealSteps ?? {}}
            blackRevealOrder={orderedRevealBlackSteps ?? {}}
            onWhitePress={handleWhitePress}
            onBlackPress={handleBlackPress}
            disabled={classicDisabled}
            allowedWhiteIndices={
              classicExerciseId === 42 ||
                classicExerciseId === 44
                ? CLASSIC_DIMINISHED1_WHITE_INDICES
                : classicExerciseId === 20 ||
                  classicExerciseId === 21 ||
                  classicExerciseId === 22 ||
                  classicExerciseId === 23 ||
                  classicExerciseId === 24 ||
                  classicExerciseId === 25 ||
                  classicExerciseId === 26 ||
                  classicExerciseId === 27 ||
                  classicExerciseId === 28 ||
                  classicExerciseId === 29 ||
                  classicExerciseId === 30 ||
                  classicExerciseId === 31 ||
                  classicExerciseId === 32 ||
                  classicExerciseId === 33 ||
                  classicExerciseId === 34 ||
                  classicExerciseId === 35 ||
                  classicExerciseId === 36 ||
                  classicExerciseId === 37 ||
                  classicExerciseId === 38 ||
                  classicExerciseId === 39 ||
                  classicExerciseId === 40 ||
                  classicExerciseId === 41 ||
                  classicExerciseId === 43
                  ? CLASSIC_CDEFGAB_WHITE_INDICES
                  : classicExerciseId === 16 ||
                    classicExerciseId === 17 ||
                    classicExerciseId === 18 ||
                    classicExerciseId === 19
                    ? CLASSIC_CDEFGA_WHITE_INDICES
                    : classicExerciseId === 12 ||
                      classicExerciseId === 13 ||
                      classicExerciseId === 14 ||
                      classicExerciseId === 15
                      ? CLASSIC_CDEFG_WHITE_INDICES
                      : classicExerciseId === 8 ||
                        classicExerciseId === 9 ||
                        classicExerciseId === 10 ||
                        classicExerciseId === 11
                        ? CLASSIC_CDEF_WHITE_INDICES
                        : classicExerciseId === 4 ||
                          classicExerciseId === 5 ||
                          classicExerciseId === 6 ||
                          classicExerciseId === 7
                          ? CLASSIC_CDE_WHITE_INDICES
                          : CLASSIC_CD_WHITE_INDICES
            }
            allowedBlackIndices={
              classicExerciseId === 40 || classicExerciseId === 43
                ? CLASSIC_EX40_EX41_ALLOWED_BLACK_INDICES
                : classicExerciseId === 41 || classicExerciseId === 42
                  ? CLASSIC_EX24_EX25_ALLOWED_BLACK_INDICES
                  : classicExerciseId === 36 ||
                    classicExerciseId === 37 ||
                    classicExerciseId === 38 ||
                    classicExerciseId === 39
                    ? CLASSIC_EX36_EX37_ALLOWED_BLACK_INDICES
                    : classicExerciseId === 32 ||
                      classicExerciseId === 33 ||
                      classicExerciseId === 34 ||
                      classicExerciseId === 35
                      ? CLASSIC_EX32_ALLOWED_BLACK_INDICES
                      : classicExerciseId === 28 ||
                        classicExerciseId === 29 ||
                        classicExerciseId === 30 ||
                        classicExerciseId === 31
                        ? CLASSIC_EX28_ALLOWED_BLACK_INDICES
                        : classicExerciseId === 24 ||
                          classicExerciseId === 25 ||
                          classicExerciseId === 26 ||
                          classicExerciseId === 27 ||
                          classicExerciseId === 44
                          ? CLASSIC_EX24_EX25_ALLOWED_BLACK_INDICES
                          : null
            }
            blackFeedback={blackFeedback}
            disableBlackKeys={
              classicExerciseId !== 24 &&
              classicExerciseId !== 25 &&
              classicExerciseId !== 26 &&
              classicExerciseId !== 27 &&
              classicExerciseId !== 28 &&
              classicExerciseId !== 29 &&
              classicExerciseId !== 30 &&
              classicExerciseId !== 31 &&
              classicExerciseId !== 32 &&
              classicExerciseId !== 33 &&
              classicExerciseId !== 34 &&
              classicExerciseId !== 35 &&
              classicExerciseId !== 36 &&
              classicExerciseId !== 37 &&
              classicExerciseId !== 38 &&
              classicExerciseId !== 39 &&
              classicExerciseId !== 40 &&
              classicExerciseId !== 41 &&
              classicExerciseId !== 42 &&
              classicExerciseId !== 43 &&
              classicExerciseId !== 44
            }
          />

          {showCorrectNotice ? (
            <div
              className="app-toast app-toast--success"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              Acertou!
            </div>
          ) : null}
        </>
      ) : (
        <p className="app-instructions app-muted">
          Modo alternativo — disponível em breve.
        </p>
      )}
    </div>
  )
}