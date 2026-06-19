import { useState } from 'react'

import './App.css'

import { useClassicGame } from './classic/useClassicGame.js'
import { ClassicModeView } from './components/ClassicModeView.jsx'
import { GameModeTabs } from './components/GameModeTabs.jsx'

export default function App() {
  const [gameMode, setGameMode] = useState('classic')
  const classic = useClassicGame(gameMode)

  return (
    <div className="app-screen">
      <h1 className="app-title">Ouvido Absoluto</h1>

      <GameModeTabs gameMode={gameMode} onModeChange={setGameMode} />

      {gameMode === 'classic' ? (
        <ClassicModeView
          classicExerciseId={classic.classicExerciseId}
          streak={classic.streak}
          exerciseComplete={classic.exerciseComplete}
          instructionsTitle={classic.instructionsTitle}
          playAudioHint={classic.playAudioHint}
          orderedRevealHintText={classic.orderedRevealHintText}
          replayAriaLabel={classic.replayAriaLabel}
          classicDisabled={classic.classicDisabled}
          whiteFeedback={classic.whiteFeedback}
          blackFeedback={classic.blackFeedback}
          orderedRevealSteps={classic.orderedRevealSteps}
          orderedRevealBlackSteps={classic.orderedRevealBlackSteps}
          showCorrectNotice={classic.showCorrectNotice}
          allowedWhiteIndices={classic.allowedWhiteIndices}
          allowedBlackIndices={classic.allowedBlackIndices}
          disableBlackKeys={classic.disableBlackKeys}
          onExerciseChange={classic.handleClassicExerciseSelectChange}
          onPlayAudio={classic.playRoundAudio}
          onWhitePress={classic.handleWhitePress}
          onBlackPress={classic.handleBlackPress}
        />
      ) : (
        <p className="app-instructions app-muted">
          Modo alternativo — disponível em breve.
        </p>
      )}
    </div>
  )
}
