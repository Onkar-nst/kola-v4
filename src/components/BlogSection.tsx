import { useState, useEffect, useRef, memo } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { setCachedSlugType } from "@/pages/SlugResolver";

/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */

const WP_API_BASE = "https://cms.kolacommunications.com/wp-json/wp/v2";

/* WordPress catch-all categories that say nothing about the topic */
const GENERIC_CATEGORIES = new Set(["blog", "uncategorized"]);

/* "_links" must be requested too, otherwise WordPress drops "_embedded"
   (featured image and categories) from a _fields response. */
const POST_FIELDS = "id,slug,title,excerpt,date,featured_media,aioseo_head_json,_links,_embedded";

interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */

interface AioseoSchema {
  "@graph"?: Array<{
    "@type": string;
    articleSection?: string;
    image?: { url: string };
    datePublished?: string;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content?: { rendered: string };
  date: string;
  featured_media: number;
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
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

const getSchemaImageUrl = (schema?: AioseoSchema): string => {
  if (!schema?.["@graph"]) return "";
  for (const node of schema["@graph"]) {
    if (
      (node["@type"] === "NewsArticle" || node["@type"] === "Article") &&
      node.image &&
      typeof (node.image as { url?: string }).url === "string"
    ) {
      return (node.image as { url: string }).url;
    }
  }
  return "";
};

const normalizePost = (p: WPPost): NormalizedPost => {
  if (p.slug) {
    setCachedSlugType(p.slug, "blog");
  }
  const img =
    p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
    getSchemaImageUrl(p.aioseo_head_json?.schema) ??
    "/placeholder.jpg";
  const imgAlt =
    p._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ??
    decodeHtmlEntities(p.title.rendered);

  const categories: string[] =
    p._embedded?.["wp:term"]?.[0]
      ?.filter((t) => !GENERIC_CATEGORIES.has(t.slug))
      .map((t) => decodeHtmlEntities(t.name))
      .slice(0, 2) ?? [];

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
  };
};

/* ══════════════════════════════════════════
   UI PRIMITIVES
══════════════════════════════════════════ */

const FadeUp = memo(({
  children, delay = 0, className = "",
}: {
  children: React.ReactNode; delay?: number; className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
});

/* ══════════════════════════════════════════
   BLOG CARD (ROW OF 3)
══════════════════════════════════════════ */

const BlogCard = memo(({ post, index }: { post: NormalizedPost; index: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/${post.slug}`} style={{ textDecoration: "none" }} className="h-full block">
      <FadeUp delay={0.08 + index * 0.08} className="h-full">
        <motion.div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="group overflow-hidden rounded-xl border border-black/10 bg-white h-full flex flex-col transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:border-black/20"
        >
          {/* Image */}
          <div className="relative overflow-hidden aspect-[16/10] bg-black/[0.03]">
            <motion.img
              src={post.img}
              alt={post.imgAlt}
              className="w-full h-full object-cover"
              animate={{ scale: hovered ? 1.05 : 1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              loading="lazy"
            />
            <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-sm">
              <ArrowUpRight size={13} className="text-black" />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-1 justify-between">
            <div>
              {post.categories.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {post.categories.slice(0, 1).map((cat) => (
                    <span key={cat}
                      className="text-[10.5px] px-2.5 py-0.5 rounded-full border border-black/10 text-black/45 tracking-wide bg-black/[0.02]">
                      {cat}
                    </span>
                  ))}
                </div>
              )}
              <h3 className={`text-[17px] font-semibold leading-snug tracking-[-0.02em] mb-2.5 transition-colors duration-200 line-clamp-2 ${hovered ? "text-black/65" : "text-black"}`}>
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-[13px] text-black/50 leading-relaxed line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-black/[0.06] text-[11.5px] text-black/35 mt-auto">
              <span>{post.formattedDate}</span>
            </div>
          </div>
        </motion.div>
      </FadeUp>
    </Link>
  );
});

/* ══════════════════════════════════════════
   SKELETON CARDS
══════════════════════════════════════════ */

const CardSkeleton = () => (
  <div className="border border-black/10 rounded-xl overflow-hidden animate-pulse bg-white">
    <div className="aspect-[16/10] bg-black/[0.05]" />
    <div className="p-6 space-y-3">
      <div className="h-4 w-16 bg-black/[0.04] rounded-full" />
      <div className="h-5 w-full bg-black/[0.06] rounded-sm" />
      <div className="h-4 w-3/4 bg-black/[0.05] rounded-sm" />
      <div className="h-3.5 w-1/2 bg-black/[0.03] rounded-sm mt-3" />
    </div>
  </div>
);

/* ══════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════ */

const BlogSection = () => {
  const [posts, setPosts] = useState<NormalizedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<WPCategory[]>([]);
  const [active, setActive] = useState<WPCategory | null>(null);

  // Topic categories that actually have posts
  useEffect(() => {
    let cancelled = false;
    fetch(`${WP_API_BASE}/categories?per_page=100&hide_empty=true&orderby=count&order=desc&_fields=id,name,slug,count`)
      .then((r) => r.json() as Promise<WPCategory[]>)
      .then((data) => {
        if (cancelled || !Array.isArray(data)) return;
        setCategories(
          data
            .filter((c) => c.count > 0 && !GENERIC_CATEGORIES.has(c.slug))
            .map((c) => ({ ...c, name: decodeHtmlEntities(c.name) }))
        );
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Latest 3 posts, optionally within the selected category
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const filter = active ? `&categories=${active.id}` : "";
    fetch(`${WP_API_BASE}/posts?per_page=3&_embed=wp:featuredmedia,wp:term&orderby=date&order=desc${filter}&_fields=${POST_FIELDS}`)
      .then((r) => r.json() as Promise<WPPost[]>)
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setPosts(data.map(normalizePost));
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [active]);

  return (
    <section className="py-12 section-container">
      <div className="max-w-[1400px] mx-auto p-4 md:p-8">

        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] tracking-[-0.02em] mb-6 md:mb-8">
            <span className="text-muted-foreground font-medium">From our blog, </span>
            <span className="text-foreground font-semibold">design insights.</span>
          </h2>

          {/* Category tabs — scroll sideways on small screens */}
          {categories.length > 0 && (
            <div
              role="tablist"
              aria-label="Blog categories"
              className="-mx-4 px-4 md:mx-0 md:px-0 flex gap-2 overflow-x-auto md:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {[null, ...categories].map((cat) => {
                const selected = (active?.id ?? null) === (cat?.id ?? null);
                return (
                  <button
                    key={cat?.id ?? "all"}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActive(cat)}
                    className={`shrink-0 whitespace-nowrap border px-4 py-2 text-[13px] font-medium transition-colors ${
                      selected
                        ? "bg-black text-white border-black"
                        : "bg-white text-black/60 border-black/10 hover:border-black/30 hover:text-black"
                    }`}
                  >
                    {cat ? cat.name : "All"}
                    {cat && <span className={`ml-1.5 tabular-nums ${selected ? "text-white/60" : "text-black/30"}`}>{cat.count}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Grid — Single row of 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-10 md:mb-14 items-stretch">
          {loading
            ? [0, 1, 2].map((i) => <CardSkeleton key={i} />)
            : posts.slice(0, 3).map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
          {!loading && posts.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
              No articles in this category yet.
            </p>
          )}
        </div>

        {/* Big View All Blogs Button */}
        <FadeUp delay={0.2} className="flex justify-center">
          <Link to={active ? `/category/${active.slug}` : "/blogs"} style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="inline-flex items-center gap-3 px-7 md:px-9 py-3.5 md:py-4 text-center bg-black text-white text-[14px] font-medium rounded-full hover:bg-black/85 shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-all cursor-pointer"
            >
              <span>{active ? `View all ${active.name} articles` : "View all blogs"}</span>
              <ArrowUpRight size={16} />
            </motion.button>
          </Link>
        </FadeUp>

      </div>
    </section>
  );
};

export default BlogSection;