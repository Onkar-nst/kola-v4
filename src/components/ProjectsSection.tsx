import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedHeading from "@/components/AnimatedHeading";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

const WP_API_BASE = "https://cms.kolacommunications.com/wp-json/wp/v2";
const PER_PAGE = 6; // cards per page

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
  };
  schema?: {
    articleSection?: string;
  };
  acf?: {
    live_url?: string;
    hover_img?: string;
    tags?: string[];
  };
  // fallback fields
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
  };
}

interface NormalizedProject {
  id: number;
  slug: string;
  title: string;
  content: string;
  img: string;
  hoverImg: string;
  tags: string[];
  liveUrl: string;
}

/* ─── Normalize WP response ─── */
const normalize = (p: WPProject): NormalizedProject => {
  const img =
    p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "/placeholder.jpg";

  // Parse tags from schema articleSection
  const rawSection =
    (p as any).aioseo_head_json?.schema?.articleSection ??
    (p as any).schema?.articleSection ??
    "";
  const tags: string[] = rawSection
    ? rawSection
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean)
        .slice(0, 3) // cap to 3 tags for UI
    : p.acf?.tags ?? [];

  return {
    id: p.id,
    slug: p.slug,
    title: p.title.rendered,
    content: p.content.rendered,
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
    <Link to={`/project/${project.slug}`} style={{ textDecoration: "none" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        onMouseEnter={() => {
          setHovered(true);
          trigger();
        }}
        onMouseLeave={() => setHovered(false)}
        className="group overflow-hidden border border-black/10 bg-white/5 backdrop-blur-xl relative cursor-pointer"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-black/10">
          <div className="flex gap-3 items-center">
            <span className="text-sm text-black font-medium">
              {project.title}
            </span>
            <div className="flex gap-2">
              {project.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 text-black/40 border border-black/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="relative w-4 h-4 overflow-hidden">
            <motion.span
              animate={
                hovered
                  ? { x: 16, y: -16, opacity: 0 }
                  : { x: 0, y: 0, opacity: 1 }
              }
              className="absolute"
            >
              <ArrowUpRight size={16} className="text-black/50" />
            </motion.span>
            <motion.span
              animate={
                hovered
                  ? { x: 0, y: 0, opacity: 1 }
                  : { x: -16, y: 16, opacity: 0 }
              }
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
            animate={{
              opacity: hovered && !glitching ? 1 : 0,
              scale: hovered ? 1 : 1.1,
            }}
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
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${WP_API_BASE}/projects?per_page=${PER_PAGE}&page=${page}&_embed=1`
        );
        if (!res.ok) throw new Error("Failed to fetch");

        const total = Number(res.headers.get("X-WP-TotalPages") ?? 1);
        setTotalPages(total);

        const data: WPProject[] = await res.json();
        setProjects(data.map(normalize));
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [page]);

  // Scroll to section top on page change
  const sectionRef = useCallback((node: HTMLElement | null) => {
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // small delay to let state update, then scroll
    setTimeout(() => {
      document.getElementById("projects-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // Build page number array with ellipsis
  const getPageNumbers = () => {
    const pages: (number | "…")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("…");
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      )
        pages.push(i);
      if (page < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <section
      id="projects-section"
      className="py-24 md:mb-10 section-container p-4 md:p-10"
    >
      <AnimatedHeading
        lines={["Projects", "we're proud of."]}
        className="
          text-[clamp(2.2rem,5vw,4rem)]
          leading-[1.05]
          tracking-[-0.02em]
          max-w-[640px]
          mb-16 md:mb-20
          md:mt-10
        "
        stagger={0.07}
        duration={0.7}
        blur={10}
      />

      {/* Grid */}
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
                <div
                  key={i}
                  className="border border-black/10 bg-white/5 animate-pulse"
                >
                  <div className="px-5 py-4 border-b border-black/10 h-12" />
                  <div className="aspect-[16/9] bg-black/5" />
                </div>
              ))
            : projects.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} />
              ))}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <PaginationBtn
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft size={14} />
          </PaginationBtn>

          {getPageNumbers().map((p, i) =>
            p === "…" ? (
              <span key={`ellipsis-${i}`} className="w-9 text-center text-black/30 text-sm">
                …
              </span>
            ) : (
              <PaginationBtn
                key={p}
                onClick={() => handlePageChange(p as number)}
                active={p === page}
              >
                {p}
              </PaginationBtn>
            )
          )}

          <PaginationBtn
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight size={14} />
          </PaginationBtn>
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;