import { useParams, Link } from "wouter";
import { ArrowLeft, Trophy, Zap, Target, Sparkles, Star } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { getTeamName, getTeamFlag } from "@/lib/utils";
import { Metric } from "@/context/AppContext";

/* ─── helpers ──────────────────────────────────────────────── */

function statusColor(status: string) {
  const s = (status || "").toLowerCase();
  if (["good", "strong", "win", "excellent", "high"].some(k => s.includes(k))) return "#22c55e";
  if (["average", "mid", "moderate", "normal", "medium"].some(k => s.includes(k))) return "#f59e0b";
  return "#ef4444";
}

function statusLabel(status: string) {
  const s = (status || "").toLowerCase();
  if (["good", "strong", "win", "excellent", "high"].some(k => s.includes(k))) return "Strong";
  if (["average", "mid", "moderate", "normal", "medium"].some(k => s.includes(k))) return "Average";
  return "Weak";
}

function StarRating({ status, reverse }: { status: string; reverse?: boolean }) {
  const color = statusColor(status);
  const lbl = statusLabel(status);
  const filled = lbl === "Strong" ? 3 : lbl === "Average" ? 2 : 1;

  const stars = (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map(n => (
        <Star
          key={n}
          className="w-4 h-4 transition-all"
          style={{
            color: n <= filled ? color : "transparent",
            fill: n <= filled ? color : "transparent",
            stroke: color,
            opacity: n <= filled ? 1 : 0.25,
          }}
        />
      ))}
    </div>
  );

  const label = (
    <span className="text-[10px] font-black uppercase tracking-wider leading-none" style={{ color }}>
      {lbl}
    </span>
  );

  return (
    <div className={`flex items-center gap-2 ${reverse ? "flex-row-reverse" : ""}`}>
      {stars}
      {label}
    </div>
  );
}

/* ─── Head to Head Row ─────────────────────────────────────── */

