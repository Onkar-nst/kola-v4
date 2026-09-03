import { useAnimationFrame } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const clientAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
];

const SPEED = 100;

/* Shipped with the site so the marquee never depends on a network round-trip.
   Supabase rows, when present, take over — see the fetch below. */
const FALLBACK_LOGOS = [
  { type: "image", image_url: "/logos/veena-developers.svg", alt: "Veena Developers" },
  { type: "image", image_url: "/logos/vayu-valves.svg", alt: "Vayu Valves" },
  { type: "image", image_url: "/logos/tazaari.svg", alt: "Tazaari" },
  { type: "image", image_url: "/logos/roy-infra.svg", alt: "Roy Infra" },
  { type: "image", image_url: "/logos/purva-desai.svg", alt: "Purva Desai Company" },
  { type: "image", image_url: "/logos/premier-league-news-now.svg", alt: "Premier League News Now" },
];

const ClientLogos = () => {
  const x = useRef(0);
  const containerRef = useRef(null);
  const halfWidthRef = useRef(0);
  const [logos, setLogos] = useState(FALLBACK_LOGOS);

  // FETCH FROM SUPABASE
  useEffect(() => {
    const fetchLogos = async () => {
      const { data, error } = await supabase
        .from("client_logos")
        .select("*")
        .order("label", { ascending: false });

      if (error) {
        console.error("ClientLogos fetch error:", error.message, error);
      } else if (data?.length) {
        setLogos(data);
      }
    };
    fetchLogos();
  }, []);


  useEffect(() => {
    if (!containerRef.current || logos.length === 0) return;

    const raf = requestAnimationFrame(() => {
      if (containerRef.current) {
        halfWidthRef.current = containerRef.current.scrollWidth / 2;
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [logos]);


  useAnimationFrame((_, delta) => {
    if (halfWidthRef.current === 0) return;

    x.current -= (SPEED * delta) / 1000;

    if (x.current <= -halfWidthRef.current) {
      x.current += halfWidthRef.current;
    }

    if (containerRef.current) {
      containerRef.current.style.transform = `translateX(${x.current}px)`;
    }
  });

  return (
    <section className="py-10 border-t border-b border-border overflow-hidden">
      <div className="section-container p-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">

          {/* LEFT — the proof, ahead of the logos it belongs to */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex -space-x-2">
              {clientAvatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Happy client ${i + 1}`}
                  loading="lazy"
                  className="w-8 h-8 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>

            <div className="flex flex-col">
              <div className="flex gap-0.5 text-foreground">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                99+ Happy clients
              </span>
            </div>
          </div>

          {/* RIGHT — marquee */}
          <div className="relative flex-1 overflow-hidden w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />

            <div
              ref={containerRef}
              className="flex items-center gap-12 whitespace-nowrap"
              style={{ willChange: "transform" }}
            >
              {[...logos, ...logos].map((logo, i) => (
                <div key={i} className="shrink-0 flex items-center">
                  {logo.type === "text" ? (
                    <span className="text-lg md:text-xl font-semibold text-muted-foreground/60">
                      {logo.label}
                    </span>
                  ) : (
                    <img
                      src={logo.image_url}
                      alt={logo.alt}
                      className="h-16 md:h-20 w-auto object-contain opacity-70 grayscale"
                      onError={(e) => {
                        console.warn("Logo failed to load:", logo.image_url);
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ClientLogos;