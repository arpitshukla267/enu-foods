import React, { useState, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavigationPage } from "../../types";
import { motion, AnimatePresence, PanInfo } from "motion/react";

interface HeroProps {
  onNavigate: (page: NavigationPage) => void;
}

interface HeroSlide {
  id: number;
  bgImage: string;
  bgImageMobile?: string;
  alt: string;
  eyebrow: string;
  headline: string;
  subtext: string;
  ctaLabel: string;
  ctaPage: NavigationPage;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    bgImage:
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=1920&q=80&auto=format&fit=crop",
    bgImageMobile:
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=900&q=80&auto=format&fit=crop",
    alt: "Premium Indian Spices",
    eyebrow: "Freshly Ground · Small Batch",
    headline: "Spices worth building a meal around",
    subtext: "Stone-ground this week, shipped straight from the source.",
    ctaLabel: "Shop the Collection",
    ctaPage: "shop" as NavigationPage,
  },
  {
    id: 2,
    bgImage:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=1920&q=80&auto=format&fit=crop",
    bgImageMobile:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=900&q=80&auto=format&fit=crop",
    alt: "Turmeric & Red Chilli",
    eyebrow: "Season\u2019s Best",
    headline: "Turmeric & red chilli, at their peak",
    subtext: "Sun-dried, hand-sorted, and packed within 48 hours of milling.",
    ctaLabel: "Explore Turmeric & Chilli",
    ctaPage: "shop" as NavigationPage,
  },
  {
    id: 3,
    bgImage:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1920&q=80&auto=format&fit=crop",
    bgImageMobile:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=900&q=80&auto=format&fit=crop",
    alt: "Whole Spices Collection",
    eyebrow: "New In",
    headline: "The whole spice collection is here",
    subtext:
      "Cardamom, clove, cinnamon and more \u2014 whole, never pre-ground.",
    ctaLabel: "Discover Whole Spices",
    ctaPage: "shop" as NavigationPage,
  },
];

const AUTOPLAY_SECONDS = 5;
const SWIPE_THRESHOLD = 60;

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  const handleNextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const handlePrevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
    );
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (index === currentSlide) return;
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
    },
    [currentSlide],
  );

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isVisible) return;
      if (e.key === "ArrowLeft") handlePrevSlide();
      if (e.key === "ArrowRight") handleNextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevSlide, handleNextSlide]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x <= -SWIPE_THRESHOLD) {
      handleNextSlide();
    } else if (info.offset.x >= SWIPE_THRESHOLD) {
      handlePrevSlide();
    }
  };

  const slide = HERO_SLIDES[currentSlide];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir >= 0 ? "100%" : "-100%",
      opacity: 1,
    }),
    center: {
      x: "0%",
      opacity: 1,
      transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: (dir: number) => ({
      x: dir >= 0 ? "-100%" : "100%",
      opacity: 1,
      transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  };

  const contentVariants = {
    enter: { y: 24, opacity: 0 },
    center: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, delay: 0.25, ease: "easeOut" },
    },
    exit: {
      y: -12,
      opacity: 0,
      transition: { duration: 0.25, ease: "easeIn" },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="mt-24 md:mt-32 py-6 pt-10 flex items-center justify-center bg-[#F2ECDD]"
    >
      {/* Reliable CSS-driven autoplay timer, independent of layout animations */}
      <style>{`
        @keyframes heroProgressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>

      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="relative h-[45vh] w-full overflow-hidden md:h-[35vh] lg:h-[50vh]"
      >
        {/* ── FULL-BLEED BANNER IMAGE ── */}
        <AnimatePresence custom={direction} mode="popLayout" initial={false}>
          <motion.div
            key={`bg-${slide.id}`}
            custom={direction}
            variants={prefersReducedMotion ? undefined : slideVariants}
            initial={prefersReducedMotion ? { opacity: 0 } : "enter"}
            animate={prefersReducedMotion ? { opacity: 1 } : "center"}
            exit={prefersReducedMotion ? { opacity: 0 } : "exit"}
            drag={prefersReducedMotion ? false : "x"}
            dragElastic={0.08}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
          >
            <picture>
              <source
                media="(max-width: 640px)"
                srcSet={slide.bgImageMobile ?? slide.bgImage}
              />
              <img
                src={slide.bgImage}
                alt={slide.alt}
                draggable={false}
                className="hero-bg-kenburns pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center"
              />
            </picture>
          </motion.div>
        </AnimatePresence>

        {/* ── Gradient for text legibility ── */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-linear-to-t from-black/70 via-black/25 to-black/20" />

        {/* ── Slide copy / CTA — vertically centered ── */}
        <div className="absolute inset-0 z-10 flex items-baseline-last pb-12 md:pb-0 md:items-center-safe px-4 sm:px-10 md:px-14 lg:px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${slide.id}`}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="max-w-[80vw] text-white sm:max-w-lg md:max-w-xl"
            >
              {/* <span className="mb-2 inline-block text-[10px] md:font-semibold uppercase tracking-[0.2em] text-[#D6A146] sm:text-xs">
                {slide.eyebrow}
              </span> */}
              <h1 className="text-xl md:text-[clamp(1.5rem,4.5vw,2.75rem)] font-semibold leading-[1.08] text-white text-balance">
                {slide.headline}
              </h1>
              <p className="mt-2 max-w-sm text-sm md:text-[clamp(0.8rem,1.8vw,0.95rem)] text-white/85 sm:mt-3">
                {slide.subtext}
              </p>
              <button
                onClick={() => onNavigate(slide.ctaPage)}
                className="mt-4 inline-flex items-center gap-1 md:gap-2 rounded-full bg-[#D6A146] px-5 py-2.5 text-xs md:font-semibold uppercase tracking-wide text-black transition-all duration-300 hover:bg-[#c4913b] hover:gap-3 active:scale-95 sm:mt-6 sm:px-6 sm:py-3 sm:text-sm"
              >
                {slide.ctaLabel}
                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Navigation Arrows (hidden on mobile — swipe instead) ── */}
        {/* <button
          onClick={handlePrevSlide}
          aria-label="Previous Slide"
          className="group absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white/40 hover:bg-white/25 active:scale-95 sm:flex md:left-6 md:h-11 md:w-11"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 sm:h-5 sm:w-5" />
        </button>

        <button
          onClick={handleNextSlide}
          aria-label="Next Slide"
          className="group absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white/40 hover:bg-white/25 active:scale-95 sm:flex md:right-6 md:h-11 md:w-11"
        >
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 sm:h-5 sm:w-5" />
        </button> */}

        {/* ── Dots (active = small progress bar, others = tiny dots) ── */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 sm:bottom-5">
          {HERO_SLIDES.map((s, idx) => {
            const isActive = idx === currentSlide;

            return (
              <button
                key={s.id}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={isActive}
                className="relative cursor-pointer rounded-full p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                {isActive ? (
                  <div className="relative h-1 w-5 overflow-hidden rounded-full bg-white/30 sm:w-6">
                    <div
                      key={`progress-${currentSlide}`}
                      onAnimationEnd={() => {
                        if (!isPaused) handleNextSlide();
                      }}
                      style={{
                        animation: prefersReducedMotion
                          ? "none"
                          : `heroProgressFill ${AUTOPLAY_SECONDS}s linear forwards`,
                        animationPlayState: isPaused ? "paused" : "running",
                        width: prefersReducedMotion ? "100%" : undefined,
                      }}
                      className="h-full rounded-full bg-white"
                    />
                  </div>
                ) : (
                  <div className="h-1 w-1 rounded-full bg-white/50 transition-colors duration-300 hover:bg-white/80" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
