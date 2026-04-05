import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { projects } from "@/data/projects";

import ColumnGuides from "@/components/ColumnGuides";
import CustomCursor from "@/components/CustomCursor";
import CTAFooter from "@/components/CTAFooter";
import SectionDivider from "@/components/SectionDivider";
import AnimatedHeading from "@/components/AnimatedHeading";

const ProjectPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const project = projects.find((p) => p.slug === slug);
  if (!project) return <div>Not found</div>;

  return (
    <div className="min-h-screen bg-white">

      <CustomCursor />

      <div className="relative overflow-hidden">
        <ColumnGuides />

        {/* ================= HERO ================= */}
        <section className="section-container py-16 md:py-24 relative z-10">
          <div className="max-w-[1100px] mx-auto px-4 md:px-10">

            {/* 🔥 BACK BUTTON (ANIMATED) */}
            <motion.button
              onClick={() => navigate(-1)}
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="mb-10 flex items-center gap-2 text-sm text-black/40 hover:text-black"
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

            {/* IMAGE GRID */}
            <div className="grid md:grid-cols-2 gap-6 mb-16">

              <motion.img
                src={project.img}
                className="w-full h-[420px] object-cover rounded-[24px]"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              />

              <motion.img
                src={project.hoverImg || project.img}
                className="w-full h-[420px] object-cover rounded-[24px]"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              />

            </div>

          </div>
        </section>

        <SectionDivider />

        {/* ================= CONTENT ================= */}
        <section className="section-container mt-20 pb-24 relative z-10">
          <div className="max-w-[1100px] mx-auto px-4 md:px-10">

            {/* 🔥 ANIMATED TITLE */}
            <AnimatedHeading
              lines={["",project.title]}
              className="
                text-[clamp(2.5rem,5vw,4rem)]
                leading-[1.05]
                tracking-[-0.03em]
                font-semibold
                mb-6
              "
            />

            {/* META */}
            <div className="flex gap-6 text-sm text-black/40 mb-8">
              <span>Client {project.title}</span>
              <span>Year 2025</span>
            </div>

            {/* TEXT */}
            <div className="max-w-[700px] space-y-6 text-[15px] text-black/70 leading-[1.8] mb-12">
              <p>{project.requirement}</p>
              <p>{project.approach}</p>
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2 mb-10">
              {project.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs border border-black/10 rounded-full text-black/50"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 🔥 PREMIUM CTA BUTTON */}
            <motion.a
              href={project.liveUrl}
              target="_blank"
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="inline-flex items-center gap-2 text-lg font-medium"
            >
              View Live Site

              <span className="relative w-5 h-5 overflow-hidden">
                <motion.span
                  variants={{
                    rest: { x: 0, y: 0, opacity: 1 },
                    hover: { x: 16, y: -16, opacity: 0 },
                  }}
                  className="absolute"
                >
                  <ArrowUpRight size={18} />
                </motion.span>

                <motion.span
                  variants={{
                    rest: { x: -16, y: 16, opacity: 0 },
                    hover: { x: 0, y: 0, opacity: 1 },
                  }}
                  className="absolute"
                >
                  <ArrowUpRight size={18} />
                </motion.span>
              </span>
            </motion.a>

          </div>
        </section>

      </div>

      <CTAFooter />

    </div>
  );
};

export default ProjectPage;