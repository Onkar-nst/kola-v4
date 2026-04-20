import { useState, useEffect, useCallback, useRef, memo } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import ColumnGuides from "@/components/ColumnGuides";
import CustomCursor from "@/components/CustomCursor";
import CTAFooter from "@/components/CTAFooter";
import AnimatedHeading from "@/components/AnimatedHeading";

/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */

const WP_API_BASE = "https://cms.kolacommunications.com/wp-json/wp/v2";
const PER_PAGE = 6;

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */

interface AioseoSchema {
  "@graph"?: Array<{
    "@type": string;
    articleSection?: string;
    image?: { url: string };
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  featured_media: number;
  categories: number[];
  aioseo_head_json?: {
    title?: string;
    description?: string;
    schema?: AioseoSchema;
    [key: string]: unknown;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text?: string }>;
    "wp:term"?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface NormalizedPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  formattedDate: string;
  img: string;
  imgAlt: string;
  categories: string[];
  categoryIds: number[];
  readTime: number;
}

interface FetchState {
  posts: NormalizedPost[];
  loading: boolean;
  totalPages: number;
  totalItems: number;
}

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */

const decodeHtmlEntities = (str: string): string => {
  if (typeof document === "undefined") return str;
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
};

const stripHtml = (html: string) =>
  html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const formatDate = (iso: string): string => {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short", day: "numeric", year: "numeric",
    }).format(new Date(iso));
  } catch { return iso; }
};

const estimateReadTime = (excerpt: string): number =>
  Math.max(1, Math.ceil(stripHtml(excerpt).split(/\s+/).length / 200));

const getSchemaImageUrl = (schema?: AioseoSchema): string => {
  if (!schema?.["@graph"]) return "";
  for (const node of schema["@graph"]) {
    if (
      (node["@type"] === "NewsArticle" || node["@type"] === "Article") &&
      node.image &&
      typeof (node.image as { url?: string }).url === "string"
    ) return (node.image as { url: string }).url;
  }
  return "";
};

const normalizePost = (p: WPPost): NormalizedPost => {
  const img =
    p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
    getSchemaImageUrl(p.aioseo_head_json?.schema) ??
    "/placeholder.jpg";
  const imgAlt =
    p._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ??
    decodeHtmlEntities(p.title.rendered);
  const categories =
    p._embedded?.["wp:term"]?.[0]?.map((t) => decodeHtmlEntities(t.name)).slice(0, 2) ?? [];
  const excerpt = decodeHtmlEntities(stripHtml(p.excerpt.rendered));
  return {
    id: p.id,
    slug: p.slug,
    title: decodeHtmlEntities(p.title.rendered),
    excerpt,
    date: p.date,
    formattedDate: formatDate(p.date),
    img,
    imgAlt,
    categories,
    categoryIds: p.categories ?? [],
    readTime: estimateReadTime(p.excerpt.rendered),
  };
};

/* ══════════════════════════════════════════
   HOOKS
══════════════════════════════════════════ */

const useCategories = () => {
  const [categories, setCategories] = useState<WPCategory[]>([]);
  useEffect(() => {
    let cancelled = false;
    fetch(`${WP_API_BASE}/categories?per_page=50&hide_empty=true`)
      .then((r) => r.json() as Promise<WPCategory[]>)
      .then((data) => {
        if (!cancelled)
          setCategories(
            data
              .map((c) => ({ ...c, name: decodeHtmlEntities(c.name) }))
              .filter((c) => c.count > 0)
              .sort((a, b) => b.count - a.count)
          );
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  return categories;
};

const usePosts = (page: number, categoryId: number | null): FetchState => {
  const [state, setState] = useState<FetchState>({
    posts: [], loading: true, totalPages: 1, totalItems: 0,
  });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true }));

    const url = categoryId
      ? `${WP_API_BASE}/posts?per_page=${PER_PAGE}&page=${page}&categories=${categoryId}&_embed=1&orderby=date&order=desc`
      : `${WP_API_BASE}/posts?per_page=${PER_PAGE}&page=${page}&_embed=1&orderby=date&order=desc`;

    fetch(url)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const totalPages = Number(r.headers.get("X-WP-TotalPages") ?? 1);
        const totalItems = Number(r.headers.get("X-WP-Total") ?? 0);
        const data: WPPost[] = await r.json();
        if (!cancelled)
          setState({ posts: data.map(normalizePost), loading: false, totalPages, totalItems });
      })
      .catch(() => { if (!cancelled) setState((s) => ({ ...s, loading: false })); });

    return () => { cancelled = true; };
  }, [page, categoryId]);

  return state;
};

