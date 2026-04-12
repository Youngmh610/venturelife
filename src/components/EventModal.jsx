import { useState } from 'react'
import { fmt } from '../game/constants'

export default function EventModal({ event, onChoice }) {
  const [chosen, setChosen] = useState(null)
  const [result, setResult] = useState(null)

  if (!event) return null

  function handleChoice(choice) {
    setChosen(choice.id)
    // Resolve chance-based outcomes
    let resolved = choice
    if (choice.outcomes) {
      const roll = Math.random()
      let cumulative = 0
      for (const outcome of choice.outcomes) {
        cumulative += outcome.chance
        if (roll < cumulative) {
          resolved = outcome
          break
        }
      }
    }
    setResult(resolved)
    // Apply after a short delay
    setTimeout(() => {
      onChoice(resolved.effects || {}, resolved.text || choice.text)
    }, 1800)
  }

  const CATEGORY_COLORS = {
    Finance:     'from-blue-900 to-blue-800',
    Media:       'from-purple-900 to-purple-800',
    Talent:      'from-green-900 to-green-800',
    Legal:       'from-red-900 to-red-800',
    Competition: 'from-orange-900 to-orange-800',
    Economy:     'from-gray-900 to-gray-800',
    Personal:    'from-pink-900 to-pink-800',
  }

  const grad = CATEGORY_COLORS[event.category] || 'from-navy-900 to-navy-800'

  function effectSummary(effects) {
    if (!effects) return null
    const parts = []
    if (effects.cash)      parts.push(`${effects.cash > 0 ? '+' : ''}${fmt(effects.cash)} cash`)
    if (effects.revenue)   parts.push(`${effects.revenue > 0 ? '+' : ''}${Math.round(effects.revenue * 100)}% revenue`)
    if (effects.brand)     parts.push(`${effects.brand > 0 ? '+' : ''}${effects.brand} brand`)
    if (effects.morale)    parts.push(`${effects.morale > 0 ? '+' : ''}${effects.morale} morale`)
    if (effects.prestige)  parts.push(`${effects.prestige > 0 ? '+' : ''}${effects.prestige} prestige`)
    if (effects.equity)    parts.push(`${effects.equity > 0 ? '+' : ''}${effects.equity}% equity`)
    if (effects.debt)      parts.push(`+${fmt(effects.debt)} debt`)
    if (effects.employees) parts.push(`${effects.employees > 0 ? '+' : ''}${effects.employees} employees`)
    return parts
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className={`bg-gradient-to-b ${grad} border border-white/10 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden`}>
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
              {event.category}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">{event.title}</h2>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <p className="text-gray-300 text-sm leading-relaxed mb-6">{event.description}</p>

          {/* Result display */}
          {result && (
            <div className="mb-4 p-3 bg-white/10 rounded-xl border border-white/20 animate-slide-up">
              <p className="text-white text-sm font-medium mb-2">{result.text}</p>
              <div className="flex flex-wrap gap-1.5">
                {effectSummary(result.effects)?.map((e, i) => (
                  <span key={i} className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    e.startsWith('+') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>{e}</span>
                ))}
              </div>
            </div>
          )}

          {/* Choices */}
          {!result && (
            <div className="space-y-2">
              {event.choices.map(choice => {
                const hints = choice.outcomes
                  ? choice.outcomes.map(o => o.text).join(' / ')
                  : null
                const efx = effectSummary(choice.effects)
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice)}
                    disabled={!!chosen}
                    className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 transition-all disabled:opacity-50 group"
                  >
                    <div className="font-medium text-white text-sm group-hover:text-amber-300 transition-colors">
                      {choice.text}
                    </div>
                    {efx && efx.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {efx.map((e, i) => (
                          <span key={i} className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                            e.startsWith('+') ? 'text-green-400' : 'text-red-400'
                          }`}>{e}</span>
                        ))}
                      </div>
                    )}
                    {hints && (
                      <div className="text-xs text-gray-500 mt-1 italic">Outcome varies...</div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
