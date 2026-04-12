import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef, memo, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";

import ColumnGuides from "@/components/ColumnGuides";
import CustomCursor from "@/components/CustomCursor";
import CTAFooter from "@/components/CTAFooter";
import SectionDivider from "@/components/SectionDivider";
// import AnimatedHeading from "@/components/AnimatedHeading";
import ContactForm from "@/components/ContactForm";

const WP_API_BASE = "https://cms.kolacommunications.com/wp-json/wp/v2";

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */

interface AioseoSchema {
  "@context"?: string;
  "@graph"?: Array<{
    "@type": string;
    articleSection?: string;
    headline?: string;
    datePublished?: string;
    dateModified?: string;
    image?: { "@type": string; url: string; width: number; height: number };
    author?: { name?: string; [key: string]: unknown };
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

interface AioseoHeadJson {
  title?: string;
  description?: string;
  canonical_url?: string;
  robots?: string;
  keywords?: string;
  schema?: AioseoSchema;
  "og:title"?: string;
  "og:description"?: string;
  "twitter:title"?: string;
  "twitter:description"?: string;
  "article:published_time"?: string;
  "article:modified_time"?: string;
  [key: string]: unknown;
}

interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string };
  date: string;
  modified: string;
  featured_media: number;
  categories: number[];
  aioseo_head_json?: AioseoHeadJson;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text?: string }>;
    "wp:term"?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

interface NormalizedRelated {
  id: number;
  slug: string;
  title: string;
  img: string;
  formattedDate: string;
  categories: string[];
}

const decodeHtmlEntities = (str: string): string => {
  if (typeof document === "undefined") return str;
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
};

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const formatDate = (iso: string): string => {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

const estimateReadTime = (html: string): number =>
  Math.max(1, Math.ceil(stripHtml(html).split(/\s+/).length / 200));

const getSchemaImageUrl = (schema?: AioseoSchema): string => {
  if (!schema?.["@graph"]) return "";
  for (const node of schema["@graph"]) {
    if (
      (node["@type"] === "NewsArticle" ||
        node["@type"] === "Article" ||
        node["@type"] === "WebPage") &&
      node.image
    )
      return (node.image as { url: string }).url ?? "";
  }
  return "";
};

const getSchemaArticleNode = (schema?: AioseoSchema) => {
  return schema?.["@graph"]?.find(
    (n) => n["@type"] === "NewsArticle" || n["@type"] === "Article",
  );
};

const normalizeRelated = (p: WPPost): NormalizedRelated => {
  const img =
    p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
    getSchemaImageUrl(p.aioseo_head_json?.schema) ??
    "/placeholder.jpg";
  const categories =
    p._embedded?.["wp:term"]?.[0]
      ?.map((t) => decodeHtmlEntities(t.name))
      .slice(0, 2) ?? [];
  return {
    id: p.id,
    slug: p.slug,
    title: decodeHtmlEntities(p.title.rendered),
    img,
    formattedDate: formatDate(p.date),
    categories,
  };
};

/* ══════════════════════════════════════════
   SEO HOOK
   
══════════════════════════════════════════ */

const upsertMeta = (
  sel: string,
  attrKey: string,
  attrVal: string,
  content: string,
) => {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(sel);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrKey, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertCanonical = (href: string) => {
  if (!href) return;
  let el = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
};

const upsertJsonLd = (data: object, id: string) => {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
};

const useBlogSEO = (post: WPPost | null, img: string, plainDesc: string) => {
  useEffect(() => {
    if (!post) return;
    const seo = post.aioseo_head_json;
    const articleNode = getSchemaArticleNode(seo?.schema);

    const metaTitle = seo?.title ?? decodeHtmlEntities(post.title.rendered);
    const metaDesc = seo?.description ?? plainDesc;
    const canonical = seo?.canonical_url ?? "";
    const ogImage = getSchemaImageUrl(seo?.schema) || img;
    const publishedTime =
      (seo?.["article:published_time"] as string) ?? post.date;
    const modifiedTime =
      (seo?.["article:modified_time"] as string) ?? post.modified;
    const articleSection = articleNode?.articleSection
      ? decodeHtmlEntities(articleNode.articleSection as string)
      : "";

    const prevTitle = document.title;
    document.title = metaTitle;

    upsertMeta('meta[name="description"]', "name", "description", metaDesc);
    upsertMeta(
      'meta[name="keywords"]',
      "name",
      "keywords",
      seo?.keywords ?? "",
    );
    upsertMeta('meta[name="robots"]', "name", "robots", seo?.robots ?? "");
    upsertCanonical(canonical);

    upsertMeta('meta[property="og:type"]', "property", "og:type", "article");
    upsertMeta(
      'meta[property="og:title"]',
      "property",
      "og:title",
      decodeHtmlEntities((seo?.["og:title"] as string) ?? metaTitle),
    );
    upsertMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      decodeHtmlEntities((seo?.["og:description"] as string) ?? metaDesc),
    );
    upsertMeta('meta[property="og:image"]', "property", "og:image", ogImage);
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);
    upsertMeta(
      'meta[property="article:published_time"]',
      "property",
      "article:published_time",
      publishedTime,
    );
    upsertMeta(
      'meta[property="article:modified_time"]',
      "property",
      "article:modified_time",
      modifiedTime,
    );
    upsertMeta(
      'meta[property="article:section"]',
      "property",
      "article:section",
      articleSection,
    );

    upsertMeta(
      'meta[name="twitter:card"]',
      "name",
      "twitter:card",
      "summary_large_image",
    );
    upsertMeta(
      'meta[name="twitter:title"]',
      "name",
      "twitter:title",
      decodeHtmlEntities((seo?.["twitter:title"] as string) ?? metaTitle),
    );
    upsertMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      decodeHtmlEntities((seo?.["twitter:description"] as string) ?? metaDesc),
    );
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", ogImage);

    // Inject the full AIOSEO @graph JSON-LD verbatim
    if (seo?.schema) upsertJsonLd(seo.schema, "kola-blog-jsonld");

    return () => {
      document.title = prevTitle;
      document.getElementById("kola-blog-jsonld")?.remove();
    };
  }, [post, img, plainDesc]);
};

