import { useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import PredictionCard from "@/components/PredictionCard";
import AnalyticsBanner from "@/components/AnalyticsBanner";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function PredictionsPage() {
  const { globalData, loading } = useAppContext();

  const predictions = useMemo(() => {
    const preds = globalData?.Prediction;
    if (!preds) return [];
    return Object.entries(preds).filter(([, v]) => v.visible);
  }, [globalData]);

  return (
    <main className="flex flex-col gap-8 px-8 md:px-12 py-8 page-transition">
      <div>
        <h1 className="text-2xl md:text-4xl font-black italic tracking-wide text-white uppercase">Match Predictions</h1>
        <p className="text-gray-400 text-sm mt-1">Expert analysis and predictions for upcoming matches</p>
      </div>

      {loading ? (
        <div className="flex"><LoadingSpinner /></div>
      ) : predictions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {predictions.map(([key, pred]) => (
            <PredictionCard key={key} predKey={key} pred={pred} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-500 flex flex-col items-center gap-3">
          <div className="text-6xl">🎯</div>
          <p className="font-semibold text-lg">No predictions available yet</p>
          <p className="text-sm text-gray-600">Check back before the next match</p>
        </div>
      )}

      {/* Promo banner → Live */}
      {!loading && <AnalyticsBanner variant="live" />}
    </main>
  );
}
