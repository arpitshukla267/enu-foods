"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import { NavigationPage, Product, Recipe } from "./types";

import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { StartupLoader } from "./components/layout/StartupLoader";
import { MobileBottomNav } from "./components/layout/MobileBottomNav";

import { Hero } from "./components/sections/Hero";
import { TrustSection } from "./components/sections/TrustSection";
import { AboutSection } from "./components/sections/AboutSection";
import { ProductCategories } from "./components/sections/ProductCategories";
import { FeaturedProducts } from "./components/sections/FeaturedProducts";
import { WhyChooseUs } from "./components/sections/WhyChooseUs";
import { ManufacturingJourney } from "./components/sections/ManufacturingJourney";
import { RecipesSection } from "./components/sections/RecipesSection";
import { Testimonials } from "./components/sections/Testimonials";
import { Certifications } from "./components/sections/Certifications";
import { NewArrivals } from "./components/sections/NewArrivals";
import { SuperSaverCombos } from "./components/sections/SuperSaverCombos";

import { AuthWelcomeModal } from "./components/overlays/AuthWelcomeModal";
import { SearchOverlayModal } from "./components/overlays/SearchOverlayModal";
import { CartPopup } from "./components/overlays/CartPopup";

import { ProductCatalogPage } from "./components/pages/ProductCatalogPage";
import ProductDetailPageWrapper from "../app/products/[productId]/page";
import { ContactPage } from "./components/pages/ContactPage";
import { CheckoutWizard } from "./components/pages/CheckoutWizard";
import { LoginPage } from "./components/pages/LoginPage";
import { SignupPage } from "./components/pages/SignupPage";
import { OrderHistoryPage } from "./components/pages/OrderHistoryPage";
import { OrderDetailPage } from "./components/pages/OrderDetailPage";
import { RecipeDetailPage } from "./components/pages/RecipeDetailPage";
import { CartDrawer } from "./components/overlays/CartDrawer";
import { PrivacyPolicyPage } from "./components/pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "./components/pages/TermsOfServicePage";
import { RecipesPage } from "./components/pages/RecipesPage";
import { CombosPage } from "./components/pages/CombosPage";
import { ComboDetailPage } from "./components/pages/ComboDetailPage";
import { getComboRouteSlug } from "./lib/comboApi";
import { getRecipeRouteSlug } from "./lib/recipeApi";
import { BestsellersPage } from "./components/pages/BestsellersPage";
import { NewArrivalsPage } from "./components/pages/NewArrivalsPage";

import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext";


