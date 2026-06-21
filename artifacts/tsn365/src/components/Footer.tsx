import { Link } from "wouter";
import { useAppContext } from "@/context/AppContext";
import { Facebook, Instagram, Linkedin, Send, Twitter, Youtube, Music2, MessageCircle, Link2 } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Live Streams", href: "/sports/live" },
  { label: "Upcoming Matches", href: "/sports/upcoming" },
  { label: "Sports Channel", href: "/sports/channel" },
  { label: "Predictions", href: "/sports/prediction" },
  { label: "Highlights", href: "/sports/highlights" },
];

interface SocialConfig {
  Icon: React.ElementType;
  color: string;
  label: string;
}

const SOCIAL_MAP: Record<string, SocialConfig> = {
  facebook:  { Icon: Facebook,      color: "#1877F2", label: "Facebook" },
  instagram: { Icon: Instagram,     color: "#E1306C", label: "Instagram" },
  twitter:   { Icon: Twitter,       color: "#1DA1F2", label: "Twitter" },
  youtube:   { Icon: Youtube,       color: "#FF0000", label: "YouTube" },
  telegram:  { Icon: Send,          color: "#0088CC", label: "Telegram" },
  linkedin:  { Icon: Linkedin,      color: "#0A66C2", label: "LinkedIn" },
  tiktok:    { Icon: Music2,        color: "#69C9D0", label: "TikTok" },
  whatsapp:  { Icon: MessageCircle, color: "#25D366", label: "WhatsApp" },
};

export default function Footer() {
  const { globalData } = useAppContext();
  const settings = globalData?.site_settings;
  const logoUrl = settings?.logo_info?.logo_value;
  const desc = settings?.general?.site_description || "Your ultimate destination for live sports streaming, predictions, and match schedules.";
  const copyright = settings?.general?.copyright_text || `© ${new Date().getFullYear()} TSN 365. All rights reserved.`;

  const contact = settings?.contact;
  const email = contact?.email;
  const phone = contact?.phone;
  const address = contact?.address;

  const socialsObj = settings?.social_media || {};
  const socialEntries = Object.entries(socialsObj).filter(([, url]) => url && url.trim() !== "");

  return (
    <footer className="w-full border-t border-white/5 bg-[#0B111A] mt-auto">
      <div className="w-full px-8 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              {logoUrl
                ? <img referrerPolicy="no-referrer" src={logoUrl} className="h-10 w-auto object-contain" alt="TSN Logo" />
                : <span className="text-2xl font-black italic tracking-wider text-white">TSN<span className="text-[#FF003C]">.</span></span>
              }
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[1.125rem] font-bold text-white">Quick Links</h4>
            <ul className="flex flex-col gap-2 text-gray-400 text-sm">
              {quickLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[1.125rem] font-bold text-white">Contact Us</h4>
            <ul className="flex flex-col gap-3 text-gray-400 text-sm">
              {email && (
                <li className="flex items-start gap-2">
                  <span className="shrink-0">📧</span>
                  <a href={`mailto:${email}`} className="hover:text-white transition-colors break-all">{email}</a>
                </li>
              )}
              {phone && (
                <li className="flex items-start gap-2">
                  <span className="shrink-0">📞</span>
                  <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-2">
                  <span className="shrink-0">📍</span>
                  <span>{address}</span>
                </li>
              )}
              {!email && !phone && !address && (
                <li className="text-gray-500 italic">No contact info available</li>
              )}
            </ul>
          </div>

          {/* Social Media */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[1.125rem] font-bold text-white">Connect With Us</h4>
            {socialEntries.length > 0 ? (
              <ul className="flex flex-col gap-3 text-sm">
                {socialEntries.map(([platform, url]) => {
                  const key = platform.toLowerCase();
                  const cfg = SOCIAL_MAP[key];
                  const Icon = cfg?.Icon ?? Link2;
                  const color = cfg?.color ?? "#9CA3AF";
                  const label = cfg?.label ?? platform;
                  return (
                    <li key={platform}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 group transition-all"
                        style={{ color }}
                      >
                        <span
                          className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-transform group-hover:scale-110"
                          style={{ backgroundColor: `${color}1A`, border: `1px solid ${color}33` }}
                        >
                          <Icon className="w-4 h-4" style={{ color }} />
                        </span>
                        <span className="font-semibold text-gray-300 group-hover:text-white transition-colors capitalize">
                          {label}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500 italic text-sm">No social links</p>
            )}
          </div>
        </div>
      </div>

      <div className="w-full px-8 md:px-12 pt-6 pb-8 border-t border-white/5 flex flex-col items-center gap-2">
        <p className="text-sm font-normal text-gray-400 text-center">{copyright}</p>
      </div>
    </footer>
  );
}
