import { PROPERTY_TYPES, fmt } from '../game/constants'

export default function PropertyModal({ tile, property, cityId, cash, onBuy, onUpgrade, onClose }) {
  if (!tile) return null

  const isEmpty = tile.type === 'empty'
  const isOwned = !!property

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="bg-navy-800 border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-sm mx-0 sm:mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-white text-lg">
            {isOwned ? `${PROPERT_TYPES[property.type]?.name} (Lev. ${property.level})` : 'Empty Lot'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">â</button>
        </div>

        <div className="px-5 py-4">
          {/* Empty lot â show buy options */}
          {isEmpty && (
            <>
              <p className="text-gray-400 text-sm mb-4">Choose a building to construct here.</p>
              <div className="space-y-2">
                {Object.entries(PROPERTY_TYPES).filter(([k]) => k !== 'hq').map(([typeId, def]) => {
                  const canAfford = cash >= def.baseCost
                  const firstLevel = def.levels[0]
                  return (
                    <button
                      key={typeId}
                      disabled={!canAfford}
                      onClick={() => onBuy(cityId, tile.idx, typeId)}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        canAfford
                          ? 'border-white/15 bg-white/5 hover:bg-amber-400/10 hover:border-amber-400/40'
                          : 'border-white/5 bg-white/2 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-sm">{def.name}</span>
                        <span className={`text-sm font-bold ${canAfford ? 'text-amber-400' : 'text-gray-500'}`}>
                          {fmt(def.baseCost)}
                        </span>
                      </div>
                      <div className="mt-1 flex gap-3 text-xs text-gray-400">
                        {firstLevel?.revenue > 0 && <span>+{fmt(firstLevel.revenue)}/mo</span>}
                        {firstLevel?.costReduction > 0 && <span>-{Math.round(firstLevel.costReduction * 100)}% costs</span>}
                        {def.description && <span>{def.description}</span>}
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {/* Owned property â show upgrade info */}
          {isOwned && (() => {
            const def = PROPERTY_TYPES[property.type]
            const currLevel = def.levels[property.level - 1]
            const nextLevel = def.levels[property.level]
            const canUpgrade = nextLevel && cash >= nextLevel.cost

            return (
              <>
                <div className="bg-white/5 rounded-xl p-3 mb-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Current (Level {property.level})</div>
                  <div className="flex gap-4 text-sm">
                    {currLevel?.revenue > 0 && (
                      <div className="text-green-400">+{fmt(currLevel.revenue)}/mo</div>
                    )}
                    {currLevel?.costReduction > 0 && (
                      <div className="text-blue-400">-{Math.round(currLevel.costReduction * 100)}% costs</div>
                    )}
                  </div>
                </div>

                {nextLevel ? (
                  <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-3 mb-4">
                    <div className="text-xs text-amber-400 uppercase tracking-wide mb-2">Upgrade â Level {property.level + 1}</div>
                    <div className="flex gap-4 text-sm mb-2">
                      {nextLevel.revenue > 0 && <div className="text-green-400">+{fmt(nextLevel.revenue)}/mo</div>}
                      {nextLevel.costReduction > 0 && <div className="text-blue-400">-{Math.round(nextLevel.costReduction * 100)}% costs</div>}
                    </div>
                    <div className="text-sm text-amber-400 font-bold">Cost: {fmt(nextLevel.cost)}</div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm text-center py-2 mb-4">Max level reached</div>
                )}

                {nextLevel && (
                  <button
                    disabled={!canUpgrade}
                    onClick={() => onUpgrade(cityId, property.id)}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                      canUpgrade
                        ? 'bg-amber-500 hover:bg-amber-400 text-navy-900'
                        : 'bg-white/10 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {canUpgrade ? `Upgrade for ${fmt(nextLevel.cost)}` : `Need ${fmt(nextLevel.cost - cash)} more`}
                  </button>
                )}
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
