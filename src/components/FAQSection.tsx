import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Calendar } from "lucide-react";
import ContactForm from "@/components/ContactForm";

/* ─── Data ─── */

const faqs = [
  {
    q: "What services does Kola Communications offer?",
    a: "We offer a full suite of digital marketing services including website development, SEO, AEO & GEO, lead generation, performance marketing, social media marketing, content creation, brand identity design, and AI-powered tools and applications.",
  },
  {
    q: "Do you work with businesses outside of India?",
    a: "Yes, we work with clients globally across the US, Europe, and the Middle East.",
  },
  {
    q: "How long does it take to see results?",
    a: "Website projects take 3–6 weeks. SEO takes 60–90 days. Ads can be faster depending on budget.",
  },
  {
    q: "Do you offer one-time projects or retainers?",
    a: "We offer both one-time projects and monthly retainers based on your needs.",
  },
  {
    q: "How do I get started?",
    a: "Book a discovery call and we'll guide you with a tailored strategy.",
  },
  {
    q: "Will I have a dedicated contact?",
    a: "Yes, every client gets a dedicated account manager.",
  },
  {
    q: "How do you measure results?",
    a: "We track traffic, leads, conversions, and campaign performance.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes, we respect confidentiality and sign NDAs when needed.",
  },
];

const NAV_H = 80;

/* ─── Component ─── */

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const ctaWrapRef = useRef<HTMLDivElement>(null);
  const [ctaTop, setCtaTop] = useState(NAV_H);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      const cta = ctaWrapRef.current;
      if (!section || !cta) return;

      const sr = section.getBoundingClientRect();
      const ctaH = cta.offsetHeight;

      const desiredTop = NAV_H - sr.top;

      const minTop = 96;
      const maxTop = sr.height - ctaH - 96;

      const clampedTop = Math.min(Math.max(desiredTop, minTop), maxTop);

      setCtaTop(clampedTop);
    };

    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 border-t border-b border-border section-container relative"
    >
      <ContactForm open={contactOpen} onClose={() => setContactOpen(false)} />
      <div className="max-w-[1100px] mx-auto px-4 md:px-10">
        <div className="flex flex-col lg:flex-row gap-14">
          {/* ═══ LEFT — FAQ list ═══ */}
          <div className="flex-1 min-w-0">
            <h2 className="text-[clamp(2.2rem,4vw,3.2rem)] leading-[1.05] tracking-[-0.02em] mb-12 md:mb-16">
              <span className="text-muted-foreground font-medium">Your questions </span>
              <span className="text-foreground font-semibold">answered.</span>
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <motion.div
                    key={index}
                    layout
                    className={`
                      rounded-[18px] border transition
                      ${
                        isOpen
                          ? "border-gray-300 bg-[#f8f8f8]"
                          : "border-gray-300 bg-[#fafafa] hover:bg-[#f5f5f5]"
                      }
                    `}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <div className="flex flex-1 min-w-0 items-center gap-4">
                        <span className="text-[14px] font-medium text-[#111]">
                          {faq.q}
                        </span>
                      </div>
                      <motion.div
                        className="shrink-0"
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.25,
                            ease: [0.25, 1, 0.5, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-[14px] text-[#666] leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Spacer to reserve right column width */}
          <div
            className="hidden lg:block flex-shrink-0 w-[360px]"
            aria-hidden
          />
        </div>
      </div>
        {/* ═══ RIGHT — CTA (positioned absolute) ═══ */}
      <div
        ref={ctaWrapRef}
        className="hidden lg:block"
        style={{
          position: "absolute",
          top: ctaTop,
          right: 40,
          width: 360,
          zIndex: 10,
          willChange: "top",
        }}
      >
        <div
          className="
            rounded-[22px]
            border border-gray-300
            bg-[#fafafa]
            p-8
          "
        >
          {/* <img src={avatarJoseph} className="w-14 h-14 rounded-full mb-6" /> */}
          <p className="text-[#8a8a8a] text-lg">Still not sure?</p>
          <h3 className="text-[28px] font-semibold leading-tight mt-1">
            Book a free discovery call.
          </h3>
          <p className="text-sm text-[#666] mt-4 leading-relaxed">
            Learn more about how we work and how we can help your business grow.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-full text-sm font-medium"
              onClick={() => setContactOpen(true)}
            >
              <Calendar size={16} />
              Schedule Now
            </motion.button>
          </div>
        </div>
      </div>

      {/* ─── Mobile ─── */}
      <div className="lg:hidden max-w-[1100px] mx-auto px-4 md:px-10 mt-10">
        <div className="rounded-[22px] border border-gray-300 bg-[#fafafa] p-8">
          {/* <img src={avatarJoseph} className="w-14 h-14 rounded-full mb-6" /> */}
          <p className="text-[#8a8a8a] text-lg">Still not sure?</p>
          <h3 className="text-[28px] font-semibold leading-tight mt-1">
            Book a free discovery call.
          </h3>
          <p className="text-sm text-[#666] mt-4 leading-relaxed">
            Learn more about how we work and how we can help your business grow.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <button onClick={() => {
                      setContactOpen(true);
                      setMobileOpen(false);
                    }} className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-full text-sm font-medium">
              <Calendar size={16} />
              Schedule Now
            </button>
            <span className="text-sm text-[#999]">Cal.com</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
