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
  <div className={className}>
    <h2 className="font-heading text-2xl sm:text-4xl font-semibold tracking-tight text-[#1E3A2B]">
      The Journey of Uncompromised Purity
    </h2>
    <p className="font-body text-sm text-[#1E3A2B]/60 mt-2">
      From the farm to your kitchen, in six careful steps.
    </p>
  </div>
);

const QualitySeals: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`flex items-center gap-4 text-xs text-[#1E3A2B]/65 font-body ${className}`}
  >
    <div className="flex items-center gap-1.5">
      <ShieldCheck className="w-4 h-4 text-[#1E3A2B]/60" />
      <span>Cold Milled</span>
    </div>
    <div className="flex items-center gap-1.5">
      <Award className="w-4 h-4 text-[#1E3A2B]/60" />
      <span>FSSAI Certified</span>
    </div>
  </div>
);

/* ----------------------------------------------------------------------- */
/*  Desktop: pinned, scroll-driven journey                                  */
/*  The progress line is driven by a MotionValue, so React only re-renders  */
/*  when the active step changes, not on every scroll pixel.                */
/* ----------------------------------------------------------------------- */

const DesktopJourney: React.FC<{
  containerRef: React.RefObject<HTMLDivElement>;
}> = ({ containerRef }) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 500,
    damping: 35,
    mass: 0.15,
  });

  useMotionValueEvent(smoothProgress, "change", (v) => {
    // Switches slightly early so a short scroll is enough for the next step.
    const rawIndex = v * (STEP_COUNT - 1) + 0.35;
    const nextIndex = Math.min(
      STEP_COUNT - 1,
      Math.max(0, Math.floor(rawIndex)),
    );
    setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
  });

  // Click a step to jump to its position in the pinned scroll track.
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

  return (
    <div className="sticky top-24 h-screen w-full hidden lg:flex flex-col justify-center gap-10 py-10 px-6 xl:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <SectionTitle />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-12 gap-8 items-stretch">
        <Timeline
          activeIndex={activeIndex}
          progress={smoothProgress}
          onSelect={jumpToStep}
        />
        <StageCard
          currentStep={STORY_STEPS[activeIndex]}
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

  const progressHeightPx = useTransform(
    progress,
    (v: number) => v * lineBounds.height,
  );

  return (
    <div className="col-span-5 bg-white p-5 xl:p-6 rounded-2xl border border-[#1E3A2B]/10 flex flex-col justify-between gap-5">
      <div ref={listRef} className="relative space-y-1">
        {/* Track + progress (dot centre sits 18px from the left edge) */}
        <div
          className="absolute left-[17px] w-0.5 bg-[#1E3A2B]/10 rounded-full"
          style={{ top: lineBounds.top, height: lineBounds.height }}
        />
        <motion.div
          style={{ top: lineBounds.top, height: progressHeightPx }}
          className="absolute left-[17px] w-0.5 bg-[#1E3A2B] rounded-full"
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
              className={`relative z-10 w-full flex items-center gap-4 text-left transition-colors duration-200 p-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A2B]/40 ${
                isActive ? "bg-[#F6EFE1]" : "hover:bg-[#F6EFE1]/60"
              }`}
            >
              <span
                ref={isFirst ? firstDotRef : isLast ? lastDotRef : undefined}
                className="shrink-0 w-3 h-3 flex items-center justify-center"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-3 h-3 bg-[#D9673B] ring-4 ring-[#D9673B]/20"
                      : isCompleted
                        ? "w-2.5 h-2.5 bg-[#1E3A2B]"
                        : "w-2.5 h-2.5 bg-white border-2 border-[#1E3A2B]/25"
                  }`}
                />
              </span>
              <span className="flex-1 min-w-0">
                <span
                  className={`block text-[11px] font-semibold uppercase tracking-wider font-btn ${
                    isActive ? "text-[#D9673B]" : "text-[#1E3A2B]/45"
                  }`}
                >
                  Step {step.number}
                </span>
                <span
                  className={`block text-sm font-semibold font-heading truncate ${
                    isActive || isCompleted
                      ? "text-[#1E3A2B]"
                      : "text-[#1E3A2B]/55"
                  }`}
                >
                  {step.title}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="pt-4 border-t border-[#1E3A2B]/10">
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
        initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
        transition={{ duration: reduceMotion ? 0.15 : 0.3, ease: EASE }}
        className="h-full bg-white rounded-2xl border border-[#1E3A2B]/10 overflow-hidden grid grid-cols-2"
      >
        <div className="relative min-h-[360px] bg-[#F6EFE1]">
          <img
            src={currentStep.image}
            alt={currentStep.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="p-6 xl:p-8 flex flex-col justify-between gap-6 text-left">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D9673B] font-btn">
                {currentStep.icon}
                {currentStep.tag}
              </span>
              <span className="font-heading text-sm font-semibold text-[#1E3A2B]/40 tabular-nums">
                {currentStep.number} / {String(STEP_COUNT).padStart(2, "0")}
              </span>
            </div>
            <h3 className="font-heading text-2xl xl:text-3xl font-semibold text-[#1E3A2B] leading-snug">
              {currentStep.title}
            </h3>
            <p className="font-body text-sm xl:text-base text-[#1E3A2B]/70 leading-relaxed mt-3">
              {currentStep.description}
            </p>
          </div>

          <div className="bg-[#F6EFE1] p-4 rounded-xl text-sm text-[#1E3A2B]/85 flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#1E3A2B] shrink-0 mt-0.5" />
            <span>{currentStep.keyHighlight}</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
);

/* ----------------------------------------------------------------------- */
/*  Mobile / tablet: swipeable snap carousel                                */
/*  A lightweight IntersectionObserver drives the active dot, so there is   */
/*  no scroll jank and native momentum scrolling is preserved.              */
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
        <div className="flex items-end justify-between gap-4 mb-6">
          <SectionTitle />
          <span className="text-xs text-[#1E3A2B]/50 font-btn shrink-0 tabular-nums">
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
              className="snap-center shrink-0 w-[85%] sm:w-[60%] bg-white rounded-2xl border border-[#1E3A2B]/10 overflow-hidden text-left"
            >
              <div className="relative h-44 sm:h-52 bg-[#F6EFE1]">
                <img
                  src={step.image}
                  alt={step.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-white text-[#1E3A2B] text-xs font-semibold px-2.5 py-1 rounded-md font-btn tabular-nums">
                  {step.number}
                </span>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#D9673B] font-btn">
                  {step.tag}
                </p>
                <h3 className="font-heading text-lg font-semibold text-[#1E3A2B]">
                  {step.title}
                </h3>
                <p className="text-sm text-[#1E3A2B]/70 leading-relaxed">
                  {step.description}
                </p>
                <div className="bg-[#F6EFE1] p-3 rounded-lg text-xs text-[#1E3A2B]/85 flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1E3A2B] shrink-0 mt-0.5" />
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
              className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A2B]/40 ${
                idx === activeIndex
                  ? "w-6 bg-[rgb(115,198,153)]"
                  : "w-1.5 bg-[#1E3A2B]/20"
              }`}
            />
          ))}
        </div>

        <QualitySeals className="justify-center mt-5" />
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
      className="relative bg-[#FBF8F1] text-[#1E3A2B] text-left selection:bg-[#1E3A2B] selection:text-white lg:h-[350vh]"
    >
      <DesktopJourney containerRef={containerRef} />
      <MobileJourney />
    </div>
  );
};

export default ManufacturingJourney;
