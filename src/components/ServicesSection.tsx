import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AnimatedHeading from "@/components/AnimatedHeading";
import { Plus } from "lucide-react";

/* ---------------- DATA ---------------- */

import {
  SiWordpress,
  SiShopify,
  SiReact,
  SiTailwindcss,
  SiGithub,
  SiGoogleanalytics,
  SiMeta,
  SiOpenai,
  SiPython,
  SiJavascript,
  SiTypescript,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiSupabase,
  SiFirebase,
  SiVercel,
  SiNetlify,
  SiFigma,
  SiCanva,
} from "react-icons/si";

const techStack = [
  { icon: SiWordpress, name: "WordPress" },
  { icon: SiShopify, name: "Shopify" },
  { icon: SiReact, name: "React" },
  { icon: SiNextdotjs, name: "Next.js" },
  { icon: SiTailwindcss, name: "Tailwind" },

  { icon: SiJavascript, name: "JavaScript" },
  { icon: SiTypescript, name: "TypeScript" },

  { icon: SiNodedotjs, name: "Node.js" },
  { icon: SiExpress, name: "Express" },

  { icon: SiMongodb, name: "MongoDB" },
  { icon: SiPostgresql, name: "PostgreSQL" },
  { icon: SiSupabase, name: "Supabase" },
  { icon: SiFirebase, name: "Firebase" },

  { icon: SiGithub, name: "GitHub" },

  { icon: SiVercel, name: "Vercel" },
  { icon: SiNetlify, name: "Netlify" },

  { icon: SiFigma, name: "Figma" },
  { icon: SiCanva, name: "Canva" },

  { icon: SiGoogleanalytics, name: "Analytics" },
  { icon: SiMeta, name: "Meta Ads" },

  { icon: SiOpenai, name: "ChatGPT" },

  { icon: SiPython, name: "Python" },
];

const services = [
  {
    icon: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png",
    title: "Website Development",
    desc: "Fast, SEO-optimized websites built for performance and scalability.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/2956/2956744.png",
    title: "SEO & AEO",
    desc: "Improve rankings on Google and AI-driven search platforms.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/3135/3135706.png",
    title: "Lead Generation & Conversion",
    desc: "High-converting funnels that turn traffic into qualified leads.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/3281/3281289.png",
    title: "Brand Identity & Design",
    desc: "Strategic branding that builds trust and lasting recognition.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/2920/2920277.png",
    title: "Performance Marketing",
    desc: "Data-driven ad campaigns focused on ROI and conversions.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
    title: "Social Media Marketing",
    desc: "Grow engagement and audience with consistent content strategies.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/4697/4697143.png",
    title: "Content Creation & Strategy",
    desc: "SEO-focused content that drives traffic and builds authority.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/8637/8637099.png",
    title: "AI-Powered Tools & Applications",
    desc: "Custom AI tools, automation, and intelligent workflows.",
  },
];

/* ---------------- COMPONENT ---------------- */

const ServicesSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="services" className="min-h-[90vh] flex items-center py-20">
      <div className="section-container w-full p-4 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          {/* ================= LEFT ================= */}
          <div>
            <AnimatedHeading
              lines={["Services that", "supercharge your", "business."]}
              className="text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] tracking-[-0.02em]"
            />

            {/* TECH STACK */}
            <motion.div
              className="flex flex-wrap gap-3 mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05 }}
            >
              {techStack.map(({ icon: Icon, name }) => (
                <div key={name} className="relative group">
                  {/* ICON */}
                  <div
                    className="
        w-11 h-11
        rounded-xl
        border border-border
        bg-background/60 backdrop-blur-md
        flex items-center justify-center
        shadow-[0_2px_10px_rgba(0,0,0,0.08)]
        transition
        group-hover:scale-105 group-hover:-translate-y-1
      "
                  >
                    <Icon size={18} />
                  </div>

                  {/* 🔥 TOOLTIP */}
                  <div
                    className="
        pointer-events-none
        absolute bottom-full left-1/2 -translate-x-1/2 mb-2
        px-2.5 py-1
        text-[11px] font-medium
        rounded-md
        bg-black text-white
        whitespace-nowrap

        opacity-0 scale-95
        group-hover:opacity-100 group-hover:scale-100

        transition-all duration-150 ease-out
      "
                  >
                    {name}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="flex flex-col gap-6">
            {services.map((service, i) => {
              const isOpen = openIndex === i;

              return (
                <div key={i}>
                  {/* ROW */}
                  <div className="flex items-center justify-between group">
                    {/* LEFT CONTENT */}
                    <div className="flex items-center gap-4">
                      {/* ICON */}
                      <div
                        className="
                          w-11 h-11 rounded-full
                          flex items-center justify-center
                          bg-black text-white grayscale
                          shadow-lg
                        "
                      >
                        <img src={service.icon} className="w-5 h-5 invert" />
                      </div>

                      {/* TEXT */}
                      <span className="text-lg font-medium">
                        {service.title}
                      </span>
                    </div>

                    {/* PLUS BUTTON */}
                    <motion.button
                      onClick={() => toggle(i)}
                      whileTap={{ scale: 0.9 }}
                      className="
                        w-8 h-8 rounded-full
                        border border-border
                        flex items-center justify-center
                        hover:bg-muted transition
                      "
                    >
                      <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <Plus size={16} />
                      </motion.div>
                    </motion.button>
                  </div>

                  {/* EXPAND TEXT */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pl-[60px] pr-4 text-md text-muted-foreground mt-3"
                      >
                        {service.desc}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
