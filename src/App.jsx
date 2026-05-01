import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import './App.css'

import {
  exercise1PickAudioFile,
  exercise1PickTarget,
  exercise2PickRound,
} from './classicExercises.js'
import { PianoKeyboard } from './components/PianoKeyboard.jsx'
import { WHITE_KEYS } from './pianoKeys.js'
import { useNoteAudio } from './useNoteAudio.js'

const VERIFICATION_TARGET = 20

const BETWEEN_NOTES_MS = 1000

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

  const [showCorrectNotice, setShowCorrectNotice] = useState(false)

  const roundRef = useRef({
    kind: 'one',
    target: 'C',
    audioFile: 'b1-C.mp3',
  })

  const frozenRef = useRef(false)
  const exerciseCompleteRef = useRef(false)
  const gameModeRef = useRef(gameMode)
  const prevModeRef = useRef(gameMode)
  const classicExerciseIdRef = useRef(1)
  const answerPhaseRef = useRef(0)
  /** Índice da primeira tecla certa no Ex. 2 ou 3 (primeira nota da ordem MA ou MD). */
  const exercise2FirstCorrectIndexRef = useRef(null)

  const [playAudioHint, setPlayAudioHint] = useState(false)
  const [showClassicExplanation, setShowClassicExplanation] = useState(false)

  useLayoutEffect(() => {
    exerciseCompleteRef.current = exerciseComplete
  }, [exerciseComplete])

  useLayoutEffect(() => {
    gameModeRef.current = gameMode
  }, [gameMode])

  useLayoutEffect(() => {
    classicExerciseIdRef.current = classicExerciseId
  }, [classicExerciseId])

  /** Escolhe nota(s) e ficheiro(s); não reproduz som. */
  const pickNewRound = useCallback(() => {
    answerPhaseRef.current = 0
    exercise2FirstCorrectIndexRef.current = null
    if (classicExerciseIdRef.current === 1) {
      const target = exercise1PickTarget()
      const audioFile = exercise1PickAudioFile(target)
      roundRef.current = { kind: 'one', target, audioFile }
      return
    }
    const r = exercise2PickRound()
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
      setStreak(0)
      setExerciseComplete(false)
      setWhiteFeedback({})
      setShowCorrectNotice(false)
      setShowClassicExplanation(false)
      frozenRef.current = false
      answerPhaseRef.current = 0
      exercise2FirstCorrectIndexRef.current = null
    }

    if (was === 'classic' && gameMode !== 'classic') {
      setShowClassicExplanation(false)
    }
    if (gameMode === 'alternative') {
      frozenRef.current = false
    }
  }, [gameMode])

  /** Nova rodada sem áudio automático: só escolhe alvo ao entrar no modo ou após resposta. */
  useEffect(() => {
    if (gameMode !== 'classic') return
    if (exerciseComplete) return
    pickNewRound()
  }, [gameMode, exerciseComplete, pickNewRound])

  const handleWrongAnswer = useCallback(() => {
    setStreak(0)
    answerPhaseRef.current = 0
    exercise2FirstCorrectIndexRef.current = null
    const round = roundRef.current
    const reveal = {}

    if (round.kind === 'twoMa' || round.kind === 'twoMd') {
      const lowLabel = WHITE_KEYS[round.lowIndex].label
      const highLabel = WHITE_KEYS[round.highIndex].label
      WHITE_KEYS.forEach((k, i) => {
        if (k.label === lowLabel || k.label === highLabel) reveal[i] = 'reveal'
      })
    } else {
      const { target } = round
      WHITE_KEYS.forEach((k, i) => {
        if (k.label === target) reveal[i] = 'reveal'
      })
    }

    setWhiteFeedback(reveal)

    window.setTimeout(() => {
      frozenRef.current = false
      setWhiteFeedback({})

      if (
        !exerciseCompleteRef.current &&
        gameModeRef.current === 'classic'
      ) {
        pickNewRound()
      }
    }, 1600)
  }, [pickNewRound])

  const handleClassicExerciseSelectChange = useCallback(
    (e) => {
      const raw = Number(e.target.value)
      const id = raw === 3 ? 3 : raw === 2 ? 2 : 1

      classicExerciseIdRef.current = id
      setClassicExerciseId(id)
      setStreak(0)
      setWhiteFeedback({})
      setShowCorrectNotice(false)
      frozenRef.current = false
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
                setStreak(0)
                frozenRef.current = false
                setShowCorrectNotice(false)
                setWhiteFeedback({})
                answerPhaseRef.current = 0
                exercise2FirstCorrectIndexRef.current = null
                pickNewRound()
              }, 650)
              return next
            }

            window.setTimeout(() => {
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
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
              setStreak(0)
              frozenRef.current = false
              setShowCorrectNotice(false)
              setWhiteFeedback({})
              answerPhaseRef.current = 0
              exercise2FirstCorrectIndexRef.current = null
              pickNewRound()
            }, 650)
            return next
          }

          setExerciseComplete(true)
          window.setTimeout(() => {
            frozenRef.current = false
            setShowCorrectNotice(false)
            setWhiteFeedback({})
          }, 650)
          return next
        }

        window.setTimeout(() => {
          frozenRef.current = false
          setShowCorrectNotice(false)
          setWhiteFeedback({})
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
        ? 'Exercício 2: Notas C e D - 2 notas - MA'
        : 'Exercício 3: Notas C e D - 2 notas - MD'

  const replayAriaLabel =
    classicExerciseId === 1
      ? 'Reproduzir o áudio da nota desta rodada'
      : classicExerciseId === 2
        ? 'Reproduzir as duas notas desta rodada na ordem grave a agudo'
        : 'Reproduzir as duas notas desta rodada na ordem agudo a grave'

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
            </select>
          </div>

          <p className="app-instructions">{instructionsTitle}</p>

          <button
            type="button"
            className="app-explanation-toggle"
            aria-expanded={showClassicExplanation}
            onClick={() => setShowClassicExplanation((v) => !v)}
          >
            {showClassicExplanation ? 'Ocultar explicação' : 'Ver explicação'}
          </button>

          {showClassicExplanation ? (
            classicExerciseId === 1 ? (
              <p className="app-instructions app-muted">
                Use o botão «Reproduzir áudio» para ouvir a nota (dó ou ré).
                Depois clique na tecla branca certa — qualquer dó ou qualquer ré
                do teclado conta. Complete a série de verificação com 20
                acertos seguidos sem erros. Ao acertar, surge um toast «Acertou!»
                e a tecla fica verde; se errar, as teclas corretas aparecem a
                vermelho e a série volta a zero.
              </p>
            ) : classicExerciseId === 2 ? (
              <p className="app-instructions app-muted">
                Vai ouvir duas notas seguidas: sempre um dó e um ré em posições
                diferentes neste teclado. A reprodução segue o{' '}
                <strong>melódico ascendente (MA)</strong>: primeiro soa a nota
                mais grave — a da esquerda, com número de ordem menor no
                teclado — e depois a mais aguda — número maior à direita.
                Responda <strong>nessa mesma ordem</strong> (grave e depois
                agudo): primeiro qualquer tecla branca com o nome da primeira
                nota (qualquer dó conta como dó, qualquer ré como ré), depois
                qualquer tecla com o nome da segunda nota. Qualquer erro reinicia
                a série a zero e todas as teclas válidas para cada nota aparecem
                realçadas; o objetivo são 20 acertos seguidos para passar ao
                exercício 3.
              </p>
            ) : (
              <p className="app-instructions app-muted">
                Ouve de novo um dó e um ré em teclas distintas. Desta vez a
                reprodução segue o{' '}
                <strong>melódico descendente (MD)</strong>: primeiro soa a nota
                mais aguda — à direita no teclado, com número de ordem maior — e
                depois a mais grave — à esquerda, número menor. A sequência pode
                ser dó–ré ou ré–dó no som; o importante é repetir{' '}
                <strong>nessa ordem descendente</strong> nos cliques (primeiro o
                nome da nota que soou primeiro, depois o da segunda). As mesmas
                regras do exercício 2 aplicam-se: qualquer dó ou ré conta para o
                nome certo, um erro zera a série e realça todas as teclas válidas
                para cada nota. Complete 20 acertos seguidos para concluir o
                percurso clássico.
              </p>
            )
          ) : null}

          <span className="app-counter" aria-live="polite">
            Série de verificação: {Math.min(streak, VERIFICATION_TARGET)} /{' '}
            {VERIFICATION_TARGET}
          </span>

          {exerciseComplete ? (
            <p className="app-success app-muted">
              Percurso clássico concluído — série de verificação completa nos
              três exercícios.
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

          <PianoKeyboard
            whiteFeedback={whiteFeedback}
            onWhitePress={handleWhitePress}
            onBlackPress={handleBlackPress}
            disabled={classicDisabled}
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
