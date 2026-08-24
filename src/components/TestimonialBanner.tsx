import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

/* ══════════════════════════════════════════
   TESTIMONIALS DATA
══════════════════════════════════════════ */

const testimonials = [
  {
    quote:
      "Working with Kola Communications has been a game-changer for our business. Their innovative approach to content and design helped us connect more deeply with our audience.",
    name: "Dhairya Shah",
    role: "Content & Design",
  },
  {
    quote:
      "From initial brand strategy to digital execution, Kola delivered beyond expectations. Our organic visibility and qualified leads skyrocketed within months.",
    name: "Aakash Mehta",
    role: "Head of Growth, Zenith Labs",
  },
  {
    quote:
      "The strategic clarity and design finesse Kola brings to the table are unmatched. They transformed our digital presence into our most powerful sales asset.",
    name: "Priya Nair",
    role: "Marketing Director, Horizon Media",
  },
];

const AUTO_SLIDE_INTERVAL = 5500;

/* ══════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════ */

const TestimonialBanner = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, AUTO_SLIDE_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  return (
    <section
      className="py-24 border-border border-b border-t"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="section-container px-10">
        <blockquote className="text-center max-w-3xl mx-auto">
          {/* CSS Grid overlay prevents any height collapse or flickering */}
          <div className="grid grid-cols-1 grid-rows-1 items-center justify-items-center relative">
            {testimonials.map((t, idx) => {
              const isActive = idx === current;
              return (
                <motion.div
                  key={idx}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    y: isActive ? 0 : 10,
                    scale: isActive ? 1 : 0.99,
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    gridColumn: "1 / -1",
                    gridRow: "1 / -1",
                    pointerEvents: isActive ? "auto" : "none",
                    visibility: isActive ? "visible" : "hidden",
                  }}
                  className="w-full"
                >
                  <p className="text-xl md:text-2xl lg:text-3xl leading-snug font-medium text-foreground">
                    "{t.quote}"
                  </p>
                  <div className="flex flex-col items-center justify-center mt-8 text-center">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Minimal Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="p-1 cursor-pointer"
              >
                <span
                  className={`block h-1 rounded-full transition-all duration-300 ${
                    i === current ? "w-5 bg-foreground" : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
                  }`}
                />
              </button>
            ))}
          </div>
        </blockquote>
      </div>
    </section>
  );
};

export default TestimonialBanner;