function H2HRow({ metric }: { metric: Metric }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-3 border-b border-white/5 last:border-0">
      <StarRating status={metric.t1.status} />
      <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest text-center whitespace-nowrap px-3 min-w-[80px]">
        {metric.label}
      </span>
      <div className="flex justify-end">
        <StarRating status={metric.t2.status} reverse />
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export default function PredictionDetails() {
  const params = useParams<{ key: string }>();
  const predKey = params.key || "";
  const { globalData } = useAppContext();

  const pred = globalData?.Prediction?.[predKey];
  const t1Name = pred ? getTeamName(pred.teams.t1.name) : "";
  const t2Name = pred ? getTeamName(pred.teams.t2.name) : "";

  if (!pred) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] gap-4 page-transition">
        <div className="text-6xl">🎯</div>
        <p className="text-white font-bold text-xl">Prediction not found</p>
        <Link href="/sports/prediction" className="text-[#0077FF] text-sm font-bold hover:underline">
          ← Back to Predictions
        </Link>
      </main>
    );
  }

  /* smart outcome logic */
  const options = pred.predictionSettings.options || [];
  const outcomeOpt = options[0];
  const scoreOpt = options[1];

  const outcomeIsTeam =
    outcomeOpt &&
    (outcomeOpt.outcome?.toLowerCase().includes(t1Name.toLowerCase()) ||
      outcomeOpt.outcome?.toLowerCase().includes(t2Name.toLowerCase()));

  const outcomeBoxTitle = outcomeIsTeam ? "Match Winner" : "Match Result";

  const winningTeamLogo = (() => {
    if (!outcomeIsTeam || !outcomeOpt) return null;
    const out = outcomeOpt.outcome?.toLowerCase() || "";
    if (out.includes(t1Name.toLowerCase())) return getTeamFlag(pred.teams.t1.logo);
    if (out.includes(t2Name.toLowerCase())) return getTeamFlag(pred.teams.t2.logo);
    return null;
  })();

  return (
    <main className="flex flex-col gap-8 px-4 md:px-12 py-8 page-transition max-w-4xl mx-auto w-full">
      {/* back */}
      <Link
        href="/sports/prediction"
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Predictions</span>
      </Link>

      {/* title row */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between w-full gap-3">
          <span className="px-3 py-1 bg-[#FF003C]/10 text-[#FF003C] text-xs font-bold uppercase tracking-wider rounded-full">
            {pred.category}
          </span>
          {pred.predictionSettings.enablePrediction && (
            <span className="flex items-center gap-1 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-full whitespace-nowrap">
              <Trophy className="w-3 h-3" /> Active Prediction
            </span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
          {t1Name} vs {t2Name}
        </h1>
        <p className="text-gray-400 text-sm">
          {pred.matchTitle} — {pred.subtitle}
        </p>
      </div>

      {/* teams */}
      <div className="grid grid-cols-7 gap-4 items-center bg-[#111827] border border-white/5 rounded-2xl p-6">
        <div className="col-span-3 flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-3">
            <img
              referrerPolicy="no-referrer"
              src={getTeamFlag(pred.teams.t1.logo)}
              alt={t1Name}
              className="w-full h-full object-contain"
              onError={e => (e.currentTarget.style.display = "none")}
            />
          </div>
          <span className="text-white font-bold text-base text-center">{t1Name}</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Home</span>
        </div>
        <div className="col-span-1 flex justify-center">
          <div className="w-10 h-10 bg-[#0B111A] border border-white/5 rounded-full flex items-center justify-center">
            <span className="text-[9px] font-black text-gray-500 uppercase">VS</span>
          </div>
        </div>
        <div className="col-span-3 flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-3">
            <img
              referrerPolicy="no-referrer"
              src={getTeamFlag(pred.teams.t2.logo)}
              alt={t2Name}
              className="w-full h-full object-contain"
              onError={e => (e.currentTarget.style.display = "none")}
            />
          </div>
          <span className="text-white font-bold text-base text-center">{t2Name}</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Away</span>
        </div>
      </div>

      {/* ── Match Analysis ── */}
      <div className="flex flex-col gap-4 p-6 bg-[#111827] border border-white/5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="absolute w-5 h-5 rounded-full bg-[#0077FF]/30 animate-ping" />
            <Zap className="w-5 h-5 text-[#0077FF] relative z-10" />
          </div>
          <h2 className="text-lg font-black text-white uppercase tracking-wider">Match Analysis</h2>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">{pred.analysis.description}</p>
      </div>

      {/* ── Bold Prediction ── */}
      {pred.analysis.bulletPoints && pred.analysis.bulletPoints.length > 0 && (
        <div className="flex flex-col gap-4 p-6 bg-[#111827] border border-white/5 rounded-2xl">
          <div className="flex items-center gap-3">
            <Target
              className="w-5 h-5 text-amber-400"
              style={{ animation: "spin 3s linear infinite" }}
            />
            <h2 className="text-lg font-black text-white uppercase tracking-wider">Bold Prediction</h2>
          </div>
          <ul className="flex flex-col gap-3">
            {pred.analysis.bulletPoints.map((bp, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                  style={{ background: "linear-gradient(135deg,#0077FF,#00CFFF)" }}
                >
                  {i + 1}
                </span>
                <span className="text-white font-bold text-sm leading-relaxed">{bp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Head to Head Comparison ── */}
      {pred.analysis.metrics && pred.analysis.metrics.length > 0 && (
        <div className="flex flex-col gap-0 bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
          {/* main header */}
          <div className="px-6 pt-6 pb-3 flex flex-col items-center gap-1">
            <h2 className="text-lg font-black text-white uppercase tracking-widest text-center">
              Head to Head Comparison
            </h2>
            <div className="w-12 h-0.5 rounded-full bg-gradient-to-r from-[#0077FF] to-[#00CFFF] mt-1" />
          </div>

          {/* team sub-headers */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 pb-3">
            <span className="text-sm font-black text-[#00FF87] truncate">{t1Name}</span>
            <span className="w-[80px]" />
            <span className="text-sm font-black text-[#0077FF] text-right truncate">{t2Name}</span>
          </div>

          {/* metric rows */}
          <div className="px-6 pb-6 flex flex-col">
            {pred.analysis.metrics.map((m, i) => (
              <H2HRow key={i} metric={m} />
            ))}
          </div>
        </div>
      )}

      {/* ── Match Outcome Golden Panel ── */}
      {pred.predictionSettings.enablePrediction && (
        <div className="flex flex-col gap-4 p-6 rounded-2xl border border-amber-500/30"
          style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.08) 0%,rgba(17,24,39,0.9) 100%)" }}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
            <h2 className="text-lg font-black text-white uppercase tracking-wider">Prediction Outcome</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1 — Match Winner / Match Result */}
            {outcomeOpt ? (
              <div className="p-5 bg-[#0B111A] border border-amber-500/20 rounded-xl flex flex-col gap-3">
                <span className="text-xs text-amber-400 uppercase tracking-widest font-black">
                  {outcomeBoxTitle}
                </span>
                <div className="flex items-center gap-3">
                  {winningTeamLogo && (
                    <img
                      referrerPolicy="no-referrer"
                      src={winningTeamLogo}
                      alt=""
                      className="w-9 h-9 object-contain flex-shrink-0"
                      onError={e => (e.currentTarget.style.display = "none")}
                    />
                  )}
                  <span className="text-white font-black text-lg leading-tight">{outcomeOpt.outcome}</span>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-[#0B111A] border border-amber-500/20 rounded-xl flex flex-col gap-3">
                <span className="text-xs text-amber-400 uppercase tracking-widest font-black">Match Result</span>
                <span className="text-gray-400 text-sm">No outcome data</span>
              </div>
            )}

            {/* Box 2 — Score Prediction (scorePredictionText from API) */}
            <div className="p-5 rounded-xl flex flex-col gap-3 border border-amber-500/20"
              style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(11,17,26,0.95))" }}>
              <span className="text-xs text-amber-400 uppercase tracking-widest font-black">Score Prediction</span>
              {pred.predictionSettings.scorePredictionText ? (
                <span className="text-white font-black text-xl leading-tight tracking-tight">
                  {pred.predictionSettings.scorePredictionText}
                </span>
              ) : scoreOpt ? (
                <span className="text-white font-black text-xl leading-tight tracking-tight">
                  {scoreOpt.outcome}
                </span>
              ) : (
                <span className="text-gray-500 text-sm">No score prediction</span>
              )}
            </div>
          </div>

          {/* any extra options beyond the first two */}
          {options.slice(2).length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {options.slice(2).map((opt, i) => (
                <div key={i} className="p-4 bg-[#0B111A] border border-white/5 rounded-xl flex flex-col gap-1">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">{opt.title}</span>
                  <span className="text-white font-bold text-sm">{opt.outcome}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
