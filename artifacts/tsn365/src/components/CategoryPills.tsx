import { useRef } from "react";
import { ALL_GLOBAL_CATEGORIES } from "@/lib/sportsData";

interface CategoryPillsProps {
  activeCategory: string;
  onChange: (cat: string) => void;
  allLabel?: string;
}

export default function CategoryPills({ activeCategory, onChange, allLabel = "ALL" }: CategoryPillsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    startX.current = e.pageX - (containerRef.current?.offsetLeft || 0);
    scrollLeft.current = containerRef.current?.scrollLeft || 0;
  };
  const onMouseLeave = () => { isDown.current = false; };
  const onMouseUp = () => { isDown.current = false; };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 2;
    if (containerRef.current) containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto pb-2 scrollbar-none flex gap-2 select-none"
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      {ALL_GLOBAL_CATEGORIES.map(cat => {
        const label = cat === "ALL" ? allLabel : cat;
        const isActive = activeCategory === label;
        return (
          <button
            key={cat}
            onClick={() => onChange(label)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap focus:outline-none ${
              isActive
                ? "bg-[#0077FF] text-white shadow-lg shadow-blue-500/10"
                : "bg-[#15212D] text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
