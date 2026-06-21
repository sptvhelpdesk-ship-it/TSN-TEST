import { useState, useMemo } from "react";
import { useParams } from "wouter";
import { useAppContext } from "@/context/AppContext";
import { safeParseDate } from "@/lib/utils";
import { sportsLookup } from "@/lib/sportsData";
import LiveMatchCard from "@/components/LiveMatchCard";
import UpcomingMatchCard from "@/components/UpcomingMatchCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function SportDetails() {
  const params = useParams<{ sport: string }>();
  const sport = params.sport || "";
  const { globalMatches, loading } = useAppContext();
  const [tab, setTab] = useState<"live" | "upcoming">("live");

  const sportInfo = sportsLookup[sport.toLowerCase()] || { name: sport, color: "#0077FF", img: "" };
  const catKey = sportInfo.catKey || sport;

  const liveMatches = useMemo(() => {
    const now = Date.now();
    return globalMatches.filter(m => {
      if (m.cat?.toLowerCase().replace(/\s+/g, "-") !== sport.toLowerCase() && m.cat?.toLowerCase() !== catKey.toLowerCase()) return false;
      const start = safeParseDate(m.eventInfo?.startTime).getTime() - 15 * 60 * 1000;
      const end = safeParseDate(m.eventInfo?.endTime).getTime();
      return now >= start && now <= end;
    });
  }, [globalMatches, sport, catKey]);

  const upcomingMatches = useMemo(() => {
    const now = Date.now();
    return globalMatches.filter(m => {
      if (m.cat?.toLowerCase().replace(/\s+/g, "-") !== sport.toLowerCase() && m.cat?.toLowerCase() !== catKey.toLowerCase()) return false;
      const start = safeParseDate(m.eventInfo?.startTime).getTime() - 15 * 60 * 1000;
      return now < start;
    });
  }, [globalMatches, sport, catKey]);

  const current = tab === "live" ? liveMatches : upcomingMatches;

  return (
    <main className="flex flex-col gap-8 px-8 md:px-12 py-8 page-transition">
      <div className="flex items-center gap-6">
        {sportInfo.img && (
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center p-3 shadow-lg" style={{ backgroundColor: sportInfo.color + "33", border: `1px solid ${sportInfo.color}55` }}>
            <img referrerPolicy="no-referrer" src={sportInfo.img} className="w-full h-full object-contain" alt={sportInfo.name} />
          </div>
        )}
        <div>
          <h1 className="text-2xl md:text-4xl font-black italic tracking-wide text-white uppercase">{sportInfo.name}</h1>
          <p className="text-gray-400 text-sm mt-1">Live and upcoming matches</p>
        </div>
      </div>

      <div className="flex gap-2">
        {(["live", "upcoming"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${tab === t ? "bg-[#0077FF] text-white" : "bg-[#15212D] text-gray-400 hover:text-white border border-white/5"}`}
          >
            {t === "live" ? `Live (${liveMatches.length})` : `Upcoming (${upcomingMatches.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex"><LoadingSpinner /></div>
      ) : current.length > 0 ? (
        tab === "live"
          ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">{current.map(m => <LiveMatchCard key={m.id} match={m} />)}</div>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{current.map(m => <UpcomingMatchCard key={m.id} match={m} />)}</div>
      ) : (
        <div className="py-20 text-center text-gray-500 flex flex-col items-center gap-3">
          <div className="text-6xl">🏟️</div>
          <p className="font-semibold text-lg">No {tab} matches for {sportInfo.name}</p>
          <p className="text-sm text-gray-600">Check back soon</p>
        </div>
      )}
    </main>
  );
}
