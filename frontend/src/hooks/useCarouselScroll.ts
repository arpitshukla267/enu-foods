import { useRef, useState, useEffect } from "react";

/* Shared horizontal-carousel scroll behavior used by FeaturedProducts,
   ProductCategories, NewArrivals and SuperSaverCombos so they all scroll
   and enable/disable arrows the same way. */
export function useCarouselScroll<T extends HTMLElement = HTMLDivElement>() {
  const trackRef = useRef<T>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scrollByPage = (direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const distance = el.clientWidth * 0.92;
    el.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return { trackRef, canScrollLeft, canScrollRight, scrollByPage };
}
