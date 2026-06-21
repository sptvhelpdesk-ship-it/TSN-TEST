import { useNavigate } from "@/hooks/useNavigate";
import { Play } from "lucide-react";
import { MatchEvent } from "@/context/AppContext";
import { getTeamName, getTeamFlag, slugify } from "@/lib/utils";
import { getSportLogo } from "@/lib/sportsData";

interface Props {
  match: MatchEvent;
}

export default function LiveMatchCard({ match }: Props) {
  const navigate = useNavigate();
  const teamA = getTeamName(match.eventInfo.teamA);
  const teamB = getTeamName(match.eventInfo.teamB);
  const matchSlug = `${slugify(teamA)}-vs-${slugify(teamB)}`;
  const playerRoute = `/sports/live/${match.cat.toLowerCase()}&${matchSlug}`;

  return (
    <div
      className="group bg-[#15212D] rounded-xl overflow-hidden shadow-lg block cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-[#FF003C]/20 border border-white/5"
      onClick={() => navigate(playerRoute)}
    >
      <div className="relative aspect-video p-3 w-full overflow-hidden">
        <div
          className="relative w-full h-full bg-cover bg-center rounded-lg flex items-center justify-center border border-white/5"
          style={{ backgroundImage: "url('https://i.ibb.co/tPK0nqDW/1000394504.jpg')" }}
        >
          <div className="absolute inset-0 bg-[#0B111A]/60 rounded-lg"></div>
          <div className="relative z-10 flex items-center gap-6 p-4">
            <img referrerPolicy="no-referrer" src={getTeamFlag(match.eventInfo.teamAFlag)} className="w-16 h-16 object-contain" alt={teamA} onError={e => (e.currentTarget.style.display = "none")} />
            <span className="text-xl font-bold uppercase tracking-wider text-white italic drop-shadow-md">VS</span>
            <img referrerPolicy="no-referrer" src={getTeamFlag(match.eventInfo.teamBFlag)} className="w-16 h-16 object-contain" alt={teamB} onError={e => (e.currentTarget.style.display = "none")} />
          </div>
        </div>
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg m-3 z-10 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-[#FF003C] flex items-center justify-center shadow-lg shadow-red-600/30 transform scale-90 group-hover:scale-100 transition-all duration-300">
            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
          </div>
        </div>
        <div className="absolute top-6 left-6 bg-[#FF003C] text-white text-xs font-bold px-2 py-0.5 rounded-sm shadow-sm">Live</div>
        <div className="absolute top-6 right-6 bg-[#0B111A]/80 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1.5 border border-white/5">
          <img referrerPolicy="no-referrer" src={getSportLogo(match.cat)} className="w-4 h-4 object-contain rounded-full" onError={e => (e.currentTarget.style.display = "none")} alt={match.cat} />
          <span>{match.cat}</span>
        </div>
      </div>
      <div className="px-4 pb-4 pt-1 bg-[#15212D]">
        <h3 className="text-white group-hover:text-[#FF003C] transition-colors text-base font-bold line-clamp-1 mb-1">{teamA} Vs {teamB}</h3>
        <p className="text-gray-400 text-xs line-clamp-1">{match.title}</p>
      </div>
    </div>
  );
}
