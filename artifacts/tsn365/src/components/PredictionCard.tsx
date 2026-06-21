import { useNavigate } from "@/hooks/useNavigate";
import { ArrowRight, Trophy } from "lucide-react";
import { PredictionEntry } from "@/context/AppContext";
import { getTeamName, getTeamFlag } from "@/lib/utils";

interface Props {
  predKey: string;
  pred: PredictionEntry;
}

export default function PredictionCard({ predKey, pred }: Props) {
  const navigate = useNavigate();
  const route = `/sports/prediction/${predKey}`;
  const t1Name = getTeamName(pred.teams.t1.name);
  const t2Name = getTeamName(pred.teams.t2.name);
  const title = `${t1Name} vs ${t2Name} | ${pred.matchTitle}`;

  return (
    <div className="w-full bg-[#111827] rounded-2xl p-6 shadow-xl border border-white/5 hover:border-white/10 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between min-h-[380px] group relative overflow-hidden cursor-pointer" onClick={() => navigate(route)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,119,255,0.03),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      <div className="flex flex-col gap-3 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#FF003C] bg-[#FF003C]/10 px-3 py-1 rounded-full uppercase tracking-wider">{pred.category}</span>
          {pred.predictionSettings.enablePrediction && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
              <Trophy className="w-3 h-3 text-amber-500" />Active Prediction
            </span>
          )}
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-[#0077FF] transition-colors line-clamp-2">{title}</h2>
          <p className="text-gray-400 text-xs mt-1 font-medium tracking-wide">{pred.subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-7 items-center justify-center my-6 py-4 px-2 bg-[#0b1220]/40 border border-white/5 rounded-xl relative z-10">
        <div className="col-span-3 flex flex-col items-center gap-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-white/5 p-2.5 border border-white/10 flex items-center justify-center shadow-md">
            <img referrerPolicy="no-referrer" src={getTeamFlag(pred.teams.t1.logo)} alt={t1Name} className="w-full h-full object-contain" onError={e => (e.currentTarget.style.display = "none")} />
          </div>
          <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider text-center line-clamp-1 max-w-full">{t1Name}</span>
        </div>
        <div className="col-span-1 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-[#111827] border border-white/5 flex items-center justify-center shadow-inner">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">VS</span>
          </div>
        </div>
        <div className="col-span-3 flex flex-col items-center gap-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-white/5 p-2.5 border border-white/10 flex items-center justify-center shadow-md">
            <img referrerPolicy="no-referrer" src={getTeamFlag(pred.teams.t2.logo)} alt={t2Name} className="w-full h-full object-contain" onError={e => (e.currentTarget.style.display = "none")} />
          </div>
          <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider text-center line-clamp-1 max-w-full">{t2Name}</span>
        </div>
      </div>
      <div className="relative z-10 mt-auto">
        <button
          onClick={e => { e.stopPropagation(); navigate(route); }}
          className="w-full bg-[#0077FF] hover:bg-[#0066DD] text-white text-xs sm:text-sm font-bold uppercase tracking-widest py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_14px_rgba(0,119,255,0.25)] focus:outline-none"
        >
          <span>Get Prediction</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
