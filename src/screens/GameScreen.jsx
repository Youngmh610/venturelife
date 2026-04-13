import { useState, useEffect, useCallback } from 'react'
import DeptCard from '../components/DeptCard'
import EventModal from '../components/EventModal'
import CityScreen from './CityScreen'
import StatsScreen from './StatsScreen'
import ExpansionScreen from './ExpansionScreen'
import { DEPARTMENTS, EVENTS, fmt, monthNames } from '../game/constants'

// âââ HUD BAR ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function HudBar({ state, paused, onTogglePause }) {
  const monthName = monthNames[state.month - 1] || 'Jan'
  return (
    <div className="bg-navy-900/90 border-b border-white/10 px-4 py-2 flex items-center justify-between backdrop-blur-sm sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onTogglePause}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
            paused ? 'bg-amber-500 text-navy-950 hover:bg-amber-400' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {paused ? 'â¶' : 'â¸'}
        </button>
        <div>
          <div className="text-white font-bold text-sm">{state.companyName}</div>
          <div className="text-xs text-gray-400">{monthName} {state.year}</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-amber-400 font-bold text-sm">{fmt(state.cash)}</div>
          <div className="text-xs text-gray-500">cash</div>
        </div>
        <div className="text-center hidden sm:block">
          <div className="text-green-400 font-bold text-sm">{fmt(state.monthlyRevenue)}</div>
          <div className="text-xs text-gray-500">rev/mo</div>
        </div>
      </div>
    </div>
  )
}

// âââ MINI STAT PILL âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function StatPill({ label, value, max, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="bg-white/5 rounded-xl p-3 flex-1 min-w-[80px]">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-medium">{value}</span>
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// âââ DASHBOARD (main tab) âââââââââââââââââââââââââââââââââââââââââââââââââââââ
function Dashboard({ state, dispatch }) {
  return (
    <div className="px-4 pt-4 pb-24 space-y-6">
      {/* Company stats row */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <StatPill label="Brand" value={state.brand} max={100} color="bg-blue-400" />
        <StatPill label="Morale" value={state.morale} max={100} color="bg-green-400" />
        <StatPill label="Prestige" value={state.prestige} max={50} color="bg-purple-400" />
      </div>

      {/* Monthly P&L */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Monthly P&L</div>
        <div className="flex justify-around">
          <div className="text-center">
            <div className="text-green-400 text-xl font-black">{fmt(state.monthlyRevenue)}</div>
            <div className="text-xs text-gray-500">Revenue</div>
          </div>
          <div className="text-gray-600 self-center">â</div>
          <div className="text-center">
            <div className="text-red-400 text-xl font-black">{fmt(state.monthlyExpenses)}</div>
            <div className="text-xs text-gray-500">Expenses</div>
          </div>
          <div className="text-gray-600 self-center">=</div>
          <div className="text-center">
            <div className={`text-xl font-black ${state.monthlyRevenue > state.monthlyExpenses ? 'text-amber-400' : 'text-red-400'}`}>
              {fmt(state.monthlyRevenue - state.monthlyExpenses)}
            </div>
            <div className="text-xs text-gray-500">Profit</div>
          </div>
        </div>
      </div>

      {/* Departments */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Departments</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DEPARTMENTS.map(dept => (
            <DeptCard
              key={dept.id}
              dept={dept}
              deptState={state.departments[dept.id]}
              cash={state.cash}
              onUpgrade={(id, cost) => dispatch({ type: 'UPGRADE_DEPT', deptId: id, cost })}
              onHireExec={(id, cost) => dispatch({ type: 'HIRE_EXEC', deptId: id, cost })}
            />
          ))}
        </div>
      </div>

      {/* Recent log */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Recent Activity</div>
        <div className="bg-white/5 rounded-xl divide-y divide-white/5 overflow-hidden">
          {state.log.slice(0, 8).map((entry, i) => (
            <div key={i} className="px-4 py-2.5 text-sm text-gray-300">
              {entry.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// âââ NAV âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const NAV = [
  { id: 'home', label: 'HQ', icon: 'ð ' },
  { id: 'city', label: 'City', icon: 'ðï¸' },
  { id: 'expand', label: 'Expand', icon: 'ð' },
  { id: 'stats', label: 'Stats', icon: 'ð' },
]

// âââ MAIN GAME SCREEN âââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export default function GameScreen({ state, dispatch }) {
  const [tab, setTab] = useState('home')
  const [activeEvent, setActiveEvent] = useState(null)
  const [paused, setPaused] = useState(false)

  // Tick engine
  useEffect(() => {
    if (paused || activeEvent) return
    const id = setInterval(() => {
      dispatch({ type: 'TICK' })
      // Random events: ~15% chance per tick
      if (Math.random() < 0.15) {
        const eligible = EVENTS.filter(e => !e.minRevenue || state.totalRevenue >= e.minRevenue)
        if (eligible.length) {
          const ev = eligible[Math.floor(Math.random() * eligible.length)]
          setActiveEvent(ev)
          setPaused(true)
        }
      }
    }, state.tickMs || 3000)
    return () => clearInterval(id)
  }, [paused, activeEvent, state.tickMs, state.totalRevenue, dispatch])

  function handleEventChoice(effects, text) {
    dispatch({ type: 'APPLY_EVENT', effects })
    dispatch({ type: 'ADD_LOG', text: `ð° ${text}` })
    setActiveEvent(null)
    setPaused(false)
  }

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col">
      <HudBar
        state={state}
        paused={paused}
        onTogglePause={() => setPaused(p => !p)}
      />

      <div className="flex-1 overflow-auto">
        {tab === 'home'   && <Dashboard state={state} dispatch={dispatch} />}
        {tab === 'city'   && <CityScreen state={state} dispatch={dispatch} onBack={() => setTab('home')} />}
        {tab === 'expand' && <ExpansionScreen state={state} dispatch={dispatch} />}
        {tab === 'stats'  && <StatsScreen state={state} />}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-navy-900/95 border-t border-white/10 backdrop-blur-sm flex z-30">
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => setTab(n.id)}
            className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-all ${
              tab === n.id ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className="text-xl">{n.icon}</span>
            <span className="text-xs font-medium">{n.label}</span>
            {tab === n.id && <span className="absolute bottom-0 w-6 h-0.5 bg-amber-400 rounded-full" />}
          </button>
        ))}
      </div>

      {/* Event modal */}
      {activeEvent && (
        <EventModal event={activeEvent} onChoice={handleEventChoice} />
      )}

      {/* Pause overlay */}
      {paused && !activeEvent && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-none">
          <div className="bg-navy-800 border border-white/10 rounded-2xl px-8 py-4 text-center">
            <div className="text-3xl mb-2">â¸</div>
            <div className="text-white font-bold">Paused</div>
          </div>
        </div>
      )}
    </div>
  )
}
