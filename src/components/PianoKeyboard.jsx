import { BLACK_KEYS, WHITE_COUNT, WHITE_KEYS } from '../pianoKeys'

function stopEvent(e) {
  e.preventDefault()
  e.stopPropagation()
}

/**
 * @param {Record<number, 'correct' | 'reveal'>} [whiteFeedback]
 * @param {Record<number, number>} [whiteRevealOrder] Índice da branca → ordem (1, 2…) na revelação de erro
 * @param {(index: number, label: string) => void} [onWhitePress]
 * @param {() => void} [onBlackPress]
 * @param {boolean} [disabled]
 */
export function PianoKeyboard({
  whiteFeedback = {},
  whiteRevealOrder = {},
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
            const orderStep = whiteRevealOrder[i]
            const cls = ['piano-white']
            if (fb === 'correct') cls.push('is-feedback-correct')
            if (fb === 'reveal') cls.push('is-feedback-reveal')

            const ariaNote =
              orderStep != null && fb === 'reveal'
                ? `Nota ${k.label}, ${orderStep}.ª da sequência correta, uma oitava (dó–si)`
                : `Nota ${k.label}, uma oitava (dó–si)`

            return (
              <button
                key={`w-${i}-${k.audioFile}`}
                type="button"
                className={cls.join(' ')}
                aria-label={ariaNote}
                disabled={disabled}
                onPointerDown={(e) => {
                  stopEvent(e)
                  if (disabled) return
                  onWhitePress?.(i, k.label)
                }}
              >
                {orderStep != null && fb === 'reveal' ? (
                  <span className="piano-white-order" aria-hidden="true">
                    {orderStep}
                  </span>
                ) : null}
                <span className="piano-white-label">{k.label}</span>
              </button>
            )
          })}
          <div className="piano-blacks" role="presentation">
            {BLACK_KEYS.map((k, i) => {
              /* Centro na junção entre duas brancas; ~47% da largura de cada branca (≈ proporcao real ~11∶23 mm). */
              const leftPct = ((k.afterWhite + 1) / n) * 100
              const widthPct = (100 / n) * 0.47
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
