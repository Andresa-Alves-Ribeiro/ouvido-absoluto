import { PianoKeyboard } from './PianoKeyboard.jsx'
import {
  CLASSIC_EXERCISE_COUNT,
  CLASSIC_EXERCISE_IDS_IN_ORDER,
  CLASSIC_SELECT_SHORT_LABEL_BY_ID,
  VERIFICATION_TARGET,
  classicExerciseDisplayNumber,
} from '../classic/classicExerciseConfig.js'

export function ClassicModeView({
  classicExerciseId,
  streak,
  exerciseComplete,
  instructionsTitle,
  playAudioHint,
  orderedRevealHintText,
  replayAriaLabel,
  classicDisabled,
  whiteFeedback,
  blackFeedback,
  orderedRevealSteps,
  orderedRevealBlackSteps,
  showCorrectNotice,
  allowedWhiteIndices,
  allowedBlackIndices,
  disableBlackKeys,
  onExerciseChange,
  onPlayAudio,
  onWhitePress,
  onBlackPress,
}) {
  return (
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
          onChange={onExerciseChange}
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
          onClick={() => void onPlayAudio()}
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
        onWhitePress={onWhitePress}
        onBlackPress={onBlackPress}
        disabled={classicDisabled}
        allowedWhiteIndices={allowedWhiteIndices}
        allowedBlackIndices={allowedBlackIndices}
        blackFeedback={blackFeedback}
        disableBlackKeys={disableBlackKeys}
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
  )
}
