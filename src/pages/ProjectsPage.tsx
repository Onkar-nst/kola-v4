import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink, Plus } from "lucide-react";

import ColumnGuides from "@/components/ColumnGuides";
import CustomCursor from "@/components/CustomCursor";
import CTAFooter from "@/components/CTAFooter";
import SectionDivider from "@/components/SectionDivider";
import AnimatedHeading from "@/components/AnimatedHeading";

/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */

const WP_API_BASE = "https://cms.kolacommunications.com/wp-json/wp/v2";

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */

interface AioseoSchema {
  "@context"?: string;
  "@graph"?: Array<{
    "@type": string;
    articleSection?: string;
    image?: { "@type": string; url: string; width: number; height: number };
    [key: string]: unknown;
  }>;
  articleSection?: string;
  [key: string]: unknown;
}

interface AioseoHeadJson {
  title?: string;
  description?: string;
  canonical_url?: string;
  robots?: string;
  keywords?: string;
  schema?: AioseoSchema;
  [key: string]: unknown;
}

interface WPProject {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  featured_media: number;
  aioseo_head_json?: AioseoHeadJson;
  acf?: {
    live_url?: string;
    liveUrl?: string;
    hover_img?: string;
    tags?: string[];
    images?: string[];
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text?: string }>;
  };
}

interface NormalizedProject {
  id: number;
  slug: string;
  title: string;
  img: string;
  tags: string[];
}

interface ContentSection {
  heading: string;
  bodyHtml: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */

const stripHtml = (html: string) =>
  html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const getArticleSection = (seo?: AioseoHeadJson): string => {
  if (!seo?.schema) return "";
  const s = seo.schema;
  if (Array.isArray(s["@graph"])) {
    const article = s["@graph"].find((n) => n["@type"] === "Article");
    if (article?.articleSection) return article.articleSection as string;
  }
  if (typeof s.articleSection === "string") return s.articleSection;
  return "";
};

const getSchemaImageUrl = (seo?: AioseoHeadJson): string => {
  if (!seo?.schema) return "";
  const s = seo.schema;
  if (Array.isArray(s["@graph"])) {
    const article = s["@graph"].find((n) => n["@type"] === "Article");
    if (article?.image && typeof (article.image as { url?: string }).url === "string")
      return (article.image as { url: string }).url;
  }
  return "";
};

const normalizeOther = (p: WPProject): NormalizedProject => {
  const img =
    p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
    getSchemaImageUrl(p.aioseo_head_json) ??
    "/placeholder.jpg";
  const rawSection = getArticleSection(p.aioseo_head_json);
  const tags: string[] = rawSection
    ? rawSection.split(",").map((t: string) => t.trim()).filter(Boolean).slice(0, 3)
    : p.acf?.tags ?? [];
  return { id: p.id, slug: p.slug, title: p.title.rendered, img, tags };
};

/**
 * Split WP HTML on every <h3> into named sections.
 * This correctly separates "CLIENT REQUIREMENT", "HOW WE BUILT...", "FAQ" etc.
 */
const parseContentSections = (html: string): ContentSection[] => {
  const parts = html.split(/(?=<h3[\s>])/gi);
  const sections: ContentSection[] = [];
  for (const part of parts) {
    const h3Match = part.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    if (!h3Match) continue;
    const heading = h3Match[1].replace(/<[^>]+>/g, "").trim();
    const bodyHtml = part.replace(/<h3[^>]*>[\s\S]*?<\/h3>/i, "").trim();
    if (heading) sections.push({ heading, bodyHtml });
  }
  return sections;
};

/**
 * Parse FAQ body HTML into structured question/answer pairs.
 * Handles: <details>/<summary> OR <strong>question</strong> patterns.
 */
const parseFaqItems = (html: string): FaqItem[] => {
  const items: FaqItem[] = [];

  // Try <details>/<summary> pattern first
  const detailRegex = /<details[^>]*>([\s\S]*?)<\/details>/gi;
  let match;
  while ((match = detailRegex.exec(html)) !== null) {
    const inner = match[1];
    const summaryMatch = inner.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i);
    if (!summaryMatch) continue;
    const question = summaryMatch[1].replace(/<[^>]+>/g, "").trim();
    const answer = inner
      .replace(/<summary[^>]*>[\s\S]*?<\/summary>/i, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (question) items.push({ question, answer });
  }

  // Fallback: <strong> bold question pattern
  if (!items.length) {
    const pRegex = /<p[^>]*><strong[^>]*>(.*?)<\/strong>([\s\S]*?)<\/p>/gi;
    while ((match = pRegex.exec(html)) !== null) {
      const question = match[1].replace(/<[^>]+>/g, "").trim();
      const answer = match[2].replace(/<[^>]+>/g, "").trim();
      if (question) items.push({ question, answer });
    }
  }

  return items;
};

/* ══════════════════════════════════════════
   SEO HOOK
══════════════════════════════════════════ */

const upsertMeta = (sel: string, attrKey: string, attrVal: string, content: string) => {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(sel);
  if (!el) { el = document.createElement("meta"); el.setAttribute(attrKey, attrVal); document.head.appendChild(el); }
  el.setAttribute("content", content);
};
const upsertCanonical = (href: string) => {
  if (!href) return;
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) { el = document.createElement("link"); el.rel = "canonical"; document.head.appendChild(el); }
  el.href = href;
};
const upsertJsonLd = (data: object) => {
  const ID = "kola-project-jsonld";
  let el = document.getElementById(ID) as HTMLScriptElement | null;
  if (!el) { el = document.createElement("script"); el.id = ID; el.type = "application/ld+json"; document.head.appendChild(el); }
  el.textContent = JSON.stringify(data);
};

