import AnalyticsBanner from "@/components/AnalyticsBanner";

export default function Highlights() {
  return (
    <main className="flex flex-col gap-12 px-8 md:px-12 py-8 page-transition">
      <div>
        <h1 className="text-2xl md:text-4xl font-black italic tracking-wide text-white uppercase">Highlights</h1>
        <p className="text-gray-400 text-sm mt-1">Best moments from recent matches</p>
      </div>

      {/* Coming Soon with animated display */}
      <div className="flex flex-col items-center justify-center py-20 gap-10">
        {/* Bouncing balls animation */}
        <div className="flex items-end gap-3 h-16">
          {["#FF003C", "#0077FF", "#00FF87", "#FF9500", "#FF003C"].map((color, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: color,
                animation: `bounce 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
                boxShadow: `0 4px 20px ${color}88`,
              }}
            />
          ))}
        </div>

        {/* Pulsing film reel icon */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-40 h-40 rounded-full bg-[#FF003C]/5 animate-ping" />
          <div className="absolute w-28 h-28 rounded-full bg-[#FF003C]/10 animate-ping" style={{ animationDelay: "0.4s" }} />
          <div className="w-24 h-24 rounded-full bg-[#0F1923] border-2 border-[#FF003C]/30 flex items-center justify-center shadow-2xl shadow-red-900/30 relative z-10">
            <span className="text-5xl select-none">🎬</span>
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider">
            Coming <span className="text-[#FF003C]">Soon</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Match highlights will be available here shortly. Check back after live matches conclude for the best moments.
          </p>
        </div>

        {/* Animated progress bar */}
        <div className="w-64 h-1 rounded-full bg-[#0F1923] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF003C] via-[#FF9500] to-[#00FF87]"
            style={{ animation: "progressSlide 2s ease-in-out infinite" }}
          />
        </div>
      </div>

      {/* Promo banner → Live */}
      <AnalyticsBanner variant="live" />

      <style>{`
        @keyframes progressSlide {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 70%; margin-left: 0%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </main>
  );
}
