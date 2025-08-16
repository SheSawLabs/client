import { useMemo } from "react";
import { SwiperOptions } from "swiper/types";

interface UseSwiperOptions {
  slidesPerView?: number | "auto";
  spaceBetween?: number;
  freeMode?: boolean;
  loop?: boolean;
  autoplay?: boolean | { delay: number };
  pagination?: boolean;
  navigation?: boolean;
  breakpoints?: SwiperOptions["breakpoints"];
}

export const useSwiper = (options: UseSwiperOptions = {}) => {
  const swiperConfig: SwiperOptions = useMemo(() => {
    const {
      slidesPerView = "auto",
      spaceBetween = 16,
      freeMode = false,
      loop = false,
      autoplay = false,
      pagination = false,
      navigation = false,
      breakpoints,
    } = options;

    const config: SwiperOptions = {
      slidesPerView,
      spaceBetween,
      freeMode,
      loop,
      pagination: pagination ? { clickable: true } : false,
      navigation,
    };

    if (autoplay && typeof autoplay === "object") {
      config.autoplay = autoplay;
    } else if (autoplay === true) {
      config.autoplay = { delay: 3000 };
    }

    if (breakpoints) {
      config.breakpoints = breakpoints;
    }

    return config;
  }, [options]);

  return swiperConfig;
};
