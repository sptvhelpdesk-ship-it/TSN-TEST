import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Live", href: "/sports/live", live: true },
  { label: "Upcoming", href: "/sports/upcoming" },
  { label: "Sports Channel", href: "/sports/channel" },
  { label: "Predictions", href: "/sports/prediction" },
  { label: "Highlights", href: "/sports/highlights" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { globalData } = useAppContext();
  const [location] = useLocation();
  const settings = globalData?.site_settings;
  const logoUrl = settings?.logo_info?.logo_value;

  useEffect(() => { setMobileOpen(false); }, [location]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/5" style={{ background: "rgba(21,33,45,0.85)", backdropFilter: "blur(7.5px)" }}>
        <div className="w-full px-8 py-3 max-[820px]:px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex gap-8 md:gap-12 items-center">
              <Link href="/" className="flex items-center gap-2">
                {logoUrl
                  ? <img referrerPolicy="no-referrer" src={logoUrl} className="h-10 w-auto object-contain" alt="TSN Logo" />
                  : <span className="text-2xl font-black italic tracking-wider text-white">TSN<span className="text-[#FF003C]">.</span></span>
                }
              </Link>
              <nav className="hidden md:flex items-center gap-6 text-[1.05rem] font-normal">
                {navLinks.map(link => (
                  <div key={link.href} className="flex items-center gap-2">
                    {link.live && (
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping bg-red-500"></span>
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
                      </span>
                    )}
                    <Link
                      href={link.href}
                      className={`transition-all duration-300 ${location === link.href ? "text-[#0077FF]" : "text-gray-400 hover:text-white"}`}
                    >
                      {link.label}
                    </Link>
                  </div>
                ))}
              </nav>
            </div>

            <div className="hidden md:flex items-center gap-4 ml-6 shrink-0">
              <div className="relative w-[280px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="What are you looking for"
                  className="w-full h-10 bg-[#0F161F] border border-white/5 rounded-lg pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#0077FF]/50 focus:ring-1 focus:ring-[#0077FF]/50 transition-all font-medium"
                />
              </div>
            </div>

            <button
              className="md:hidden text-white p-2 focus:outline-none"
              onClick={() => setMobileOpen(o => !o)}
            >
              {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-[#0F161F] border-b border-white/5 px-6 py-4 space-y-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`block text-sm font-medium py-1 ${location === link.href ? "text-[#0077FF]" : "text-gray-400 hover:text-white"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
