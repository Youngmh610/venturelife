import { fmt } from '../game/constants'

export default function DeptCard({ dept, deptState, cash, onUpgrade, onHireExec }) {
  const level = deptState.level
  const hasExec = deptState.hasExec
  const upgradeCost = Math.round(dept.upgradeCost * Math.pow(1.4, level - 1))
  const execCost = dept.execSalary * 12  // annual cost shown as one-time
  const canUpgrade = cash >= upgradeCost && level < 10
  const canHireExec = !hasExec && cash >= execCost

  const levelPct = ((level - 1) / 9) * 100

  return (
    <div className={`bg-white/5 border rounded-xl p-4 transition-all ${
      hasExec ? 'border-amber-400/40 shadow-amber-400/10 shadow-lg' : 'border-white/10 hover:border-white/20'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold text-white text-sm">{dept.name}</div>
          {hasExec && (
            <div className="text-xs text-amber-400 mt-0.5">ð¤ {dept.exec} on autopilot</div>
          )}
        </div>
        <div className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-lg">Lv.{level}</div>
      </div>

      {/* Level bar */}
      <div className="h-1.5 bg-white/10 rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${levelPct}%` }}
        />
      </div>

      {/* Bonus display */}
      <div className="text-xs text-gray-400 mb-3">
        <span className="text-green-400 font-medium">+{((level - 1) * 2.5).toFixed(1)}%</span> revenue bonus
        {hasExec && <span className="text-amber-400 ml-2 font-medium">+6% exec</span>}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        {level < 10 && (
          <button
            disabled={!canUpgrade}
            onClick={() => onUpgrade(dept.id, upgradeCost)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              canUpgrade
                ? 'bg-white/10 hover:bg-amber-400/20 text-white hover:text-amber-300'
                : 'bg-white/5 text-gray-600 cursor-not-allowed'
            }`}
          >
            Upgrade {fmt(upgradeCost)}
          </button>
        )}
        {!hasExec && (
          <button
            disabled={!canHireExec}
            onClick={() => onHireExec(dept.id, execCost)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              canHireExec
                ? 'bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-400/30'
                : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
            }`}
          >
            Hire {dept.exec.split(' ')[0]} {fmt(execCost)}
          </button>
        )}
        {hasExec && level >= 10 && (
          <div className="flex-1 text-center py-1.5 text-xs text-amber-400 font-medium">Maxed â</div>
        )}
      </div>
    </div>
  )
}
