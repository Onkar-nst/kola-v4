import { motion, cubicBezier } from "framer-motion";
import { useRef, useEffect, useState } from "react";
// import avatarImg from "@/assets/avatar.jpg";
import AnimatedHeading from "@/components/AnimatedHeading";

/* ---------------- DATA ---------------- */
const testimonials = [
  {
    quote:
      "Kola Communications completely transformed our online presence. From building our e-commerce platform to running our SEO campaigns, every step was handled with professionalism and precision. Within three months of launch, our organic traffic doubled and conversions followed.",
    name: "Vinit Jain",
    title: "Founder, Tazaari Shop",
  },
  {
    quote:
      "We approached Kola Communications for our website and ended up getting so much more. We got a full digital strategy that actually works. The team understood our audience, our brand, and our goals from day one. Our lead generation has improved significantly and the quality of enquiries we receive now is on a completely different level.",
    name: "Dhaval Sanghavi",
    title: "Director, Veena Developers",
  },
  {
    quote:
      "Working with an agency halfway across the world felt like a risk, but Kola Communications made it seamless. Their communication was excellent, deadlines were always met, and the results spoke for themselves. Our Google rankings improved within weeks and the leads started coming in consistently. Highly recommend them to any business serious about growing online.",
    name: "James Whitfield",
    title: "CEO, BrightPath (UK)",
  },
];

/* ---------------- ANIMATION ---------------- */
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.92,
    filter: "blur(10px)",
  },
  show: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.08,
      duration: 0.7,
      ease: cubicBezier(0.16, 1, 0.3, 1),
    },
  }),
};

/* ---------------- CARD ---------------- */
const Card = ({ t, i, eager = false }) => (
  <motion.div
    custom={i}
    variants={cardVariants}
    initial="hidden"
    whileInView={eager ? undefined : "show"}
    animate={eager ? "show" : undefined}
    viewport={{ once: true, margin: "-80px" }}
    whileHover={{ y: -6, scale: 1.02 }}
    whileTap={{ scale: 0.96 }}
    className="
      h-full flex flex-col justify-between
      rounded-[20px]
      border border-[#e6e6e6]
      bg-[#f9f9f9]
      p-5
      shadow-[0_1px_1px_rgba(0,0,0,0.04),
              0_10px_30px_rgba(0,0,0,0.06)]
    "
  >
    <div className="text-xl">"</div>
    <p className="text-[15px] leading-[1.6] text-[#111] mt-2 mb-4">{t.quote}</p>
    <div className="flex items-center gap-3 mt-auto">
      <div>
        <p className="text-[14px] font-semibold">{t.name}</p>
        <p className="text-[12px] text-[#777]">{t.title}</p>
      </div>
    </div>
  </motion.div>
);

/* ---------------- COMPONENT ---------------- */
const TestimonialsSection = () => {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const [dragLeft, setDragLeft] = useState(-600); // fallback

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
  }, []);

  return (
    <section className="py-24 md:-my-10 section-container">
      <div className="max-w-[1100px] p-2 md:p-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <AnimatedHeading
                      lines={["Feedback that", "fuels us"]}
                      className="
                        text-[clamp(3rem,3.5vw,3.5rem)]
                        leading-[1.05]
                        tracking-[-0.025em]
                        max-w-[760px]
                      "
                    />
          {/* <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <img key={i} src={avatarImg} className="w-8 h-8 rounded-full border-2 border-white" />
              ))}
            </div>
            <div>
              <div className="text-sm">★★★★★</div>
              <div className="text-xs text-[#777]">99+ Happy clients</div>
            </div>
          </div> */}
        </div>

        {/* ================= DESKTOP ================= */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {testimonials.map((t, i) => (
            <div key={i} className="h-full">
              <Card t={t} i={i} />
            </div>
          ))}
        </div>

        {/* ================= MOBILE (PEEK CAROUSEL) ================= */}
        <div ref={containerRef} className="md:hidden" style={{ overflow: "hidden", marginLeft: "-1rem", marginRight: "-1rem" }}>
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: dragLeft, right: 0 }}
            dragElastic={0.08}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
            style={{ display: "flex", gap: "12px", paddingLeft: "1rem", width: "max-content", cursor: "grab" }}
          >
            {testimonials.map((t, i) => (
              <div key={i} style={{ width: "74vw", flexShrink: 0 }}>
                <Card t={t} i={i} eager />
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;