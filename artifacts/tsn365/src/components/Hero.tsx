import { Link } from "wouter";
import { Play } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function Hero() {
  const { globalData } = useAppContext();
  const banners = globalData?.banners;

  const heroImg = banners?.[0]?.url ||
    "https://res.cloudinary.com/dnpvdgpgu/image/upload/v1779656539/tsn-sports/file_ulljhv.jpg";

  return (
    <section className="w-full">
      <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden group bg-black rounded-3xl">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${heroImg}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B111A] via-[#0B111A]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B111A]/90 via-[#0B111A]/40 to-transparent"></div>
        </div>
        <div className="relative h-full w-full mx-auto px-6 md:px-12 pb-10 md:pb-[80px] flex flex-col justify-end items-start text-white">
          <div className="w-full max-w-4xl space-y-4 md:space-y-6">
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-2 px-3 py-1.5 bg-[#FF003C] text-white text-xs font-bold rounded-full">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>Live now
              </span>
              <span className="px-3 py-1.5 bg-[#0F172A]/80 backdrop-blur-md text-gray-300 text-xs font-medium rounded-full border border-white/10">Featured</span>
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                Watch Live Sports From Around The World
              </h1>
              <p className="text-base md:text-xl text-gray-300 font-normal leading-relaxed max-w-2xl">
                Stream thousands of live events, highlights, and get expert predictions for your favorite sports
              </p>
            </div>
            <div className="pt-4 mb-10">
              <Link
                href="/sports/live"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FF003C] hover:bg-[#D60032] text-white text-sm font-semibold rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-600/20"
              >
                <span>Join live now</span>
                <Play className="w-4 h-4 fill-white" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