/* ══════════════════════════════════════════
   GLITCH HOOK + OVERLAY
══════════════════════════════════════════ */

const useGlitch = () => {
  const [glitching, setGlitching] = useState(false);
  const trigger = useCallback(() => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 500);
  }, []);
  return { glitching, trigger };
};

const GlitchOverlay = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 1, 0.4, 1, 0] }}
    transition={{ duration: 0.5 }}
    className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
  >
    {[0, 1, 2].map((i) => (
      <motion.div key={i}
        animate={{ x: [0, -6 + i * 4, 6 - i * 2, 0], opacity: [0, 0.6, 0.2, 0] }}
        transition={{ duration: 0.3, delay: i * 0.05 }}
        className="absolute inset-0"
        style={{
          background:
            i === 0 ? "rgba(255,0,0,0.2)"
            : i === 1 ? "rgba(0,255,0,0.15)"
            : "rgba(0,150,255,0.2)",
          mixBlendMode: "screen",
        }}
      />
    ))}
  </motion.div>
));

/* ══════════════════════════════════════════
   BLOG CARD
   flex-col so the image section (flex-1) fills
   whatever height the row-level grid assigns.
══════════════════════════════════════════ */

interface BlogCardProps {
  post: NormalizedPost;
  index: number;
  onCategoryClick: (id: number, name: string) => void;
}

