import { useState, useEffect, useMemo } from "react";
import { useParams } from "wouter";
import { ArrowLeft, Tv2 } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useNavigate } from "@/hooks/useNavigate";
import { safeUrl } from "@/lib/utils";
import type { Channel } from "@/context/AppContext";

const FALLBACK_LOGO = "https://i.ibb.co/13xvbBk/1000392004.jpg";

interface FlatChannel {
  name: string;
  logo: string;
  stream_links: { link: string; name?: string }[];
}

function buildFlatChannels(globalData: ReturnType<typeof useAppContext>["globalData"]): FlatChannel[] {
  const result: FlatChannel[] = [];
  globalData?.SPORTS?.categories?.forEach(cat => {
    cat.channels_data?.forEach((ch: Channel) => {
      if (ch.visible === false) return;
      const links = ch.stream_links?.length
        ? ch.stream_links
        : ch.link ? [{ link: ch.link, name: "Server 1" }] : [];
      if (!links.length) return;
      result.push({ name: ch.name || ch.server || "Channel", logo: ch.logo || "", stream_links: links });
    });
  });
  return result;
}

export default function SportsPlayer() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const channelName = decodeURIComponent(slug);
  const { globalData } = useAppContext();
  const navigate = useNavigate();
  const [activeLinkIdx, setActiveLinkIdx] = useState(0);

  const allChannels = useMemo(() => buildFlatChannels(globalData), [globalData]);

  const currentChannel = useMemo(() => {
    if (!allChannels.length) return null;
    const found = allChannels.find(c => c.name === channelName || encodeURIComponent(c.name) === slug);
    return found || allChannels[0];
  }, [allChannels, channelName, slug]);

  // Reset link index when channel changes
  useEffect(() => { setActiveLinkIdx(0); }, [currentChannel?.name]);

  const activeLink = currentChannel?.stream_links[activeLinkIdx];

  const suggestedChannels = useMemo(() => {
    if (!allChannels.length || !currentChannel) return [];
    return allChannels.filter(c => c.name !== currentChannel.name).slice(0, 24);
  }, [allChannels, currentChannel]);

  if (!currentChannel && allChannels.length === 0) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-8">
        <Tv2 className="w-16 h-16 text-gray-700 animate-pulse" />
        <p className="text-gray-400 font-semibold">Loading channel…</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-black">
      {/* Sticky header with back + player */}
      <div className="sticky top-0 z-30 bg-black">
        {/* Back button */}
        <button
          onClick={() => { window.history.back(); }}
          className="w-full py-3 bg-[#FF003C] hover:bg-[#D60032] text-white font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Channel List
        </button>

        {/* Channel name + live badge */}
        <div className="px-4 py-2 bg-[#0B111A] border-b border-white/5 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-white overflow-hidden border border-black/10 shrink-0">
            <img
              referrerPolicy="no-referrer"
              src={safeUrl(currentChannel?.logo) || FALLBACK_LOGO}
              alt={currentChannel?.name}
              className="w-full h-full object-contain"
              onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_LOGO; }}
            />
          </div>
          <span className="text-white font-black text-sm uppercase tracking-wide flex-1 line-clamp-1">
            {currentChannel?.name}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FF003C]/10 border border-[#FF003C]/30 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF003C] animate-pulse" />
            <span className="text-[#FF003C] text-[10px] font-black uppercase tracking-widest">Live</span>
          </span>
        </div>

        {/* iframe player */}
        <div className="w-full bg-black" style={{ aspectRatio: "16/9" }}>
          {activeLink ? (
            <div
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: activeLink.link }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <Tv2 className="w-12 h-12 animate-pulse" />
            </div>
          )}
        </div>

        {/* Stream links bar — only if multiple */}
        {currentChannel && currentChannel.stream_links.length > 1 && (
          <div className="flex gap-2 overflow-x-auto px-3 py-2 bg-black border-t border-white/5 scrollbar-none">
            {currentChannel.stream_links.map((l, i) => (
              <button
                key={i}
                onClick={() => setActiveLinkIdx(i)}
                className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                  i === activeLinkIdx
                    ? "bg-[#0088cc]/20 border-[#0088cc] text-white"
                    : "bg-[#1a1a1a] border-[#0088cc]/30 text-gray-400 hover:text-white hover:border-[#0088cc]/70"
                }`}
              >
                {l.name || `Server ${i + 1}`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Scrollable below content: suggested channels */}
      {suggestedChannels.length > 0 && (
        <div className="flex-1 overflow-y-auto bg-black px-3 py-4">
          <div
            className="px-2 py-1.5 mb-3 rounded-md inline-block text-xs font-black uppercase tracking-widest text-white"
            style={{ borderLeft: "4px solid #0088cc", background: "rgba(0,136,204,0.1)" }}
          >
            Suggested Channels
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {suggestedChannels.map((ch, i) => (
              <div
                key={i}
                onClick={() => navigate(`/sports/player/${encodeURIComponent(ch.name)}`)}
                className="cat-card-square cursor-pointer"
              >
                <div className="cat-icon-circle overflow-hidden">
                  <img
                    referrerPolicy="no-referrer"
                    src={safeUrl(ch.logo) || FALLBACK_LOGO}
                    alt={ch.name}
                    className="w-full h-full object-contain"
                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_LOGO; }}
                  />
                </div>
                <div className="channel-name-wrapper">
                  <span className="cat-name-sq text-center">{ch.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