const useProjectSEO = (project: WPProject | null, img: string, plainDesc: string) => {
  useEffect(() => {
    if (!project) return;
    const seo = project.aioseo_head_json;
    const metaTitle = seo?.title ?? project.title.rendered;
    const metaDesc = seo?.description ?? plainDesc;
    const canonical = seo?.canonical_url ?? "";
    const prevTitle = document.title;
    document.title = metaTitle;
    upsertMeta('meta[name="description"]', "name", "description", metaDesc);
    upsertMeta('meta[name="keywords"]', "name", "keywords", seo?.keywords ?? "");
    upsertMeta('meta[name="robots"]', "name", "robots", seo?.robots ?? "");
    upsertCanonical(canonical);
    upsertMeta('meta[property="og:type"]', "property", "og:type", "article");
    upsertMeta('meta[property="og:title"]', "property", "og:title", metaTitle);
    upsertMeta('meta[property="og:description"]', "property", "og:description", metaDesc);
    upsertMeta('meta[property="og:image"]', "property", "og:image", getSchemaImageUrl(seo) || img);
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", metaTitle);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", metaDesc);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", getSchemaImageUrl(seo) || img);
    upsertMeta('meta[property="article:section"]', "property", "article:section", getArticleSection(seo));
    if (seo?.schema) upsertJsonLd(seo.schema);
    return () => { document.title = prevTitle; document.getElementById("kola-project-jsonld")?.remove(); };
  }, [project, img, plainDesc]);
};

/* ══════════════════════════════════════════
   UI PRIMITIVES
══════════════════════════════════════════ */

const FadeUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
};

const LineReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div initial={{ y: "100%" }} animate={inView ? { y: 0 } : {}}
        transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </motion.div>
    </div>
  );
};

/* ══════════════════════════════════════════
   DRAG CAROUSEL
══════════════════════════════════════════ */

const DragCarousel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragLeft, setDragLeft] = useState(-800);
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current || !containerRef.current) return;
      setDragLeft(-(trackRef.current.scrollWidth - containerRef.current.offsetWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [children]);
  return (
    <div ref={containerRef} className={className} style={{ overflow: "hidden", marginLeft: "-1rem", marginRight: "-1rem" }}>
      <motion.div ref={trackRef} drag="x" dragConstraints={{ left: dragLeft, right: 0 }}
        dragElastic={0.08} dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
        style={{ display: "flex", gap: "12px", paddingLeft: "1rem", width: "max-content", cursor: "grab" }}>
        {children}
      </motion.div>
    </div>
  );
};

/* ══════════════════════════════════════════
   FAQ ACCORDION — premium, minimal
══════════════════════════════════════════ */