const BlogCard = memo(({ post, index, onCategoryClick }: BlogCardProps) => {
  const { glitching, trigger } = useGlitch();
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group overflow-hidden border border-black/10 bg-white relative flex flex-col"
      onMouseEnter={() => { setHovered(true); trigger(); }}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      <Link to={`/blog/${post.slug}`} style={{ textDecoration: "none" }} tabIndex={-1}>
        <div className="flex justify-between items-start px-5 py-4 border-b border-black/10 gap-3">
          <div className="min-w-0 flex-1">
            <span className="text-[14.5px] text-black font-medium leading-snug block">
              {post.title}
            </span>
            {post.categories.length > 0 && (
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {post.categories.map((cat, i) => {
                  const catId = post.categoryIds[i];
                  return (
                    <button
                      key={cat}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (catId) onCategoryClick(catId, cat);
                      }}
                      className="text-[10px] px-2 py-0.5 text-black/45 border border-black/10 whitespace-nowrap hover:border-black/30 hover:text-black transition-colors duration-150 cursor-pointer"
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="relative w-4 h-4 overflow-hidden shrink-0 mt-0.5">
            <motion.span
              animate={hovered ? { x: 16, y: -16, opacity: 0 } : { x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 0.18 }} className="absolute">
              <ArrowUpRight size={16} className="text-black/50" />
            </motion.span>
            <motion.span
              animate={hovered ? { x: 0, y: 0, opacity: 1 } : { x: -16, y: 16, opacity: 0 }}
              transition={{ duration: 0.18 }} className="absolute">
              <ArrowUpRight size={16} className="text-black" />
            </motion.span>
          </div>
        </div>
      </Link>

      {/* Image + meta — flex-1 fills remaining card height */}
      <Link to={`/blog/${post.slug}`} style={{ textDecoration: "none" }} className="flex-1 flex flex-col">
        <div className="relative aspect-[16/9] overflow-hidden flex-1">
          <motion.img
            src={post.img}
            alt={post.imgAlt}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ opacity: hovered && glitching ? 0 : 1 }}
            loading="lazy"
          />
          <motion.img
            src={post.img}
            alt={post.imgAlt}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: hovered && !glitching ? 1 : 0, scale: hovered ? 1 : 1.06 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            loading="lazy"
          />
          <AnimatePresence>{glitching && <GlitchOverlay />}</AnimatePresence>
        </div>
        {/* Meta footer — always at the bottom */}
        <div className="px-5 py-3 flex items-center gap-2 border-t border-black/[0.06]">
          <span className="text-[11px] text-black/30">{post.formattedDate}</span>
          <span className="w-0.5 h-0.5 rounded-full bg-black/20" />
          <span className="text-[11px] text-black/30">{post.readTime} min read</span>
        </div>
      </Link>
    </motion.div>
  );
});

/* ══════════════════════════════════════════
   BLOG CARD ROW
   Same row-pair subgrid strategy as ProjectDisplay.
   Each row is its own 2-col grid with rows [auto 1fr]:
   - "auto" row = tallest header in the pair sets height
   - "1fr" row = image+meta fills the rest equally
   On mobile collapses to 1 col and stacks normally.
══════════════════════════════════════════ */

interface BlogCardRowProps {
  pair: NormalizedPost[];
  rowIndex: number;
  onCategoryClick: (id: number, name: string) => void;
}

const BlogCardRow = memo(({ pair, rowIndex, onCategoryClick }: BlogCardRowProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {pair.map((post, i) => (
      <BlogCard
        key={post.slug}
        post={post}
        index={rowIndex * 2 + i}
        onCategoryClick={onCategoryClick}
      />
    ))}
  </div>
));

/* ══════════════════════════════════════════
   SKELETON CARD
══════════════════════════════════════════ */

const SkeletonCard = memo(({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    className="border border-black/10 overflow-hidden animate-pulse flex flex-col"
  >
    <div className="px-5 py-4 border-b border-black/10 space-y-2">
      <div className="h-4 bg-black/[0.06] rounded-sm w-3/4" />
      <div className="flex gap-1.5">
        {[60, 80].map((w, i) => (
          <div key={i} className="h-4 bg-black/[0.04] rounded-sm" style={{ width: w }} />
        ))}
      </div>
    </div>
    <div className="aspect-[16/9] bg-black/[0.04] flex-1" />
    <div className="px-5 py-3 flex gap-2 border-t border-black/[0.06]">
      <div className="h-3 w-20 bg-black/[0.04] rounded-sm" />
    </div>
  </motion.div>
));

/* ══════════════════════════════════════════
   FILTER BAR — DESKTOP
══════════════════════════════════════════ */

interface FilterProps {
  categories: WPCategory[];
  activeCategoryId: number | null;
  activeCategoryName: string | null;
  onSelect: (id: number | null, name: string | null) => void;
}

const DesktopFilterBar = memo(({ categories, activeCategoryId, onSelect }: FilterProps) => {
  if (!categories.length) return null;
  return (
    <div className="hidden md:flex flex-wrap gap-2">
      <motion.button
        onClick={() => onSelect(null, null)}
        whileTap={{ scale: 0.95 }}
        className={`px-4 py-1.5 text-[12px] font-medium border rounded-full transition-all duration-200 whitespace-nowrap ${
          !activeCategoryId
            ? "bg-black text-white border-black"
            : "text-black/50 border-black/[0.12] hover:border-black/30 hover:text-black"
        }`}>
        All
      </motion.button>
      {categories.map((cat) => (
        <motion.button key={cat.id}
          onClick={() => onSelect(
            cat.id === activeCategoryId ? null : cat.id,
            cat.id === activeCategoryId ? null : cat.name
          )}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-1.5 text-[12px] font-medium border rounded-full transition-all duration-200 whitespace-nowrap ${
            activeCategoryId === cat.id
              ? "bg-black text-white border-black"
              : "text-black/50 border-black/[0.12] hover:border-black/30 hover:text-black"
          }`}>
          {cat.name}
        </motion.button>
      ))}
    </div>
  );
});

/* ══════════════════════════════════════════
   MOBILE FILTER DROPDOWN
   Uses React.createPortal → renders into document.body,
   completely escaping overflow:hidden, transform stacking
   contexts, and z-index hierarchies from parent elements.
   Position is calculated via getBoundingClientRect and
   kept in sync on scroll and resize.
══════════════════════════════════════════ */

const MobileFilterDropdown = memo(({ categories, activeCategoryId, activeCategoryName, onSelect }: FilterProps) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  const syncRect = useCallback(() => {
    if (triggerRef.current) setTriggerRect(triggerRef.current.getBoundingClientRect());
  }, []);

  // Keep panel position in sync while open
  useEffect(() => {
    if (!open) return;
    syncRect();
    window.addEventListener("scroll", syncRect, true);
    window.addEventListener("resize", syncRect);
    return () => {
      window.removeEventListener("scroll", syncRect, true);
      window.removeEventListener("resize", syncRect);
    };
  }, [open, syncRect]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      const panel = document.getElementById("bd-mobile-cat-panel");
      if (!triggerRef.current?.contains(t) && !panel?.contains(t)) {
        setOpen(false);
      }
    };
    const timer = setTimeout(() => document.addEventListener("mousedown", handler), 10);
    return () => { clearTimeout(timer); document.removeEventListener("mousedown", handler); };
  }, [open]);

  const panel =
    open && triggerRect
      ? createPortal(
          <AnimatePresence>
            <motion.div
              id="bd-mobile-cat-panel"
              key="bd-cat-panel"
              initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -4, scaleY: 0.97 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "fixed",
                top: triggerRect.bottom + 6,
                left: triggerRect.left,
                width: triggerRect.width,
                zIndex: 99999,
                transformOrigin: "top center",
              }}
              className="bg-white border border-black/[0.12] rounded-xl shadow-2xl overflow-hidden max-h-[60vh] overflow-y-auto"
            >
              {/* All */}
              <button
                onClick={() => { onSelect(null, null); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-[13px] border-b border-black/[0.07] transition-colors duration-100 ${
                  !activeCategoryId
                    ? "text-black font-semibold bg-black/[0.04]"
                    : "text-black/55 hover:bg-black/[0.02] hover:text-black"
                }`}
              >
                <span>All categories</span>
                {!activeCategoryId && <span className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" />}
              </button>

              {categories.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelect(
                      cat.id === activeCategoryId ? null : cat.id,
                      cat.id === activeCategoryId ? null : cat.name
                    );
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-[13px] transition-colors duration-100 ${
                    i < categories.length - 1 ? "border-b border-black/[0.05]" : ""
                  } ${
                    activeCategoryId === cat.id
                      ? "text-black font-semibold bg-black/[0.04]"
                      : "text-black/55 hover:bg-black/[0.02] hover:text-black"
                  }`}
                >
                  <span>
                    {cat.name}
                  </span>
                  {activeCategoryId === cat.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" />
                  )}
                </button>
              ))}
            </motion.div>
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <div className="md:hidden">
      <motion.button
        ref={triggerRef}
        onClick={() => { syncRect(); setOpen((o) => !o); }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 border border-black/[0.15] rounded-lg text-[13px] bg-white shadow-sm"
      >
        <span className={activeCategoryName ? "text-black font-medium" : "text-black/45"}>
          {activeCategoryName ?? "All categories"}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {activeCategoryId && (
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(null, null); setOpen(false); }}
              className="text-black/30 hover:text-black/60 transition-colors p-0.5"
            >
              <X size={12} strokeWidth={2} />
            </button>
          )}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <ChevronDown size={14} className="text-black/40" />
          </motion.span>
        </div>
      </motion.button>

      {panel}
    </div>
  );
});

/* ══════════════════════════════════════════
   ACTIVE FILTER BADGE + RESULTS COUNT
══════════════════════════════════════════ */

const ActiveFilterBadge = memo(({ name, onClear }: { name: string; onClear: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[11.5px] rounded-full font-medium"
  >
    <span>{name}</span>
    <button onClick={onClear} className="hover:opacity-70 transition-opacity">
      <X size={10} strokeWidth={2} />
    </button>
  </motion.div>
));

const ResultsCount = memo(({ total, loading, categoryName }: {
  total: number; loading: boolean; categoryName: string | null;
}) => {
  if (loading) return null;
  return (
    <motion.p
      key={`${total}-${categoryName}`}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="text-[11.5px] text-black/30 tracking-wide"
    >
      {total} {total === 1 ? "article" : "articles"}
      {categoryName ? ` in "${categoryName}"` : ""}
    </motion.p>
  );
});

/* ══════════════════════════════════════════
   PAGINATION
══════════════════════════════════════════ */

const PaginationBtn = memo(({ onClick, disabled, active, children }: {
  onClick: () => void; disabled?: boolean; active?: boolean; children: React.ReactNode;
}) => (
  <motion.button
    onClick={onClick} disabled={disabled} whileTap={!disabled ? { scale: 0.9 } : {}}
    className={`inline-flex items-center justify-center w-9 h-9 text-sm border transition-colors duration-150 ${
      active
        ? "border-black bg-black text-white"
        : "border-black/10 text-black/60 hover:border-black/30 hover:text-black"
    } disabled:opacity-30 disabled:cursor-not-allowed`}
  >
    {children}
  </motion.button>
));

const Pagination = memo(({ page, totalPages, onPageChange }: {
  page: number; totalPages: number; onPageChange: (p: number) => void;
}) => {
  if (totalPages <= 1) return null;
  const getPages = (): (number | "…")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mt-16 flex items-center justify-center gap-2"
    >
      <PaginationBtn onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        <ChevronLeft size={14} />
      </PaginationBtn>
      {getPages().map((p, i) =>
        p === "…"
          ? <span key={`e-${i}`} className="w-9 text-center text-black/30 text-sm">…</span>
          : <PaginationBtn key={p} onClick={() => onPageChange(p as number)} active={p === page}>{p}</PaginationBtn>
      )}
      <PaginationBtn onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
        <ChevronRight size={14} />
      </PaginationBtn>
    </motion.div>
  );
});

/* ══════════════════════════════════════════
   EMPTY STATE
══════════════════════════════════════════ */

const EmptyState = memo(({ categoryName, onClear }: { categoryName: string; onClear: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
    className="col-span-full py-24 flex flex-col items-center justify-center gap-4"
  >
    <p className="text-black/30 text-sm tracking-wide">
      No articles in <span className="text-black/60 font-medium">"{categoryName}"</span>
    </p>
    <button onClick={onClear} className="flex items-center gap-1.5 text-xs text-black/40 hover:text-black transition-colors">
      <X size={12} /> Clear filter
    </button>
  </motion.div>
));

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */

const BlogDisplay = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryParam = searchParams.get("category");
  const categoryNameParam = searchParams.get("categoryName");
  const pageParam = Math.max(1, Number(searchParams.get("page") ?? 1));

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(
    categoryParam ? Number(categoryParam) : null
  );
  const [activeCategoryName, setActiveCategoryName] = useState<string | null>(categoryNameParam);
  const [page, setPage] = useState(pageParam);

  useEffect(() => {
    setActiveCategoryId(categoryParam ? Number(categoryParam) : null);
    setActiveCategoryName(categoryNameParam);
    setPage(Math.max(1, pageParam));
  }, [categoryParam, categoryNameParam, pageParam]);

  const categories = useCategories();
  const { posts, loading, totalPages, totalItems } = usePosts(page, activeCategoryId);

  const updateUrl = useCallback(
    (catId: number | null, catName: string | null, p: number) => {
      const params: Record<string, string> = {};
      if (catId) params.category = String(catId);
      if (catName) params.categoryName = catName;
      if (p > 1) params.page = String(p);
      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      document.getElementById("blog-display")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }, []);

  const handleCategorySelect = useCallback((id: number | null, name: string | null) => {
    setActiveCategoryId(id);
    setActiveCategoryName(name);
    setPage(1);
    updateUrl(id, name, 1);
    scrollToTop();
  }, [updateUrl, scrollToTop]);

  const handlePageChange = useCallback((p: number) => {
    setPage(p);
    updateUrl(activeCategoryId, activeCategoryName, p);
    scrollToTop();
  }, [activeCategoryId, activeCategoryName, updateUrl, scrollToTop]);

  const gridKey = `${activeCategoryId ?? "all"}-${page}`;

  // Chunk posts into pairs for row-level equal-height alignment
  const postRows = Array.from(
    { length: Math.ceil(posts.length / 2) },
    (_, i) => posts.slice(i * 2, i * 2 + 2)
  );

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Digital Marketing Insights | Kola Communications Blog</title>
        <meta name="description" content="Kola Communications blog covers website development, SEO, AEO, WordPress, Shopify, social media, content writing and AI tools for businesses growing online." />
        <meta name="keywords" content="Kola Communications Blog, Digital Marketing Blog India, Website Development Blog India, SEO Blog India, AEO Blog India, WordPress Tips India, Shopify Tips India, Social Media Marketing Blog India, Content Writing Blog India, AI Tools Blog India, Web Development Insights India, Digital Marketing Tips Mumbai, Website Design Tips India, SEO Tips for Small Business India, AEO Guide India, WordPress Development Tips India, Shopify Store Tips India, Lead Generation Tips India, Content Strategy Blog India, Digital Agency Blog Mumbai, Website SEO Tips India, Kola Communications Insights, Marketing Blog Mumbai, Business Growth Blog India, Digital Solutions Blog India, Website Development Blog, SEO Blog, AEO Blog, WordPress Tips, Shopify Tips, Social Media Marketing Blog, Content Writing Blog, AI Tools Blog, Web Development Insights, Website Design Tips, SEO Tips for Small Business, AEO Guide, WordPress Development Tips, Shopify Store Tips, Lead Generation Tips, Content Strategy Blog, Digital Agency Blog, Website SEO Tips, Marketing Blog, Business Growth Blog, Digital Solutions Blog" />
        <meta property="og:title" content="Digital Marketing Insights | Kola Communications Blog" />
        <meta property="og:description" content="Kola Communications blog covers website development, SEO, AEO, WordPress, Shopify, social media, content writing and AI tools for businesses growing online." />
        <meta property="og:url" content="https://www.kolacommunications.com/blog" />
        <meta property="og:image" content="https://www.kolacommunications.com/og-image.jpg" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.kolacommunications.com/blog" />
      </Helmet>
      <CustomCursor />
      <div className="relative overflow-hidden">
        <ColumnGuides />

        {/* ═══════ HEADER ═══════ */}
        <section id="blog-display" className="section-container pt-28 pb-0 relative z-10">
          <div className="max-w-[1100px] mx-auto px-4 md:px-10">

            <motion.button onClick={() => navigate(-1)}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10 flex items-center gap-2 text-sm text-black/35 hover:text-black transition-colors">
              <ChevronLeft size={14} /> Back
            </motion.button>

            <AnimatedHeading
              lines={["Articles &", "design insights."]}
              className="text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] max-w-[640px] mb-10 md:mt-4"
              stagger={0.07} duration={0.7} blur={10}
            />

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 space-y-4"
            >
              <DesktopFilterBar
                categories={categories}
                activeCategoryId={activeCategoryId}
                activeCategoryName={activeCategoryName}
                onSelect={handleCategorySelect}
              />
              <MobileFilterDropdown
                categories={categories}
                activeCategoryId={activeCategoryId}
                activeCategoryName={activeCategoryName}
                onSelect={handleCategorySelect}
              />
              <div className="flex items-center gap-3 min-h-[24px]">
                <AnimatePresence>
                  {activeCategoryName && (
                    <ActiveFilterBadge
                      name={activeCategoryName}
                      onClear={() => handleCategorySelect(null, null)}
                    />
                  )}
                </AnimatePresence>
                <ResultsCount total={totalItems} loading={loading} categoryName={activeCategoryName} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════ GRID ═══════ */}
        <section className="section-container pt-2 pb-28 relative z-10">
          <div className="max-w-[1100px] mx-auto px-4 md:px-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={gridKey}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-4"
              >
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: PER_PAGE }).map((_, i) => (
                      <SkeletonCard key={i} index={i} />
                    ))}
                  </div>
                ) : posts.length === 0 && activeCategoryName ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EmptyState
                      categoryName={activeCategoryName}
                      onClear={() => handleCategorySelect(null, null)}
                    />
                  </div>
                ) : (

                  postRows.map((pair, rowIdx) => (
                    <BlogCardRow
                      key={rowIdx}
                      pair={pair}
                      rowIndex={rowIdx}
                      onCategoryClick={handleCategorySelect}
                    />
                  ))
                )}
              </motion.div>
            </AnimatePresence>

            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        </section>
      </div>
      <CTAFooter />
    </div>
  );
};

export default BlogDisplay;