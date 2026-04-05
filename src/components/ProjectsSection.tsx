import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedHeading from "@/components/AnimatedHeading";
import { ArrowUpRight } from "lucide-react";

/* ─── DATA ─── */

const projects = [
  {
    title: "Kora Consulting Site",
    tags: ["Web Design", "Framer Dev"],
    img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
    hoverImg:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
  },
  {
    title: "KYMA Platform",
    tags: ["Web App", "UI/UX"],
    img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80",
    hoverImg:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  },
  {
    title: "Real Estate Portal",
    tags: ["Landing Page", "SEO"],
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    hoverImg:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
  },
  {
    title: "AI Dashboard",
    tags: ["Web App", "AI Tools"],
    img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
    hoverImg:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  },
];

/* ─── GLITCH HOOK ─── */

const useGlitch = () => {
  const [glitching, setGlitching] = useState(false);

  const trigger = useCallback(() => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 500);
  }, []);

  return { glitching, trigger };
};

/* ─── GLITCH OVERLAY ─── */
/* ─── GLITCH OVERLAY (UPGRADED) ─── */

const GlitchOverlay = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 1, 0.4, 1, 0] }}
    transition={{ duration: 0.5 }}
    className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
  >
    {/* RGB SHIFT */}
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{
          x: [0, -6 + i * 4, 6 - i * 2, 0],
          opacity: [0, 0.6, 0.2, 0],
        }}
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

    {/* SCAN LINES */}
    {Array.from({ length: 14 }).map((_, i) => (
      <motion.div
        key={i}
        animate={{
          y: ["0%", "100%"],
          opacity: [0.8, 0],
        }}
        transition={{ duration: 0.1, delay: i * 0.02 }}
        className="absolute w-full h-[5%] bg-black/70"
        style={{ top: `${i * 7}%` }}
      />
    ))}

    {/* PIXEL BURST */}
    {Array.from({ length: 60 }).map((_, i) => (
      <motion.div
        key={i}
        animate={{
          opacity: [0, 1, 0],
          scale: [0.4, 1.6, 0.4],
        }}
        transition={{
          duration: 0.4,
          delay: Math.random() * 0.3,
        }}
        style={{
          position: "absolute",
          width: "3px",
          height: "3px",
          background: "white",
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }}
      />
    ))}
  </motion.div>
);

/* ─── PROJECT CARD ─── */

const ProjectCard = ({ project, index }) => {
  const { glitching, trigger } = useGlitch();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => {
        setHovered(true);
        trigger();
      }}
      onMouseLeave={() => setHovered(false)}
      className="group overflow-hidden border border-black/10 bg-white/5 backdrop-blur-xl relative"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-black/10">
        <div className="flex gap-3 items-center">
          <span className="text-sm text-black font-medium">
            {project.title}
          </span>

          <div className="flex gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 text-black/40 border border-black/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ARROW */}
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

      {/* IMAGE */}
      <div className="relative aspect-[16/9] overflow-hidden">

        {/* base */}
        <motion.img
          src={project.img}
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ opacity: hovered && glitching ? 0 : 1 }}
        />

        {/* hover */}
        <motion.img
          src={project.hoverImg}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: hovered && !glitching ? 1 : 0,
            scale: hovered ? 1 : 1.1,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* glitch */}
        <AnimatePresence>
          {glitching && <GlitchOverlay />}
        </AnimatePresence>

        {/* VIEW BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: hovered ? 1 : 0,
            y: hovered ? 0 : 20,
          }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
        >
        </motion.div>

      </div>
    </motion.div>
  );
};
/* ─── MAIN COMPONENT ─── */

const ProjectsSection = () => {
  return (
    <section className="py-24 section-container p-4 md:p-10">
      <AnimatedHeading
                lines={["Projects", "we're proud of."]}
                className="
                  text-[clamp(2.2rem,5vw,4rem)]
                  leading-[1.05]
                  tracking-[-0.02em]
                  max-w-[640px]
                  mb-16 md:mb-20
                "
                stagger={0.07}
                duration={0.7}
                blur={10}
              />

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((p, i) => (
          <ProjectCard key={p.title} project={p} index={i} />
        ))}
      </div>

      {/* VIEW ALL */}
      <div className="mt-12 flex justify-center">
        <motion.a
          href="#"
          initial="rest"
          whileHover="hover"
          animate="rest"
          className="inline-flex items-center gap-2 text-md text-black/80 hover:text-black"
        >
          View all projects

          <span className="relative w-4 h-4 overflow-hidden">
            <motion.span
              variants={{
                rest: { x: 0, y: 0, opacity: 1 },
                hover: { x: 16, y: -16, opacity: 0 },
              }}
              className="absolute"
            >
              <ArrowUpRight size={14} />
            </motion.span>

            <motion.span
              variants={{
                rest: { x: -16, y: 16, opacity: 0 },
                hover: { x: 0, y: 0, opacity: 1 },
              }}
              className="absolute"
            >
              <ArrowUpRight size={14} />
            </motion.span>
          </span>
        </motion.a>
      </div>

    </section>
  );
};

export default ProjectsSection;