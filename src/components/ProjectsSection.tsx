import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedHeading from "@/components/AnimatedHeading";
import { ArrowUpRight } from "lucide-react";

/* ─── Data ─── */

const projects = [
  {
    title: "Kora Consulting Site",
    tags: ["Web Design", "Framer Dev"],
    img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
  },
  {
    title: "KYMA Platform",
    tags: ["Web App", "UI/UX"],
    img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80",
  },
  {
    title: "Real Estate Portal",
    tags: ["Landing Page", "SEO"],
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  },
  {
    title: "AI Dashboard",
    tags: ["Web App", "AI Tools"],
    img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
  },
];

/* ─── Glitch hook ─── */

const useGlitch = () => {
  const [glitching, setGlitching] = useState(false);

  const trigger = useCallback(() => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 600);
  }, []);

  return { glitching, trigger };
};

/* ─── Glitch overlay ─── */

const GlitchOverlay = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 0.85, 0.3, 0.9, 0.2, 0.7, 0] }}
    transition={{ duration: 0.6, times: [0, 0.1, 0.25, 0.4, 0.6, 0.8, 1] }}
    className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
  >
    {/* Scan lines */}
    {Array.from({ length: 14 }).map((_, i) => (
      <motion.div
        key={i}
        animate={{
          y: [`${(i / 14) * 100}%`, `${((i + 2) / 14) * 100}%`],
          opacity: [0.9, 0],
          scaleY: [1, 0.3],
        }}
        transition={{ duration: 0.08 + Math.random() * 0.1, delay: i * 0.025 }}
        style={{
          position: "absolute",
          left: 0, right: 0,
          height: `${3 + Math.random() * 6}%`,
          background: `rgba(0,0,0,${0.5 + Math.random() * 0.4})`,
          mixBlendMode: "multiply",
        }}
      />
    ))}

    {/* RGB shift blocks */}
    {[0, 1, 2].map((i) => (
      <motion.div
        key={`rgb-${i}`}
        animate={{
          x: [0, -4 + i * 4, 6 - i * 3, 0],
          opacity: [0, 0.6, 0.3, 0],
          top: [`${10 + i * 25}%`],
        }}
        transition={{ duration: 0.3, delay: i * 0.08 }}
        style={{
          position: "absolute",
          left: 0, right: 0,
          height: "12%",
          background: i === 0
            ? "rgba(255,0,0,0.15)"
            : i === 1
            ? "rgba(0,255,0,0.1)"
            : "rgba(0,100,255,0.15)",
          mixBlendMode: "screen",
        }}
      />
    ))}
  </motion.div>
);

/* ─── Project card ─── */

const ProjectCard = ({ project, index }: { project: typeof projects[0]; index: number }) => {
  const { glitching, trigger } = useGlitch();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => { setHovered(true); trigger(); }}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col overflow-hidden cursor-pointer group"
      style={{ border: "1px solid rgba(0,0,0,0.08)" }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", background: "#fafafa" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-sm font-medium tracking-tight text-black"
            style={{ fontFamily: "'SF Mono', monospace" }}
          >
            {project.title}
          </span>
          <div className="flex gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 text-black/40"
                style={{
                  fontFamily: "'SF Mono', monospace",
                  letterSpacing: "0.08em",
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Animated arrow */}
        <div className="relative w-8 h-8 overflow-hidden flex items-center justify-center">
          <motion.div
            animate={hovered ? { y: "-100%" } : { y: "0%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute"
          >
            <ArrowUpRight size={16} strokeWidth={2} className="text-black/40" />
          </motion.div>
          <motion.div
            initial={{ y: "100%" }}
            animate={hovered ? { y: "0%" } : { y: "100%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute"
          >
            <ArrowUpRight size={16} strokeWidth={2} className="text-black" />
          </motion.div>
        </div>
      </div>

      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <motion.img
          src={project.img}
          alt={project.title}
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full object-cover"
          style={{ filter: "grayscale(20%)" }}
          loading="lazy"
        />

        {/* Glitch overlay */}
        <AnimatePresence>
          {glitching && <GlitchOverlay key="glitch" />}
        </AnimatePresence>

        {/* Hover tint */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.12), transparent)" }}
        />
      </div>
    </motion.div>
  );
};

/* ─── Component ─── */

const ProjectsSection = () => {
  return (
    <section id="work" className="py-24 md:py-32 section-container p-10">
      <div className="mx-auto max-w-[1080px]">

        {/* Heading */}
        <AnimatedHeading
          lines={["Projects","we're proud of."]}
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

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex justify-center"
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 text-sm font-medium text-black/40 hover:text-black transition-colors group"
          >
            <span
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              View all projects
            </span>
            <div className="relative w-4 h-4 overflow-hidden">
              <motion.div
                className="absolute"
                initial={{ y: 0 }}
                whileHover={{ y: "-100%" }}
                transition={{ duration: 0.25 }}
              >
                <ArrowUpRight size={14} />
              </motion.div>
              <motion.div
                className="absolute"
                initial={{ y: "100%" }}
                whileHover={{ y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <ArrowUpRight size={14} />
              </motion.div>
            </div>
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
};

export default ProjectsSection;