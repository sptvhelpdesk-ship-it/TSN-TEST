import { useRef } from "react";
import { Link } from "wouter";
import { sportsList } from "@/lib/sportsData";

export default function SportBrowse() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    containerRef.current?.classList.add("active");
    startX.current = e.pageX - (containerRef.current?.offsetLeft || 0);
    scrollLeft.current = containerRef.current?.scrollLeft || 0;
  };
  const onMouseLeave = () => { isDown.current = false; containerRef.current?.classList.remove("active"); };
  const onMouseUp = () => { isDown.current = false; containerRef.current?.classList.remove("active"); };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 2;
    if (containerRef.current) containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <section className="py-4">
      <div className="flex flex-col mb-10">
        <h2 className="text-2xl md:text-4xl font-black italic tracking-wide text-white uppercase">Browse by sport</h2>
        <p className="text-gray-400 text-sm md:text-base mt-1">Discover live games, highlights, and more</p>
      </div>
      <div
        ref={containerRef}
        className="overflow-x-auto pb-4 scrollbar-none flex gap-4 md:gap-6 select-none"
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        {sportsList.map(sport => (
          <Link
            key={sport.key}
            href={`/sports/${sport.key}`}
            className="group flex flex-col items-center justify-center w-[120px] md:w-[140px] shrink-0 aspect-square rounded-[2rem] transition-all duration-500 hover:-translate-y-2 active:scale-95 shadow-xl relative overflow-hidden"
            style={{ backgroundColor: sport.color }}
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-500"></div>
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center p-2">
                <img
                  referrerPolicy="no-referrer"
                  src={sport.img}
                  className="w-full h-full object-contain filter drop-shadow-lg"
                  alt={sport.name}
                />
              </div>
              <span className="text-white font-semibold text-sm md:text-base tracking-wide">{sport.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
