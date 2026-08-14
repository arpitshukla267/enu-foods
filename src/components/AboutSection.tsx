import React, { useEffect, useRef, useState } from "react";
import { TRADITION_IMAGE } from "../data/mockData";
import {
  CheckCircle2,
  Sparkles,
  Shield,
  ArrowRight,
  Award,
} from "lucide-react";
import { NavigationPage } from "../types";

interface AboutSectionProps {
  onNavigate: (page: NavigationPage) => void;
  isStoryPage: boolean;
}

/**
 * Lightweight scroll-into-view hook.
 * Fires once (unobserves after first intersection) so the animation
 * doesn't replay every time the user scrolls past the section.
 */
function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px", ...options },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, isInView] as const;
}

/**
 * Shared animation classes:
 * - Mobile (default): slide up from bottom (translate-y-8 -> 0)
 * - Desktop (md+): slide in from the right (translate-x-14 -> 0)
 */
const getAnimClasses = (inView: boolean) =>
  `transition-all duration-700 ease-out ${
    inView
      ? "opacity-100 translate-y-0 translate-x-0"
      : "opacity-0 translate-y-8 md:translate-y-0 md:translate-x-14"
  }`;

const BULLET_ITEMS = [
  "Direct Farm Procurement",
  "Zero Artificial Dyes & Starch",
  "4-Layer Aroma Lock Pouches",
  "NABL Lab Tested Every Batch",
];

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate, isStoryPage }) => {
  const [badgeRef, badgeInView] = useInView<HTMLDivElement>();
  const [headingRef, headingInView] = useInView<HTMLHeadingElement>();
  const [para1Ref, para1InView] = useInView<HTMLParagraphElement>();
  const [para2Ref, para2InView] = useInView<HTMLParagraphElement>();
  const [bulletsRef, bulletsInView] = useInView<HTMLDivElement>();
  const [ctaRef, ctaInView] = useInView<HTMLDivElement>();
 

  return (
    <section
      id="about-section"
      className="relative overflow-hidden bg-[#EFECE1] py-14 sm:py-20 lg:py-28"
    >
      <div className="relative z-10 mx-auto max-w-[95vw] md:max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Column 1: Image Left — editorial frame treatment */}
          <div className="hidden lg:block lg:col-span-6">
            <div className="relative mx-auto max-w-md sm:max-w-lg lg:max-w-none">
              {/* Offset frame — thin hairline instead of a blurred glow */}
              <div className="absolute -bottom-3 -right-3 h-full w-full rounded-[1.75rem] border-2 border-[#D6A146] sm:-bottom-4 sm:-right-4" />

              {/* Dot-grid texture, tucked behind the top-left corner */}
              <svg
                aria-hidden="true"
                className="absolute -left-4 -top-4 h-20 w-20 text-[#284C38]/25 sm:-left-6 sm:-top-6 sm:h-24 sm:w-24"
              >
                <pattern
                  id="about-dots"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#about-dots)" />
              </svg>

              {/* Vertical signature label — a quiet detail, not a default numbered marker */}
              <div className="absolute -left-9 top-1/2 hidden -translate-y-1/2 -rotate-180 [writing-mode:vertical-lr] md:block">
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#284C38]/60">
                  Farm to Mortar
                </span>
              </div>

              {/* Photo */}
              <div className="relative overflow-hidden rounded-[1.75rem] shadow-xl">
                <img
                  src={TRADITION_IMAGE}
                  alt="Traditional Stone Grinding of ENU Spices"
                  className="h-[340px] w-full transform object-cover object-center transition-transform duration-700 hover:scale-105 sm:h-[420px] lg:h-[480px]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1D]/50 via-transparent to-transparent" />
              </div>

              {/* Wax-seal badge — visible at every breakpoint now, scaled down on mobile */}
              <div className="absolute -top-5 -right-3 flex h-16 w-16 -rotate-6 flex-col items-center justify-center rounded-full border-2 border-[#D6A146] bg-[#284C38] text-white shadow-lg sm:-top-6 sm:-right-5 sm:h-20 sm:w-20">
                <Award className="h-4 w-4 text-[#D6A146] sm:h-5 sm:w-5" />
                <span className="mt-0.5 font-heading text-sm font-bold leading-none text-[#D6A146] sm:text-base">
                  100%
                </span>
                <span className="text-[6px] font-medium uppercase tracking-wider text-white/85 sm:text-[7px]">
                  Purity
                </span>
              </div>
            </div>

            {/* Caption bar — sits below the frame instead of covering the photo */}
            <div className="relative z-10 mx-auto mt-8 max-w-md rounded-2xl border border-[#284C38]/10 bg-white/70 px-5 py-4 shadow-sm backdrop-blur-sm sm:mt-10 sm:max-w-lg sm:px-6 sm:py-5 lg:max-w-none">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D6A146]/15 sm:h-12 sm:w-12">
                  <Sparkles className="h-5 w-5 text-[#D6A146]" />
                </div>
                <div className="min-w-0">
                  <div className="font-heading text-base font-bold text-[#1D1D1D] sm:text-lg">
                    Low Temp Grinding
                  </div>
                  <div className="mt-0.5 font-body text-xs font-light leading-snug text-[#1D1D1D]/65 sm:text-sm">
                    Preserving 100% volatile essential oils &amp; aroma below
                    35&deg;C
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Content Right */}
          <div className="space-y-6 text-left lg:col-span-6">
            <div
              ref={badgeRef}
              style={{ transitionDelay: "0ms" }}
              className={`inline-flex items-center gap-2 rounded-full border border-[#284C38]/20 bg-[#284C38]/10 px-3.5 py-1 font-btn text-xs font-semibold uppercase tracking-wider text-[#284C38] ${getAnimClasses(
                badgeInView,
              )}`}
            >
              <Shield className="h-3.5 w-3.5 text-[#D6A146]" />
              <span>Authentic Spice Artisans</span>
            </div>

            <h2
              ref={headingRef}
              style={{ transitionDelay: "100ms" }}
              className={`font-heading text-3xl font-bold leading-tight text-[#1D1D1D] sm:text-4xl lg:text-5xl ${getAnimClasses(
                headingInView,
              )}`}
            >
              Crafted With Tradition.{" "}
              <span className="block text-[#284C38] sm:inline sm:whitespace-nowrap">
                Trusted By Every Kitchen.
              </span>
            </h2>

            {/* Column 1: Image Left — editorial frame treatment */}
            <div className="lg:hidden lg:col-span-6">
              <div className="relative mx-auto max-w-md sm:max-w-lg lg:max-w-none">
                {/* Offset frame — thin hairline instead of a blurred glow */}
                {/* <div className="absolute -bottom-3 -right-3 h-full w-full rounded-[1.75rem] border-2 border-[#D6A146] sm:-bottom-4 sm:-right-4" /> */}

                {/* Photo */}
                <div className="relative overflow-hidden rounded-[0.75rem] shadow-xl">
                  <img
                    src={TRADITION_IMAGE}
                    alt="Traditional Stone Grinding of ENU Spices"
                    className="h-[340px] w-full transform object-cover object-center transition-transform duration-700 hover:scale-105 sm:h-[420px] lg:h-[480px]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1D]/50 via-transparent to-transparent" />
                </div>

                {/* Wax-seal badge — visible at every breakpoint now, scaled down on mobile */}
                <div className="absolute -top-5 -right-3 flex h-16 w-16 -rotate-6 flex-col items-center justify-center rounded-full border-2 border-[#D6A146] bg-[#284C38] text-white shadow-lg sm:-top-6 sm:-right-5 sm:h-20 sm:w-20">
                  <Award className="h-4 w-4 text-[#D6A146] sm:h-5 sm:w-5" />
                  <span className="mt-0.5 font-heading text-sm font-bold leading-none text-[#D6A146] sm:text-base">
                    100%
                  </span>
                  <span className="text-[6px] font-medium uppercase tracking-wider text-white/85 sm:text-[7px]">
                    Purity
                  </span>
                </div>
              </div>
            </div>

            <p
              ref={para1Ref}
              style={{ transitionDelay: "200ms" }}
              className={`font-body text-base font-light leading-relaxed text-gray-700 ${getAnimClasses(
                para1InView,
              )}`}
            >
              At{" "}
              <strong className="font-medium text-[#284C38]">ENU Foods</strong>,
              we believe that real Indian food begins with pure, unadulterated
              spices. From the fertile farms of South India to the aromatic herb
              fields of Rajasthan, every spice seed in our collection is
              carefully chosen at peak harvest.
            </p>

            {isStoryPage && (
              <>
                <p
                  ref={para2Ref}
                  style={{ transitionDelay: "300ms" }}
                  className={`font-body text-base font-light leading-relaxed text-gray-700 ${getAnimClasses(
                    para2InView,
                  )}`}
                >
                  We reject high-speed industrial milling that scorches delicate
                  aroma oils. Instead, our spices are ground using
                  state-of-the-art Cold Grinding Technology below 35&deg;C —
                  locking in rich natural colors, medicinal antioxidants, and
                  unforgettable traditional taste.
                </p>
              </>
            )}

            {/* Key Bullet Highlights — each item animates in one by one */}
            <div
              ref={bulletsRef}
              className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2"
            >
              {BULLET_ITEMS.map((label, index) => (
                <div
                  key={label}
                  style={{ transitionDelay: `${400 + index * 150}ms` }}
                  className={`flex items-center gap-2.5 ${getAnimClasses(
                    bulletsInView,
                  )}`}
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#284C38]" />
                  <span className="font-body text-sm font-medium text-[#1D1D1D]">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {!isStoryPage && (
              <>
                {/* Action CTA Button */}
                <div
                  ref={ctaRef}
                  style={{
                    transitionDelay: `${400 + BULLET_ITEMS.length * 150}ms`,
                  }}
                  className={`pt-4 ${getAnimClasses(ctaInView)}`}
                >
                  <button
                    id="about-learn-more-btn"
                    onClick={() => onNavigate("story")}
                    className="text-xs md:text-md text-nowrap gap-1 group inline-flex w-full items-center justify-center md:gap-2 rounded-full bg-[#284C38] px-4 md:px-7 py-3 md:py-3.5 font-btn font-medium text-white shadow-md transition-all duration-300 hover:bg-[#1E3A2B] hover:shadow-xl sm:w-auto"
                  >
                    <span>Discover Our Manufacturing Process</span>
                    <ArrowRight className="h-4 w-4 text-[#D6A146] transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
