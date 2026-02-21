"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import BannerImages from "./BannerImages";

export default function BannerCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  return (
    <div className="overflow-hidden rounded-2xl shadow-lg" ref={emblaRef}>
      <BannerImages />
    </div>
  );
}
