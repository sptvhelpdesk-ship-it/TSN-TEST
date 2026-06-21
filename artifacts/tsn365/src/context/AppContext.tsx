import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { API_URL } from "@/lib/sportsData";
import { safeParseDate } from "@/lib/utils";

export interface StreamLink {
  link: string;
  name?: string;
  tokenApi?: string;
}

export interface Channel {
  name?: string;
  link?: string;
  server?: string;
  logo?: string;
  stream_links?: StreamLink[];
  is_playlist?: boolean;
  visible?: boolean;
  source?: string;
}

export function getChannelLink(ch: Channel): string {
  return ch.link || ch.stream_links?.[0]?.link || "";
}

export interface EventInfo {
  startTime: string;
  endTime: string;
  teamA: unknown;
  teamB: unknown;
  teamAFlag: unknown;
  teamBFlag: unknown;
  leagueLogo?: string;
  league_logo?: string;
}

export interface MatchEvent {
  id: string | number;
  cat: string;
  title: string;
  league_logo?: string;
  leagueLogo?: string;
  eventInfo: EventInfo;
  channels_data?: Channel[];
}

export interface TeamEntry {
  name: unknown;
  logo: string;
}

export interface Metric {
  label: string;
  t1: { status: string; value: number };
  t2: { status: string; value: number };
}

export interface PredictionEntry {
  visible: boolean;
  category: string;
  matchTitle: string;
  subtitle: string;
  teams: { t1: TeamEntry; t2: TeamEntry };
  analysis: { description: string; metrics?: Metric[]; bulletPoints?: string[] };
  predictionSettings: {
    enablePrediction: boolean;
    options?: { title: string; outcome: string }[];
    scorePredictionText?: string;
  };
}

export interface CompBanner {
  id?: string;
  banner_type?: string;
  banner_value?: string;
}

export interface SiteSettings {
  logo_info?: { logo_value?: string; logo_type?: string };
  general?: { site_description?: string; copyright_text?: string; site_name?: string };
  contact?: { email?: string; phone?: string; address?: string };
  social_media?: Record<string, string>;
  ads_visible?: string;
  ads_link?: string;
  competition_banner?: { banners?: CompBanner[] };
}

export interface CategoryData {
  name?: string;
  logo?: string;
  type?: string;
  visible?: boolean;
  channels_data?: Channel[];
}

export interface SportsData {
  site_settings?: SiteSettings;
  sports_live?: { events?: MatchEvent[] };
  Prediction?: Record<string, PredictionEntry>;
  SPORTS?: { categories?: CategoryData[] };
}

interface AppContextType {
  globalData: SportsData | null;
  globalMatches: MatchEvent[];
  globalTvChannels: Channel[];
  loading: boolean;
  tapCount: number;
  setTapCount: (n: number) => void;
  userRemindersCount: number;
  incrementReminders: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [globalData, setGlobalData] = useState<SportsData | null>(null);
  const [globalMatches, setGlobalMatches] = useState<MatchEvent[]>([]);
  const [globalTvChannels, setGlobalTvChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [tapCount, setTapCount] = useState(0);
  const [userRemindersCount, setUserRemindersCount] = useState(0);
  const fetched = useRef(false);

  const incrementReminders = useCallback(() => setUserRemindersCount(n => n + 1), []);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetch(API_URL)
      .then(r => r.json())
      .then((data: SportsData) => {
        setGlobalData(data);
        if (data.sports_live?.events) {
          const sorted = [...data.sports_live.events].sort((a, b) =>
            safeParseDate(a.eventInfo?.startTime).getTime() - safeParseDate(b.eventInfo?.startTime).getTime()
          );
          setGlobalMatches(sorted);
        }
        const channels: Channel[] = [];
        if (data.SPORTS?.categories) {
          data.SPORTS.categories.forEach(cat => {
            if (cat.channels_data) channels.push(...cat.channels_data);
          });
        }
        setGlobalTvChannels(channels);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppContext.Provider value={{ globalData, globalMatches, globalTvChannels, loading, tapCount, setTapCount, userRemindersCount, incrementReminders }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
