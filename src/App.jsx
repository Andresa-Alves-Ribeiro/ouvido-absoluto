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
  exercise2PickRound,
  pickClassicOneNoteRound,
} from './classicExercises.js'
import { PianoKeyboard } from './components/PianoKeyboard.jsx'
import { WHITE_KEYS } from './pianoKeys.js'
import { useNoteAudio } from './useNoteAudio.js'

const VERIFICATION_TARGET = 20

/** Índices das brancas C e D (ex. 1–3); no ex. 4 inclui-se E (índice 2). */
const CLASSIC_CD_WHITE_INDICES = new Set([0, 1])
const CLASSIC_CDE_WHITE_INDICES = new Set([0, 1, 2])

const BETWEEN_NOTES_MS = 1000

function rollVerificationHalf(halfRef) {
  halfRef.current = Math.random() < 0.5 ? 'low' : 'high'
}

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export default function App() {
  const play = useNoteAudio()

  const [gameMode, setGameMode] = useState('classic')
  const [classicExerciseId, setClassicExerciseId] = useState(1)

  const [streak, setStreak] = useState(0)
  const [exerciseComplete, setExerciseComplete] = useState(false)
  const [whiteFeedback, setWhiteFeedback] = useState({})
  /** Índice da branca → passo 1 ou 2 (só erros nos ex. 2 e 3). */
  const [orderedRevealSteps, setOrderedRevealSteps] = useState(null)

  const [showCorrectNotice, setShowCorrectNotice] = useState(false)

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
  /** Índice da primeira tecla certa no Ex. 2 ou 3 (primeira nota da ordem MA ou MD). */
  const exercise2FirstCorrectIndexRef = useRef(null)
  const streakRef = useRef(0)
  /** Com streak < 10 no Ex. 1 e 4: só b1–b7 (`low`) ou b8–b14 (`high`); renove-se a cada par de acertos e ao zerar a série. */
  const verificationHalfRef = useRef(null)

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
    answerPhaseRef.current = 0
    exercise2FirstCorrectIndexRef.current = null
    const streakNow = streakRef.current
    if (
      (classicExerciseIdRef.current === 1 ||
        classicExerciseIdRef.current === 4) &&
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
    const r = exercise2PickRound(ctx)
    const kind =
      classicExerciseIdRef.current === 2 ? 'twoMa' : 'twoMd'
    roundRef.current = {
      kind,
      lowIndex: r.lowIndex,
      highIndex: r.highIndex,
      audioFileLow: r.audioFileLow,
      audioFileHigh: r.audioFileHigh,
    }
  }, [])

  /** Reproduz o áudio da rodada atual (apenas ao clicar no botão). */
  const playRoundAudio = useCallback(async () => {
    if (wrongRevealAwaitingReplayRef.current) {
      wrongRevealAwaitingReplayRef.current = false
      frozenRef.current = false
      setWhiteFeedback({})
      setOrderedRevealSteps(null)
    }

    const round = roundRef.current
    if (round.kind === 'twoMa' || round.kind === 'twoMd') {
      const first =
        round.kind === 'twoMa' ? round.audioFileLow : round.audioFileHigh
      const second =
        round.kind === 'twoMa' ? round.audioFileHigh : round.audioFileLow
      let ok = await play(first, { immediate: true })
      if (!ok) ok = await play(first)
      await delay(BETWEEN_NOTES_MS)
      let ok2 = await play(second, { immediate: true })
      if (!ok2) ok2 = await play(second)
      const allOk = ok && ok2
      if (!allOk) setPlayAudioHint(true)
      else setPlayAudioHint(false)
      return allOk
    }

    let ok = await play(round.audioFile, { immediate: true })
    if (!ok) ok = await play(round.audioFile)
    if (!ok) setPlayAudioHint(true)
    else setPlayAudioHint(false)
    return ok
  }, [play])

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
      setOrderedRevealSteps(null)
      setShowCorrectNotice(false)
      frozenRef.current = false
      wrongRevealAwaitingReplayRef.current = false
      answerPhaseRef.current = 0
      exercise2FirstCorrectIndexRef.current = null
    }

    if (gameMode === 'alternative') {
      frozenRef.current = false
      wrongRevealAwaitingReplayRef.current = false
    }
  }, [gameMode])

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
    const round = roundRef.current
    const reveal = {}
    let steps = null

    if (round.kind === 'twoMa' || round.kind === 'twoMd') {
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
    } else {
      const { target } = round
      WHITE_KEYS.forEach((k, i) => {
        if (k.label === target) reveal[i] = 'reveal'
      })
    }

    wrongRevealAwaitingReplayRef.current = true
    setOrderedRevealSteps(steps)
    setWhiteFeedback(reveal)
  }, [])

  const handleClassicExerciseSelectChange = useCallback(
    (e) => {
      const raw = Number(e.target.value)
      const id = raw >= 1 && raw <= 4 ? raw : 1

      classicExerciseIdRef.current = id
      setClassicExerciseId(id)
      rollVerificationHalf(verificationHalfRef)
      setStreak(0)
      setWhiteFeedback({})
      setOrderedRevealSteps(null)
      setShowCorrectNotice(false)
      frozenRef.current = false
      wrongRevealAwaitingReplayRef.current = false
      answerPhaseRef.current = 0
      exercise2FirstCorrectIndexRef.current = null

      if (exerciseCompleteRef.current) {
        setExerciseComplete(false)
      } else {
        pickNewRound()
      }
    },
    [pickNewRound],
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

          setStreak((s) => {
            const next = s + 1

            if (
              next >= VERIFICATION_TARGET &&
              classicExerciseIdRef.current === 1
            ) {
              window.setTimeout(() => {
                classicExerciseIdRef.current = 2
                setClassicExerciseId(2)
                rollVerificationHalf(verificationHalfRef)
                setStreak(0)
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setOrderedRevealSteps(null)
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
              setExerciseComplete(true)
              window.setTimeout(() => {
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                setOrderedRevealSteps(null)
              }, 650)
              return next
            }

            window.setTimeout(() => {
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setOrderedRevealSteps(null)
              if (gameModeRef.current === 'classic') pickNewRound()
            }, 650)

            return next
          })
        } else {
          handleWrongAnswer()
        }

        return
      }

      /* Exercícios 2 (MA) e 3 (MD) — dois cliques na ordem do áudio */
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

      setStreak((s) => {
        const next = s + 1

        if (next >= VERIFICATION_TARGET) {
          if (classicExerciseIdRef.current === 2) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 3
              setClassicExerciseId(3)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setOrderedRevealSteps(null)
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          if (classicExerciseIdRef.current === 3) {
            window.setTimeout(() => {
              classicExerciseIdRef.current = 4
              setClassicExerciseId(4)
              rollVerificationHalf(verificationHalfRef)
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              setOrderedRevealSteps(null)
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
          setOrderedRevealSteps(null)
          answerPhaseRef.current = 0
          if (gameModeRef.current === 'classic') pickNewRound()
        }, 650)

        return next
      })
    },
    [gameMode, exerciseComplete, handleWrongAnswer, pickNewRound],
  )

  const handleBlackPress = useCallback(() => {
    if (gameMode !== 'classic' || exerciseComplete || frozenRef.current)
      return

    frozenRef.current = true
    handleWrongAnswer()
  }, [gameMode, exerciseComplete, handleWrongAnswer])

  const classicDisabled = exerciseComplete

  const instructionsTitle =
    classicExerciseId === 1
      ? 'Exercício 1: Notas C e D - 1 nota'
      : classicExerciseId === 2
        ? 'Exercício 2: Notas C e D - 2 notas — MA'
        : classicExerciseId === 3
          ? 'Exercício 3: Notas C e D - 2 notas — MD'
          : 'Exercício 4: Notas C, D e E - 1 nota'

  const replayAriaLabel =
    classicExerciseId === 1 || classicExerciseId === 4
      ? 'Reproduzir o áudio da nota desta rodada'
      : classicExerciseId === 2
        ? 'Reproduzir as duas notas desta rodada na ordem grave a agudo'
        : 'Reproduzir as duas notas desta rodada na ordem agudo a grave'

  const orderedRevealHintText =
    orderedRevealSteps == null
      ? ''
      : Object.entries(orderedRevealSteps)
          .sort((a, b) => a[1] - b[1])
          .map(([idx, step]) => `${step} — ${WHITE_KEYS[Number(idx)].label}`)
          .join(', ')

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
              <option value={1}>Exercício 1 — uma nota (C ou D)</option>
              <option value={2}>Exercício 2 — duas notas (MA)</option>
              <option value={3}>Exercício 3 — duas notas (MD)</option>
              <option value={4}>Exercício 4 — uma nota (C, D ou E)</option>
            </select>
          </div>

          <p className="app-instructions">{instructionsTitle}</p>

          <span className="app-counter" aria-live="polite">
            Série de verificação: {Math.min(streak, VERIFICATION_TARGET)} /{' '}
            {VERIFICATION_TARGET}
          </span>

          {exerciseComplete ? (
            <p className="app-success app-muted">
              Percurso clássico concluído — série de verificação completa nos
              quatro exercícios.
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

          {orderedRevealSteps ? (
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
            onWhitePress={handleWhitePress}
            onBlackPress={handleBlackPress}
            disabled={classicDisabled}
            allowedWhiteIndices={
              classicExerciseId === 4
                ? CLASSIC_CDE_WHITE_INDICES
                : CLASSIC_CD_WHITE_INDICES
            }
            disableBlackKeys
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
