"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import { NavigationPage, Product, Recipe, CartItem, OrderDetails } from "./types";
import { PRODUCTS, RECIPES } from "./data/mockData";

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
import { RecipeDetailPage } from "./components/pages/RecipeDetailPage";
import { CartDrawer } from "./components/overlays/CartDrawer";
import { PrivacyPolicyPage } from "./components/pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "./components/pages/TermsOfServicePage";
import { RecipesPage } from "./components/pages/RecipesPage";
import { CombosPage } from "./components/pages/CombosPage";
import { BestsellersPage } from "./components/pages/BestsellersPage";
import { NewArrivalsPage } from "./components/pages/NewArrivalsPage";

export default function App() {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<
    string | undefined
  >(undefined);

  // =========================================================
  // LOADER
  // =========================================================

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // =========================================================
  // USER & ORDER STATE
  // =========================================================

  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [orders, setOrders] = useState<OrderDetails[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("enu_user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }

    const storedOrders = localStorage.getItem("enu_orders");
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogin = (user: { name: string; email: string; phone: string }) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("enu_user");
    setCurrentUser(null);
    handleNavigate("home");
  };

  const handleOrderPlaced = (order: OrderDetails) => {
    const updatedOrders = [order, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem("enu_orders", JSON.stringify(updatedOrders));
  };

  // =========================================================
  // CART
  // =========================================================

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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
    if (isLoading) return;
    const dismissed = localStorage.getItem("enu_auth_modal_dismissed");
    const storedUser = localStorage.getItem("enu_user");
    if (!dismissed && !storedUser) {
      const timer = setTimeout(() => setIsAuthModalOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const openAuthModal = () => setIsAuthModalOpen(true);

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
  
  const productMatch = routingPathname.match(/^\/products\/([^/]+)/);
  const recipeMatch = routingPathname.match(/^\/recipes\/([^/]+)/);
  
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

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
  // ADD TO CART
  // =========================================================

  const handleAddToCart = (
    product: Product,
    weight?: string,
    qty: number = 1,
  ) => {
    const targetWeight = weight || product.defaultWeight;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedWeight === targetWeight,
      );

      if (existingIndex > -1) {
        const updated = [...prev];

        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
        };

        return updated;
      }

      return [
        ...prev,
        {
          product,
          selectedWeight: targetWeight,
          quantity: qty,
        },
      ];
    });

    /*
     * Desktop behaviour:
     * Add product → open cart drawer → URL becomes /cart
     *
     * Mobile:
     * Keep CartPopup behaviour.
     */
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      openCart(false);
    }
  };

  // =========================================================
  // UPDATE CART QUANTITY
  // =========================================================

  const handleUpdateQuantity = (
    productId: string,
    weight: string,
    newQty: number,
  ) => {
    if (newQty <= 0) {
      handleRemoveItem(productId, weight);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedWeight === weight) {
          return {
            ...item,
            quantity: newQty,
          };
        }

        return item;
      }),
    );
  };

  // =========================================================
  // REMOVE CART ITEM
  // =========================================================

  const handleRemoveItem = (productId: string, weight: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item.product.id === productId && item.selectedWeight === weight),
      ),
    );
  };

  // =========================================================
  // CLEAR CART
  // =========================================================

  const handleClearCart = () => {
    setCartItems([]);
  };

  // =========================================================
  // NAVIGATION
  // =========================================================

  const handleNavigate = (
    page: NavigationPage,
    categoryName?: string,
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
    if (categoryName) {
      setSelectedCategoryFilter(categoryName);
      router.push("/products");
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
      setSelectedCategoryFilter(undefined);
      router.push("/products");
      return;
    }

    if (page === "recipes") {
      router.push("/recipes");
      return;
    }

    if (page === "combos") {
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
                onSelectCategory={(catName) => {
                  setSelectedCategoryFilter(catName);
                  router.push("/products");
                }}
                onNavigate={handleNavigate}
              />

              <FeaturedProducts
                onNavigate={handleNavigate}
                onAddToCart={handleAddToCart}
              />

              <RecipesSection
                onSelectRecipe={(recipe: Recipe) => {
                  router.push(`/recipes/${recipe.id}`);
                }}
                onNavigate={handleNavigate}
              />

              <NewArrivals
                onNavigate={handleNavigate}
                onAddToCart={handleAddToCart}
              />

              <SuperSaverCombos
                onNavigate={handleNavigate}
                onAddComboToCart={handleAddToCart}
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
            selectedCategoryFilter={selectedCategoryFilter}
            onAddToCart={handleAddToCart}
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
            onAddToCart={handleAddToCart}
          />
        )}

        {/* ===================================================
            RECIPES
        =================================================== */}

        {currentPage === "recipes" && (
          <RecipesPage
            onSelectRecipe={(recipe: Recipe) => {
              router.push(`/recipes/${recipe.id}`);
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
            onAddToCart={handleAddToCart}
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
            onAddToCart={handleAddToCart}
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
            onAddToCart={handleAddToCart}
          />
        )}

        {/* ===================================================
            RECIPE DETAIL
        =================================================== */}

        {currentPage === "recipe-detail" && activeRecipeId && (
          <RecipeDetailPage
            recipe={RECIPES.find((r) => r.id === activeRecipeId)!}
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

        {currentPage === "checkout" && (
          <CheckoutWizard
            cartItems={cartItems}
            onClearCart={handleClearCart}
            onOrderPlaced={handleOrderPlaced}
          />
        )}

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
          <OrderHistoryPage orders={orders} onNavigate={handleNavigate} />
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

      <CartPopup cartItems={cartItems} onOpenCart={() => openCart(true)} />

      {/* =====================================================
          AUTH WELCOME MODAL
      ===================================================== */}

      <AuthWelcomeModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onNavigate={handleNavigate}
      />

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <SearchOverlayModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectRecipe={(recipe: Recipe) => {
          router.push(`/recipes/${recipe.id}`);
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
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onAddToCart={handleAddToCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          router.push("/checkout");
        }}
      />

      {/* Checkout modal has been moved inline to main content as a routeable page */}
    </div>
  );
}