/* ══════════════════════════════════════════
   UI PRIMITIVES
══════════════════════════════════════════ */

const FadeUp = memo(
  ({
    children,
    delay = 0,
    className = "",
  }: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 22 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    );
  },
);

const LineReveal = memo(
  ({
    children,
    delay = 0,
    className = "",
  }: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    return (
      <div ref={ref} className={`overflow-hidden ${className}`}>
        <motion.div
          initial={{ y: "100%" }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </div>
    );
  },
);

/* ══════════════════════════════════════════
   DRAG CAROUSEL
══════════════════════════════════════════ */

const DragCarousel = memo(
  ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dragLeft, setDragLeft] = useState(-800);

    useEffect(() => {
      const measure = () => {
        if (!trackRef.current || !containerRef.current) return;
        const overflow =
          trackRef.current.scrollWidth - containerRef.current.offsetWidth;
        setDragLeft(overflow > 0 ? -overflow : 0);
      };
      measure();
      const ro = new ResizeObserver(measure);
      if (containerRef.current) ro.observe(containerRef.current);
      return () => ro.disconnect();
    }, [children]);

    return (
      <div
        ref={containerRef}
        className={className}
        style={{
          overflow: "hidden",
          marginLeft: "-1rem",
          marginRight: "-1rem",
        }}
      >
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: dragLeft, right: 0 }}
          dragElastic={0.08}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
          style={{
            display: "flex",
            gap: "12px",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            width: "max-content",
            cursor: "grab",
          }}
        >
          {children}
        </motion.div>
      </div>
    );
  },
);

/* ══════════════════════════════════════════
   READING PROGRESS BAR
══════════════════════════════════════════ */

const ReadingProgressBar = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      setProgress(
        docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0,
      );
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-black/[0.05]">
      <motion.div
        className="h-full bg-black"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
};

/* ══════════════════════════════════════════
   INLINE CTA — mirrors ProjectPage
══════════════════════════════════════════ */

