import { useState } from 'react'
import { INDUSTRIES, STARTS, fmt } from '../game/constants'

export default function SetupScreen({ onLaunch }) {
  const [companyName, setCompanyName] = useState('')
  const [industryId, setIndustryId] = useState(null)
  const [startId, setStartId] = useState(null)
  const [step, setStep] = useState(0) // 0=name, 1=industry, 2=start

  const industry = INDUSTRIES.find(i => i.id === industryId)
  const start = STARTS.find(s => s.id === startId)

  function handleLaunch() {
    if (!companyName.trim() || !industryId || !startId) return
    onLaunch({ companyName: companyName.trim(), industryId, startId, industry, start })
  }

  const steps = [
    { label: 'Name', icon: 'âï¸' },
    { label: 'Industry', icon: 'ð­' },
    { label: 'Start', icon: 'ð' },
  ]

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center px-4 py-8">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                i === step
                  ? 'bg-amber-500 text-navy-950'
                  : i < step
                  ? 'bg-amber-500/20 text-amber-400 cursor-pointer hover:bg-amber-500/30'
                  : 'bg-white/5 text-gray-600 cursor-default'
              }`}
            >
              <span>{s.icon}</span> {s.label}
            </button>
            {i < steps.length - 1 && (
              <div className={`w-6 h-px ${i < step ? 'bg-amber-400' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg">
        {/* Step 0: Company Name */}
        {step === 0 && (
          <div className="animate-fade-in text-center">
            <h2 className="text-3xl font-black text-white mb-2">Name your company</h2>
            <p className="text-gray-400 mb-8">This is how the world will know you.</p>
            <input
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && companyName.trim() && setStep(1)}
              placeholder="e.g. Apex Corp, Nova Labsâ¦"
              maxLength={30}
              autoFocus
              className="w-full bg-white/5 border border-white/15 rounded-xl px-5 py-4 text-white text-lg placeholder-gray-600 focus:outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all text-center"
            />
            <button
              disabled={!companyName.trim()}
              onClick={() => setStep(1)}
              className="mt-6 bg-amber-500 hover:bg-amber-400 disabled:bg-white/10 disabled:text-gray-600 text-navy-950 font-bold px-8 py-3 rounded-xl transition-all disabled:cursor-not-allowed"
            >
              Next â
            </button>
          </div>
        )}

        {/* Step 1: Industry */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-black text-white mb-2 text-center">Pick your industry</h2>
            <p className="text-gray-400 mb-6 text-center">Each has different margins and growth patterns.</p>
            <div className="grid grid-cols-2 gap-2">
              {INDUSTRIES.map(ind => (
                <button
                  key={ind.id}
                  onClick={() => { setIndustryId(ind.id); setStep(2) }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    industryId === ind.id
                      ? 'border-amber-400/60 bg-amber-400/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20'
                  }`}
                >
                  <div className="text-2xl mb-1">{ind.icon}</div>
                  <div className="font-semibold text-white text-sm">{ind.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{fmt(ind.baseRev)}/mo base</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Starting scenario */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-black text-white mb-2 text-center">How did you start?</h2>
            <p className="text-gray-400 mb-6 text-center">Your backstory affects starting capital and skills.</p>
            <div className="space-y-2">
              {STARTS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setStartId(s.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    startId === s.id
                      ? 'border-amber-400/60 bg-amber-400/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-sm">{s.name}</span>
                    <span className="text-amber-400 font-bold text-sm">{fmt(s.capital)}</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{s.description}</p>
                  <div className="flex gap-3 mt-2 text-xs text-gray-500">
                    <span>Skill: {s.skill}%</span>
                    <span>Connections: {s.connections}</span>
                  </div>
                </button>
              ))}
            </div>

            {startId && (
              <button
                onClick={handleLaunch}
                className="mt-6 w-full bg-amber-500 hover:bg-amber-400 text-navy-950 font-black text-lg py-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-400/30 active:scale-98"
              >
                Found {companyName} ð
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
