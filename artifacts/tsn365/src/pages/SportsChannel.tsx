import { useState, useMemo, useRef, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useNavigate } from "@/hooks/useNavigate";
import { Search, Tv2, X } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { safeUrl } from "@/lib/utils";
import type { Channel } from "@/context/AppContext";

const FALLBACK_LOGO = "https://i.ibb.co/13xvbBk/1000392004.jpg";

interface ChannelItem {
  name: string;
  logo: string;
  catName: string;
  stream_links: { link: string; name?: string }[];
}

interface ServerModalProps {
  channel: ChannelItem;
  onClose: () => void;
  onSelect: (link: string, linkIdx: number) => void;
}

function ServerModal({ channel, onClose, onSelect }: ServerModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] rounded-2xl p-5 w-[85%] max-w-[300px] border border-white/10 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Select Link Server</span>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {channel.stream_links.map((l, i) => (
            <button
              key={i}
              onClick={() => onSelect(l.link, i)}
              className="w-full text-center py-3 px-4 rounded-xl bg-[#222] border border-[#0088cc]/40 text-white font-bold text-sm hover:bg-[#0088cc]/20 hover:border-[#0088cc] transition-all"
            >
              {l.name || `Server ${i + 1}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChannelCard({ channel, onClick }: { channel: ChannelItem; onClick: () => void }) {
  const nameRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    if (nameRef.current && wrapRef.current) {
      setShouldScroll(nameRef.current.scrollWidth > wrapRef.current.clientWidth + 2);
    }
  }, [channel.name]);

  return (
    <div className="cat-card-square cursor-pointer group" onClick={onClick}>
      <div className="cat-icon-circle overflow-hidden">
        <img
          referrerPolicy="no-referrer"
          src={safeUrl(channel.logo) || FALLBACK_LOGO}
          alt={channel.name}
          className="w-full h-full object-contain"
          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_LOGO; }}
        />
      </div>
      <div className="channel-name-wrapper" ref={wrapRef}>
        <span
          ref={nameRef}
          className={`cat-name-sq${shouldScroll ? " scrolling-text-channel" : ""}`}
        >
          {shouldScroll ? `${channel.name}\xa0\xa0\xa0\xa0${channel.name}` : channel.name}
        </span>
      </div>
    </div>
  );
}

export default function SportsChannel() {
  const { globalData, loading } = useAppContext();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalChannel, setModalChannel] = useState<ChannelItem | null>(null);

  const categoriesMap = useMemo(() => {
    const cats = globalData?.SPORTS?.categories || [];
    const result: Record<string, ChannelItem[]> = {};
    cats.forEach(cat => {
      if (cat.visible === false) return;
      const catName = cat.name || "Other";
      (cat.channels_data || []).forEach((ch: Channel) => {
        if (ch.visible === false) return;
        const links = ch.stream_links?.length
          ? ch.stream_links
          : ch.link ? [{ link: ch.link, name: "Server 1" }] : [];
        if (!links.length) return;
        if (!result[catName]) result[catName] = [];
        result[catName].push({
          name: ch.name || ch.server || "Channel",
          logo: ch.logo || "",
          catName,
          stream_links: links,
        });
      });
    });
    return result;
  }, [globalData]);

  const allChannels = useMemo(() => Object.values(categoriesMap).flat(), [categoriesMap]);

  const filteredChannels = useMemo(() => {
    let base = activeCategory === "ALL" ? allChannels : (categoriesMap[activeCategory] || []);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      base = base.filter(ch => ch.name.toLowerCase().includes(q));
    }
    return base;
  }, [allChannels, categoriesMap, activeCategory, searchQuery]);

  const handleChannelClick = (ch: ChannelItem) => {
    if (!ch.stream_links.length) return;
    if (ch.stream_links.length === 1) {
      navigate(`/sports/player/${encodeURIComponent(ch.name)}`);
    } else {
      setModalChannel(ch);
    }
  };

  const handleLinkSelect = (_link: string, _linkIdx: number) => {
    if (!modalChannel) return;
    const name = modalChannel.name;
    setModalChannel(null);
    navigate(`/sports/player/${encodeURIComponent(name)}`);
  };

  return (
    <main className="flex flex-col gap-6 px-8 md:px-12 py-8 page-transition">
      <div>
        <h1 className="text-2xl md:text-4xl font-black italic tracking-wide text-white uppercase">Sports Channels</h1>
        <p className="text-gray-400 text-sm mt-1">Browse live TV channels by sport</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search channels..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0F1923] border border-white/5 text-white text-sm font-medium placeholder-gray-500 focus:outline-none focus:border-[#0088cc]/60 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category filter pills */}
      <div className="overflow-x-auto pb-2 scrollbar-none flex gap-2">
        <button
          onClick={() => setActiveCategory("ALL")}
          className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap focus:outline-none ${activeCategory === "ALL" ? "bg-[#0077FF] text-white" : "bg-[#15212D] text-gray-400 hover:text-white border border-white/5"}`}
        >
          ALL ({allChannels.length})
        </button>
        {Object.keys(categoriesMap).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap focus:outline-none ${activeCategory === cat ? "bg-[#0077FF] text-white" : "bg-[#15212D] text-gray-400 hover:text-white border border-white/5"}`}
          >
            {cat} ({categoriesMap[cat].length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex"><LoadingSpinner /></div>
      ) : filteredChannels.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
          {filteredChannels.map((ch, i) => (
            <ChannelCard
              key={`${ch.catName}-${ch.name}-${i}`}
              channel={ch}
              onClick={() => handleChannelClick(ch)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-500 flex flex-col items-center gap-3">
          <Tv2 className="w-16 h-16 text-gray-700" />
          <p className="font-semibold text-lg">No channels found</p>
          {searchQuery && <p className="text-sm text-gray-600">Try a different search term</p>}
        </div>
      )}

      {/* Server selector modal */}
      {modalChannel && (
        <ServerModal
          channel={modalChannel}
          onClose={() => setModalChannel(null)}
          onSelect={handleLinkSelect}
        />
      )}
    </main>
  );
}
