import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Sprout,
  Settings,
  FlaskConical,
  Package,
  Utensils,
  Check,
  ShieldCheck,
  Award,
  ArrowDown,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

interface StoryMilestone {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tag: string;
  keyHighlight: string;
  image: string;
}

const STORY_STEPS: StoryMilestone[] = [
  {
    number: "01",
    title: "Carefully Sourced Ingredients",
    description:
      "We partner with trusted farms to select the finest spices from across India.",
    icon: <Sprout className="w-5 h-5" />,
    tag: "Farm Direct",
    keyHighlight: "Pesticide-free single-origin harvests from Guntur & Salem",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80",
  },
  {
    number: "02",
    title: "Cleaning & Sorting",
    description:
      "Every ingredient is cleaned and sorted to maintain premium quality.",
    icon: <Settings className="w-5 h-5" />,
    tag: "Optical Precision",
    keyHighlight:
      "Pneumatic air-cleaning and triple optical sorting technology",
    image:
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80",
  },
  {
    number: "03",
    title: "Traditional Grinding",
    description:
      "Our spices are ground using carefully controlled methods to preserve aroma and natural oils.",
    icon: <Settings className="w-5 h-5" />,
    tag: "Low-Temp Cold Mill",
    keyHighlight: "Cryogenic milling under 38°C preserves 100% volatile oils",
    image:
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1000&q=80",
  },
  {
    number: "04",
    title: "Quality Inspection",
    description:
      "Every batch undergoes strict quality testing before packaging.",
    icon: <FlaskConical className="w-5 h-5" />,
    tag: "32-Point Audit",
    keyHighlight:
      "FSSAI & NABL lab certified for moisture, essential oil & purity",
    image:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80",
  },
  {
    number: "05",
    title: "Hygienic Packaging",
    description:
      "Products are packed in food-grade packaging that locks in freshness.",
    icon: <Package className="w-5 h-5" />,
    tag: "Aseptic Touchless",
    keyHighlight: "Nitrogen-flushed 4-layer aroma protection barrier pouches",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80",
  },
  {
    number: "06",
    title: "Delivered To Your Kitchen",
    description:
      "Fresh, authentic flavours reach every home with uncompromised quality.",
    icon: <Utensils className="w-5 h-5" />,
    tag: "Direct To Door",
    keyHighlight: "Express Pan-India delivery preserving peak aroma",
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80",
  },
];

const STEP_COUNT = STORY_STEPS.length;
const EASE = [0.25, 0.46, 0.45, 0.94] as const;

/* ----------------------------------------------------------------------- */
/*  Shared bits                                                             */
/* ----------------------------------------------------------------------- */

const SectionTitle: React.FC<{ className?: string }> = ({ className = "" }) => (
  <h2
    className={`font-heading text-2xl sm:text-4xl font-bold tracking-tight text-white ${className}`}
  >
    The Journey Of{" "}
    <span className="text-[#D6A146] italic font-serif">
      Uncompromised Purity
    </span>
  </h2>
);

const QualitySeals: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`flex items-center gap-4 text-[11px] text-gray-300 font-body ${className}`}
  >
    <div className="flex items-center gap-1.5">
      <ShieldCheck className="w-3.5 h-3.5 text-[#D6A146]" />
      <span>Cold Milled Formula</span>
    </div>
    <div className="flex items-center gap-1.5">
      <Award className="w-3.5 h-3.5 text-[#D6A146]" />
      <span>FSSAI Certified</span>
    </div>
  </div>
);

/* ----------------------------------------------------------------------- */
/*  Desktop: pinned, scroll-driven journey                                  */
/*  All scroll-linked visuals are driven by MotionValues (progress bar,     */
/*  ambient glow) so the browser only touches transform/opacity on the      */
/*  compositor thread — React only re-renders when the active step actually */
/*  changes, not on every scroll pixel.                                     */
/* ----------------------------------------------------------------------- */