const InlineCTA = memo(({ onOpenContact }: { onOpenContact: () => void }) => (
  <FadeUp delay={0.05}>
    <div className="mt-16 pt-10 border-t border-black/[0.06]">
      <p className="text-[10px] tracking-[0.22em] uppercase text-black/28 font-semibold mb-5">
        Start a project
      </p>
      <p className="text-[21px] font-semibold tracking-[-0.03em] text-black leading-[1.18] mb-7 max-w-[300px]">
        Let's build something that works for you.
      </p>
      <motion.button
        onClick={onOpenContact}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="group relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white text-[13px] font-medium leading-none"
      >
        <span className="relative z-10">Start a Project</span>
        <motion.span
          variants={{ rest: { x: 0, y: 0 }, hover: { x: 3, y: -3 } }}
          transition={{ duration: 0.18 }}
          className="relative z-10"
        >
          <ArrowUpRight size={13} strokeWidth={1.8} />
        </motion.span>
        <motion.span
          variants={{
            rest: { x: "-110%", opacity: 0 },
            hover: { x: "210%", opacity: 0.12 },
          }}
          transition={{ duration: 0.45 }}
          className="absolute inset-0 bg-white skew-x-12 pointer-events-none"
        />
      </motion.button>
    </div>
  </FadeUp>
));

/* ══════════════════════════════════════════
   LOADING STATE — skeleton
══════════════════════════════════════════ */

