import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedHeading from "@/components/AnimatedHeading";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

const ProjectCard = ({ project, index }) => {
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
            src={project.hoverImg || project.hover_img}
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

/* ─── Main Component ─── */

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="py-24 md:mb-10 section-container p-4 md:p-10">
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
      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>

      {/* View all */}
      <div className="mt-12 flex justify-center">
        <motion.div initial="rest" whileHover="hover" animate="rest">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-md text-black/80 hover:text-black"
            style={{ textDecoration: "none" }}
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
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;