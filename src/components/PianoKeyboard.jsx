import { BLACK_KEYS, WHITE_COUNT, WHITE_KEYS } from '../pianoKeys'

function stopEvent(e) {
  e.preventDefault()
  e.stopPropagation()
}

/**
 * @param {Record<number, 'correct' | 'reveal'>} [whiteFeedback]
 * @param {(index: number, label: string) => void} [onWhitePress]
 * @param {() => void} [onBlackPress]
 * @param {boolean} [disabled]
 */
export function PianoKeyboard({
  whiteFeedback = {},
  onWhitePress,
  onBlackPress,
  disabled = false,
}) {
  const n = WHITE_COUNT

  return (
    <div className="piano-board" aria-label="Teclado base clicável">
      <div className="piano-keys-area">
        <div className="piano-whites" role="group">
          {WHITE_KEYS.map((k, i) => {
            const fb = whiteFeedback[i]
            const cls = ['piano-white']
            if (fb === 'correct') cls.push('is-feedback-correct')
            if (fb === 'reveal') cls.push('is-feedback-reveal')

            return (
              <button
                key={`w-${i}-${k.audioFile}`}
                type="button"
                className={cls.join(' ')}
                aria-label={`Nota ${k.label}, oitava ${i < 7 ? 4 : i < 14 ? 5 : 6}`}
                disabled={disabled}
                onPointerDown={(e) => {
                  stopEvent(e)
                  if (disabled) return
                  onWhitePress?.(i, k.label)
                }}
              >
                <span className="piano-white-label">{k.label}</span>
              </button>
            )
          })}
          <div className="piano-blacks" role="presentation">
            {BLACK_KEYS.map((k, i) => {
              const leftPct = ((k.afterWhite + 1) / n) * 100
              const widthPct = (100 / n) * 0.58
              return (
                <button
                  key={`b-${i}-${k.afterWhite}`}
                  type="button"
                  className="piano-black"
                  style={{
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    transform: 'translateX(-50%)',
                  }}
                  aria-label={`${k.sharp} ou ${k.flat}`}
                  disabled={disabled}
                  onPointerDown={(e) => {
                    stopEvent(e)
                    if (disabled) return
                    onBlackPress?.()
                  }}
                >
                  <span className="piano-black-label">
                    <span>{k.sharp}</span>
                    <span className="piano-black-slash">/</span>
                    <span>{k.flat}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
