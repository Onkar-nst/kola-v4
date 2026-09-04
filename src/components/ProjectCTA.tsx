import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ContactForm from "@/components/ContactForm";

const ProjectCTA: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <>
      <ContactForm open={formOpen} onClose={() => setFormOpen(false)} prefillService="Project Page CTA" />

      <div ref={ref} className="mt-12 mb-2">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[20px] overflow-hidden bg-black px-7 py-8"
        >
          {/* soft glow */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.1, 0.06] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white blur-3xl pointer-events-none"
          />

          {/* eyebrow */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.15 }}
            className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-4 flex items-center gap-2"
          >
            <span className="w-1 h-1 rounded-full bg-white/30 animate-pulse inline-block" />
            Kola Communications
          </motion.p>

          {/* headline */}
          <div className="overflow-hidden mb-1">
            <motion.h3
              initial={{ y: "100%" }}
              animate={inView ? { y: 0 } : {}}
              transition={{ delay: 0.18, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-[1.45rem] font-semibold leading-[1.15] tracking-[-0.02em] text-white"
            >
              Let's build something
            </motion.h3>
          </div>
          <div className="overflow-hidden mb-5">
            <motion.h3
              initial={{ y: "100%" }}
              animate={inView ? { y: 0 } : {}}
              transition={{ delay: 0.24, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-[1.45rem] font-semibold leading-[1.15] tracking-[-0.02em] text-white/35"
            >
              that works for you.
            </motion.h3>
          </div>

          {/* sub */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.32, duration: 0.5 }}
            className="text-[12px] text-white/40 leading-relaxed mb-7 max-w-[260px]"
          >
            Websites, SEO &amp; lead generation — measurable results across 5+ countries.
          </motion.p>

          {/* button */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.45 }}
          >
            <motion.button
              onClick={() => setFormOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="
                group relative overflow-hidden
                inline-flex items-center gap-1.5
                px-5 py-2.5 rounded-full
                bg-white text-black text-[13px] font-semibold
                shadow-[0_2px_16px_rgba(255,255,255,0.12)]
              "
            >
              <span className="relative z-10">Start a Project</span>
              <motion.span
                className="relative z-10"
                whileHover={{ x: 2, y: -2 }}
                transition={{ duration: 0.18 }}
              >
                <ArrowUpRight size={14} />
              </motion.span>
              {/* shimmer */}
              <motion.span
                initial={{ x: "-100%", opacity: 0 }}
                whileHover={{ x: "220%", opacity: 0.15 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0 bg-black skew-x-12 pointer-events-none"
              />
            </motion.button>
          </motion.div>

          {/* bottom stat strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.52, duration: 0.5 }}
            className="flex items-center gap-5 mt-8 pt-6 border-t border-white/8"
          >
            {[["199+", "Global Founders & Clients"], ["3×", "avg. traffic growth"], ["5+", "countries"]].map(([val, label], i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 6 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.52 + i * 0.07 }}
                className="flex flex-col"
              >
                <span className="text-[14px] font-semibold text-white leading-none">{val}</span>
                <span className="text-[10px] text-white/30 mt-0.5">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default ProjectCTA;