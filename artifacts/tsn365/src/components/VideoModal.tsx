import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { Channel } from "@/context/AppContext";
import { encodeBase64Stream, decodeBase64Stream } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  title: string;
  channels: Channel[];
  onClose: () => void;
}

export default function VideoModal({ isOpen, title, channels, onClose }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [iframeHtml, setIframeHtml] = useState("");

  const loadStream = useCallback((chan: Channel) => {
    const encoded = encodeBase64Stream(chan.link);
    setIframeHtml(decodeBase64Stream(encoded));
  }, []);

  useEffect(() => {
    if (isOpen && channels.length > 0) {
      setActiveIdx(0);
      loadStream(channels[0]);
    }
    if (!isOpen) {
      setIframeHtml("");
    }
  }, [isOpen, channels, loadStream]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100]">
      <div className="w-full max-w-4xl mx-auto px-4 flex flex-col gap-4">
        <div className="flex justify-between items-center bg-[#15212D] px-6 py-4 rounded-t-xl border border-white/5 border-b-0">
          <h3 className="text-lg font-black uppercase tracking-wide text-white">{title || "Live Stream"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 focus:outline-none">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="w-full aspect-video bg-black rounded-b-xl overflow-hidden border border-white/5 relative shadow-2xl shadow-[#FF003C]/10 aspect-video-abs"
          dangerouslySetInnerHTML={{ __html: iframeHtml }}
        />
        {channels.length > 1 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Available Channels</span>
            <div className="flex flex-wrap gap-2">
              {channels.map((chan, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveIdx(idx); loadStream(chan); }}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    idx === activeIdx ? "bg-[#FF003C] text-white" : "bg-[#15212D] text-gray-400 hover:text-white border border-white/5"
                  }`}
                >
                  TSN {idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
