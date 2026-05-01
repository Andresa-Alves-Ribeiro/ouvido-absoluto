import './App.css'
import { PianoKeyboard } from './components/PianoKeyboard.jsx'

function App() {
  return (
    <div className="app-screen">
      <h1 className="app-title">Ouvido Absoluto</h1>
      <p className="app-instructions">
        uma breve explicação do que deve ser feito
      </p>
      <span className="app-counter" aria-live="polite">
        Contador de série de verificação
      </span>
      <p className="app-keyboard-hint app-muted">(Teclado base clicável)</p>
      <PianoKeyboard />
    </div>
  )
}

export default App
