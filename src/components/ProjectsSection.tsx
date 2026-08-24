import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedHeading from "@/components/AnimatedHeading";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { setCachedSlugType } from "@/pages/SlugResolver";

const WP_API_BASE = "https://cms.kolacommunications.com/wp-json/wp/v2";
const PER_PAGE = 6;

/* ─── Types ─── */
interface WPProject {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  aioseo_head_json?: {
    title?: string;
    description?: string;
    keywords?: string;
    schema?: {
      articleSection?: string;
      "@graph"?: Array<{
        "@type": string;
        articleSection?: string;
        [key: string]: unknown;
      }>;
      [key: string]: unknown;
    };
  };
  acf?: {
    live_url?: string;
    hover_img?: string;
    tags?: string[];
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
  };
}

interface NormalizedProject {
  id: number;
  slug: string;
  title: string;
  img: string;
  hoverImg: string;
  tags: string[];
  liveUrl: string;
}

/* ─── Decode HTML entities (&#038; → &, &amp; → &, etc.) ─── */
const decodeHtmlEntities = (str: string): string => {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
};

/* ─── Extract articleSection from aioseo schema (mirrors ProjectPage logic) ─── */
const getArticleSection = (p: WPProject): string => {
  const schema = p.aioseo_head_json?.schema as any;
  if (!schema) return "";

  // @graph array — same structure ProjectPage uses
  if (Array.isArray(schema["@graph"])) {
    const article = schema["@graph"].find((n: any) => n["@type"] === "Article");
    if (article?.articleSection) return article.articleSection as string;
  }
  // Flat fallback
  if (typeof schema.articleSection === "string") return schema.articleSection;

  return "";
};

/* ─── Normalize WP response ─── */
const normalize = (p: WPProject): NormalizedProject => {
  if (p.slug) {
    setCachedSlugType(p.slug, "project");
  }
  const img =
    p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "/placeholder.jpg";

  const rawSection = getArticleSection(p);
  const tags: string[] = rawSection
    ? rawSection.split(",").map((t: string) => t.trim()).filter(Boolean).slice(0, 3)
    : p.acf?.tags ?? [];

  return {
    id: p.id,
    slug: p.slug,
    title: decodeHtmlEntities(p.title.rendered),
    img,
    hoverImg: p.acf?.hover_img ?? img,
    tags,
    liveUrl: p.acf?.live_url ?? "",
  };
};

/* ─── Glitch hook ─── */
const useGlitch = () => {
  const [glitching, setGlitching] = useState(false);
  const trigger = useCallback(() => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 500);
  }, []);
  return { glitching, trigger };
};

/* ─── Glitch overlay ─── */
const GlitchOverlay = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 1, 0.4, 1, 0] }}
    transition={{ duration: 0.5 }}
    className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
  >
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{ x: [0, -6 + i * 4, 6 - i * 2, 0], opacity: [0, 0.6, 0.2, 0] }}
        transition={{ duration: 0.3, delay: i * 0.05 }}
        className="absolute inset-0"
        style={{
          background:
            i === 0
              ? "rgba(255,0,0,0.2)"
              : i === 1
              ? "rgba(0,255,0,0.15)"
              : "rgba(0,150,255,0.2)",
          mixBlendMode: "screen",
        }}
      />
    ))}
  </motion.div>
);

