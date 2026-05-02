/**
 * Uma oitava: C–Si (brancas). Áudio opcional das brancas: public/assets/audios/{Nota} maior.mp3
 */
const whiteSequence = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

export const WHITE_KEYS = whiteSequence.map((label) => ({
  label,
  audioFile: `${label} maior.mp3`,
}))

/**
 * Pretas dentro da mesma oitava; afterWhite = índice da branca imediatamente à esquerda da preta (0 = dó).
 * Os ficheiros usam «sharp» em vez de '#' no disco.
 */
export const BLACK_KEYS = [
  { afterWhite: 0, sharp: 'C#', flat: 'Db', audioFile: 'p1-Csharp-Db.mp3' },
  { afterWhite: 1, sharp: 'D#', flat: 'Eb', audioFile: 'p2-Dsharp-Eb.mp3' },
  { afterWhite: 3, sharp: 'F#', flat: 'Gb', audioFile: 'p3-Fsharp-Gb.mp3' },
  { afterWhite: 4, sharp: 'G#', flat: 'Ab', audioFile: 'p4-Gsharp-Ab.mp3' },
  { afterWhite: 5, sharp: 'A#', flat: 'Bb', audioFile: 'p5-Asharp-Bb.mp3' },
]

export const WHITE_COUNT = WHITE_KEYS.length
