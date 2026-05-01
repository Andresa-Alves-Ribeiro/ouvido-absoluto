/**
 * 15 brancas: duas vezes C–B + C final. Áudio: public/assets/audios/{Nota} maior.mp3
 * (várias teclas podem usar o mesmo ficheiro; edite `audioFile` por tecla se tiver um ficheiro por oitava).
 */
const whiteSequence = [
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
  'C',
]

export const WHITE_KEYS = whiteSequence.map((label) => ({
  label,
  audioFile: `${label} maior.mp3`,
}))

/**
 * 10 pretas; afterWhite = índice da branca à esquerda (0 = dó grave).
 * Os ficheiros usam «sharp» em vez de '#' no disco ( '#' quebra pedidos HTTP/`Audio` na prática neste projeto).
 *
 * Um passo inicial: node scripts/rename-audio-hash.mjs
 */
export const BLACK_KEYS = [
  { afterWhite: 0, sharp: 'C#', flat: 'Db', audioFile: 'p1-Csharp-Db.mp3' },
  { afterWhite: 1, sharp: 'D#', flat: 'Eb', audioFile: 'p2-Dsharp-Eb.mp3' },
  { afterWhite: 3, sharp: 'F#', flat: 'Gb', audioFile: 'p3-Fsharp-Gb.mp3' },
  { afterWhite: 4, sharp: 'G#', flat: 'Ab', audioFile: 'p4-Gsharp-Ab.mp3' },
  { afterWhite: 5, sharp: 'A#', flat: 'Bb', audioFile: 'p5-Asharp-Bb.mp3' },
  { afterWhite: 7, sharp: 'C#', flat: 'Db', audioFile: 'p6-Csharp-Db.mp3' },
  { afterWhite: 8, sharp: 'D#', flat: 'Eb', audioFile: 'p7-Dsharp-Eb.mp3' },
  { afterWhite: 10, sharp: 'F#', flat: 'Gb', audioFile: 'p8-Fsharp-Gb.mp3' },
  { afterWhite: 11, sharp: 'G#', flat: 'Ab', audioFile: 'p9-Gsharp-Ab.mp3' },
  { afterWhite: 12, sharp: 'A#', flat: 'Bb', audioFile: 'p10-Asharp-Bb.mp3' },
]

export const WHITE_COUNT = WHITE_KEYS.length
