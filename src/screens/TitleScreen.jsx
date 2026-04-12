export default function TitleScreen({ onStart }) {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
              <path d="M 60 0 L 0 0 0 30" fill="none" stroke="#F59E0B" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating buildings decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-40 opacity-20 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 bg-amber-400"
            style={{
              left: `${i * 13 + 2}%`,
              width: `${8 + (i % 3) * 4}px`,
              height: `${40 + (i * 17) % 80}px`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 animate-fade-in">
        {/* Logo */}
        <div className="mb-2 inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-1.5 text-amber-400 text-xs font-semibold uppercase tracking-widest">
          Company Tycoon
        </div>

        <h1 className="text-6xl sm:text-8xl font-black text-white mt-4 mb-2 tracking-tight">
          Venture<span className="text-amber-400">Life</span>
        </h1>

        <p className="text-gray-400 text-lg sm:text-xl mb-10 max-w-md mx-auto leading-relaxed">
          Build your empire from a garage to a global corporation.
        </p>

        <button
          onClick={onStart}
          className="bg-amber-500 hover:bg-amber-400 text-navy-950 font-black text-lg px-10 py-4 rounded-2xl shadow-lg shadow-amber-500/30 transition-all hover:scale-105 hover:shadow-amber-400/40 active:scale-95"
        >
          Start Your Company â
        </button>

        <div className="mt-8 flex items-center justify-center gap-6 text-gray-600 text-xs">
          <span>10 Industries</span>
          <span className="text-gray-700">â¢</span>
          <span>8 Cities</span>
          <span className="text-gray-700">â¢</span>
          <span>Sandbox Mode</span>
        </div>
      </div>
    </div>
  )
}
