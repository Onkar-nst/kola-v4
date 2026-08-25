import { useState, useEffect, useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import ContactForm from "@/components/ContactForm";
import AnimatedHeading from "@/components/AnimatedHeading";

/* ─── Client Avatars for Social Proof ─── */
const clientAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
];

/* ─── Featured Showcase Projects for Reel ─── */
const showcaseProjects = [
  {
    title: "Tazaari Platform",
    category: "E-Commerce & Scale",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    slug: "tazaari-shop",
  },
  {
    title: "Veena Developers",
    category: "Real Estate & Lead Gen",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
    slug: "veena-developers",
  },
  {
    title: "Zenith Labs",
    category: "HealthTech & Brand",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    slug: "zenith-labs",
  },
  {
    title: "Horizon Media",
    category: "Digital Performance",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80",
    slug: "horizon-media",
  },
  {
    title: "BrightPath UK",
    category: "Web & Global SEO",
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    slug: "brightpath-uk",
  },
  {
    title: "Nexus Architecture",
    category: "Design System & Web",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    slug: "nexus-architecture",
  },
];

/* ─── Infinite Marquee Showcase Reel ─── */
const ShowcaseReel = () => {
  const x = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const halfWidthRef = useRef(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const raf = requestAnimationFrame(() => {
      if (containerRef.current) {
        halfWidthRef.current = containerRef.current.scrollWidth / 2;
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useAnimationFrame((_, delta) => {
    if (halfWidthRef.current === 0 || isHovered) return;

    // Smooth continuous auto-scroll speed
    const speed = 40; // px per second
    x.current -= (speed * delta) / 1000;

    if (x.current <= -halfWidthRef.current) {
      x.current += halfWidthRef.current;
    }

    if (containerRef.current) {
      containerRef.current.style.transform = `translateX(${x.current}px)`;
    }
  });

  const doubledProjects = [...showcaseProjects, ...showcaseProjects];

  return (
    <div
      className="relative w-full overflow-hidden pt-4 pb-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Side gradient overlays for seamless fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-background via-background/60 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-background via-background/60 to-transparent z-10" />

      <div
        ref={containerRef}
        className="flex items-center gap-3.5 sm:gap-5 md:gap-6 whitespace-nowrap will-change-transform"
      >
        {doubledProjects.map((item, i) => (
          <Link
            key={i}
            to={`/projects`}
            className="
              group relative block shrink-0
              w-[190px] sm:w-[240px] md:w-[290px] lg:w-[320px]
              aspect-[16/11]
              rounded-xl sm:rounded-2xl md:rounded-3xl
              overflow-hidden
              border border-border/80 bg-card
              shadow-[0_4px_20px_rgba(0,0,0,0.03)]
              hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)]
              hover:border-foreground/30
              transition-all duration-400
            "
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
            />

            {/* Dark subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Text details */}
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 md:p-5 flex items-end justify-between">
              <div>
                <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-white/75 uppercase mb-0.5 block">
                  {item.category}
                </span>
                <h4 className="text-xs sm:text-sm md:text-base font-bold text-white leading-tight">
                  {item.title}
                </h4>
              </div>

              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors shrink-0">
                <ArrowUpRight size={12} className="sm:w-3.5 sm:h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

/* ─── Main Hero Section ─── */
const HeroSection = () => {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <section className="pt-28 pb-6 sm:pt-32 sm:pb-8 md:pt-36 md:pb-12 relative overflow-hidden">
      <ContactForm open={contactOpen} onClose={() => setContactOpen(false)} />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 md:px-10 text-center">
        {/* 1. TOP SOCIAL PROOF PILL */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 sm:gap-2.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-border/80 bg-muted/60 backdrop-blur-md text-[11px] sm:text-xs font-medium mb-5 sm:mb-6 shadow-sm"
        >
          {/* Overlapping avatars */}
          <div className="flex -space-x-1.5 sm:-space-x-2">
            {clientAvatars.slice(0, 4).map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Client avatar"
                className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full border border-background object-cover"
              />
            ))}
          </div>

          <span className="text-muted-foreground font-semibold">
            99+ Happy Global Clients
          </span>
        </motion.div>

        {/* 2. MASSIVE CENTERED EDITORIAL HEADLINE */}
        <div className="max-w-[900px] mx-auto mb-4 sm:mb-5">
          <AnimatedHeading
            lines={["Pure Performance.", "Potent Storytelling."]}
            className="
              hidden md:block
              text-[clamp(2.8rem,5.5vw,4.8rem)]
              leading-[1.01]
              tracking-[-0.035em]
              font-bold
              text-center
            "
          />
          <AnimatedHeading
            lines={["Pure Performance.", "Potent Storytelling."]}
            className="
              md:hidden
              text-[clamp(2.1rem,7.5vw,3.2rem)]
              leading-[1.04]
              tracking-[-0.03em]
              font-bold
              text-center
            "
          />
        </div>

        {/* 3. REFINED SUB-HEADLINE */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed mb-6 sm:mb-8 font-normal px-2"
        >
          From high-performance website development to SEO, lead generation and
          beyond — we craft data-driven digital strategies for brands ready to
          scale bold.
        </motion.p>

        {/* 4. DUAL ACTION BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-10"
        >
          {/* Primary CTA with arrow circle */}
          <button
            onClick={() => setContactOpen(true)}
            className="
              group flex items-center gap-2.5
              bg-black text-white dark:bg-white dark:text-black
              pl-5 pr-1.5 py-1.5 sm:pl-6 sm:pr-2 sm:py-2 rounded-full
              text-xs sm:text-sm font-medium
              shadow-[0_4px_20px_rgba(0,0,0,0.1)]
              hover:opacity-90 transition-opacity
            "
          >
            <span>Book a Call</span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center text-white dark:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
              <ArrowUpRight size={13} className="sm:w-3.5 sm:h-3.5" />
            </div>
          </button>

          {/* Secondary Link */}
          <HashLink
            to="/#pricing"
            smooth
            className="text-xs sm:text-sm font-medium text-foreground hover:text-muted-foreground transition underline underline-offset-4"
          >
            See Pricing
          </HashLink>
        </motion.div>
      </div>

      {/* 5. BOTTOM SHOWCASE REEL */}
      <ShowcaseReel />
    </section>
  );
};

export default HeroSection;
