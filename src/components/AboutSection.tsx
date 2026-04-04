import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import avatarJoseph from "@/assets/avatar.jpg";
import { Twitter, Instagram, Dribbble, Linkedin } from "lucide-react";
import AnimatedHeading from "@/components/AnimatedHeading";

/* ---------------- DATA ---------------- */

const paragraphs = [
  {
    bold: "I love turning ideas into something real through design.",
    text: "What started as a hobby turned into a career when I discovered how design can make things both look great and work better.",
  },
  {
    bold: "I focus on creating user interfaces that serve a real purpose",
    text: "making sure they're not just pretty, but actually solve problems. Whether I'm working on a mobile app or a website, my goal is to make something that feels natural and easy to use.",
  },
  {
    bold: "I'm a bit of a perfectionist when it comes to the small stuff,",
    text: "but I think that's what makes good design great. This attention to detail helps me build strong relationships with clients.",
  },
];

const history = [
  { company: "KYMA", role: "Full-Stack Designer", year: "2012–2024" },
  { company: "Mugen", role: "Staff Product Designer", year: "2020–2022" },
  { company: "Axiom", role: "Designer", year: "2016–2020" },
];

/* ---------------- COMPONENT ---------------- */

const AboutSection = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="py-24 md:py-32 border-t border-border section-container p-10">
      <div className="mx-auto max-w-[1080px]">

        {/* ===== HEADING ===== */}
        <AnimatedHeading
          lines={[
            "Designing experiences",
            "that solve real problems.",
          ]}
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
          lines={[
            "Designing",
            "experiences",
            "that solve",
            "real problems.",
          ]}
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
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-16 lg:gap-24">

          {/* ================= LEFT ================= */}
          <div>

            {/* IMAGE */}
            <div className="relative w-full max-w-[320px] aspect-[4/5] rounded-2xl overflow-hidden">
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
              <h3 className="text-[17px] font-semibold">
                Joseph Alexander
              </h3>
              <p className="text-[13px] text-muted-foreground">
                Full-stack Designer
              </p>
            </div>

            {/* ===== WORK HISTORY ===== */}
            <div className="mt-14">
              <p className="text-[15px] font-medium mb-6">
                My work history
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
                        <p className="text-[14px] text-muted-foreground mt-1">
                          {history[0].role}
                        </p>
                      </div>

                      <span className="text-[14px] text-muted-foreground">
                        {history[0].year}
                      </span>
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

                            <span className="text-[13px] text-muted-foreground">
                              {item.year}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* BUTTON */}
                <motion.button
                  onClick={() => setOpen((prev) => !prev)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="
                    mt-6 mx-auto block
                    px-5 py-2.5 rounded-full
                    border border-border
                    text-[13px] font-medium
                    bg-background
                    shadow-sm
                  "
                >
                  {open ? "Hide" : "Show all"} ⌄
                </motion.button>
              </div>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="space-y-8 max-w-[660px]">

            {paragraphs.map((p, i) => (
              <p key={i} className="text-xl leading-[1.65]">
                <span className="font-medium">{p.bold}</span>{" "}
                <br />
                <span className="text-muted-foreground">{p.text}</span>
              </p>
            ))}

            {/* SIGNATURE */}
            <div className="pt-6">
              <img
                src="/signature.svg"
                alt="signature"
                className="h-14 opacity-90"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;