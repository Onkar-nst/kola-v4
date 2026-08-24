import { useState, useEffect, useRef, memo } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import AnimatedHeading from "@/components/AnimatedHeading";

/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */

const WP_API_BASE = "https://cms.kolacommunications.com/wp-json/wp/v2";

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
  readTime: number;
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

const estimateReadTime = (excerpt: string, content?: string): number => {
  const source = content ? stripHtml(content) : stripHtml(excerpt);
  const wordCount = content
    ? source.split(/\s+/).length
    : Math.round(source.split(/\s+/).length * 8); // excerpt heuristic
  return Math.max(1, Math.round(wordCount / 200));
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
  const img =
    p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
    getSchemaImageUrl(p.aioseo_head_json?.schema) ??
    "/placeholder.jpg";
  const imgAlt =
    p._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ??
    decodeHtmlEntities(p.title.rendered);

  // Categories from _embedded wp:term[0]
  const categories: string[] =
    p._embedded?.["wp:term"]?.[0]
      ?.map((t) => decodeHtmlEntities(t.name))
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
    readTime: estimateReadTime(p.excerpt.rendered, p.content?.rendered),
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
   FEATURED POST CARD
══════════════════════════════════════════ */

const FeaturedCard = memo(({ post }: { post: NormalizedPost }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/blogs/${post.slug}`} style={{ textDecoration: "none" }}>
      <FadeUp delay={0.05}>
        <motion.div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="group grid md:grid-cols-[1.2fr_1fr] overflow-hidden border border-black/10 bg-white"
        >
          {/* Image */}
          <div className="relative overflow-hidden aspect-[4/3] md:aspect-auto md:h-full min-h-[240px]">
            <motion.img
              src={post.img}
              alt={post.imgAlt}
              className="w-full h-full object-cover"
              animate={{ scale: hovered ? 1.04 : 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Content */}
          <div className="p-7 md:p-10 flex flex-col justify-between">
            <div>
              {/* Categories */}
              {post.categories.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-4">
                  {post.categories.map((cat) => (
                    <span key={cat}
                      className="text-[10.5px] px-2.5 py-1 border border-black/10 text-black/45 tracking-wide">
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h3 className={`text-[22px] md:text-[26px] font-semibold leading-[1.18] tracking-[-0.025em] mb-4 transition-colors duration-200 ${hovered ? "text-black/70" : "text-black"}`}>
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-[13.5px] text-black/50 leading-[1.75] line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-black/30">{post.formattedDate}</span>
              </div>
              {/* Animated arrow */}
              <div className="relative w-4 h-4 overflow-hidden">
                <motion.span
                  animate={hovered ? { x: 16, y: -16, opacity: 0 } : { x: 0, y: 0, opacity: 1 }}
                  transition={{ duration: 0.18 }}
                  className="absolute">
                  <ArrowUpRight size={16} className="text-black/40" />
                </motion.span>
                <motion.span
                  animate={hovered ? { x: 0, y: 0, opacity: 1 } : { x: -16, y: 16, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="absolute">
                  <ArrowUpRight size={16} className="text-black" />
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>
      </FadeUp>
    </Link>
  );
});

/* ══════════════════════════════════════════
   SMALL BLOG CARD
══════════════════════════════════════════ */

const BlogCard = memo(({ post, index }: { post: NormalizedPost; index: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/blogs/${post.slug}`} style={{ textDecoration: "none" }}>
      <FadeUp delay={0.08 + index * 0.06}>
        <motion.div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="group overflow-hidden border border-black/10 bg-white h-full flex flex-col"
        >
          {/* Image */}
          <div className="relative overflow-hidden aspect-[16/9]">
            <motion.img
              src={post.img}
              alt={post.imgAlt}
              className="w-full h-full object-cover"
              animate={{ scale: hovered ? 1.05 : 1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            {post.categories.length > 0 && (
              <div className="flex gap-1.5 flex-wrap mb-3">
                {post.categories.slice(0, 1).map((cat) => (
                  <span key={cat}
                    className="text-[10px] px-2 py-0.5 border border-black/10 text-black/40 tracking-wide">
                    {cat}
                  </span>
                ))}
              </div>
            )}
            <h3 className={`text-[15px] font-semibold leading-snug tracking-[-0.015em] mb-2 flex-1 transition-colors duration-200 ${hovered ? "text-black/60" : "text-black"}`}>
              {post.title}
            </h3>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[11px] text-black/30">{post.formattedDate}</span>
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

const FeaturedSkeleton = () => (
  <div className="grid md:grid-cols-[1.2fr_1fr] overflow-hidden border border-black/10 animate-pulse">
    <div className="aspect-[4/3] md:min-h-[320px] bg-black/[0.05]" />
    <div className="p-7 md:p-10 flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="h-5 w-20 bg-black/[0.05] rounded-sm" />
        <div className="h-5 w-24 bg-black/[0.04] rounded-sm" />
      </div>
      <div className="h-7 w-3/4 bg-black/[0.06] rounded-sm" />
      <div className="h-7 w-1/2 bg-black/[0.05] rounded-sm" />
      <div className="space-y-2 mt-2">
        <div className="h-3.5 w-full bg-black/[0.04] rounded-sm" />
        <div className="h-3.5 w-[90%] bg-black/[0.03] rounded-sm" />
        <div className="h-3.5 w-[75%] bg-black/[0.03] rounded-sm" />
      </div>
    </div>
  </div>
);

const CardSkeleton = () => (
  <div className="border border-black/10 overflow-hidden animate-pulse">
    <div className="aspect-[16/9] bg-black/[0.05]" />
    <div className="p-5 space-y-2.5">
      <div className="h-4 w-16 bg-black/[0.04] rounded-sm" />
      <div className="h-4 w-full bg-black/[0.06] rounded-sm" />
      <div className="h-4 w-3/4 bg-black/[0.05] rounded-sm" />
      <div className="h-3 w-24 bg-black/[0.03] rounded-sm mt-3" />
    </div>
  </div>
);

/* ══════════════════════════════════════════
   VIEW ALL BUTTON
══════════════════════════════════════════ */

const ViewAllButton = () => {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to="/blogs" style={{ textDecoration: "none" }}>
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="inline-flex items-center gap-2 text-[13px] font-medium text-black/45 hover:text-black transition-colors duration-200"
      >
        <span>View all articles</span>
        <span className="relative w-[13px] h-[13px] overflow-hidden">
          <motion.span
            animate={hovered ? { x: 13, y: -13, opacity: 0 } : { x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 flex items-center justify-center">
            <ArrowUpRight size={13} strokeWidth={1.6} />
          </motion.span>
          <motion.span
            animate={hovered ? { x: 0, y: 0, opacity: 1 } : { x: -13, y: 13, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 flex items-center justify-center">
            <ArrowUpRight size={13} strokeWidth={1.6} />
          </motion.span>
        </span>
      </motion.div>
    </Link>
  );
};

/* ══════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════ */

const BlogSection = () => {
  const [posts, setPosts] = useState<NormalizedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`${WP_API_BASE}/posts?per_page=5&_embed=1&orderby=date&order=desc&_fields=id,slug,title,excerpt,content,date,featured_media,aioseo_head_json,_embedded`)
      .then((r) => r.json() as Promise<WPPost[]>)
      .then((data) => {
        if (!cancelled) setPosts(data.map(normalizePost));
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const [featured, ...rest] = posts;

  return (
    <section className="py-12 section-container">
      <div className="max-w-[1100px] mx-auto p-4 md:p-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-12 md:mb-14">
          <AnimatedHeading
            lines={["From our blog,", "design insights."]}
            className="text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.05] tracking-[-0.02em] font-semibold"
          />
          <div className="hidden md:block pb-1">
            <ViewAllButton />
          </div>
        </div>

        {/* Featured post */}
        <div className="mb-5">
          {loading ? <FeaturedSkeleton /> : featured ? <FeaturedCard post={featured} /> : null}
        </div>

        {/* Grid — 2 cols */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {loading
            ? [0, 1].map((i) => <CardSkeleton key={i} />)
            : rest.slice(0, 4).map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
        </div>

        {/* Mobile view all */}
        <div className="md:hidden flex justify-center">
          <ViewAllButton />
        </div>

      </div>
    </section>
  );
};

export default BlogSection;