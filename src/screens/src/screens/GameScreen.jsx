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

// âââ MAIN GAME SCREEN âââââââââââââââââââââââââââââââââââââââââââââââââââââââââ÷'BFVfVÇBgVæ7FöâvÖU67&VVâ²7FFRÂF7F6Ò°¢6öç7B·F"Â6WEF%ÒÒW6U7FFRvöÖRr¢6öç7B¶7FfTWfVçBÂ6WD7FfTWfVçEÒÒW6U7FFRçVÆÂ¢6öç7B·W6VBÂ6WEW6VEÒÒW6U7FFRfÇ6R ¢òòF6²VævæP¢W6TVffV7BÓâ°¢bW6VBÇÂ7FfTWfVçB&WGW&à¢6öç7BBÒ6WDçFW'fÂÓâ°¢F7F6²GS¢uD4²rÒ¢òò&æFöÒWfVçG3¢ãRR6æ6RW"F6°¢bÖFç&æFöÒÂãR°¢6öç7BVÆv&ÆRÒUdTåE2æfÇFW"RÓâRæÖå&WfVçVRÇÂ7FFRçF÷FÅ&WfVçVRãÒRæÖå&WfVçVR¢bVÆv&ÆRæÆVæwF°¢6öç7BWbÒVÆv&ÆU´ÖFæfÆö÷"ÖFç&æFöÒ¢VÆv&ÆRæÆVæwFÐ¢6WD7FfTWfVçBWb¢6WEW6VBG'VR¢Ð¢Ð¢ÒÂ7FFRçF6´×2ÇÂ3¢&WGW&âÓâ6ÆV$çFW'fÂB¢ÒÂ·W6VBÂ7FfTWfVçBÂ7FFRçF6´×2Â7FFRçF÷FÅ&WfVçVRÂF7F6Ò ¢gVæ7FöâæFÆTWfVçD6ö6RVffV7G2ÂFWB°¢F7F6²GS¢tÅôUdTåBrÂVffV7G2Ò¢F7F6²GS¢tDEôÄôrrÂFWC¢	ù;G·FWGÖÒ¢6WD7FfTWfVçBçVÆÂ¢6WEW6VBfÇ6R¢Ð ¢&WGW&â¢ÆFb6Æ74æÖSÒ&ÖâÖ×67&VVâ&rÖægÓSfÆWfÆWÖ6öÂ#à¢ÄVD& ¢7FFS×·7FFWÐ¢W6VC×·W6VGÐ¢öåFövvÆUW6S×²Óâ6WEW6VBÓâÐ¢óà ¢ÆFb6Æ74æÖSÒ&fÆWÓ÷fW&fÆ÷rÖWFò#à¢·F"ÓÓÒvöÖRrbbÄF6&ö&B7FFS×·7FFWÒF7F6×¶F7F6ÒóçÐ¢·F"ÓÓÒv6GrbbÄ6G67&VVâ7FFS×·7FFWÒF7F6×¶F7F6Òöä&6³×²Óâ6WEF"vöÖRrÒóçÐ¢·F"ÓÓÒvWæBrbbÄWç6öå67&VVâ7FFS×·7FFWÒF7F6×¶F7F6ÒóçÐ¢·F"ÓÓÒw7FG2rbbÅ7FG567&VVâ7FFS×·7FFWÒóçÐ¢ÂöFcà ¢²ò¢&÷GFöÒæb¢÷Ð¢ÆFb6Æ74æÖSÒ&fVB&÷GFöÒÓÆVgBÓ&vBÓ&rÖægÓóR&÷&FW"×B&÷&FW"×vFRó&6¶G&÷Ö&ÇW"×6ÒfÆW¢Ó3#à¢´äbæÖâÓâ¢Æ'WGFöà¢¶W×¶âæGÐ¢öä6Æ6³×²Óâ6WEF"âæBÐ¢6Æ74æÖS×¶fÆWÓfÆWfÆWÖ6öÂFV×2Ö6VçFW"Ó2vÓãRG&ç6FöâÖÆÂG°¢F"ÓÓÒâæBòwFWBÖÖ&W"ÓCr¢wFWBÖw&ÓS÷fW#§FWBÖw&Ó3p¢ÖÐ¢à¢Ç7â6Æ74æÖSÒ'FWB×Â#ç¶âæ6öçÓÂ÷7ãà¢Ç7â6Æ74æÖSÒ'FWB×2föçBÖÖVFVÒ#ç¶âæÆ&VÇÓÂ÷7ãà¢·F"ÓÓÒâæBbbÇ7â6Æ74æÖSÒ&'6öÇWFR&÷GFöÒÓrÓbÓãR&rÖÖ&W"ÓC&÷VæFVBÖgVÆÂ"óçÐ¢Âö'WGFöãà¢Ð¢ÂöFcà ¢²ò¢WfVçBÖöFÂ¢÷Ð¢¶7FfTWfVçBbb¢ÄWfVçDÖöFÂWfVçC×¶7FfTWfVçGÒöä6ö6S×¶æFÆTWfVçD6ö6WÒóà¢Ð ¢²ò¢W6R÷fW&Æ¢÷Ð¢·W6VBbb7FfTWfVçBbb¢ÆFb6Æ74æÖSÒ&fVBç6WBÓ¢ÓCfÆWFV×2Ö6VçFW"§W7FgÖ6VçFW"&rÖ&Æ6²óS&6¶G&÷Ö&ÇW"×6ÒöçFW"ÖWfVçG2ÖæöæR#à¢ÆFb6Æ74æÖSÒ&&rÖægÓ&÷&FW"&÷&FW"×vFRó&÷VæFVBÓ'ÂÓÓBFWBÖ6VçFW"#à¢ÆFb6Æ74æÖSÒ'FWBÓ7ÂÖ"Ó"#î(ûÂöFcà¢ÆFb6Æ74æÖSÒ'FWB×vFRföçBÖ&öÆB#åW6VCÂöFcà¢ÂöFcà¢ÂöFcà¢Ð¢ÂöFcà¢§Ð
