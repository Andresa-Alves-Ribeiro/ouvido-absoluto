import { useNoteAudio } from '../useNoteAudio'
import { BLACK_KEYS, WHITE_COUNT, WHITE_KEYS } from '../pianoKeys'

function activateBlack(play, audioFile, e) {
  e.preventDefault()
  e.stopPropagation()
  play(audioFile)
}

export function PianoKeyboard() {
  const play = useNoteAudio()

  const n = WHITE_COUNT

  return (
    <div className="piano-board" aria-label="Teclado base clicável">
      <div className="piano-keys-area">
        <div className="piano-whites" role="group">
          {WHITE_KEYS.map((k, i) => (
            <button
              key={`w-${i}-${k.audioFile}`}
              type="button"
              className="piano-white"
              aria-label={`Nota ${k.label}, oitava ${i < 7 ? 4 : i < 14 ? 5 : 6}`}
              onPointerDown={(e) => {
                e.preventDefault()
                play(k.audioFile)
              }}
            >
              <span className="piano-white-label">{k.label}</span>
            </button>
          ))}
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
                  onPointerDown={(e) => activateBlack(play, k.audioFile, e)}
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
