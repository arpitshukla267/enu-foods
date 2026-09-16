import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Search, X } from "lucide-react";

interface AnimatedListProps<T> {
  items: T[];

  // Unique key for every item
  getKey: (item: T, index: number) => string | number;

  // Text used for searching
  getSearchText?: (item: T) => string;

  // How each item should look
  renderItem: (item: T, index: number) => React.ReactNode;

  // Optional heading
  title?: string;

  // Optional count
  showCount?: boolean;

  // Search placeholder
  searchPlaceholder?: string;

  // Initially open?
  defaultOpen?: boolean;

  // Custom empty state
  emptyMessage?: string;

  // Search bar visible?
  searchable?: boolean;

  // Extra classes
  className?: string;
}

export function AnimatedList<T>({
  items,
  getKey,
  getSearchText = (item) => String(item),
  renderItem,
  title = "List",
  showCount = true,
  searchPlaceholder = "Search...",
  defaultOpen = true,
  emptyMessage = "No items found",
  searchable = true,
  className = "",
}: AnimatedListProps<T>) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return items;

    return items.filter((item) =>
      getSearchText(item).toLowerCase().includes(query),
    );
  }, [items, search, getSearchText]);

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[#E8E2D5] bg-white shadow-sm ${className}`}
    >
      {/* ================= HEADER ================= */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 px-4 py-3.5 bg-[#F9F7F2] hover:bg-[#F5F0E7] transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#173D2A]">{title}</h3>

              {showCount && (
                <span className="px-2 py-0.5 rounded-full bg-[#173D2A] text-white text-[10px] font-bold">
                  {items.length}
                </span>
              )}
            </div>

            {search && (
              <p className="text-[10px] text-[#8F816B] mt-0.5">
                {filteredItems.length} result
                {filteredItems.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-[#736854]" />
        </motion.div>
      </button>

      {/* ================= CONTENT ================= */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
            }}
          >
            <div className="p-3 space-y-3">
              {/* ================= SEARCH ================= */}
              {searchable && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F816B]" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#FDFBF7] text-xs text-[#1A211D] placeholder:text-[#A49A89] outline-none transition-all focus:border-[#173D2A] focus:ring-2 focus:ring-[#173D2A]/10"
                  />

                  <AnimatePresence>
                    {search && (
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        onClick={() => setSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-[#8F816B] hover:bg-[#EAE2D2] hover:text-[#173D2A] transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* ================= LIST ================= */}
              <div className="overflow-hidden rounded-xl border border-[#E8E2D5] divide-y divide-[#F0EBE0]">
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={getKey(item, index)}
                      layout
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -10,
                      }}
                      transition={{
                        duration: 0.2,
                        delay: Math.min(index * 0.035, 0.25),
                      }}
                    >
                      {renderItem(item, index)}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* ================= EMPTY ================= */}
                {filteredItems.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-10 px-4 text-center"
                  >
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#F4EFE6] flex items-center justify-center">
                      <Search className="w-4 h-4 text-[#8F816B]" />
                    </div>

                    <p className="text-xs font-semibold text-[#5C5343]">
                      {search ? "No results found" : emptyMessage}
                    </p>

                    {search && (
                      <p className="text-[10px] text-[#9A907E] mt-1">
                        Try searching with a different keyword
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
