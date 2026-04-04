import {
  Rocket,
  Diamond,
  Monitor,
  Layout,
  Wand2,
  Box,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import AnimatedHeading from "@/components/AnimatedHeading";

/* 🔥 Tech icons */
import {
  SiFigma,
  SiFramer,
  SiWebflow,
  SiBlender,
  SiTrello,
} from "react-icons/si";
import { RiChatAiLine } from "react-icons/ri";
import { BsStars } from "react-icons/bs"; 
import { TbBrandVue } from "react-icons/tb";

/* ---------------- DATA ---------------- */

const services = [
  { icon: Rocket, label: "Framer Development" },
  { icon: Diamond, label: "Brand Design" },
  { icon: Monitor, label: "Web Apps" },
  { icon: Layout, label: "Landing Pages" },
  { icon: Wand2, label: "Motion Graphics" },
  { icon: Box, label: "3D Design" },
  { icon: MessageSquare, label: "UX / UI Consultation" },
];

const techStack = [
  { icon: SiFigma, name: "Figma" },
  { icon: SiFramer, name: "Framer" },
  { icon: SiWebflow, name: "Webflow" },
  { icon: TbBrandVue, name: "Rive" },
  { icon: SiBlender, name: "Blender" },
  { icon: SiTrello, name: "Trello" },
  { icon: RiChatAiLine, name: "ChatGPT" },
  { icon: BsStars, name: "Claude" },
];

/* ---------------- ANIMATION ---------------- */

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* ---------------- COMPONENT ---------------- */

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 md:py-32 section-container p-10">
      <div className="mx-auto max-w-[1080px] ">

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 items-center">

          {/* ================= LEFT ================= */}
          <div className="flex flex-col justify-center h-full">

            {/* ✅ Animated Heading */}
            <AnimatedHeading
              lines={["Services that", "supercharge your", "business."]}
              className="
                text-[clamp(2.2rem,5vw,4rem)]
                leading-[1.05]
                tracking-[-0.02em]
                max-w-[640px]
              "
            />

            {/* TECH STACK ICONS */}
            <div className="mt-12 sm:mt-14">
              <p className="text-sm text-muted-foreground mb-5">
                My tech stack
              </p>

              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-wrap gap-3"
              >
                {techStack.map(({ icon: Icon, name }) => (
                  <motion.div
                    key={name}
                    className="
                      w-11 h-11
                      rounded-xl
                      border border-border
                      bg-background
                      flex items-center justify-center
                      shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]
                      hover:scale-105 transition
                    "
                    title={name}
                  >
                    <Icon size={18} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col gap-6 sm:gap-7 lg:pl-6"
          >
            {services.map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                className="flex items-center gap-4 sm:gap-5 group cursor-pointer"
              >
                {/* ICON */}
                <div
                  className="
                    w-11 h-11 sm:w-12 sm:h-12
                    rounded-full
                    flex items-center justify-center
                    text-white bg-black
                    border border-neutral-700
                    shadow-[inset_0_2px_4px_rgba(255,255,255,0.25),
                             0_2px_6px_rgba(0,0,0,0.25),
                             0_10px_25px_rgba(0,0,0,0.15)]
                  "
                >
                  <Icon size={18} strokeWidth={2} />
                </div>

                {/* TEXT */}
                <span className="text-base sm:text-lg md:text-xl font-medium tracking-tight">
                  {label}
                </span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ServicesSection;