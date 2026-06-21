import { useState, useMemo } from "react";
import { Calendar, Layers, Bell } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { safeParseDate } from "@/lib/utils";
import CategoryPills from "@/components/CategoryPills";
import UpcomingMatchCard from "@/components/UpcomingMatchCard";
import AnalyticsBanner from "@/components/AnalyticsBanner";
import LoadingSpinner from "@/components/LoadingSpinner";

interface StatBoxProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  pulse?: boolean;
}

function StatBox({ icon, label, value, color, pulse }: StatBoxProps) {
  return (
    <div
      className="flex-1 min-w-0 flex flex-col gap-3 p-5 rounded-2xl border border-white/5 bg-[#0F1923] relative overflow-hidden shadow-xl"
      style={{ borderColor: `${color}22` }}
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ background: `radial-gradient(circle at 80% 20%, ${color}, transparent 70%)` }} />
      <div className="relative z-10 flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}22`, color }}>
          {icon}
        </div>
        {pulse && (
          <span className="flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-2.5 w-2.5 rounded-full opacity-75 animate-ping" style={{ backgroundColor: color }} />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
          </span>
        )}
      </div>
      <div className="relative z-10">
        <div className="text-3xl font-black text-white tabular-nums" style={{ color }}>{value}</div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{label}</div>
      </div>
    </div>
  );
}

export default function Upcoming() {
  const { globalMatches, loading, userRemindersCount } = useAppContext();
  const [activeCategory, setActiveCategory] = useState("ALL");

  const upcomingMatches = useMemo(() => {
    const now = Date.now();
    return globalMatches.filter(m => {
      const start = safeParseDate(m.eventInfo?.startTime).getTime() - 15 * 60 * 1000;
      return now < start;
    }).sort((a, b) =>
      safeParseDate(a.eventInfo?.startTime).getTime() - safeParseDate(b.eventInfo?.startTime).getTime()
    );
  }, [globalMatches]);

  const activeSportCategories = useMemo(() => {
    const cats = new Set(upcomingMatches.map(m => m.cat?.toUpperCase()).filter(Boolean));
    return cats.size;
  }, [upcomingMatches]);

  const filtered = useMemo(() => {
    if (activeCategory === "ALL") return upcomingMatches;
    return upcomingMatches.filter(m => m.cat?.toUpperCase() === activeCategory.toUpperCase());
  }, [upcomingMatches, activeCategory]);

  return (
    <main className="flex flex-col gap-8 px-8 md:px-12 py-8 page-transition">
      <div>
        <h1 className="text-2xl md:text-4xl font-black italic tracking-wide text-white uppercase">Upcoming Matches</h1>
        <p className="text-gray-400 text-sm mt-1">Schedule of upcoming sporting events</p>
      </div>

      {/* 3 Stat boxes */}
      <div className="flex flex-col sm:flex-row gap-4">
        <StatBox icon={<Calendar className="w-5 h-5" />} label="Total Upcoming" value={loading ? "—" : upcomingMatches.length} color="#0077FF" />
        <StatBox icon={<Layers className="w-5 h-5" />} label="Active Categories" value={loading ? "—" : activeSportCategories} color="#00FF87" pulse />
        <StatBox icon={<Bell className="w-5 h-5" />} label="Active Reminders" value={userRemindersCount} color="#FF003C" pulse={userRemindersCount > 0} />
      </div>

      <CategoryPills activeCategory={activeCategory} onChange={setActiveCategory} />

      {loading ? (
        <div className="flex"><LoadingSpinner /></div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(m => <UpcomingMatchCard key={m.id} match={m} />)}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-500 flex flex-col items-center gap-3">
          <div className="text-6xl">📅</div>
          <p className="font-semibold text-lg">No upcoming matches found</p>
          <p className="text-sm text-gray-600">Try a different category or check back later</p>
        </div>
      )}

      {/* Promo banner → Predictions */}
      {!loading && <AnalyticsBanner variant="predictions" />}
    </main>
  );
}
