import { MILESTONES, DEPARTMENTS, fmt, pct, monthNames } from '../game/constants'

function StatBar({ label, value, max = 100, color = 'bg-amber-400' }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-medium">{value}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
        />
      </div>
    </div>
  )
}

export default function StatsScreen({ state }) {
  const milestonesHit = state.milestonesAchieved.length
  const milestonesTotal = MILESTONES.length

  return (
    <div className="min-h-screen bg-navy-950 pb-24 px-4 pt-4">
      <h2 className="text-2xl font-black text-white mb-6">Company Stats</h2>

      {/* Financial overview */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Financials</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Cash', value: fmt(state.cash), sub: 'Available', color: 'text-amber-400' },
            { label: 'Total Revenue', value: fmt(state.totalRevenue), sub: 'All time', color: 'text-green-400' },
            { label: 'Monthly Rev', value: fmt(state.monthlyRevenue), sub: 'Base', color: 'text-blue-400' },
            { label: 'Monthly Exp', value: fmt(state.monthlyExpenses), sub: 'Base', color: 'text-red-400' },
            { label: 'Debt', value: fmt(state.debt), sub: 'Outstanding', color: state.debt > 0 ? 'text-red-400' : 'text-gray-500' },
            { label: 'Equity', value: `${state.equity}%`, sub: 'Owned', color: 'text-purple-400' },
          ].map(item => (
            <div key={item.label} className="bg-white/5 rounded-xl p-3">
              <div className="text-xs text-gray-400 mb-0.5">{item.label}</div>
              <div className={`font-bold text-lg ${item.color}`}>{item.value}</div>
              <div className="text-xs text-gray-600">{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Company health */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Company Health</h3>
        <div className="bg-white/5 rounded-xl p-4 space-y-4">
          <StatBar label="Brand" value={state.brand} color="bg-blue-400" />
          <StatBar label="Morale" value={state.morale} color="bg-green-400" />
          <StatBar label="Prestige" value={state.prestige} max={50} color="bg-purple-400" />
        </div>
      </section>

      {/* Company snapshot */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Operations</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Employees', value: state.employees },
            { label: 'Properties', value: state.totalProperties },
            { label: 'Cities', value: Object.values(state.cities).filter(c => c.unlocked).length },
          ].map(item => (
            <div key={item.label} className="bg-white/5 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-white">{item.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Departments</h3>
        <div className="space-y-2">
          {DEPARTMENTS.map(dept => {
            const ds = state.departments[dept.id]
            return (
              <div key={dept.id} className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">{dept.name}</div>
                  {ds.hasExec && <div className="text-xs text-amber-400">{dept.exec}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-400">Lv.{ds.level}</div>
                  {ds.hasExec && <span className="text-xs">ð¤</span>}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Milestones */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
          Milestones {milestonesHit}/{milestonesTotal}
        </h3>
        <div className="space-y-2">
          {MILESTONES.map(m => {
            const hit = state.milestonesAchieved.includes(m.id)
            return (
              <div key={m.id} className={`flex items-center gap-3 p-3 rounded-xl border ${
                hit ? 'border-amber-400/30 bg-amber-400/5' : 'border-white/5 bg-white/3'
              }`}>
                <span className="text-lg">{hit ? 'ð' : 'ð'}</span>
                <div>
                  <div className={`text-sm font-medium ${hit ? 'text-white' : 'text-gray-500'}`}>{m.label}</div>
                  <div className="text-xs text-gray-600">{m.description}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Activity log */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Activity Log</h3>
        <div className="bg-white/5 rounded-xl divide-y divide-white/5 overflow-hidden">
          {state.log.slice(0, 15).map((entry, i) => (
            <div key={i} className="px-3 py-2 text-xs text-gray-400">
              {entry.text}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
