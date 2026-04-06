import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import avatarJoseph from "@/assets/avatar.jpg";
import {
  Twitter,
  Instagram,
  Dribbble,
  Linkedin,
  ChevronDown,
} from "lucide-react";
import AnimatedHeading from "@/components/AnimatedHeading";

/* ---------------- DATA ---------------- */

const paragraphs = [
  {
    bold: "Kola Communications was born from a simple belief that every business,",
    text: "regardless of size, deserves a powerful digital presence. What started as a passion for creative problem-solving has grown into a full-service digital marketing agency trusted by brands across India, Australia, US, Europe, and Middle East.",
  },
  {
    bold: "We go beyond aesthetics.",
    text: "From building high-performance websites to running targeted SEO campaigns and lead generation strategies, everything we do is designed to deliver measurable impact. Our team brings together creativity, data, and strategy to craft digital experiences that don't just look great they work hard for your business",
  },
  {
    bold: "We're detail-obsessed, and we think that's exactly what sets us apart.",
    text: "It's what keeps our clients coming back and what drives us to treat every project with the same dedication and care we'd want for our own brand.",
  },
];

const history = [
  {
    company: "Results-Driven",
    role: "We focus on delivering measurable outcomes that directly impact your business growth and success.",
  },
  {
    company: "Innovation First",
    role: "We stay ahead of digital trends and leverage cutting-edge technologies to give you a competitive edge.",
  },
  {
    company: "Client-Centric",
    role: "Your success is our priority. We build lasting partnerships through transparent communication and dedicated support.",
  },
  {
    company: "Quality Excellence",
    role: "We maintain the highest standards in every project, ensuring exceptional quality and attention to detail.",
  },
];

/* ---------------- COMPONENT ---------------- */

const AboutSection = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="py-24 md:py-24 border-t border-border section-container p-10">
      <div className="mx-auto max-w-[1080px]">
        {/* ===== HEADING ===== */}
        <AnimatedHeading
          lines={["Helping brands grow in a", "digital-first world."]}
          className="
          hidden md:block
            text-[clamp(2.6rem,5vw,4rem)]
            leading-[1.05]
            tracking-[-0.025em]
            mb-20 md:mb-24
            max-w-[760px]
          "
        />
        <AnimatedHeading
          lines={["Helping brands", "grow in a","digital-first world"]}
          className="
           md:hidden
            text-[clamp(2.6rem,5vw,4rem)]
            leading-[1.05]
            tracking-[-0.025em]
            mb-20 md:mb-24
            max-w-[760px]
          "
        />

        {/* ===== GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-16 ">
          {/* ================= LEFT ================= */}
          <div>
            {/* IMAGE */}
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src={avatarJoseph}
                alt="Joseph Alexander"
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* SOCIAL BAR */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full">
                  <Twitter size={14} /> 1,214
                </div>

                {[Instagram, Dribbble, Linkedin].map((Icon, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-white"
                  >
                    <Icon size={14} />
                  </div>
                ))}
              </div>
            </div>

            {/* NAME */}
            <div className="mt-6">
              <h3 className="text-[17px] font-semibold">Joseph Alexander</h3>
              <p className="text-[13px] text-muted-foreground">
                Full-stack Designer
              </p>
            </div>

            {/* ===== PARAGRAPHS — mobile only, shown between image and values ===== */}
            <div className="lg:hidden mt-10 space-y-8">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-xl leading-[1.65]">
                  <span className="font-medium">{p.bold}</span>{" "}
                  <span className="text-muted-foreground">{p.text}</span>
                </p>
              ))}
            </div>

            {/* ===== WORK HISTORY ===== */}
            <div className="mt-14">
              <p className="text-[15px] font-medium mb-6">
                Built on Unshakeable Values
              </p>

              <div className="max-w-[420px]">
                {/* STACK CARD */}
                <motion.div
                  layout
                  onClick={() => setOpen((prev) => !prev)}
                  className="relative cursor-pointer"
                >
                  {!open && (
                    <>
                      <div className="absolute inset-0 translate-y-3 scale-[0.96] bg-card border rounded-2xl opacity-40" />
                      <div className="absolute inset-0 translate-y-1.5 scale-[0.98] bg-card border rounded-2xl opacity-70" />
                    </>
                  )}

                  <motion.div
                    layout
                    className="
                      relative rounded-2xl border border-border bg-card
                      px-6 py-5
                      shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                    "
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[16px] font-semibold">
                          {history[0].company}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {history[0].role}
                        </p>
                      </div>

                    </div>
                  </motion.div>
                </motion.div>

                {/* EXPANDED */}
                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.25 }}
                      className="mt-3 flex flex-col gap-3"
                    >
                      {history.slice(1).map((item, i) => (
                        <motion.div
                          key={item.company}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: i * 0.05,
                            type: "spring",
                            stiffness: 120,
                            damping: 16,
                          }}
                          className="
                            rounded-2xl border border-border bg-card
                            px-6 py-5
                            shadow-[0_6px_20px_rgba(0,0,0,0.06)]
                          "
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-[15px] font-medium">
                                {item.company}
                              </p>
                              <p className="text-[13px] text-muted-foreground mt-1">
                                {item.role}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* BUTTON */}
                <motion.button
                  onClick={() => setOpen((prev) => !prev)}
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className="
    mt-6 mx-auto flex items-center gap-2
    px-5 py-2.5 rounded-full
    text-[13px] font-medium

    border border-white/20
    bg-white/10
    backdrop-blur-xl

    shadow-[0_6px_30px_rgba(0,0,0,0.12)]

    transition
  "
                >
                  {/* TEXT */}
                  <motion.span
                    key={open ? "hide" : "show"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-black"
                  >
                    {open ? "Hide" : "Show all"}
                  </motion.span>

                  {/* ICON */}
                  <motion.span
                    variants={{
                      rest: { rotate: 0 },
                      hover: { rotate: 180 },
                      tap: { scale: 0.9 },
                    }}
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex items-center justify-center text-black/70"
                  >
                    <ChevronDown size={16} />
                  </motion.span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          {/* hidden on mobile since paragraphs are rendered above in the left col */}
          <div className="hidden lg:block space-y-8 max-w-[660px]">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-xl leading-[1.65]">
                <span className="font-medium">{p.bold}</span>{" "}
                <span className="text-muted-foreground">{p.text}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;