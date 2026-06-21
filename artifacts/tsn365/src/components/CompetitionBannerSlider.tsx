import { useAppContext } from "@/context/AppContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function CompetitionBannerSlider() {
  const { globalData } = useAppContext();
  const banners = globalData?.site_settings?.competition_banner?.banners || [];
  const visibleBanners = banners.filter(b => b.banner_value);

  if (visibleBanners.length === 0) return null;

  const useAutoplay = visibleBanners.length >= 2;

  return (
    <section className="w-full">
      <div className="flex flex-col mb-6">
        <h2 className="text-2xl md:text-4xl font-black italic tracking-wide text-white uppercase">Competitions</h2>
        <p className="text-gray-400 text-sm mt-1">Featured tournaments and competitions</p>
      </div>

      {visibleBanners.length === 1 ? (
        <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/5">
          <img
            referrerPolicy="no-referrer"
            src={visibleBanners[0].banner_value}
            alt="Competition"
            className="w-full h-auto block"
          />
        </div>
      ) : (
        <Swiper
          modules={useAutoplay ? [Autoplay, Pagination] : [Pagination]}
          autoplay={useAutoplay ? { delay: 2000, disableOnInteraction: false } : false}
          pagination={{ clickable: true }}
          loop={useAutoplay}
          spaceBetween={0}
          slidesPerView={1}
          style={{ borderRadius: "1rem" }}
          className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/5 competition-swiper"
        >
          {visibleBanners.map((banner, i) => (
            <SwiperSlide key={banner.id || i}>
              <img
                referrerPolicy="no-referrer"
                src={banner.banner_value}
                alt={`Competition banner ${i + 1}`}
                className="w-full h-auto block"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}