export default function App() {
  const router = useRouter();
  const pathname = usePathname();

  const {
    user: currentUser,
    isAuthenticated,
    isLoading: authLoading,
    logout,
  } = useAuth();

  const {
    cartItems,
    subtotal: cartSubtotal,
    totalItems: cartCount,
    appliedCoupon: cartAppliedCoupon,
    discount: cartDiscount,
    total: cartTotal,
    isLoading: cartLoading,
    isMutating: cartMutating,
    isCouponLoading,
    couponError,
    error: cartError,
    addToCart: handleAddToCart,
    updateQuantity: handleUpdateQuantity,
    removeItem: handleRemoveItem,
    clearCart: handleClearCart,
    applyCoupon: handleApplyCoupon,
    removeCoupon: handleRemoveCoupon,
  } = useCart();

  // =========================================================
  // LOADER
  // =========================================================

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // =========================================================
  // USER STATE
  // =========================================================

  const handleLogout = () => {
    logout();
    handleNavigate("home");
  };

  // =========================================================
  // CART UI
  // =========================================================

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // =========================================================
  // SEARCH
  // =========================================================

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // =========================================================
  // AUTH MODAL
  // =========================================================

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isLoading || authLoading) return;
  
    const dismissed = localStorage.getItem("enu_auth_modal_dismissed");
  
    if (!dismissed && !isAuthenticated) {
      const timer = setTimeout(() => {
        setIsAuthModalOpen(true);
      }, 800);
  
      return () => clearTimeout(timer);
    }
  }, [isLoading, authLoading, isAuthenticated]);

  const openAuthModal = () => setIsAuthModalOpen(true);

  const handleLogin = () => {
    openAuthModal();
    handleNavigate("home");
  };

  // =========================================================
  // CART ROUTE HISTORY
  // =========================================================

  /*
   * We don't want router.back() to behave unexpectedly when
   * /cart is opened directly.
   *
   * This remembers whether /cart was opened from inside the app.
   */
  const previousPathRef = useRef<string | null>(null);

  // =========================================================
  // CURRENT PAGE FROM URL
  // =========================================================

  // Strip trailing "/cart" if present for page routing, so the background page is preserved
  let routingPathname = pathname || "/";
  if (routingPathname.endsWith("/cart") && routingPathname !== "/cart") {
    routingPathname = routingPathname.slice(0, -5); // remove "/cart"
  } else if (routingPathname === "/cart") {
    routingPathname = "/";
  }

  let currentPage: NavigationPage = "home";
  
  let activeProductId: string | undefined = undefined;
  let activeRecipeId: string | undefined = undefined;
  let activeComboId: string | undefined = undefined;
  let activeOrderId: string | undefined = undefined;
  
  const productMatch = routingPathname.match(/^\/products\/([^/]+)/);
  const recipeMatch = routingPathname.match(/^\/recipes\/([^/]+)/);
  const comboMatch = routingPathname.match(/^\/combos\/([^/]+)/);
  const orderMatch = routingPathname.match(/^\/orders\/([^/]+)/);
  
  if (productMatch) {
    currentPage = "product-detail";
    activeProductId = productMatch[1];
  } else if (routingPathname === "/products") {
    currentPage = "products";
  } else if (recipeMatch) {
    currentPage = "recipe-detail";
    activeRecipeId = recipeMatch[1];
  } else if (routingPathname === "/recipes") {
    currentPage = "recipes";
  } else if (comboMatch) {
    currentPage = "combo-detail";
    activeComboId = comboMatch[1];
  } else if (routingPathname === "/combos") {
    currentPage = "combos";
  } else if (routingPathname === "/bestsellers") {
    currentPage = "bestsellers";
  } else if (routingPathname === "/new-arrivals") {
    currentPage = "new-arrivals";
  } else if (routingPathname === "/story") {
    currentPage = "story";
  } else if (routingPathname === "/contact") {
    currentPage = "contact";
  } else if (routingPathname === "/checkout") {
    currentPage = "checkout";
  } else if (routingPathname === "/login") {
    currentPage = "login";
  } else if (routingPathname === "/signup") {
    currentPage = "signup";
  } else if (orderMatch) {
    currentPage = "order-detail";
    activeOrderId = orderMatch[1];
  } else if (routingPathname === "/orders") {
    currentPage = "orders";
  } else if (routingPathname === "/privacy") {
    currentPage = "privacy";
  } else if (routingPathname === "/terms") {
    currentPage = "terms";
  }

  // =========================================================
  // CART ROUTE
  // =========================================================

  const isCartRoute = pathname?.endsWith("/cart") || false;

  /*
   * Whenever URL ends with /cart, open the drawer.
   */
  useEffect(() => {
    if (pathname?.endsWith("/cart")) {
      setIsCartOpen(true);
    }
  }, [pathname]);

  /*
   * If URL changes away from /cart, make sure drawer is closed.
   */
  useEffect(() => {
    if (!pathname?.endsWith("/cart")) {
      setIsCartOpen(false);
    }
  }, [pathname]);

  // =========================================================
  // SCROLL TO TOP ON ROUTE CHANGE
  // =========================================================

  useEffect(() => {
    if (pathname?.endsWith("/cart") || pathname === "/cart") {
      return;
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  // =========================================================
  // CART COUNT
  // =========================================================

  // cartCount comes from CartContext

  // =========================================================
  // OPEN CART
  // =========================================================

  const openCart = (updateRoute = true) => {
    if (updateRoute && !pathname?.endsWith("/cart")) {
      previousPathRef.current = pathname;
      const targetPath = pathname === "/" ? "/cart" : `${pathname}/cart`;
      router.push(targetPath, { scroll: false });
    }
  
    setIsCartOpen(true);
  };

  // =========================================================
  // CLOSE CART
  // =========================================================

  const closeCart = () => {
    setIsCartOpen(false);
  
    if (pathname?.endsWith("/cart")) {
      if (previousPathRef.current) {
        const previousPath = previousPathRef.current;
        previousPathRef.current = null;
  
        router.push(previousPath, { scroll: false });
      } else {
        const targetPath = pathname === "/cart" ? "/" : pathname.slice(0, -5);
        router.push(targetPath, { scroll: false });
      }
    }
  };

  // =========================================================
  // ADD TO CART WRAPPER
  // =========================================================

  const handleAddToCartWithDrawer = async (
    product: Product,
    weight?: string,
    qty: number = 1,
  ) => {
    await handleAddToCart(product, weight, qty);

    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      openCart(false);
    }
  };

  // =========================================================
  // NAVIGATION
  // =========================================================

  const handleNavigate = (
    page: NavigationPage,
    categorySlug?: string,
    productId?: string,
  ) => {
    /*
     * Product detail
     */
    if (productId) {
      router.push(`/products/${productId}`);
      return;
    }

    /*
     * Category filter
     */
    if (categorySlug) {
      router.push(`/products?category=${encodeURIComponent(categorySlug)}`);
      return;
    }

    /*
     * Normal routes
     */
    if (page === "home") {
      router.push("/");
      return;
    }

    if (page === "products") {
      router.push("/products");
      return;
    }

    if (page === "recipes") {
      router.push("/recipes");
      return;
    }

    if (page === "combos") {
      if (productId) {
        router.push(`/combos/${productId}`);
        return;
      }
      router.push("/combos");
      return;
    }

    if (page === "combo-detail") {
      if (productId) {
        router.push(`/combos/${productId}`);
        return;
      }
      router.push("/combos");
      return;
    }

    if (page === "bestsellers") {
      router.push("/bestsellers");
      return;
    }

    if (page === "new-arrivals") {
      router.push("/new-arrivals");
      return;
    }

    if (page === "story") {
      router.push("/story");
      return;
    }

    if (page === "contact") {
      router.push("/contact");
      return;
    }

    if (page === "checkout") {
      router.push("/checkout");
      return;
    }

    if (page === "login") {
      router.push("/login");
      return;
    }

    if (page === "signup") {
      router.push("/signup");
      return;
    }

    if (page === "orders") {
      router.push("/orders");
      return;
    }

    if (page === "privacy") {
      router.push("/privacy");
      return;
    }

    if (page === "terms") {
      router.push("/terms");
      return;
    }

    /*
     * Cart
     */
    if (page === "cart") {
      openCart();
      return;
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#F7F5EF]
        text-[#1D1D1D]
        font-sans
        flex
        flex-col
        selection:bg-[#D6A146]
        selection:text-white
        pb-10
        md:pb-0
      "
    >
      {/* =====================================================
          STARTUP LOADER
      ===================================================== */}

      {isLoading && <StartupLoader onFinish={() => setIsLoading(false)} />}

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        cartCount={cartCount}
        onOpenCart={() => openCart(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={openAuthModal}
      />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="flex-1">
        {/* ===================================================
            HOME
        =================================================== */}

        {currentPage === "home" && (
          <>
            <Hero onNavigate={handleNavigate} />

            <div className="relative z-10 bg-[#F7F5EF]">
              <ProductCategories
                onSelectCategory={(categorySlug) => {
                  setSelectedCategoryFilter(categorySlug);
                  router.push(
                    `/products?category=${encodeURIComponent(categorySlug)}`,
                  );
                }}
                onNavigate={handleNavigate}
              />

              <FeaturedProducts
                onNavigate={handleNavigate}
                onAddToCart={handleAddToCartWithDrawer}
              />

              <RecipesSection
                onSelectRecipe={(recipe: Recipe) => {
                  router.push(`/recipes/${getRecipeRouteSlug(recipe)}`);
                }}
                onNavigate={handleNavigate}
              />

              <NewArrivals
                onNavigate={handleNavigate}
                onAddToCart={handleAddToCartWithDrawer}
              />

              <SuperSaverCombos
                onNavigate={handleNavigate}
                onAddComboToCart={handleAddToCartWithDrawer}
              />

              {/* <TrustSection /> */}

              <AboutSection onNavigate={handleNavigate} isStoryPage={false} />

              {/* <WhyChooseUs /> */}

              <ManufacturingJourney />
              <Certifications />

              <Testimonials />

            </div>
          </>
        )}

        {/* ===================================================
            PRODUCTS
        =================================================== */}

        {currentPage === "products" && (
          <ProductCatalogPage
            onAddToCart={handleAddToCartWithDrawer}
          />
        )}

        {/* ===================================================
            PRODUCT DETAIL
        =================================================== */}

        {currentPage === "product-detail" && activeProductId && (
          <ProductDetailPageWrapper
            params={{
              productId: activeProductId,
            }}
            onAddToCart={handleAddToCartWithDrawer}
          />
        )}

        {/* ===================================================
            RECIPES
        =================================================== */}

        {currentPage === "recipes" && (
          <RecipesPage
            onSelectRecipe={(recipe: Recipe) => {
              router.push(`/recipes/${getRecipeRouteSlug(recipe)}`);
            }}
            onNavigate={handleNavigate}
          />
        )}

        {/* ===================================================
            SUPER SAVER COMBOS
        =================================================== */}

        {currentPage === "combos" && (
          <CombosPage
            onNavigate={handleNavigate}
            onSelectCombo={(combo) => {
              router.push(`/combos/${getComboRouteSlug(combo)}`);
            }}
            onAddToCart={handleAddToCartWithDrawer}
          />
        )}

        {/* ===================================================
            COMBO DETAIL
        =================================================== */}

        {currentPage === "combo-detail" && activeComboId && (
          <ComboDetailPage
            slug={activeComboId}
            onBack={() => router.push("/combos")}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCartWithDrawer}
          />
        )}

        {/* ===================================================
            BESTSELLERS
        =================================================== */}

        {currentPage === "bestsellers" && (
          <BestsellersPage
            onNavigate={handleNavigate}
            onSelectProduct={(product: Product) => {
              router.push(`/products/${product.id}`);
            }}
            onAddToCart={handleAddToCartWithDrawer}
          />
        )}

        {/* ===================================================
            NEW ARRIVALS
        =================================================== */}

        {currentPage === "new-arrivals" && (
          <NewArrivalsPage
            onNavigate={handleNavigate}
            onSelectProduct={(product: Product) => {
              router.push(`/products/${product.id}`);
            }}
            onAddToCart={handleAddToCartWithDrawer}
          />
        )}

        {/* ===================================================
            RECIPE DETAIL
        =================================================== */}

        {currentPage === "recipe-detail" && activeRecipeId && (
          <RecipeDetailPage
            slug={activeRecipeId}
            onBack={() => router.push("/recipes")}
          />
        )}

        {/* ===================================================
            STORY
        =================================================== */}

        {currentPage === "story" && (
          <div className="pt-24 pb-20">
            <AboutSection
              onNavigate={handleNavigate}
              isStoryPage={currentPage === "story"}
            />

            <ManufacturingJourney />

            <WhyChooseUs />

            <Certifications />
          </div>
        )}

        {/* ===================================================
            CONTACT
        =================================================== */}

        {currentPage === "contact" && <ContactPage />}

        {/* ===================================================
            CHECKOUT
        =================================================== */}

        {currentPage === "checkout" && <CheckoutWizard />}

        {/* ===================================================
            AUTHENTICATION & ORDERS
        =================================================== */}

        {currentPage === "login" && (
          <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />
        )}

        {currentPage === "signup" && (
          <SignupPage onLogin={handleLogin} onNavigate={handleNavigate} />
        )}

        {currentPage === "orders" && (
          <OrderHistoryPage onNavigate={handleNavigate} />
        )}

        {currentPage === "order-detail" && activeOrderId && (
          <OrderDetailPage orderId={activeOrderId} onNavigate={handleNavigate} />
        )}

        {currentPage === "privacy" && <PrivacyPolicyPage />}

        {currentPage === "terms" && <TermsOfServicePage />}
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer onNavigate={handleNavigate} />

      {/* =====================================================
          MOBILE BOTTOM NAV
      ===================================================== */}

      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={cartCount}
        onOpenCart={() => openCart(true)}
        onOpenAuth={openAuthModal}
      />

      {/* =====================================================
          CART POPUP
          /cart is already excluded inside CartPopup
      ===================================================== */}

      <CartPopup
        cartItems={cartItems}
        onOpenCart={() => openCart(true)}
        isSearchOpen={isSearchOpen}
      />

      {/* =====================================================
          AUTH WELCOME MODAL
      ===================================================== */}

      <AuthWelcomeModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <SearchOverlayModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectRecipe={(recipe: Recipe) => {
          router.push(`/recipes/${getRecipeRouteSlug(recipe)}`);
        }}
        onNavigate={handleNavigate}
      />

      {/* =====================================================
          CART DRAWER
      ===================================================== */}

      <CartDrawer
        isOpen={isCartOpen || isCartRoute}
        onClose={closeCart}
        cartItems={cartItems}
        subtotal={cartSubtotal}
        total={cartTotal}
        discount={cartDiscount}
        appliedCoupon={cartAppliedCoupon}
        isAuthenticated={isAuthenticated}
        isLoading={cartLoading}
        isMutating={cartMutating}
        isCouponLoading={isCouponLoading}
        couponError={couponError}
        error={cartError}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onAddToCart={handleAddToCartWithDrawer}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          router.push("/checkout");
        }}
      />

      {/* Checkout modal has been moved inline to main content as a routeable page */}
    </div>
  );
}
