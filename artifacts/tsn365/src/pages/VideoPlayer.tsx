import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "wouter";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { safeParseDate, getTeamName, getTeamFlag, slugify, encodeBase64Stream, decodeBase64Stream } from "@/lib/utils";
import { getSportLogo } from "@/lib/sportsData";
import LiveMatchCard from "@/components/LiveMatchCard";

export default function VideoPlayer() {
  const params = useParams<{ catslug: string }>();
  const rawParam = params.catslug || "";
  const ampIdx = rawParam.indexOf("&");
  const cat = ampIdx !== -1 ? rawParam.slice(0, ampIdx) : rawParam;
  const slug = ampIdx !== -1 ? rawParam.slice(ampIdx + 1) : "";

  const { globalMatches } = useAppContext();
  const [activeChannelIdx, setActiveChannelIdx] = useState(0);
  const [iframeHtml, setIframeHtml] = useState("");

  const match = useMemo(() => {
    const now = Date.now();
    const liveMatches = globalMatches.filter(m => {
      const start = safeParseDate(m.eventInfo?.startTime).getTime() - 15 * 60 * 1000;
      const end = safeParseDate(m.eventInfo?.endTime).getTime();
      return now >= start && now <= end && m.cat?.toLowerCase() === cat.toLowerCase();
    });
    if (!slug) return liveMatches[0];
    return liveMatches.find(m => {
      const tA = getTeamName(m.eventInfo.teamA);
      const tB = getTeamName(m.eventInfo.teamB);
      const expected = `${slugify(tA)}-vs-${slugify(tB)}`;
      return expected === slug;
    }) || liveMatches[0];
  }, [globalMatches, cat, slug]);

  const relatedMatches = useMemo(() => {
    if (!match) return [];
    const now = Date.now();
    return globalMatches.filter(m => {
      if (m.id === match.id) return false;
      const start = safeParseDate(m.eventInfo?.startTime).getTime() - 15 * 60 * 1000;
      const end = safeParseDate(m.eventInfo?.endTime).getTime();
      return now >= start && now <= end;
    }).slice(0, 4);
  }, [globalMatches, match]);

  const channels = match?.channels_data || [];

  const loadStream = useCallback((idx: number) => {
    const chan = channels[idx];
    if (!chan) return;
    const encoded = encodeBase64Stream(chan.link);
    setIframeHtml(decodeBase64Stream(encoded));
    setActiveChannelIdx(idx);
  }, [channels]);

  useEffect(() => {
    if (channels.length > 0) loadStream(0);
  }, [channels, loadStream]);

  if (!match) {
    return (
      <main className="flex flex-col gap-8 px-8 md:px-12 py-8 page-transition min-h-[60vh] items-center justify-center">
        <div className="text-6xl">📡</div>
        <p className="text-white font-bold text-xl">Stream not found</p>
        <Link href="/sports/live" className="text-[#0077FF] text-sm font-bold hover:underline">← Back to Live</Link>
      </main>
    );
  }

  const teamA = getTeamName(match.eventInfo.teamA);
  const teamB = getTeamName(match.eventInfo.teamB);
  const leagueLogo = match.league_logo || match.leagueLogo || "";

  return (
    <main className="flex flex-col gap-8 px-8 md:px-12 py-8 page-transition">
      <Link href="/sports/live" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> <span className="text-sm font-medium">Back to Live</span>
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-4">
          {/* Player */}
          <div className="w-full bg-[#0B111A] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
            <div className="w-full aspect-video bg-black relative aspect-video-abs"
              dangerouslySetInnerHTML={{ __html: iframeHtml }}
            />
          </div>

          {/* Match info */}
          <div className="flex flex-col gap-3 p-5 bg-[#15212D] rounded-2xl border border-white/5 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-[#FF003C] text-white text-[10px] font-black rounded-sm uppercase tracking-widest">Live</span>
              {leagueLogo && <img referrerPolicy="no-referrer" src={leagueLogo} className="w-5 h-5 object-contain" onError={e => (e.currentTarget.style.display = "none")} alt="" />}
              <span className="text-gray-300 text-sm font-semibold">{match.title}</span>
            </div>
            <div className="flex items-center gap-6 py-3">
              <div className="flex items-center gap-3">
                <img referrerPolicy="no-referrer" src={getTeamFlag(match.eventInfo.teamAFlag)} alt={teamA} className="w-10 h-10 object-contain" onError={e => (e.currentTarget.style.display = "none")} />
                <span className="text-white font-bold text-lg">{teamA}</span>
              </div>
              <div className="text-gray-400 font-black text-xl tracking-widest">VS</div>
              <div className="flex items-center gap-3 flex-row-reverse">
                <img referrerPolicy="no-referrer" src={getTeamFlag(match.eventInfo.teamBFlag)} alt={teamB} className="w-10 h-10 object-contain" onError={e => (e.currentTarget.style.display = "none")} />
                <span className="text-white font-bold text-lg">{teamB}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img referrerPolicy="no-referrer" src={getSportLogo(match.cat)} className="w-4 h-4 object-contain" onError={e => (e.currentTarget.style.display = "none")} alt="" />
              <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">{match.cat}</span>
            </div>
          </div>

          {/* Channel selector */}
          {channels.length > 1 && (
            <div className="flex flex-col gap-3 p-5 bg-[#15212D] rounded-2xl border border-white/5">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Available Channels</span>
              <div className="flex flex-wrap gap-2">
                {channels.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadStream(idx)}
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all focus:outline-none ${
                      idx === activeChannelIdx ? "bg-[#FF003C] text-white shadow-md shadow-red-500/20" : "bg-[#0B111A] text-gray-400 hover:text-white border border-white/5"
                    }`}
                  >
                    Channel {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related matches */}
        {relatedMatches.length > 0 && (
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">More Live Matches</h3>
            {relatedMatches.map(m => <LiveMatchCard key={m.id} match={m} />)}
          </div>
        )}
      </div>
    </main>
  );
}
