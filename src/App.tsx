"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import { NavigationPage, Product, Recipe, CartItem } from "./types";
import { PRODUCTS } from "./data/mockData";

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TrustSection } from "./components/TrustSection";
import { AboutSection } from "./components/AboutSection";
import { ProductCategories } from "./components/ProductCategories";
import { FeaturedProducts } from "./components/FeaturedProducts";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { ManufacturingJourney } from "./components/ManufacturingJourney";
import { RecipesSection } from "./components/RecipesSection";
import { Testimonials } from "./components/Testimonials";
import { Certifications } from "./components/Certifications";
import { Footer } from "./components/Footer";

import { ProductCatalogPage } from "./components/ProductCatalogPage";
import ProductDetailPageWrapper from "../app/products/[productId]/page";

import { ContactPage } from "./components/ContactPage";

import { SearchOverlayModal } from "./components/SearchOverlayModal";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutWizard } from "./components/CheckoutWizard";
import { StartupLoader } from "./components/StartupLoader";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { CartPopup } from "./components/CartPopup";

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

  let currentPage: NavigationPage = "home";
  
  let activeProductId: string | undefined = undefined;
  
  const productMatch = pathname?.match(/^\/products\/([^/]+)/);
  
  if (productMatch) {
    currentPage = "product-detail";
    activeProductId = productMatch[1];
  } else if (pathname === "/products") {
    currentPage = "products";
  } else if (pathname === "/recipes") {
    currentPage = "recipes";
  } else if (pathname === "/story") {
    currentPage = "story";
  } else if (pathname === "/contact") {
    currentPage = "contact";
  }

  // =========================================================
  // CART ROUTE
  // =========================================================

  const isCartRoute = pathname === "/cart";

  /*
   * Whenever URL becomes /cart, open the drawer.
   *
   * This also handles:
   * /cart opened directly
   * browser refresh on /cart
   * router.push("/cart")
   */
  useEffect(() => {
    if (pathname === "/cart") {
      setIsCartOpen(true);
    }
  }, [pathname]);

  /*
   * If URL changes away from /cart, make sure drawer is closed.
   */
  useEffect(() => {
    if (pathname !== "/cart") {
      setIsCartOpen(false);
    }
  }, [pathname]);

  // =========================================================
  // SCROLL TO TOP ON ROUTE CHANGE
  // =========================================================

  useEffect(() => {
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

  const openCart = () => {
    if (pathname !== "/cart") {
      previousPathRef.current = pathname;
      router.push("/cart", { scroll: false });
    }
  
    setIsCartOpen(true);
  };

  // =========================================================
  // CLOSE CART
  // =========================================================

  const closeCart = () => {
    setIsCartOpen(false);
  
    if (pathname === "/cart") {
      if (previousPathRef.current) {
        const previousPath = previousPathRef.current;
        previousPathRef.current = null;
  
        router.push(previousPath, { scroll: false });
      } else {
        router.push("/", { scroll: false });
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
      openCart();
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
      router.push("/products");
      return;
    }

    if (page === "recipes") {
      router.push("/recipes");
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
        onOpenCart={openCart}
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
              <TrustSection />

              <AboutSection onNavigate={handleNavigate} />

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

              <WhyChooseUs />

              <ManufacturingJourney />

              <RecipesSection
                onSelectRecipe={(recipe: Recipe) => {
                  router.push(`/recipes/${recipe.id}`);
                }}
                onNavigate={handleNavigate}
              />

              <Testimonials />

              <Certifications />
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
          <div className="pt-24 pb-20 bg-[#F7F5EF]">
            <RecipesSection
              onSelectRecipe={(recipe: Recipe) => {
                router.push(`/recipes/${recipe.id}`);
              }}
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {/* ===================================================
            STORY
        =================================================== */}

        {currentPage === "story" && (
          <div className="pt-24 pb-20">
            <AboutSection onNavigate={handleNavigate} />

            <ManufacturingJourney />

            <WhyChooseUs />

            <Certifications />
          </div>
        )}

        {/* ===================================================
            CONTACT
        =================================================== */}

        {currentPage === "contact" && <ContactPage />}
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
        onOpenCart={openCart}
      />

      {/* =====================================================
          CART POPUP
          /cart is already excluded inside CartPopup
      ===================================================== */}

      <CartPopup cartItems={cartItems} onOpenCart={openCart} />

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
          setIsCheckoutOpen(true);
        }}
      />

      {/* =====================================================
          CHECKOUT
      ===================================================== */}

      <CheckoutWizard
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
