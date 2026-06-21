import { useState, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { safeParseDate } from "@/lib/utils";
import CategoryPills from "@/components/CategoryPills";
import LiveMatchCard from "@/components/LiveMatchCard";
import AnalyticsBanner from "@/components/AnalyticsBanner";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Live() {
  const { globalMatches, loading } = useAppContext();
  const [activeCategory, setActiveCategory] = useState("ALL");

  const liveMatches = useMemo(() => {
    const now = Date.now();
    return globalMatches.filter(m => {
      const start = safeParseDate(m.eventInfo?.startTime).getTime() - 15 * 60 * 1000;
      const end = safeParseDate(m.eventInfo?.endTime).getTime();
      return now >= start && now <= end;
    });
  }, [globalMatches]);

  const filtered = useMemo(() => {
    if (activeCategory === "ALL") return liveMatches;
    return liveMatches.filter(m => m.cat?.toUpperCase() === activeCategory.toUpperCase());
  }, [liveMatches, activeCategory]);

  return (
    <main className="flex flex-col gap-8 px-8 md:px-12 py-8 page-transition">
      {/* Page header */}
      <div>
        <h1 className="text-2xl md:text-4xl font-black italic tracking-wide text-white uppercase">Live Now</h1>
        <p className="text-gray-400 text-sm mt-1">All live matches streaming right now</p>
      </div>

      {/* Animated live count badge */}
      {!loading && (
        <div className="flex justify-center">
          <div className="relative inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#0F1923] border border-[#FF003C]/30 shadow-lg shadow-red-900/20">
            <span className="absolute inset-0 rounded-full animate-ping bg-[#FF003C]/10 pointer-events-none" />
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#FF003C] opacity-75 animate-ping" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#FF003C]" />
            </span>
            <span className="relative text-white font-black text-sm md:text-base tracking-wide">
              <span className="text-[#FF003C] text-lg md:text-xl mr-1">{liveMatches.length}</span>
              {liveMatches.length === 1 ? "Match" : "Matches"} Live Now
            </span>
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#00FF87] opacity-75 animate-ping" style={{ animationDelay: "0.5s" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00FF87]" />
            </span>
          </div>
        </div>
      )}

      <CategoryPills activeCategory={activeCategory} onChange={setActiveCategory} />

      {loading ? (
        <div className="flex"><LoadingSpinner /></div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(m => <LiveMatchCard key={m.id} match={m} />)}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-500 flex flex-col items-center gap-3">
          <div className="text-6xl">🏟️</div>
          <p className="font-semibold text-lg">No live matches right now</p>
          <p className="text-sm text-gray-600">Check back soon or browse other sports</p>
        </div>
      )}

      {/* Promo banner → Predictions */}
      {!loading && <AnalyticsBanner variant="predictions" />}
    </main>
  );
}
