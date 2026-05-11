import { BLACK_KEYS, WHITE_COUNT, WHITE_KEYS } from '../pianoKeys'

function stopEvent(e) {
  e.preventDefault()
  e.stopPropagation()
}

/**
 * @param {Record<number, 'correct' | 'reveal'>} [whiteFeedback]
 * @param {Record<number, number>} [whiteRevealOrder] Índice da branca → ordem (1, 2…) na revelação de erro
 * @param {(index: number, label: string) => void} [onWhitePress]
 * @param {(blackKeyIndex: number) => void} [onBlackPress]
 * @param {boolean} [disabled]
 * @param {ReadonlySet<number> | null} [allowedWhiteIndices] Se definido, só esses índices de branca são clicáveis
 * @param {ReadonlySet<number> | null} [allowedBlackIndices] Se definido, só esses índices em BLACK_KEYS são clicáveis
 * @param {boolean} [disableBlackKeys] Se true, todas as pretas ficam desactivadas (ignora allowedBlackIndices)
 */
export function PianoKeyboard({
  whiteFeedback = {},
  whiteRevealOrder = {},
  onWhitePress,
  onBlackPress,
  disabled = false,
  allowedWhiteIndices = null,
  allowedBlackIndices = null,
  disableBlackKeys = false,
}) {
  const n = WHITE_COUNT

  const whiteClickable = (i) =>
    allowedWhiteIndices == null || allowedWhiteIndices.has(i)

  const blackClickable = (i) => {
    if (disabled || disableBlackKeys) return false
    if (allowedBlackIndices == null) return true
    return allowedBlackIndices.has(i)
  }

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

            const keyDisabled = disabled || !whiteClickable(i)

            return (
              <button
                key={`w-${i}-${k.audioFile}`}
                type="button"
                className={cls.join(' ')}
                aria-label={ariaNote}
                disabled={keyDisabled}
                onPointerDown={(e) => {
                  stopEvent(e)
                  if (keyDisabled) return
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
              const clickable = blackClickable(i)
              const blackDisabled = disabled || !clickable
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
                  disabled={blackDisabled}
                  onPointerDown={(e) => {
                    stopEvent(e)
                    if (!clickable) return
                    onBlackPress?.(i)
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