const BlogPageSkeleton = () => (
  <div className="min-h-screen bg-white">
    <div className="max-w-[1100px] mx-auto px-4 md:px-10 pt-24 pb-28 animate-pulse">
      <div className="h-4 w-12 bg-black/[0.06] rounded mb-10" />
      <div className="w-full h-[480px] bg-black/[0.05] rounded-[20px] mb-10" />
      <div className="flex gap-2 mb-5">
        {[80, 100, 70].map((w, i) => (
          <div
            key={i}
            className="h-5 bg-black/[0.04] rounded-full"
            style={{ width: w }}
          />
        ))}
      </div>
      <div className="h-9 w-3/4 bg-black/[0.06] rounded mb-3" />
      <div className="h-9 w-1/2 bg-black/[0.05] rounded mb-8" />
      <div className="h-px bg-black/[0.05] mb-12" />
      <div className="space-y-3 max-w-[680px]">
        {[100, 95, 88, 100, 92, 60].map((w, i) => (
          <div
            key={i}
            className="h-3.5 bg-black/[0.04] rounded"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════
   BLOG PAGE  ←  default export
══════════════════════════════════════════ */

const BlogPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<WPPost | null>(null);
  const [related, setRelated] = useState<NormalizedRelated[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  // Always-derived (safe before early returns)
  const featuredImg =
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
    getSchemaImageUrl(post?.aioseo_head_json?.schema) ??
    "/placeholder.jpg";
  const altText =
    post?._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ??
    (post ? decodeHtmlEntities(post.title.rendered) : "");
  const plainDesc = post
    ? decodeHtmlEntities(stripHtml(post.excerpt.rendered)).slice(0, 160)
    : "";

  useBlogSEO(post, featuredImg, plainDesc);

  // ── Fetch post ──
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setPost(null);

    fetch(`${WP_API_BASE}/posts?slug=${encodeURIComponent(slug)}&_embed=1`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<WPPost[]>;
      })
      .then((data) => {
        if (cancelled) return;
        if (!data.length) setNotFound(true);
        else setPost(data[0]);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // ── Fetch related (same category, exclude self) ──
  useEffect(() => {
    if (!post) return;
    let cancelled = false;
    const catId = post.categories?.[0];
    const url = catId
      ? `${WP_API_BASE}/posts?per_page=4&categories=${catId}&_embed=1&exclude=${post.id}`
      : `${WP_API_BASE}/posts?per_page=4&_embed=1&exclude=${post.id}`;

    fetch(url)
      .then((r) => r.json() as Promise<WPPost[]>)
      .then((data) => {
        if (!cancelled) setRelated(data.slice(0, 3).map(normalizeRelated));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [post]);

  if (loading) return <BlogPageSkeleton />;

  if (notFound || !post)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-black/50 text-sm">Article not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-black hover:text-black/60 transition-colors"
        >
          <ArrowLeft size={14} /> Go back
        </button>
      </div>
    );

  /* ── Derived ── */
  const displayTitle = decodeHtmlEntities(post.title.rendered);
  const formattedDate = formatDate(post.date);
  const readTime = estimateReadTime(post.content.rendered);

  const categories =
    post._embedded?.["wp:term"]?.[0]?.map((t) => ({
      id: t.id,
      name: decodeHtmlEntities(t.name),
      slug: t.slug,
    })) ?? [];

  const articleNode = getSchemaArticleNode(post.aioseo_head_json?.schema);
  const authorName =
    typeof articleNode?.author === "object" && articleNode?.author !== null
      ? ((articleNode.author as { name?: string }).name ??
        "Kola Communications")
      : "Kola Communications";

  return (
    <div className="min-h-screen bg-white">
      <ReadingProgressBar />
      <CustomCursor />
      <div className="relative overflow-hidden">
        <ColumnGuides />

        {/* ═══════ HERO ═══════ */}
        <section
          ref={heroRef}
          className="section-container pt-24 pb-0 relative z-10"
        >
          <div className="max-w-[1100px] mx-auto px-4 md:px-10">
            {/* Back */}
            <FadeUp delay={0}>
              <motion.button
                onClick={() => navigate(-1)}
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="mb-10 flex items-center gap-2 text-sm text-black/35 hover:text-black transition-colors"
              >
                <span className="relative w-4 h-4 overflow-hidden">
                  <motion.span
                    variants={{
                      rest: { x: 0, y: 0, opacity: 1 },
                      hover: { x: -16, y: 16, opacity: 0 },
                    }}
                    className="absolute"
                  >
                    <ArrowLeft size={14} />
                  </motion.span>
                  <motion.span
                    variants={{
                      rest: { x: 16, y: -16, opacity: 0 },
                      hover: { x: 0, y: 0, opacity: 1 },
                    }}
                    className="absolute"
                  >
                    <ArrowLeft size={14} />
                  </motion.span>
                </span>
                Back
              </motion.button>
            </FadeUp>

            {/* Hero image — desktop full width */}
            <motion.div
              className="hidden md:block overflow-hidden  mb-10 w-full"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.img
                src={featuredImg}
                alt={altText}
                style={{ y: imgY, scale: imgScale }}
                className="w-full h-[480px] object-contain"
                loading="eager"
              />
            </motion.div>

            {/* Mobile hero */}
            <motion.div
              className="md:hidden overflow-hidden rounded-[18px] mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={featuredImg}
                alt={altText}
                className="w-full h-[240px] object-cover"
                loading="eager"
              />
            </motion.div>

            {/* Categories */}
            <FadeUp delay={0.1}>
              <div className="flex flex-wrap gap-2 mb-5">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/blog?category=${cat.id}&categoryName=${encodeURIComponent(cat.name)}`}
                    style={{ textDecoration: "none" }}
                  >
                    <motion.span
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="inline-block px-3 py-1 text-[11.5px] border border-black/[0.12] rounded-full text-black/40 tracking-wide hover:border-black/30 hover:text-black/70 transition-colors duration-150 cursor-pointer"
                    >
                      {cat.name}
                    </motion.span>
                  </Link>
                ))}
              </div>
            </FadeUp>

            {/* Title */}
            <motion.div
              className="mb-5 w-full"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: 0.14,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <h1
                className="
                    text-[clamp(1.75rem,4vw,3rem)]
                    font-semibold
                    leading-[1.12]
                    tracking-[-0.03em]
                    text-black
                    break-words
                    hyphens-auto
                    max-w-[1200px]"
              >
                {displayTitle}
              </h1>
            </motion.div>
            {/* Meta row */}
            <FadeUp delay={0.28}>
              <div className="flex items-center gap-3 pb-10 text-[12px] text-black/35">
                <span>{formattedDate}</span>
                <span className="w-1 h-1 rounded-full bg-black/20" />
                <span>{readTime} min read</span>
                {authorName && authorName !== "admin" && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-black/20" />
                    <span>By {authorName}</span>
                  </>
                )}
              </div>
            </FadeUp>
          </div>
        </section>

        <SectionDivider />

        {/* ═══════ CONTENT ═══════ */}
        <section className="section-container pt-12 pb-28 relative z-10">
          <div className="max-w-[1100px] mx-auto px-4 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-8 lg:gap-16">
              {/* ── LEFT: article body ── */}
              <div>
                <FadeUp delay={0.05}>
                  {/*
                    Blog content from WP — we apply rich prose styling via Tailwind
                    arbitrary selectors. Images, headings, lists, blockquotes all
                    handled gracefully.
                  */}
                  <div
                    className="
                    blog-content
                    text-[15px] text-black/60 leading-[1.88] tracking-[-0.01em]
                    [&_h1]:text-[clamp(1.5rem,3vw,2rem)] [&_h1]:font-semibold [&_h1]:text-black [&_h1]:leading-tight [&_h1]:tracking-[-0.025em] [&_h1]:mt-10 [&_h1]:mb-5
                    [&_h2]:text-[clamp(1.25rem,2.5vw,1.6rem)] [&_h2]:font-semibold [&_h2]:text-black [&_h2]:leading-tight [&_h2]:tracking-[-0.02em] [&_h2]:mt-10 [&_h2]:mb-4
                    [&_h3]:text-[17px] [&_h3]:font-semibold [&_h3]:text-black [&_h3]:leading-snug [&_h3]:tracking-[-0.015em] [&_h3]:mt-8 [&_h3]:mb-3
                    [&_h4]:text-[15px] [&_h4]:font-semibold [&_h4]:text-black/80 [&_h4]:mt-6 [&_h4]:mb-2
                    [&_p]:mb-5 [&_p:last-child]:mb-0 [&_p]:text-black/58
                    [&_a]:text-black [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-black/55 [&_a]:transition-colors
                    [&_strong]:text-black/80 [&_strong]:font-semibold
                    [&_em]:italic [&_em]:text-black/55
                    [&_blockquote]:border-l-2 [&_blockquote]:border-black/20 [&_blockquote]:pl-5 [&_blockquote]:my-6 [&_blockquote]:text-black/50 [&_blockquote]:italic
                    [&_ul]:mt-3 [&_ul]:mb-5 [&_ul]:space-y-2.5 [&_ul]:pl-0 [&_ul]:list-none
                    [&_ul>li]:flex [&_ul>li]:gap-3 [&_ul>li]:text-black/55
                    [&_ul>li]:before:content-['—'] [&_ul>li]:before:text-black/20 [&_ul>li]:before:shrink-0
                    [&_ol]:mt-3 [&_ol]:mb-5 [&_ol]:space-y-2.5 [&_ol]:pl-5
                    [&_ol>li]:text-black/55
                    [&_img]:rounded-[12px] [&_img]:w-full [&_img]:max-h-[480px] [&_img]:my-8 [&_img]:object-cover [&_img]:block
                    [&_figure]:my-8 [&_figure]:max-w-full [&_figure_img]:max-h-[480px] [&_figure_img]:object-cover [&_figcaption]:text-[12px] [&_figcaption]:text-black/35 [&_figcaption]:text-center [&_figcaption]:mt-2
                    [&_hr]:border-black/[0.08] [&_hr]:my-10
                    [&_pre]:bg-black/[0.04] [&_pre]:rounded-[8px] [&_pre]:p-5 [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:text-[13px]
                    [&_code]:bg-black/[0.05] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[13px] [&_code]:text-black/70
                  "
                    dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                  />
                </FadeUp>

                {/* CTA */}
                <div className="hidden md:block">
                  <InlineCTA onOpenContact={() => setContactOpen(true)} />
                </div>

                {/* MOBILE related carousel */}
                {related.length > 0 && (
                  <div className="md:hidden mt-16">
                    <p className="text-[10.5px] uppercase tracking-[0.2em] text-black/28 font-semibold mb-5">
                      Related Articles
                    </p>
                    <DragCarousel>
                      {related.map((p, i) => (
                        <motion.div
                          key={p.slug}
                          initial={{ opacity: 0, y: 18, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            delay: i * 0.08,
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          onClick={() => navigate(`/blog/${p.slug}`)}
                          style={{ width: "68vw", flexShrink: 0 }}
                          className="cursor-pointer group"
                        >
                          <div className="relative overflow-hidden rounded-2xl mb-3 h-[130px]">
                            <img
                              src={p.img}
                              alt={p.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                              <ArrowUpRight size={11} />
                            </div>
                          </div>
                          <p className="text-[13px] font-medium text-black leading-snug group-hover:text-black/50 transition-colors line-clamp-2">
                            {p.title}
                          </p>
                          <p className="text-[11px] text-black/30 mt-0.5">
                            {p.formattedDate}
                          </p>
                        </motion.div>
                      ))}
                    </DragCarousel>
                  </div>
                )}

                <div className="md:hidden">
                  <InlineCTA onOpenContact={() => setContactOpen(true)} />
                </div>
              </div>

              {/* ── RIGHT: sticky sidebar ── */}
              <div className="hidden md:block">
                <div className="sticky top-28 space-y-10">
                  {/* Article meta */}
                  <FadeUp delay={0.1}>
                    <div className="pb-6 border-b border-black/[0.06]">
                      <p className="text-[10.5px] uppercase tracking-[0.2em] text-black/28 font-semibold mb-4">
                        About this article
                      </p>
                      <div className="space-y-2.5">
                        <div>
                          <p className="text-[10.5px] text-black/28 uppercase tracking-wide mb-0.5">
                            Published
                          </p>
                          <p className="text-[12.5px] text-black/55">
                            {formattedDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10.5px] text-black/28 uppercase tracking-wide mb-0.5">
                            Read time
                          </p>
                          <p className="text-[12.5px] text-black/55">
                            {readTime} min
                          </p>
                        </div>
                        {categories.length > 0 && (
                          <div>
                            <p className="text-[10.5px] text-black/28 uppercase tracking-wide mb-1.5">
                              Categories
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {categories.map((cat) => (
                                <Link
                                  key={cat.id}
                                  to={`/blog?category=${cat.id}&categoryName=${encodeURIComponent(cat.name)}`}
                                  style={{ textDecoration: "none" }}
                                >
                                  <span className="text-[10.5px] px-2 py-0.5 border border-black/10 text-black/45 hover:border-black/25 hover:text-black/65 transition-colors cursor-pointer">
                                    {cat.name}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </FadeUp>

                  {/* Related articles */}
                  {related.length > 0 && (
                    <div>
                      <LineReveal className="mb-5">
                        <p className="text-[10.5px] uppercase tracking-[0.2em] text-black/28 font-semibold">
                          Related Articles
                        </p>
                      </LineReveal>
                      <div className="flex flex-col">
                        {related.map((p, i) => (
                          <motion.div
                            key={p.slug}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              delay: i * 0.07,
                              duration: 0.5,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            onClick={() => navigate(`/blog/${p.slug}`)}
                            className="group cursor-pointer py-3 border-b border-black/[0.06] last:border-b-0"
                          >
                            <div className="relative overflow-hidden rounded-[10px] mb-2.5 h-[110px]">
                              <img
                                src={p.img}
                                alt={p.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300 rounded-[10px]" />
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 scale-75 group-hover:scale-100">
                                <ArrowUpRight size={10} />
                              </div>
                            </div>
                            <p className="text-[12.5px] font-medium text-black group-hover:text-black/45 transition-colors duration-200 leading-snug line-clamp-2">
                              {p.title}
                            </p>
                            <p className="text-[11px] text-black/28 mt-0.5">
                              {p.formattedDate}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                      <motion.button
                        onClick={() => navigate("/blog")}
                        whileHover={{ x: 2 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 22,
                        }}
                        className="mt-5 text-[11px] text-black/28 hover:text-black/55 transition-colors flex items-center gap-1"
                      >
                        All articles <ArrowUpRight size={10} />
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <ContactForm open={contactOpen} onClose={() => setContactOpen(false)} />
      <CTAFooter />
    </div>
  );
};

export default BlogPage;
