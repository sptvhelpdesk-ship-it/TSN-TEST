import { Link } from "wouter";
import { ArrowRight, Trophy, Play } from "lucide-react";

interface Props {
  variant?: "predictions" | "live";
}

export default function AnalyticsBanner({ variant = "predictions" }: Props) {
  if (variant === "live") {
    return (
      <Link href="/sports/live" className="block w-full group cursor-pointer">
        <div className="bg-gradient-to-r from-[#111827] to-[#15212D] border border-amber-500/20 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden shadow-2xl min-h-[220px] md:min-h-[280px] transition-all group-hover:border-amber-500/40 group-hover:shadow-amber-500/10">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-[#FF003C]/5 rounded-full blur-3xl" />
          <div className="absolute -left-16 -top-16 w-64 h-64 bg-[#FF003C]/3 rounded-full blur-3xl" />
          <div className="flex items-start gap-6 relative z-10">
            <div className="w-18 h-18 md:w-24 md:h-24 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0 text-[#FF003C] shadow-xl group-hover:scale-105 transition-transform">
              <Play className="w-10 h-10 md:w-12 md:h-12 fill-[#FF003C]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl md:text-4xl font-black text-white tracking-wide uppercase leading-tight">Watch Live Action</h3>
              <p className="text-gray-400 text-sm md:text-base mt-1 max-w-xl leading-relaxed">Stream live matches across every sport — football, cricket, tennis and more. Don't miss a single second of the action.</p>
            </div>
          </div>
          <div className="px-8 py-4 bg-[#FF003C] text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-lg shadow-red-500/20 shrink-0 flex items-center gap-2.5 relative z-10 group-hover:bg-[#D60032] transition-colors">
            <span>Go to Live</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href="/sports/prediction" className="block w-full group cursor-pointer">
      <div className="bg-gradient-to-r from-[#111827] to-[#15212D] border border-white/10 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden shadow-2xl min-h-[220px] md:min-h-[280px] transition-all group-hover:border-emerald-500/30 group-hover:shadow-emerald-500/10">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-[#00FF87]/5 rounded-full blur-3xl" />
        <div className="absolute -left-16 -top-16 w-64 h-64 bg-[#00FF87]/3 rounded-full blur-3xl" />
        <div className="flex items-start gap-6 relative z-10">
          <div className="w-18 h-18 md:w-24 md:h-24 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0 text-[#00FF87] shadow-xl group-hover:scale-105 transition-transform">
            <Trophy className="w-10 h-10 md:w-12 md:h-12" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl md:text-4xl font-black text-white tracking-wide uppercase leading-tight">Full Sport Analytics</h3>
            <p className="text-gray-400 text-sm md:text-base mt-1 max-w-xl leading-relaxed">Unlock advanced player statistics, pitch reports, and expert predictions for all active matches.</p>
          </div>
        </div>
        <div className="px-8 py-4 bg-[#00FF87] text-black font-black text-sm uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 shrink-0 flex items-center gap-2.5 relative z-10 group-hover:bg-[#00D670] transition-colors">
          <span>Get Predictions</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
