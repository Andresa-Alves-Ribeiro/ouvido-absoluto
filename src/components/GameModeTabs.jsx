export function GameModeTabs({ gameMode, onModeChange }) {
  return (
    <div className="app-mode-tabs" role="tablist" aria-label="Modo de jogo">
      <button
        type="button"
        role="tab"
        aria-selected={gameMode === 'classic'}
        className={`app-mode-tab ${gameMode === 'classic' ? 'is-active' : ''}`}
        onClick={() => onModeChange('classic')}
      >
        Modo clássico
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={gameMode === 'alternative'}
        className={`app-mode-tab ${gameMode === 'alternative' ? 'is-active' : ''}`}
        onClick={() => onModeChange('alternative')}
      >
        Modo alternativo
      </button>
    </div>
  )
}