const FaqAccordion = ({ items }: { items: FaqItem[] }) => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="mt-1">
      {items.map((item, i) => (
        <div key={i} className={`border-t border-black/[0.07] ${i === items.length - 1 ? "border-b" : ""}`}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-6 py-4 text-left group focus:outline-none"
          >
            <span className={`text-[13.5px] leading-snug tracking-[-0.01em] transition-colors duration-200 ${open === i ? "text-black" : "text-black/60 group-hover:text-black/90"}`}>
              {item.question}
            </span>
            <motion.span
              animate={{ rotate: open === i ? 45 : 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="shrink-0 text-black/25 group-hover:text-black/50 transition-colors"
            >
              <Plus size={13} strokeWidth={1.4} />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                key="answer"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="pb-4 text-[13px] text-black/45 leading-[1.8] pr-8 tracking-[-0.005em]">
                  {item.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════
   LIVE SITE CTA — minimal text link
══════════════════════════════════════════ */

const LiveSiteCTA = ({ href }: { href: string }) => {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1.5 text-[12.5px] text-black/38 hover:text-black/70 transition-colors duration-200"
    >
      View live site
      <ExternalLink size={11} strokeWidth={1.5} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
};

/* ══════════════════════════════════════════
   PROJECT CTA BLOCK
   Clean, editorial-style — no dark card
══════════════════════════════════════════ */

const InlineProjectCTA = () => {
  const navigate = useNavigate();
  return (
    <FadeUp delay={0.05}>
      <div className="mt-14 pt-10 border-t border-black/[0.06]">
        <p className="text-[11px] tracking-[0.18em] uppercase text-black/25 font-medium mb-4">
          Start a project
        </p>
        <p className="text-[22px] font-semibold tracking-[-0.03em] text-black leading-[1.15] mb-5 max-w-[320px]">
          Let's build something that works for you.
        </p>
        <motion.button
          onClick={() => navigate("/contact")}
          whileHover={{ x: 3 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-black/50 hover:text-black transition-colors duration-200"
        >
          Get in touch
          <ArrowUpRight size={13} strokeWidth={1.6} />
        </motion.button>
      </div>
    </FadeUp>
  );
};

/* ══════════════════════════════════════════
   CONTENT SECTION BLOCK
   h3 → styled label
   p tags → prose body
   FAQ → accordion
══════════════════════════════════════════ */

const ContentSectionBlock = ({ section, delay = 0 }: { section: ContentSection; delay?: number }) => {
  const isFAQ = /faq|frequently asked/i.test(section.heading);
  const faqItems = isFAQ ? parseFaqItems(section.bodyHtml) : [];

  return (
    <FadeUp delay={delay}>
      <div className="mb-12 last:mb-0">

        {/* Section label — rendered as visual h3, styled as small uppercase caption */}
        <LineReveal className="mb-5">
          <h3 className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-black/30 m-0 p-0">
            {section.heading}
          </h3>
        </LineReveal>

        {/* Thin rule */}
        <motion.div
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} style={{ originX: 0 }}
          className="h-px bg-black/[0.055] mb-6"
        />

        {/* Body */}
        {isFAQ && faqItems.length > 0 ? (
          <FaqAccordion items={faqItems} />
        ) : (
          /* Render as semantic p tags with refined prose styling */
          <div
            className={`
              text-[14.5px] text-black/55 leading-[1.88] tracking-[-0.01em]
              [&_p]:mb-5 [&_p:last-child]:mb-0
              [&_p]:text-black/55
              [&_strong]:text-black/75 [&_strong]:font-medium
              [&_a]:text-black [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-black/60
              [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:mb-5
              [&_li]:flex [&_li]:gap-2.5 [&_li]:text-black/50
              [&_li]:before:content-['—'] [&_li]:before:text-black/20 [&_li]:before:shrink-0 [&_li]:before:mt-0
            `}
            dangerouslySetInnerHTML={{ __html: section.bodyHtml }}
          />
        )}
      </div>
    </FadeUp>
  );
};

/* ══════════════════════════════════════════
   PROJECT PAGE  ←  default export
══════════════════════════════════════════ */

const ProjectPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<WPProject | null>(null);
  const [otherProjects, setOtherProjects] = useState<NormalizedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const featuredImg =
    project?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
    getSchemaImageUrl(project?.aioseo_head_json) ??
    "/placeholder.jpg";
  const altText =
    project?._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ??
    project?.title.rendered ?? "";
  const plainDesc = project ? stripHtml(project.content.rendered).slice(0, 160) : "";

  useProjectSEO(project, featuredImg, plainDesc);

  useEffect(() => {
    if (!slug) return;
    setLoading(true); setNotFound(false); setProject(null);
    fetch(`${WP_API_BASE}/projects?slug=${encodeURIComponent(slug)}&_embed=1`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json() as Promise<WPProject[]>; })
      .then((data) => { if (!data.length) setNotFound(true); else setProject(data[0]); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    fetch(`${WP_API_BASE}/projects?per_page=4&_embed=1`)
      .then((r) => r.json() as Promise<WPProject[]>)
      .then((data) => setOtherProjects(data.filter((p) => p.slug !== slug).slice(0, 3).map(normalizeOther)))
      .catch(() => {});
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        className="text-sm text-black/30 tracking-widest uppercase">Loading</motion.div>
    </div>
  );

  if (notFound || !project) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-black/50 text-sm">Project not found.</p>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-black hover:text-black/60 transition-colors">
        <ArrowLeft size={14} /> Go back
      </button>
    </div>
  );

  const liveUrl = project.acf?.live_url ?? project.acf?.liveUrl ?? "";
  const articleSection = getArticleSection(project.aioseo_head_json);
  const tags: string[] = articleSection
    ? articleSection.split(",").map((t) => t.trim()).filter(Boolean)
    : project.acf?.tags ?? [];

  const hoverImg = project.acf?.hover_img ?? featuredImg;
  const extraImages: string[] = project.acf?.images ?? [];
  const allImages = [featuredImg, hoverImg, ...extraImages].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);

  const sections = parseContentSections(project.content.rendered);

  return (
    <div className="min-h-screen bg-white">
      <CustomCursor />
      <div className="relative overflow-hidden">
        <ColumnGuides />

        {/* ═══════ HERO ═══════ */}
        <section ref={heroRef} className="section-container pt-24 pb-0 relative z-10">
          <div className="max-w-[1100px] mx-auto px-4 md:px-10">

            {/* BACK */}
            <FadeUp delay={0}>
              <motion.button onClick={() => navigate(-1)} initial="rest" whileHover="hover" animate="rest"
                className="mb-10 flex items-center gap-2 text-sm text-black/35 hover:text-black transition-colors">
                <span className="relative w-4 h-4 overflow-hidden">
                  <motion.span variants={{ rest: { x: 0, y: 0, opacity: 1 }, hover: { x: -16, y: 16, opacity: 0 } }} className="absolute"><ArrowLeft size={14} /></motion.span>
                  <motion.span variants={{ rest: { x: 16, y: -16, opacity: 0 }, hover: { x: 0, y: 0, opacity: 1 } }} className="absolute"><ArrowLeft size={14} /></motion.span>
                </span>
                Back
              </motion.button>
            </FadeUp>

            {/* DESKTOP: full-width hero */}
            <motion.div className="hidden md:block overflow-hidden rounded-[20px] mb-10 w-full"
              initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
              <motion.img src={featuredImg} alt={altText}
                style={{ y: imgY, scale: imgScale }}
                className="w-full h-[500px] lg:h-[540px] object-cover" />
            </motion.div>

            {/* MOBILE: drag carousel */}
            <div className="md:hidden mb-8">
              <DragCarousel>
                {allImages.map((src, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ width: "82vw", flexShrink: 0 }} className="overflow-hidden rounded-[18px]">
                    <img src={src} alt={`${project.title.rendered} ${i + 1}`} className="w-full h-[240px] object-cover" />
                  </motion.div>
                ))}
              </DragCarousel>
            </div>

            {/* TITLE */}
            <div className="mb-2">
              <AnimatedHeading lines={[project.title.rendered]}
                className="md:hidden text-[clamp(2rem,8vw,3rem)] leading-[1.05] tracking-[-0.03em] font-semibold" />
              <AnimatedHeading lines={[project.title.rendered]}
                className="hidden md:block text-[clamp(2.5rem,4.5vw,3.5rem)] leading-[1.05] tracking-[-0.03em] font-semibold" />
            </div>

            {/* TAGS */}
            <FadeUp delay={0.25}>
              <div className="flex flex-wrap gap-2 pb-10 pt-3">
                {tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs border border-black/[0.12] rounded-full text-black/40 bg-transparent tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        <SectionDivider />

        {/* ═══════ CONTENT ═══════ */}
        <section className="section-container pt-14 pb-28 relative z-10">
          <div className="max-w-[1100px] mx-auto px-4 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-8 lg:gap-16">

              {/* LEFT */}
              <div>
                {sections.length > 0
                  ? sections.map((section, idx) => (
                      <ContentSectionBlock key={idx} section={section} delay={0.05 + idx * 0.07} />
                    ))
                  : (
                    <FadeUp delay={0.05}>
                      <div className="text-[14.5px] text-black/55 leading-[1.88] [&_p]:mb-5 [&_p:last-child]:mb-0"
                        dangerouslySetInnerHTML={{ __html: project.content.rendered }} />
                    </FadeUp>
                  )
                }

                {/* Inline CTA — desktop + shared */}
                <div className="hidden md:block">
                  <InlineProjectCTA />
                  {liveUrl && (
                    <FadeUp delay={0.05}>
                      <div className="mt-5">
                        <LiveSiteCTA href={liveUrl} />
                      </div>
                    </FadeUp>
                  )}
                </div>

                {/* MOBILE other-projects carousel */}
                {otherProjects.length > 0 && (
                  <div className="md:hidden mt-16">
                    <p className="text-[10.5px] uppercase tracking-[0.2em] text-black/28 font-semibold mb-5">Other Projects</p>
                    <DragCarousel>
                      {otherProjects.map((p, i) => (
                        <motion.div key={p.slug}
                          initial={{ opacity: 0, y: 18, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          onClick={() => navigate(`/project/${p.slug}`)}
                          style={{ width: "62vw", flexShrink: 0 }}
                          className="cursor-pointer group">
                          <div className="relative overflow-hidden rounded-2xl mb-3 h-[130px]">
                            <img src={p.img} alt={p.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                              <ArrowUpRight size={11} />
                            </div>
                          </div>
                          <p className="text-[13px] font-medium text-black leading-snug group-hover:text-black/50 transition-colors">{p.title}</p>
                          {p.tags?.length > 0 && (
                            <p className="text-[11px] text-black/30 mt-0.5">{p.tags.slice(0, 2).join(" · ")}</p>
                          )}
                        </motion.div>
                      ))}
                    </DragCarousel>
                  </div>
                )}

                {/* Mobile CTA */}
                <div className="md:hidden">
                  <InlineProjectCTA />
                  {liveUrl && (
                    <div className="mt-4">
                      <LiveSiteCTA href={liveUrl} />
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: sticky sidebar */}
              {otherProjects.length > 0 && (
                <div className="hidden md:block">
                  <div className="sticky top-28">
                    <LineReveal className="mb-5">
                      <p className="text-[10.5px] uppercase tracking-[0.2em] text-black/28 font-semibold">Other Projects</p>
                    </LineReveal>
                    <div className="flex flex-col gap-0">
                      {otherProjects.map((p, i) => (
                        <motion.div key={p.slug}
                          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          onClick={() => navigate(`/project/${p.slug}`)}
                          className="group cursor-pointer py-3 border-b border-black/[0.06] last:border-b-0">
                          <div className="relative overflow-hidden rounded-[10px] mb-2.5 h-[120px]">
                            <img src={p.img} alt={p.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300 rounded-[10px]" />
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 scale-75 group-hover:scale-100">
                              <ArrowUpRight size={10} />
                            </div>
                          </div>
                          <p className="text-[12.5px] font-medium text-black group-hover:text-black/45 transition-colors duration-200 leading-snug">{p.title}</p>
                          {p.tags?.length > 0 && (
                            <p className="text-[11px] text-black/28 mt-0.5">{p.tags.slice(0, 2).join(" · ")}</p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    <motion.button onClick={() => navigate("/#work")}
                      whileHover={{ x: 2 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
                      className="mt-5 text-[11px] text-black/28 hover:text-black/55 transition-colors flex items-center gap-1">
                      View all <ArrowUpRight size={10} />
                    </motion.button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      </div>
      <CTAFooter />
    </div>
  );
};

export default ProjectPage;