/* ─── Project card ─── */
const ProjectCard = ({
  project,
  index,
}: {
  project: NormalizedProject;
  index: number;
}) => {
  const { glitching, trigger } = useGlitch();
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/${project.slug}`} style={{ textDecoration: "none" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        onMouseEnter={() => { setHovered(true); trigger(); }}
        onMouseLeave={() => setHovered(false)}
        className="group overflow-hidden border border-black/10 bg-white/5 backdrop-blur-xl relative cursor-pointer"
      >
        {/* Header row — title + tags + arrow */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-black/10 gap-3">
          <div className="flex-col items-center gap-3 min-w-0 flex-1">
            {/* Title */}
            <span className="text-md text-black font-medium shrink-0 leading-snug">
              {project.title}
            </span>

            {/* Tags — shown beside the name */}
            {project.tags.length > 0 && (
              <div className="flex gap-1.5 my-2 flex-wrap min-w-0">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 text-black border border-black/10 whitespace-nowrap leading-snug"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Animated arrow */}
          <div className="relative w-4 h-4 overflow-hidden shrink-0">
            <motion.span
              animate={hovered ? { x: 16, y: -16, opacity: 0 } : { x: 0, y: 0, opacity: 1 }}
              className="absolute"
            >
              <ArrowUpRight size={16} className="text-black/50" />
            </motion.span>
            <motion.span
              animate={hovered ? { x: 0, y: 0, opacity: 1 } : { x: -16, y: 16, opacity: 0 }}
              className="absolute"
            >
              <ArrowUpRight size={16} className="text-black" />
            </motion.span>
          </div>
        </div>

        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <motion.img
            src={project.img}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ opacity: hovered && glitching ? 0 : 1 }}
          />
          <motion.img
            src={project.hoverImg}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: hovered && !glitching ? 1 : 0, scale: hovered ? 1 : 1.1 }}
            transition={{ duration: 0.5 }}
          />
          <AnimatePresence>{glitching && <GlitchOverlay />}</AnimatePresence>
        </div>
      </motion.div>
    </Link>
  );
};

/* ─── Pagination button ─── */
const PaginationBtn = ({
  onClick,
  disabled,
  active,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      inline-flex items-center justify-center w-9 h-9 text-sm border transition-colors
      ${active
        ? "border-black bg-black text-white"
        : "border-black/10 text-black/60 hover:border-black/30 hover:text-black"
      }
      disabled:opacity-30 disabled:cursor-not-allowed
    `}
  >
    {children}
  </button>
);

/* ─── Main Component ─── */
const ProjectsSection = () => {
  const [projects, setProjects] = useState<NormalizedProject[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${WP_API_BASE}/projects?per_page=${PER_PAGE}&page=${page}&_embed=1`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        if (cancelled) return;
        setTotalPages(Number(res.headers.get("X-WP-TotalPages") ?? 1));
        const data: WPProject[] = await res.json();
        if (!cancelled) setProjects(data.map(normalize));
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProjects();
    return () => { cancelled = true; };
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setTimeout(() => {
      document.getElementById("projects-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const getPageNumbers = (): (number | "…")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  };

  return (
    <section id="projects-section" className="py-24 md:mb-10 section-container p-4 md:p-10">
      <AnimatedHeading
        lines={["Projects", "we're proud of."]}
        className="text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] max-w-[640px] mb-16 md:mb-20 md:mt-10"
        stagger={0.07}
        duration={0.7}
        blur={10}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35 }}
          className="grid md:grid-cols-2 gap-4"
        >
          {loading
            ? Array.from({ length: PER_PAGE }).map((_, i) => (
                <div key={i} className="border border-black/10 bg-white/5 animate-pulse">
                  <div className="px-5 py-4 border-b border-black/10 h-12" />
                  <div className="aspect-[16/9] bg-black/5" />
                </div>
              ))
            : projects.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} />
              ))}
        </motion.div>
      </AnimatePresence>

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <PaginationBtn onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
            <ChevronLeft size={14} />
          </PaginationBtn>
          {getPageNumbers().map((p, i) =>
            p === "…" ? (
              <span key={`ellipsis-${i}`} className="w-9 text-center text-black/30 text-sm">…</span>
            ) : (
              <PaginationBtn key={p} onClick={() => handlePageChange(p as number)} active={p === page}>
                {p}
              </PaginationBtn>
            )
          )}
          <PaginationBtn onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
            <ChevronRight size={14} />
          </PaginationBtn>
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;