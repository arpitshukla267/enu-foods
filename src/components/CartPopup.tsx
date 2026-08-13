"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronRight, ShoppingBag, Check } from "lucide-react";

interface CartPopupProps {
  cartItems?: Array<{
    product?: any;
    id?: string;
    name?: string;
    image?: string;
    images?: any[];
    selectedWeight?: string;
    quantity: number;
  }>;
  onOpenCart?: () => void;
}

export function CartPopup({
  cartItems: propsCartItems,
  onOpenCart,
}: CartPopupProps) {
  const router = useRouter();
  const pathname = usePathname();

  const cartItems = useMemo(() => {
    return propsCartItems || [];
  }, [propsCartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cartItems]);

  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [newItemAdded, setNewItemAdded] = useState(false);

  // Entrance animation phases: hidden → circle → expanding → content → done
  const hasAppearedRef = useRef(false);
  const [entrancePhase, setEntrancePhase] = useState<
    "hidden" | "circle" | "expanding" | "content" | "done"
  >("hidden");

  // Track TOTAL QUANTITY (not array length) so adding an existing product
  // (which bumps quantity instead of pushing a new array entry) still
  // triggers the "Added to Cart" pop reliably.
  const prevTotalRef = useRef(-1);
  const newItemTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get last 3 items (most recent first)
  const recentItems = useMemo(() => {
    const lastThree = cartItems.slice(-3);
    return [...lastThree].reverse();
  }, [cartItems]);

  // Detect when new item is added
  useEffect(() => {
    if (prevTotalRef.current === -1) {
      prevTotalRef.current = totalItems;
      return;
    }

    if (totalItems > prevTotalRef.current) {
      setNewItemAdded(true);
      if (newItemTimerRef.current) {
        clearTimeout(newItemTimerRef.current);
      }
      newItemTimerRef.current = setTimeout(() => {
        setNewItemAdded(false);
        newItemTimerRef.current = null;
      }, 3000);
    }
    prevTotalRef.current = totalItems;

    return () => {
      if (newItemTimerRef.current) {
        clearTimeout(newItemTimerRef.current);
      }
    };
  }, [totalItems]);

  const getItemImage = (item: any) => {
    if (item?.product?.image) return item.product.image;
    if (item?.image) return item.image;
    if (item?.images && item.images[0]) {
      const firstImage = item.images[0];
      return typeof firstImage === "string" ? firstImage : firstImage?.url;
    }
    return null;
  };

  const getItemName = (item: any) => {
    return item?.product?.name || item?.name || "Spice Pouch";
  };

  const excludedPaths = [
    "/cart",
    "/checkout",
    "/recipes",
    "/contact",
    "/about",
    "/privacy-policy",
    "/terms-of-service",
    "/story",
  ];
  
  const isDynamicExcludedPage =
    pathname?.startsWith("/recipes/") || pathname?.startsWith("/products/");
  
  const isExcludedPage =
    excludedPaths.includes(pathname || "") || isDynamicExcludedPage;

  // Detect open filter/sort panels and modals
  useEffect(() => {
    const checkPanels = () => {
      const backdrops = document.querySelectorAll(
        '[class*="z-[70]"], [class*="z-70"]',
      );
      const hasOpenPanel =
        backdrops.length > 0 &&
        Array.from(backdrops).some(
          (el) =>
            el.classList.contains("fixed") || el.classList.contains("bg-black"),
        );

      const modals = document.querySelectorAll(
        '.fixed.inset-0[class*="z-50"], .fixed.inset-0[class*="z-[50]"]',
      );

      const hasOpenModal =
        modals.length > 0 &&
        Array.from(modals).some(
          (el) =>
            el.classList.contains("bg-black") ||
            el.classList.contains("backdrop-blur"),
        );

      setIsPanelOpen(hasOpenPanel || hasOpenModal);
    };

    checkPanels();
    const observer = new MutationObserver(checkPanels);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    const interval = setInterval(checkPanels, 200);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  /**
   * Visibility + entrance animation sequencing
   * Phase timeline:
   *   0ms    → 'circle'    (small circle with cart icon rises from bottom)
   *   700ms  → 'expanding' (circle grows into the bar; icon fades out in place)
   *   1050ms → 'content'   (inner content fades in from below)
   *   1400ms → 'done'      (normal interactive state)
   */
  useEffect(() => {
    const show = totalItems > 0 && !isExcludedPage && !isPanelOpen;

    setShouldShow(show);

    if (!show) {
      setIsVisible(false);
      setEntrancePhase("hidden");
      hasAppearedRef.current = false;
      return;
    }

    if (!hasAppearedRef.current) {
      hasAppearedRef.current = true;

      setEntrancePhase("circle");
      setIsVisible(false);

      const t1 = setTimeout(() => setEntrancePhase("expanding"), 700);
      const t2 = setTimeout(() => setEntrancePhase("content"), 1050);
      const t3 = setTimeout(() => {
        setEntrancePhase("done");
        setIsVisible(true);
      }, 1400);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }

    setEntrancePhase("done");
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [totalItems, isExcludedPage, isPanelOpen]);

  const handleCartClick = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      router.push("/cart");
    }
  };

  // ---- Width measurement via ResizeObserver ----
  // Keeps target width correct even if images or web fonts finish loading
  // AFTER the initial measurement — it just smoothly re-transitions instead
  // of snapping.
  const mobileMeasureRef = useRef<HTMLDivElement>(null);
  const desktopMeasureRef = useRef<HTMLDivElement>(null);
  const [mobileTargetWidth, setMobileTargetWidth] = useState<number | null>(
    null,
  );
  const [desktopTargetWidth, setDesktopTargetWidth] = useState<number | null>(
    null,
  );

  useLayoutEffect(() => {
    const mobileEl = mobileMeasureRef.current;
    const desktopEl = desktopMeasureRef.current;
    if (!mobileEl && !desktopEl) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = Math.ceil(entry.contentRect.width) + 36; // + horizontal padding
        if (entry.target === mobileEl) setMobileTargetWidth(width);
        if (entry.target === desktopEl) setDesktopTargetWidth(width);
      }
    });

    if (mobileEl) ro.observe(mobileEl);
    if (desktopEl) ro.observe(desktopEl);

    return () => ro.disconnect();
  }, [recentItems, totalItems, newItemAdded]);

  if (!shouldShow) return null;

  const isEntrancing = entrancePhase !== "done" && entrancePhase !== "hidden";
  const isCircle = entrancePhase === "circle";
  const showContent = entrancePhase === "content" || entrancePhase === "done";

  const avatarStack = (sizeClass: string, marginClass: string) => (
    <>
      {recentItems.map((item, index) => {
        const itemImage = getItemImage(item);
        const isNewest = index === 0 && newItemAdded;
        return (
          <div
            key={`avatar-${item?.product?.id || item?.id || index}-${index}`}
            className={`relative ${sizeClass} rounded-full overflow-hidden border-2 border-[#F7F5EF] bg-[#284C38] shrink-0 shadow-md transition-all duration-300 ${index > 0 ? marginClass : ""} ${isNewest ? "ring-2 ring-[#D6A146]" : ""}`}
            style={{
              zIndex: recentItems.length - index,
              animation: isNewest
                ? "slideFromRightToFirst 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                : undefined,
            }}
          >
            {itemImage ? (
              <img
                src={itemImage}
                alt={getItemName(item)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#D6A146]">
                <ShoppingBag className="w-4 h-4" />
              </div>
            )}
          </div>
        );
      })}
    </>
  );

  // Fixed size of the circle stage — used to pin the icon's position so it
  // never drifts as the pill widens.
  const CIRCLE_SIZE = 56;

  return (
    <>
      <style>{`
        @keyframes slideFromRightToFirst {
          0% { transform: translateX(45px) scale(0.4); opacity: 0; }
          65% { transform: translateX(-4px) scale(1.18); opacity: 1; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes cartCircleRise {
          0% { opacity: 0; transform: translateY(100px) scale(0.4); }
          60% { opacity: 1; transform: translateY(-8px) scale(1.05); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* ====== MOBILE Cart Popup ====== */}
      <div
        className={`
          fixed inset-x-0 z-[9999] md:hidden
          flex justify-center px-4
          ${entrancePhase === "done" ? "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" : ""}
          ${
            entrancePhase === "done"
              ? isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12 pointer-events-none"
              : ""
          }
        `}
        style={{ bottom: "5.25rem" }}
      >
        <button
          onClick={handleCartClick}
          className="cursor-pointer active:scale-[0.98] transition-transform duration-150 relative"
          style={{
            display: "flex",
            alignItems: "center",
            background: "#1E3A2B",
            color: "#F7F5EF",
            border: "1px solid rgba(214, 161, 70, 0.5)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)",
            overflow: "hidden",
            // Radius is ALWAYS the same fixed px value (never "50%"), so it
            // never has to be interpolated during the width transition —
            // that mismatch (50% ↔ px) was what caused the oval/jerk glitch.
            borderRadius: "9999px",
            ...(isCircle
              ? {
                  width: `${CIRCLE_SIZE}px`,
                  height: `${CIRCLE_SIZE}px`,
                  padding: "0",
                  animation:
                    "cartCircleRise 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
                }
              : {
                  width: mobileTargetWidth ? `${mobileTargetWidth}px` : "auto",
                  maxWidth: "calc(100vw - 32px)",
                  minHeight: `${CIRCLE_SIZE}px`,
                  padding: "10px 16px",
                  transition:
                    "width 0.45s cubic-bezier(0.22, 1, 0.36, 1), padding 0.4s ease",
                }),
          }}
        >
          {/* Hidden measurer - mirrors real content, used only to compute target width */}
          <div
            ref={mobileMeasureRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              visibility: "hidden",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              whiteSpace: "nowrap",
              top: 0,
              left: 0,
            }}
          >
            {recentItems.length > 0 && (
              <div className="flex items-center shrink-0">
                {avatarStack("w-11 h-11", "-ml-3")}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6A146]">
                {newItemAdded ? "Added to cart" : "Items in basket"}
              </span>
              <span className="text-sm font-bold text-white">
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#D6A146]" />
          </div>

          {/* Cart icon - pinned at a fixed spot (the circle's center), so it
              never drifts as the bar widens. Only opacity/scale animate. */}
          <div
            className="flex items-center justify-center"
            style={{
              position: "absolute",
              left: `${CIRCLE_SIZE / 2}px`,
              top: "50%",
              transform: isCircle
                ? "translate(-50%, -50%) scale(1)"
                : "translate(-50%, -50%) scale(0.4)",
              opacity: isCircle ? 1 : 0,
              transition: "opacity 0.3s ease, transform 0.3s ease",
              pointerEvents: "none",
            }}
          >
            <ShoppingBag className="w-6 h-6 text-[#D6A146]" />
          </div>

          {/* Visible content - fades + slides up once the bar has expanded */}
          <div
            className="flex items-center gap-3 w-full"
            style={{
              opacity: showContent ? 1 : 0,
              transform: showContent ? "translateY(0)" : "translateY(10px)",
              transition:
                "opacity 0.35s ease 0.05s, transform 0.35s ease 0.05s",
            }}
          >
            {recentItems.length > 0 && (
              <div
                className="flex items-center shrink-0"
                style={{ overflow: "visible" }}
              >
                {avatarStack("w-11 h-11", "-ml-3")}
              </div>
            )}

            <div className="flex flex-col min-w-0 flex-1">
              <span className="flex items-center justify-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#D6A146] whitespace-nowrap">
                {newItemAdded ? (
                  <>
                    <Check className="w-4 h-4 shrink-0" />
                    Added 
                  </>
                ) : (
                  "View Cart"
                )}
              </span>
              <span className="text-sm font-bold text-white whitespace-nowrap">
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-[#D6A146] text-[#1D1D1D] flex items-center justify-center shrink-0 shadow-md">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </button>
      </div>

      {/* ====== DESKTOP Cart Popup ====== */}
      <div
        className={`
          hidden fixed z-40
          ${entrancePhase === "done" ? "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" : ""}
          ${
            entrancePhase === "done"
              ? isVisible
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
              : ""
          }
        `}
        style={{
          right:
            (entrancePhase === "done" && isVisible) || isEntrancing
              ? "24px"
              : "-100%",
          bottom: "24px",
        }}
      >
        <button
          onClick={handleCartClick}
          className="cursor-pointer hover:scale-[1.02] active:scale-[0.99] transition-transform duration-150 relative"
          style={{
            display: "flex",
            alignItems: "center",
            background: "#1E3A2B",
            color: "#F7F5EF",
            border: "1px solid rgba(214, 161, 70, 0.5)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)",
            textAlign: "left" as const,
            overflow: "hidden",
            borderRadius: "9999px",
            ...(isCircle
              ? {
                  width: `${CIRCLE_SIZE}px`,
                  height: `${CIRCLE_SIZE}px`,
                  padding: "0",
                  animation:
                    "cartCircleRise 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                }
              : {
                  width: desktopTargetWidth
                    ? `${desktopTargetWidth}px`
                    : "auto",
                  maxWidth: "24rem",
                  minHeight: `${CIRCLE_SIZE}px`,
                  padding: "12px 18px",
                  transition:
                    "width 0.45s cubic-bezier(0.22, 1, 0.36, 1), padding 0.4s ease",
                }),
          }}
        >
          {/* Hidden measurer */}
          <div
            ref={desktopMeasureRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              visibility: "hidden",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              whiteSpace: "nowrap",
              top: 0,
              left: 0,
            }}
          >
            {recentItems.length > 0 && (
              <div className="flex items-center shrink-0">
                {avatarStack("w-11 h-11", "-ml-3.5")}
              </div>
            )}
            <div className="flex flex-col pr-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D6A146]">
                {newItemAdded ? "Recently Added" : "Items in Cart"}
              </span>
              <span className="text-sm font-bold text-white">
                {totalItems}{" "}
                {totalItems === 1 ? "Spice Pouch" : "Spice Pouches"}
              </span>
              <span className="text-[11px] text-white/70">
                Click to view your cart
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#D6A146]" />
          </div>

          {/* Cart icon - pinned at fixed spot, fades in place */}
          <div
            className="flex items-center justify-center"
            style={{
              position: "absolute",
              left: `${CIRCLE_SIZE / 2}px`,
              top: "50%",
              transform: isCircle
                ? "translate(-50%, -50%) scale(1)"
                : "translate(-50%, -50%) scale(0.4)",
              opacity: isCircle ? 1 : 0,
              transition: "opacity 0.3s ease, transform 0.3s ease",
              pointerEvents: "none",
            }}
          >
            <ShoppingBag className="w-6 h-6 text-[#D6A146]" />
          </div>

          {/* Visible content */}
          <div
            className="flex items-center gap-4 w-full"
            style={{
              opacity: showContent ? 1 : 0,
              transform: showContent ? "translateY(0)" : "translateY(10px)",
              transition:
                "opacity 0.35s ease 0.05s, transform 0.35s ease 0.05s",
            }}
          >
            {recentItems.length > 0 && (
              <div
                className="flex items-center shrink-0"
                style={{ overflow: "visible" }}
              >
                {avatarStack("w-11 h-11", "-ml-3.5")}
              </div>
            )}

            <div className="flex flex-col pr-2 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D6A146] animate-pulse shrink-0" />
                <span className="text-[11px] font-bold text-[#D6A146] uppercase tracking-wider whitespace-nowrap">
                  {newItemAdded ? "Recently Added" : "Items in Cart"}
                </span>
              </div>
              <span className="text-sm font-bold text-white mt-0.5 whitespace-nowrap">
                {totalItems}{" "}
                {totalItems === 1 ? "Spice Pouch" : "Spice Pouches"}
              </span>
              <span className="text-[11px] text-white/70 whitespace-nowrap">
                Click to view your cart
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-[#D6A146] text-[#1D1D1D] flex items-center justify-center shrink-0 shadow-md ml-auto hover:scale-105 transition-transform">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </button>
      </div>
    </>
  );
}

export default CartPopup;
