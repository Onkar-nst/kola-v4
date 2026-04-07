import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";

import ColumnGuides from "@/components/ColumnGuides";
import ProjectCTA from "@/components/ProjectCTA";
import CustomCursor from "@/components/CustomCursor";
import CTAFooter from "@/components/CTAFooter";
import SectionDivider from "@/components/SectionDivider";
import AnimatedHeading from "@/components/AnimatedHeading";

/* ── helpers ── */
const FadeUp = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
};

const LineReveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
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

/* ── reusable drag carousel ── */
const DragCarousel = ({ children, className = "" }) => {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const [dragLeft, setDragLeft] = useState(-800);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current || !containerRef.current) return;
      const trackW = trackRef.current.scrollWidth;
      const containerW = containerRef.current.offsetWidth;
      setDragLeft(-(trackW - containerW));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [children]);

  return (
    <div ref={containerRef} className={className}
      style={{ overflow: "hidden", marginLeft: "-1rem", marginRight: "-1rem" }}>
      <motion.div
        ref={trackRef}
        drag="x"
        dragConstraints={{ left: dragLeft, right: 0 }}
        dragElastic={0.08}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
        style={{ display: "flex", gap: "12px", paddingLeft: "1rem", width: "max-content", cursor: "grab" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ── live site CTA block ── */
const LiveSiteCTA = ({ href }) => (
  <FadeUp delay={0.15}>
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="group inline-flex items-center gap-3"
    >
      <span className="relative overflow-hidden px-6 py-3 rounded-full bg-black text-white text-sm font-medium flex items-center gap-2">
        <span className="relative z-10">View Live Site</span>
        <motion.span
          variants={{ rest: { x: 0, y: 0 }, hover: { x: 3, y: -3 } }}
          transition={{ duration: 0.2 }}
          className="relative z-10"
        >
          <ExternalLink size={14} />
        </motion.span>
        <motion.span
          variants={{ rest: { x: "-100%", opacity: 0 }, hover: { x: "200%", opacity: 0.15 } }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-white skew-x-12 pointer-events-none"
        />
      </span>
    </motion.a>
  </FadeUp>
);

/* ── main ── */
const ProjectPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [otherProjects, setOtherProjects] = useState([]);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  // images: project.img + project.hover_img + any extra in project.images[]
  const allImages = project
    ? [
        project.img,
        project.hoverImg || project.hover_img,
        ...(project.images || []),
      ].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i) // dedupe
    : [];

  useEffect(() => {
    const fetch_ = async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).single();
      if (error) console.error(error);
      else setProject(data);
    };
    if (slug) fetch_();
  }, [slug]);

  useEffect(() => {
    const fetchOthers = async () => {
      const { data, error } = await supabase.from("projects")
        .select("slug, title, img, tags").neq("slug", slug).limit(3);
      if (!error && data) setOtherProjects(data);
    };
    if (slug) fetchOthers();
  }, [slug]);

  if (!project) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        className="text-sm text-black/30 tracking-widest uppercase">Loading</motion.div>
    </div>
  );

  const liveUrl = project.liveUrl || project.live_url;

  return (
    <div className="min-h-screen bg-white">
      <CustomCursor />
      <div className="relative overflow-hidden">
        <ColumnGuides />

        {/* ═══════════ HERO ═══════════ */}
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

            {/* ── IMAGES ──
                Desktop: 2-col grid (unchanged)
                Mobile: drag carousel, same pattern as other carousels
            */}

            {/* DESKTOP grid */}
            <div className="hidden md:grid md:grid-cols-2 gap-4 mb-8">
              {allImages.slice(0, 2).map((src, i) => (
                <motion.div key={i} className="overflow-hidden rounded-[24px]"
                  initial={{ opacity: 0, y: i === 0 ? 40 : 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}>
                  <motion.img src={src} style={{ y: imgY, scale: imgScale }}
                    className="w-full h-[440px] object-cover" />
                </motion.div>
              ))}
            </div>

            {/* MOBILE drag carousel */}
            <div className="md:hidden mb-8">
              <DragCarousel>
                {allImages.map((src, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ width: "78vw", flexShrink: 0 }}
                    className="overflow-hidden rounded-[20px]"
                  >
                    <img src={src} alt={`${project.title} ${i + 1}`}
                      className="w-full h-[260px] object-cover" />
                  </motion.div>
                ))}
              </DragCarousel>
            </div>

            {/* TITLE */}
            <div className="mb-2">
              <AnimatedHeading lines={[project.title]} className="md:hidden text-[clamp(2rem,8vw,3rem)] leading-[1.05] tracking-[-0.03em] font-semibold" />
              <AnimatedHeading lines={[project.title]} className="hidden md:block text-[clamp(2.5rem,4.5vw,3.5rem)] leading-[1.05] tracking-[-0.03em] font-semibold" />
            </div>

            <FadeUp delay={0.3}>
              <div className="flex flex-wrap gap-2 pb-10 pt-3">
                {project.tags?.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs border border-black/20 rounded-full text-black/45 bg-black/[0.02]">{tag}</span>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        <SectionDivider />

        {/* ═══════════ CONTENT ═══════════ */}
        <section className="section-container pt-12 pb-24 relative z-10">
          <div className="max-w-[1100px] mx-auto px-4 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-8 lg:gap-10">

              {/* LEFT */}
              <div>
                <FadeUp delay={0.05}>
                  <div className="mb-10">
                    <LineReveal className="mb-4">
                      <p className="text-xl uppercase tracking-[0.18em] text-black font-medium">Project Requirements</p>
                    </LineReveal>
                    <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} style={{ originX: 0 }}
                      className="h-px bg-black/8 mb-5" />
                    <p className="text-[15px] text-black/60 leading-[1.85]">{project.requirement}</p>
                  </div>
                </FadeUp>

                <FadeUp delay={0.1}>
                  <div className="mb-12">
                    <LineReveal className="mb-4">
                      <p className="text-xl uppercase tracking-[0.18em] text-black font-medium">Our Approach</p>
                    </LineReveal>
                    <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} style={{ originX: 0 }}
                      className="h-px bg-black/8 mb-5" />
                    <p className="text-[15px] text-black/60 leading-[1.85]">{project.approach}</p>
                  </div>
                </FadeUp>

                {/* CTA — desktop shows here in left col */}
                <div className="hidden md:block">
                  <LiveSiteCTA href={liveUrl} />
                  <ProjectCTA />
                </div>

                {/* MOBILE: other projects carousel */}
                {otherProjects.length > 0 && (
                  <div className="md:hidden mt-16">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-black/30 font-medium mb-5">Other Projects</p>
                    <DragCarousel>
                      {otherProjects.map((p, i) => (
                        <motion.div
                          key={p.slug}
                          initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(6px)" }}
                          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                          transition={{ delay: i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                          onClick={() => navigate(`/projects/${p.slug}`)}
                          style={{ width: "62vw", flexShrink: 0 }}
                          className="cursor-pointer group"
                        >
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

                {/* CTA — mobile shows at very bottom */}
                <div className="md:hidden mt-12">
                  <LiveSiteCTA href={liveUrl} />
                  <ProjectCTA />
                </div>
              </div>

              {/* RIGHT: sticky sidebar desktop */}
              {otherProjects.length > 0 && (
                <div className="hidden md:block">
                  <div className="sticky top-28">
                    <LineReveal className="mb-5">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-black/30 font-medium">Other Projects</p>
                    </LineReveal>
                    <div className="flex flex-col gap-3">
                      {otherProjects.map((p, i) => (
                        <motion.div key={p.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                          onClick={() => navigate(`/projects/${p.slug}`)} className="group cursor-pointer">
                          <div className="relative overflow-hidden rounded-xl mb-2.5 h-[130px]">
                            <img src={p.img} alt={p.title}
                              className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.06]" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300" />
                            <motion.div initial={{ opacity: 0, scale: 0.7 }} whileHover={{ opacity: 1, scale: 1 }}
                              className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                              <ArrowUpRight size={11} />
                            </motion.div>
                          </div>
                          <p className="text-[13px] font-medium text-black group-hover:text-black/45 transition-colors duration-200 leading-snug">{p.title}</p>
                          {p.tags?.length > 0 && (
                            <p className="text-[11px] text-black/28 mt-0.5">{p.tags.slice(0, 2).join(" · ")}</p>
                          )}
                          {i < otherProjects.length - 1 && (
                            <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                              transition={{ duration: 0.4, delay: i * 0.06 }} style={{ originX: 0 }}
                              className="h-px bg-black/6 mt-3" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                    <motion.button onClick={() => navigate("/#work")} whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="mt-6 text-[11px] text-black/28 hover:text-black/60 transition-colors flex items-center gap-1">
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