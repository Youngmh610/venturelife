import { CITIES, fmt } from '../game/constants'

export default function ExpansionScreen({ state, dispatch }) {
  const unlockedIds = new Set(Object.values(state.cities).filter(c => c.unlocked).map(c => c.id))

  function handleUnlock(city) {
    if (state.cash < city.unlockCost) return
    dispatch({ type: 'UNLOCK_CITY', cityId: city.id, cost: city.unlockCost })
    dispatch({ type: 'SET_ACTIVE_CITY', cityId: city.id })
  }

  function handleSelect(cityId) {
    dispatch({ type: 'SET_ACTIVE_CITY', cityId })
  }

  const TIER_LABELS = { 1: 'Local', 2: 'Regional', 3: 'National', 4: 'Global' }
  const TIER_COLORS = { 1: 'text-gray-400', 2: 'text-blue-400', 3: 'text-purple-400', 4: 'text-amber-400' }

  return (
    <div className="min-h-screen bg-navy-950 pb-24 px-4 pt-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white">Expansion</h2>
        <div className="text-right">
          <div className="text-amber-400 font-bold">{fmt(state.cash)}</div>
          <div className="text-xs text-gray-500">available</div>
        </div>
      </div>

      <div className="space-y-3">
        {CITIES.map(city => {
          const isUnlocked = unlockedIds.has(city.id)
          const isActive = state.activeCityId === city.id
          const canAfford = state.cash >= city.unlockCost
          const cityState = state.cities[city.id]
          const propCount = cityState?.properties?.length || 0

          return (
            <div
              key={city.id}
              className={`rounded-2xl border p-4 transition-all ${
                isActive
                  ? 'border-amber-400/50 bg-amber-400/5 shadow-amber-400/10 shadow-lg'
                  : isUnlocked
                  ? 'border-white/15 bg-white/5 hover:border-white/25'
                  : 'border-white/5 bg-white/2'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{city.name}</span>
                    {isActive && <span className="text-xs bg-amber-400/20 text-amber-400 px-1.5 py-0.5 rounded-full font-medium">Active</span>}
                  </div>
                  <div className="text-xs text-gray-400">{city.country}</div>
                </div>
                <div className={`text-xs font-semibold ${TIER_COLORS[city.tier]}`}>
                  {TIER_LABELS[city.tier]}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span>Grid: {city.grid}Ã{city.grid}</span>
                <span>Market Ã{city.marketMult.toFixed(1)}</span>
                {isUnlocked && <span className="text-gray-400">{propCount} buildings</span>}
              </div>

              {isUnlocked ? (
                <button
                  onClick={() => handleSelect(city.id)}
                  className={`w-full py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-400/20 text-amber-300 cursor-default'
                      : 'bg-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  {isActive ? 'ð Currently Viewing' : 'Switch to City'}
                </button>
              ) : (
                <button
                  disabled={!canAfford}
                  onClick={() => handleUnlock(city)}
                  className={`w-full py-2 rounded-xl text-sm font-semibold transition-all ${
                    canAfford
                      ? 'bg-amber-500 hover:bg-amber-400 text-navy-950 shadow-amber-500/20 shadow-md'
                      : 'bg-white/5 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? `Expand â ${fmt(city.unlockCost)}` : `Locked â need ${fmt(city.unlockCost)}`}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