const DesktopJourney: React.FC<{
  containerRef: React.RefObject<HTMLDivElement>;
}> = ({ containerRef }) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressPct, setProgressPct] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 500,
    damping: 35,
    mass: 0.15,
  });

  // const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const glowScale = useTransform(smoothProgress, [0, 1], [0.85, 1.15]);

  useMotionValueEvent(smoothProgress, "change", (v) => {
    // Same spacing model as the dots (idx / (STEP_COUNT - 1)), so the
    // active dot flips right as the line visually reaches it.
    // The +0.35 offset (instead of +0.5) makes it switch a little early,
    // so a light/short scroll is enough to trigger the next step.
    const rawIndex = v * (STEP_COUNT - 1) + 0.35;
    const nextIndex = Math.min(STEP_COUNT - 1, Math.max(0, Math.floor(rawIndex)));
    setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
    const pct = Math.round(v * 100);
    setProgressPct((prev) => (prev === pct ? prev : pct));
  });

  // Click a milestone to jump straight to its position in the pinned scroll track.
  const jumpToStep = (idx: number) => {
    const el = containerRef.current;
    if (!el) return;
    const targetProgress = idx / (STEP_COUNT - 1);
    const rect = el.getBoundingClientRect();
    const trackHeight = rect.height - window.innerHeight;
    const destination =
      window.scrollY + rect.top + targetProgress * trackHeight;
    window.scrollTo({
      top: destination,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const currentStep = STORY_STEPS[activeIndex];

  return (
    <div className="sticky top-24 h-screen w-full hidden lg:flex flex-col justify-between overflow-hidden py-10 px-6 xl:px-8">
      {/* Ambient lighting — pure transform, no re-render cost */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        <motion.div
          style={{ scale: glowScale }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#D6A146]/20 rounded-full blur-[120px]"
        />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#284C38]/40 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-end justify-between gap-4 border-b border-white/10 pb-4">
        <SectionTitle />
      </div>

      {/* Stage */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 my-auto grid grid-cols-12 gap-10 items-center py-4">
        <Timeline
          activeIndex={activeIndex}
          progress={smoothProgress}
          onSelect={jumpToStep}
        />
        <StageCard
          currentStep={currentStep}
          reduceMotion={!!prefersReducedMotion}
        />
      </div>
    </div>
  );
};

const Timeline: React.FC<{
  activeIndex: number;
  progress: MotionValue<number>;
  onSelect: (idx: number) => void;
}> = ({ activeIndex, progress, onSelect }) => {
  const currentStep = STORY_STEPS[activeIndex];

  const listRef = useRef<HTMLDivElement>(null);
  const firstDotRef = useRef<HTMLSpanElement>(null);
  const lastDotRef = useRef<HTMLSpanElement>(null);
  const [lineBounds, setLineBounds] = useState({ top: 0, height: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      if (!listRef.current || !firstDotRef.current || !lastDotRef.current)
        return;
      const containerTop = listRef.current.getBoundingClientRect().top;
      const firstRect = firstDotRef.current.getBoundingClientRect();
      const lastRect = lastDotRef.current.getBoundingClientRect();
      const firstCenter = firstRect.top + firstRect.height / 2 - containerTop;
      const lastCenter = lastRect.top + lastRect.height / 2 - containerTop;
      setLineBounds({ top: firstCenter, height: lastCenter - firstCenter });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const progressHeightPx = useTransform(progress, (v: number) => v * lineBounds.height);

  // ... rest of your Timeline JSX (the `return (...)` part) goes here
  return (
    <div className="col-span-5 bg-[#122419]/90 backdrop-blur-2xl p-6 xl:p-8 rounded-3xl border border-[#D6A146]/30 shadow-2xl space-y-6">
      <div ref={listRef} className="relative pl-7 xl:pl-8 space-y-3">
        <div
          className="absolute left-[21px] xl:left-[50px] w-0.5 rounded-full"
          style={{ top: lineBounds.top, height: lineBounds.height }}
        />
        <motion.div
          style={{ top: lineBounds.top, height: progressHeightPx }}
          className="absolute left-[21px] xl:left-[47.5px] w-0.5 bg-gradient-to-b from-[#D6A146] via-[#E5C180] to-[#D6A146] rounded-full shadow-[0_0_10px_#D6A146]"
        />

        {STORY_STEPS.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;
          const isFirst = idx === 0;
          const isLast = idx === STORY_STEPS.length - 1;

          return (
            <button
              key={step.number}
              onClick={() => onSelect(idx)}
              aria-current={isActive ? "step" : undefined}
              className={`relative z-10 w-full flex items-center gap-3.5 text-left transition-all duration-300 p-2.5 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A146]/70 ${
                isActive
                  ? "bg-[#D6A146]/15 border border-[#D6A146]/50 shadow-[0_0_20px_rgba(214,161,70,0.15)] translate-x-1"
                  : isCompleted
                    ? "opacity-85 hover:opacity-100 hover:bg-white/5 border border-transparent"
                    : "opacity-40 hover:opacity-70 border border-transparent"
              }`}
            >
              <span
                ref={isFirst ? firstDotRef : isLast ? lastDotRef : undefined}
                className="relative z-10 shrink-0 w-3 h-3 flex items-center justify-center"
              >
                <span
                  className={`rounded-full transition-all duration-500 ${
                    isActive
                      ? "w-3 h-3 -ml-2 bg-[#D6A146] shadow-[0_0_12px_rgba(214,161,70,0.6)]"
                      : isCompleted
                        ? "w-2.5 h-2.5 bg-[#D6A146]"
                        : "w-2 h-2 bg-white/20"
                  }`}
                />
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider font-btn ${
                      isActive
                        ? "text-[#D6A146]"
                        : isCompleted
                          ? "text-gray-300"
                          : "text-gray-500"
                    }`}
                  >
                    Phase {step.number}
                  </span>
                  {/* {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#D6A146] motion-safe:animate-pulse" />
                  )} */}
                </span>
                <span
                  className={`block text-xs xl:text-sm font-bold font-heading truncate ${
                    isActive
                      ? "text-white"
                      : isCompleted
                        ? "text-gray-200"
                        : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="pt-3 border-t border-white/10">
        <QualitySeals className="justify-between" />
      </div>
    </div>
  );
};

const StageCard: React.FC<{
  currentStep: StoryMilestone;
  reduceMotion: boolean;
}> = ({ currentStep, reduceMotion }) => (
  <div className="col-span-7">
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep.number}
        initial={{
          opacity: 0,
          y: reduceMotion ? 0 : 24,
          scale: reduceMotion ? 1 : 0.97,
        }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{
          opacity: 0,
          y: reduceMotion ? 0 : -16,
          scale: reduceMotion ? 1 : 0.97,
        }}
        transition={{ duration: reduceMotion ? 0.15 : 0.35, ease: EASE }}
        className="bg-gradient-to-br from-[#12281B] via-[#0F2217] to-[#0A160F] p-6 xl:p-8 rounded-3xl border border-[#D6A146]/50 shadow-[0_0_40px_rgba(214,161,70,0.15)] space-y-6"
      >
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D6A146] font-btn">
              {currentStep.tag}
            </span>
            <h3 className="font-heading text-2xl xl:text-3xl font-bold text-white mt-1 truncate">
              {currentStep.title}
            </h3>
          </div>
          <div className="font-heading text-4xl xl:text-5xl font-bold text-[#D6A146] opacity-90 shrink-0">
            {currentStep.number}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 items-center">
          <div className="col-span-6 h-52 xl:h-60 rounded-2xl overflow-hidden border border-white/10 relative group shadow-xl">
            <img
              src={currentStep.image}
              alt={currentStep.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover filter brightness-95 transform group-hover:scale-105 transition-transform duration-700 motion-reduce:transform-none"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 bg-[#D6A146] text-[#1D1D1D] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-btn">
              {currentStep.tag}
            </div>
          </div>

          <div className="col-span-6 space-y-4 text-left">
            <p className="font-body text-base xl:text-lg text-gray-100 font-light leading-relaxed italic border-l-2 border-[#D6A146] pl-4">
              "{currentStep.description}"
            </p>
            <div className="pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#D6A146] font-btn mb-2">
                Purity Guarantee:
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs xl:text-sm text-gray-200 font-medium flex items-start gap-2">
                <Check className="w-4 h-4 text-[#D6A146] shrink-0 mt-0.5" />
                <span>{currentStep.keyHighlight}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
);

/* ----------------------------------------------------------------------- */
/*  Mobile / tablet: swipeable snap carousel                                */
/*  Sticky pin-and-scrub scrollytelling doesn't translate well to small      */
/*  screens (address-bar resize jitter, awkward reading order), so mobile    */
/*  gets the pattern top e-commerce sites actually use: a horizontally       */
/*  swipeable card rail with a lightweight IntersectionObserver driving      */
/*  the active dot — no scroll-jank, works with native momentum scrolling.   */
/* ----------------------------------------------------------------------- */

const MobileJourney: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            setActiveIndex(idx);
          }
        });
      },
      { root: track, threshold: [0.55] },
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToIndex = (idx: number) => {
    cardRefs.current[idx]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <div
      className="lg:hidden py-12 px-4 sm:px-6"
      id="manufacturing-journey-section-mobile"
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-6 border-b border-white/10 pb-4">
          <SectionTitle />
          <span className="text-xs text-gray-400 font-btn shrink-0 tabular-nums">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(STEP_COUNT).padStart(2, "0")}
          </span>
        </div>

        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 pb-2 -mx-4 px-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {STORY_STEPS.map((step, idx) => (
            <div
              key={step.number}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              data-index={idx}
              className="snap-center shrink-0 w-[85%] sm:w-[60%] bg-gradient-to-br from-[#12281B] via-[#0F2217] to-[#0A160F] rounded-3xl border border-[#D6A146]/30 overflow-hidden shadow-xl"
            >
              <div className="relative h-48 sm:h-56">
                <img
                  src={step.image}
                  alt={step.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#0A160F]/80 backdrop-blur border border-[#D6A146]/40 flex items-center justify-center text-[#D6A146] font-heading text-xs font-bold">
                  {step.number}
                </div>
                <div className="absolute bottom-3 left-3 bg-[#D6A146] text-[#1D1D1D] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-btn">
                  {step.tag}
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-heading text-lg font-bold text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {step.description}
                </p>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs text-gray-200 flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#D6A146] shrink-0 mt-0.5" />
                  <span>{step.keyHighlight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex items-center justify-center gap-2 mt-4"
          role="tablist"
          aria-label="Journey steps"
        >
          {STORY_STEPS.map((step, idx) => (
            <button
              key={step.number}
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={`Go to ${step.title}`}
              onClick={() => scrollToIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A146]/70 ${
                idx === activeIndex ? "w-6 bg-[#D6A146]" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>

        <QualitySeals className="justify-center mt-4" />
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------------- */
/*  Root                                                                    */
/* ----------------------------------------------------------------------- */

export const ManufacturingJourney: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      id="manufacturing-journey-section"
      className="relative bg-[#0A160F] text-white text-left selection:bg-[#D6A146] selection:text-black lg:h-[350vh]"
    >
      <DesktopJourney containerRef={containerRef} />
      <MobileJourney />
    </div>
  );
};

export default ManufacturingJourney;
