import { motion } from "framer-motion";
import avatarJoseph from "@/assets/avatar.jpg";
import { Twitter, Instagram, Dribbble, Linkedin } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-24 section-container border-t border-border p-4">

      {/* HEADING */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] tracking-tight mb-20"
      >
        <span className="text-muted-foreground font-medium">
          Designing experiences
        </span>
        <br />
        <span className="text-foreground font-semibold">
          that solve real problems.
        </span>
      </motion.h2>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* IMAGE */}
          <div className="relative rounded-2xl overflow-hidden w-[320px] aspect-[4/5] shadow-sm">
            <img
              src={avatarJoseph}
              alt="Joseph Alexander"
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* SOCIAL OVERLAY */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              
              <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full">
                <Twitter size={14} /> 1,214
              </div>

              {[Instagram, Dribbble, Linkedin].map((Icon, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-black/80 backdrop-blur-md flex items-center justify-center text-white"
                >
                  <Icon size={14} />
                </div>
              ))}
            </div>
          </div>

          {/* NAME */}
          <div className="mt-5">
            <h3 className="text-lg font-semibold text-foreground">
              Joseph Alexander
            </h3>
            <p className="text-sm text-muted-foreground">
              Full-stack Designer
            </p>
          </div>

          {/* WORK HISTORY */}
          <div className="mt-12">
            <p className="text-sm text-foreground mb-4">
              My work history
            </p>

            <div className="rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">KYMA</p>
                  <p className="text-sm text-muted-foreground">
                    Full-Stack Designer
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  2012–2024
                </span>
              </div>
            </div>

            <button className="mt-4 text-sm text-muted-foreground hover:text-foreground transition">
              Show all →
            </button>
          </div>
        </motion.div>

        {/* RIGHT (BIO) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8 max-w-xl"
        >
          <p className="text-base leading-relaxed">
            <span className="font-semibold text-foreground">
              I love turning ideas into something real through design.
            </span>{" "}
            <span className="text-muted-foreground">
              What started as a hobby turned into a career when I discovered how design can make things both look great and work better.
            </span>
          </p>

          <p className="text-base leading-relaxed">
            <span className="font-semibold text-foreground">
              I focus on creating user interfaces that serve a real purpose
            </span>{" "}
            <span className="text-muted-foreground">
              – making sure they're not just pretty, but actually solve problems. Whether I'm working on a mobile app or a website, my goal is to make something that feels natural and easy to use.
            </span>
          </p>

          <p className="text-base leading-relaxed">
            <span className="font-semibold text-foreground">
              I'm a bit of a perfectionist when it comes to the small stuff,
            </span>{" "}
            <span className="text-muted-foreground">
              but I think that's what makes good design great. This attention to detail helps me build strong relationships with clients.
            </span>
          </p>

          {/* SIGNATURE */}
          <div className="pt-6 text-2xl font-signature text-foreground">
            Joseph Alexander
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutSection;