import { memo, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedHeading from "@/components/AnimatedHeading";

/* ─── Data ─── */

const TECHS = [
  { name: "Figma",      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/figma.svg",        color: "#F24E1E" },
  { name: "Adobe XD",   icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/adobexd.svg",      color: "#FF61F6" },
  { name: "Rive",       icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/rive.svg",         color: "#333333" },
  { name: "Framer",     icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/framer.svg",       color: "#0099FF" },
  { name: "Python",     icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/python.svg",       color: "#3776AB" },
  { name: "Slack",      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/slack.svg",        color: "#4A154B" },
  { name: "React",      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/react.svg",        color: "#61DAFB" },
  { name: "Angular",    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/angular.svg",      color: "#DD0031" },
  { name: "Notion",     icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/notion.svg",       color: "#000000" },
  { name: "GitHub",     icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg",       color: "#24292E" },
  { name: "Tailwind",   icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tailwindcss.svg",  color: "#06B6D4" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/typescript.svg",   color: "#3178C6" },
];

const PARTICLES = Array.from({ length: 8 }, (_, i) => i);

/* ─── Animation variants ─── */

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Mobile strip (infinite scroll) ─── */

const MobileStrip = memo(({ techs, direction = 1 }: { techs: typeof TECHS; direction?: number }) => {
  const doubled = [...techs, ...techs, ...techs];
  const duration = techs.length * 3.5;

  return (
    <div
      style={{
        overflow: "hidden",
        width: "100%",
        maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <motion.div
        animate={{ x: direction > 0 ? ["0%", "-33.33%"] : ["-33.33%", "0%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: 10, width: "max-content" }}
      >
        {doubled.map((tech, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: 130,
              height: 130,
              background: "#f5f5f5",
              border: "1px solid rgba(0,0,0,0.07)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 14px 12px",
            }}
          >
            <span
              style={{
                alignSelf: "flex-start",
                fontFamily: "'SF Mono', monospace",
                fontSize: "8.5px",
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.28)",
                fontWeight: 500,
              }}
            >
              {tech.name}
            </span>
            <img
              src={tech.icon}
              alt={tech.name}
              style={{
                width: 48,
                height: 48,
                objectFit: "contain",
                filter: `drop-shadow(0 2px 6px ${tech.color}44)`,
              }}
            />
            <div
              style={{
                alignSelf: "stretch",
                height: 1,
                background: `linear-gradient(90deg, transparent, ${tech.color}55, transparent)`,
              }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
});

/* ─── Desktop card ─── */

const TechCard = memo(({ tech }: { tech: typeof TECHS[0] }) => {
  const [hovered, setHovered] = useState(false);
  const [burst, setBurst] = useState(false);

  const handleEnter = () => {
    setHovered(true);
    setBurst(false);
    setTimeout(() => setBurst(true), 10);
  };

  return (
    <motion.div
      variants={item}
      onMouseEnter={handleEnter}
      onMouseLeave={() => { setHovered(false); setBurst(false); }}
      className="relative flex flex-col items-center justify-between cursor-pointer select-none overflow-hidden"
      style={{
        aspectRatio: "1 / 1",
        padding: "clamp(14px, 2.5vw, 24px)",
        background: hovered
          ? `radial-gradient(circle at 50% 45%, ${tech.color}10 0%, #fafafa 75%)`
          : "#fafafa",
        transition: "background 0.45s ease",
      }}
    >
      {/* Label */}
      <span
        className="self-start"
        style={{
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: "9px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: hovered ? tech.color : "rgba(0,0,0,0.28)",
          transition: "color 0.3s ease",
          fontWeight: 500,
        }}
      >
        {tech.name}
      </span>

      {/* Icon */}
      <div className="relative flex items-center justify-center" style={{ width: "52%", height: "52%" }}>
        <motion.div
          animate={{ opacity: hovered ? 0.22 : 0, scale: hovered ? 1.4 : 0.8 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${tech.color} 0%, transparent 70%)`,
            filter: "blur(14px)",
          }}
        />

        <AnimatePresence mode="wait">
          <motion.img
            key={hovered ? "h" : "i"}
            src={tech.icon}
            alt={tech.name}
            initial={{ opacity: 0, scale: 0.55, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.35, filter: "blur(12px)" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: `drop-shadow(0 2px ${hovered ? "12px" : "4px"} ${tech.color}${hovered ? "77" : "22"})`,
              transition: "filter 0.4s ease",
            }}
          />
        </AnimatePresence>

        {/* Particle burst */}
        {burst && PARTICLES.map((i) => {
          const angle = (i / PARTICLES.length) * 360;
          const dist = 26 + Math.random() * 16;
          const rad = (angle * Math.PI) / 180;
          return (
            <motion.span
              key={i}
              initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
              animate={{ x: Math.cos(rad) * dist, y: Math.sin(rad) * dist, opacity: 0, scale: 0 }}
              transition={{ duration: 0.48, ease: "easeOut" }}
              style={{
                position: "absolute",
                width: 3.5,
                height: 3.5,
                borderRadius: "50%",
                background: tech.color,
                pointerEvents: "none",
              }}
            />
          );
        })}
      </div>

      {/* Bottom shimmer */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          alignSelf: "stretch",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${tech.color}88, transparent)`,
          transformOrigin: "center",
        }}
      />
    </motion.div>
  );
});

/* ─── Component ─── */

const TechStack = () => {
  return (
    <section id="techstack" className="py-24 section-container">
      <div className=" p-4 md:p-10 max-w-[1080px]">

        {/* Heading */}
        <AnimatedHeading
          lines={["Tools we","use to build."]}
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

        {/* ═══ Desktop grid ═══ */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="
            hidden md:grid
            grid-cols-6
          "
          style={{
            borderTop: "1px solid rgba(0,0,0,0.07)",
            borderLeft: "1px solid rgba(0,0,0,0.07)",
          }}
        >
          {TECHS.map((tech) => (
            <div
              key={tech.name}
              style={{
                borderRight: "1px solid rgba(0,0,0,0.07)",
                borderBottom: "1px solid rgba(0,0,0,0.07)",
              }}
            >
              <TechCard tech={tech} />
            </div>
          ))}
        </motion.div>

        {/* ═══ Mobile strips ═══ */}
        <div className="md:hidden flex flex-col gap-3">
          <MobileStrip techs={TECHS} direction={1} />
          <MobileStrip techs={[...TECHS].reverse()} direction={-1} />
        </div>

      </div>
    </section>
  );
};

export default TechStack;