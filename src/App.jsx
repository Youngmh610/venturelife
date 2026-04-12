import { useReducer, useState } from 'react'
import TitleScreen from './screens/TitleScreen'
import SetupScreen from './screens/SetupScreen'
import GameScreen from './screens/GameScreen'
import { gameReducer, createInitialState } from './game/gameReducer'

// Lazy init: start with null â will be set by RESET action
function rootReducer(state, action) {
  if (action.type === 'RESET') return action.payload
  if (!state) return state
  return gameReducer(state, action)
}

export default function App() {
  const [screen, setScreen] = useState('title')
  const [gameState, dispatch] = useReducer(rootReducer, null)

  function handleLaunch(config) {
    const initialState = createInitialState(config)
    dispatch({ type: 'RESET', payload: initialState })
    setScreen('game')
  }

  return (
    <>
      {screen === 'title' && <TitleScreen onStart={() => setScreen('setup')} />}
      {screen === 'setup' && <SetupScreen onLaunch={handleLaunch} />}
      {screen === 'game' && gameState && (
        <GameScreen state={gameState} dispatch={dispatch} />
      )}
    </>
  )
}
