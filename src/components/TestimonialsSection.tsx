import { motion } from "framer-motion";
import avatarImg from "@/assets/avatar.jpg";

/* ---------------- DATA ---------------- */
const testimonials = [
  {
    quote:
      "The new UI design cut our customer support tickets in half. It's been a game-changer for us.",
    name: "Martina Martinez",
    title: "Customer Manager at SupportEase",
  },
  {
    quote:
      "Working with Joseph felt like having a seasoned design partner who truly understood our vision for Zazzle and brought it to life in ways we hadn't even imagined.",
    name: "Thomas Weber",
    title: "Co-founder of KYMA",
  },
  {
    quote:
      "Our website conversion rate improved significantly thanks to Joseph's expertise.",
    name: "Ben Harper",
    title: "CTO of Nexus",
  },
  {
    quote:
      "Joseph's design approach brought clarity to our complex data visualizations. Our users are thrilled!",
    name: "Michael Wong",
    title: "Data Scientist at DataSphere",
  },
  {
    quote:
      "The rebranding exceeded our expectations. It's given us a competitive edge in our industry.",
    name: "Natalie Rivera",
    title: "Brand Manager at UnityBrands",
  },
  {
    quote:
      "The redesign transformed our brand image. We've seen a 30% increase in engagement since launch.",
    name: "Emma Kraft",
    title: "CMO of TechVista",
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
const Card = ({ t, i }: any) => {
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
        <img
          src={avatarImg}
          className="w-9 h-9 rounded-full object-cover"
          style={{ filter: `hue-rotate(${i * 50}deg) saturate(0.7)` }}
        />
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
    <section className="py-24  section-container">
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
              Hear from what my
            </span>
            <br />
            clients have to say.
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
