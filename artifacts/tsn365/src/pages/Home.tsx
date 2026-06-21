import { useMemo } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { safeParseDate } from "@/lib/utils";
import Hero from "@/components/Hero";
import SportBrowse from "@/components/SportBrowse";
import LiveMatchCard from "@/components/LiveMatchCard";
import UpcomingMatchCard from "@/components/UpcomingMatchCard";
import PredictionCard from "@/components/PredictionCard";
import CompetitionBannerSlider from "@/components/CompetitionBannerSlider";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const { globalMatches, globalData, loading } = useAppContext();

  const liveMatches = useMemo(() => {
    const now = Date.now();
    return globalMatches.filter(m => {
      const start = safeParseDate(m.eventInfo?.startTime).getTime() - 15 * 60 * 1000;
      const end = safeParseDate(m.eventInfo?.endTime).getTime();
      return now >= start && now <= end;
    });
  }, [globalMatches]);

  const upcomingMatches = useMemo(() => {
    const now = Date.now();
    return globalMatches.filter(m => {
      const start = safeParseDate(m.eventInfo?.startTime).getTime() - 15 * 60 * 1000;
      return now < start;
    }).slice(0, 6);
  }, [globalMatches]);

  const predictions = useMemo(() => {
    const preds = globalData?.Prediction;
    if (!preds) return [];
    return Object.entries(preds).filter(([, v]) => v.visible).slice(0, 4);
  }, [globalData]);

  return (
    <main className="flex flex-col gap-16 px-8 md:px-12 py-8 page-transition">
      <Hero />
      <SportBrowse />

      {/* Live Now */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-black italic tracking-wide text-white uppercase">Live Now</h2>
            <p className="text-gray-400 text-sm mt-1">Streaming live across multiple channels</p>
          </div>
          <Link href="/sports/live" className="flex items-center gap-1.5 text-[#0077FF] text-sm font-bold hover:text-white transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="flex"><LoadingSpinner /></div>
        ) : liveMatches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {liveMatches.slice(0, 8).map(m => <LiveMatchCard key={m.id} match={m} />)}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">
            <div className="text-5xl mb-4">🏟️</div>
            <p className="font-medium">No live matches right now. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Upcoming Matches */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-black italic tracking-wide text-white uppercase">Upcoming Matches</h2>
            <p className="text-gray-400 text-sm mt-1">Set reminders for your favorite teams</p>
          </div>
          <Link href="/sports/upcoming" className="flex items-center gap-1.5 text-[#0077FF] text-sm font-bold hover:text-white transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="flex"><LoadingSpinner /></div>
        ) : upcomingMatches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingMatches.map(m => <UpcomingMatchCard key={m.id} match={m} />)}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">
            <div className="text-5xl mb-4">📅</div>
            <p className="font-medium">No upcoming matches found</p>
          </div>
        )}
      </section>

      {/* Competition Banner Slider */}
      {!loading && <CompetitionBannerSlider />}

      {/* Predictions */}
      {predictions.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-black italic tracking-wide text-white uppercase">Predictions</h2>
              <p className="text-gray-400 text-sm mt-1">Expert match predictions and analysis</p>
            </div>
            <Link href="/sports/prediction" className="flex items-center gap-1.5 text-[#0077FF] text-sm font-bold hover:text-white transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {predictions.map(([key, pred]) => (
              <PredictionCard key={key} predKey={key} pred={pred} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
