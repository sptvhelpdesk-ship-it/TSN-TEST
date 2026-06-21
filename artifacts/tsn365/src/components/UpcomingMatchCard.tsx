import { useEffect, useState } from "react";
import { Bell, Lock, Calendar, Clock } from "lucide-react";
import { MatchEvent } from "@/context/AppContext";
import { getTeamName, getTeamFlag, safeParseDate } from "@/lib/utils";
import { getSportLogo } from "@/lib/sportsData";
import { showToast } from "@/components/Toast";
import { useAppContext } from "@/context/AppContext";

interface Props {
  match: MatchEvent;
}

function CountdownTimer({ startTime }: { startTime: string }) {
  const [timeLeft, setTimeLeft] = useState({ hrs: "00", mins: "00", secs: "00" });

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const target = safeParseDate(startTime).getTime();
      const diff = target - now;
      if (diff > 0) {
        const totalSecs = Math.floor(diff / 1000);
        const hours = Math.floor(totalSecs / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = totalSecs % 60;
        setTimeLeft({
          hrs: String(hours).padStart(2, "0"),
          mins: String(minutes).padStart(2, "0"),
          secs: String(seconds).padStart(2, "0"),
        });
      } else {
        setTimeLeft({ hrs: "00", mins: "00", secs: "00" });
      }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  return (
    <div className="w-full mb-2 flex items-center justify-center gap-3 py-1">
      <div className="flex items-center gap-2 select-none">
        <div className="flex flex-col items-center">
          <div className="bg-red-700/90 text-white font-black text-sm px-2.5 py-1.5 rounded-lg border border-red-500 shadow-md shadow-red-700/20">{timeLeft.hrs}</div>
          <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">Hrs</span>
        </div>
        <span className="text-red-500 font-bold text-sm -mt-4">:</span>
        <div className="flex flex-col items-center">
          <div className="bg-red-700/90 text-white font-black text-sm px-2.5 py-1.5 rounded-lg border border-red-500 shadow-md shadow-red-700/20">{timeLeft.mins}</div>
          <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">Min</span>
        </div>
        <span className="text-red-500 font-bold text-sm -mt-4">:</span>
        <div className="flex flex-col items-center">
          <div className="bg-red-700/90 text-white font-black text-sm px-2.5 py-1.5 rounded-lg border border-red-500 shadow-md shadow-red-700/20">{timeLeft.secs}</div>
          <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Sec</span>
        </div>
      </div>
    </div>
  );
}

export default function UpcomingMatchCard({ match }: Props) {
  const { incrementReminders } = useAppContext();
  const teamA = getTeamName(match.eventInfo.teamA);
  const teamB = getTeamName(match.eventInfo.teamB);
  const matchDate = safeParseDate(match.eventInfo.startTime);
  const formattedDate = matchDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const formattedTime = matchDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const leagueLogo = match.league_logo || match.leagueLogo || match.eventInfo?.leagueLogo || match.eventInfo?.league_logo || "";

  const handleBell = () => {
    incrementReminders();
    showToast(`✅ Reminder set for ${teamA} vs ${teamB}!`);
  };

  return (
    <div className="flex flex-col items-start p-3.5 gap-2 w-full bg-[#15212D] border border-white/5 rounded-2xl group transition-all duration-500 hover:border-[#0077FF]/30 relative overflow-hidden shadow-2xl">
      <div className="absolute top-3.5 right-3.5 z-10">
        <span className="px-2.5 py-0.5 bg-[#123026]/90 backdrop-blur text-[#00FF87] text-[10px] font-black uppercase rounded-full tracking-wider border border-[#00FF87]/20">Upcoming</span>
      </div>
      <div className="flex items-center justify-between w-full mb-1">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2 pr-2 border-r border-white/10 mr-2">
            <img referrerPolicy="no-referrer" src={getSportLogo(match.cat)} className="w-5 h-5 object-contain bg-white/10 p-0.5 rounded-full" onError={e => (e.currentTarget.style.display = "none")} alt={match.cat} />
            <span className="text-xs font-bold text-white uppercase tracking-wider">{match.cat}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between w-full mb-2 mt-1">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
            <img referrerPolicy="no-referrer" src={getTeamFlag(match.eventInfo.teamAFlag)} alt={teamA} className="w-full h-full object-contain" onError={e => (e.currentTarget.style.display = "none")} />
          </div>
          <div className="min-w-0">
            <h3 className="text-white font-bold text-[14px] break-words leading-tight">{teamA}</h3>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-0.5">Home</p>
          </div>
        </div>
        <div className="mx-1">
          <div className="bg-[#1A2E3D] px-2 py-0.5 rounded text-[9px] font-black text-gray-400 border border-white/5 uppercase tracking-wider">VS</div>
        </div>
        <div className="flex items-center gap-3 flex-1 justify-end text-right">
          <div className="min-w-0">
            <h3 className="text-white font-bold text-[14px] break-words leading-tight">{teamB}</h3>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-0.5">Away</p>
          </div>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
            <img referrerPolicy="no-referrer" src={getTeamFlag(match.eventInfo.teamBFlag)} alt={teamB} className="w-full h-full object-contain" onError={e => (e.currentTarget.style.display = "none")} />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 -mt-2 mb-2 w-full px-1">
        {leagueLogo && <img referrerPolicy="no-referrer" src={leagueLogo} onError={e => (e.currentTarget.style.display = "none")} className="w-4 h-4 object-contain" alt="" />}
        <span className="text-[13px] font-semibold text-[#00FF87] tracking-wide leading-tight">{match.title}</span>
      </div>
      <CountdownTimer startTime={match.eventInfo.startTime} />
      <div className="h-[1px] bg-white/5 w-full mb-2"></div>
      <div className="w-full mb-2 flex items-center justify-between gap-3 bg-white/5 border border-white/5 p-2.5 rounded-xl">
        <div className="flex items-center gap-2">
          <Calendar className="w-[16px] h-[18px] text-[#00FF87]" />
          <div className="flex flex-col">
            <span className="text-white font-bold text-xs leading-none">{formattedDate}</span>
            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 leading-none">Match Day</span>
          </div>
        </div>
        <div className="h-5 w-[1px] bg-white/10 shrink-0"></div>
        <div className="flex items-center gap-2">
          <Clock className="w-[16px] h-[18px] text-[#FF003C]" />
          <div className="flex flex-col">
            <span className="text-white font-bold text-xs leading-none">{formattedTime}</span>
            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">BST (GMT+6)</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 w-full mt-auto pt-1">
        <button className="flex-1 bg-white/5 py-2.5 rounded-xl text-gray-400 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-not-allowed">
          <Lock className="w-[14px] h-[14px]" />
          <span>Coming Soon</span>
        </button>
        <button
          onClick={handleBell}
          className="w-10 h-10 bg-[#0B111A] border border-white/5 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:border-[#0077FF]/30 transition-all shadow-lg focus:outline-none"
        >
          <Bell className="w-5 h-5 text-gray-400 hover:text-[#0077FF] transition-colors" />
        </button>
      </div>
    </div>
  );
}
