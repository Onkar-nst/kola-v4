import { motion } from "framer-motion";
import avatarImg from "@/assets/avatar.jpg";

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
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.08,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

/* ---------------- CARD ---------------- */
const Card = ({ t, i }) => {
  return (
    <motion.div
      custom={i}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-80px" }}
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      whileTap={{ scale: 0.96 }}
      className="
        h-[300px] flex flex-col justify-between
        rounded-[20px]
        border border-[#e6e6e6]
        bg-[#f9f9f9]
        p-5
        shadow-[0_1px_1px_rgba(0,0,0,0.04),
                0_10px_30px_rgba(0,0,0,0.06)]
      "
    >
      {/* quote */}
      <div className="text-xl">“</div>

      {/* text */}
      <p className="text-[15px] leading-[1.6] text-[#111] line-clamp-4">
        {t.quote}
      </p>

      {/* user */}
      <div className="flex items-center gap-3">
        {/* <img
          src={avatarImg}
          className="w-9 h-9 rounded-full object-cover"
          style={{ filter: `hue-rotate(${i * 50}deg) saturate(0.7)` }}
        /> */}
        <div>
          <p className="text-[14px] font-semibold">{t.name}</p>
          <p className="text-[12px] text-[#777]">{t.title}</p>
        </div>
      </div>
    </motion.div>
  );
};

/* ---------------- COMPONENT ---------------- */
const TestimonialsSection = () => {
  return (
    <section className="py-24 md:-my-10  section-container">
      <div className="max-w-[1100px] p-2 md:p-10 ">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <h2
            className="
            text-[clamp(2.4rem,5vw,3.5rem)]
            leading-[1.1]
            tracking-[-0.02em]
            font-semibold
          "
          >
            <span className="text-[#9b9b9b] font-medium">
              Feedback that 
            </span>
            <br />
            fuels us
          </h2>

          <div className="flex items-center gap-3">
            {/* avatars */}
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={avatarImg}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))}
            </div>

            <div>
              <div className="text-sm">★★★★★</div>
              <div className="text-xs text-[#777]">99+ Happy clients</div>
            </div>
          </div>
        </div>

        {/* ================= DESKTOP GRID ================= */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Card key={i} t={t} i={i} />
          ))}
        </div>

        {/* ================= MOBILE CAROUSEL ================= */}
        <motion.div className="md:hidden overflow-hidden">
          <motion.div
            drag="x"
            dragConstraints={{
              left: -((testimonials.length - 1) * 260),
              right: 0,
            }}
            dragElastic={0.05}
            className="flex gap-3 pl-4 pr-2 cursor-grab active:cursor-grabbing"
          >
            {testimonials.map((t, i) => (
              <div key={i} className="min-w-[80%]">
                <Card t={t} i={i} />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
