import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useInView } from "framer-motion";

import ColumnGuides from "@/components/ColumnGuides";
import CustomCursor from "@/components/CustomCursor";
import AboutSection from "@/components/AboutSection";
import TestimonialBanner from "@/components/TestimonialBanner";
import CTAFooter from "@/components/CTAFooter";
import ContactForm from "@/components/ContactForm";

/* ══════════════════════════════════════════
   ANIMATED COUNTER
   ══════════════════════════════════════════ */

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const AnimatedCounter = ({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: CounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = ease * value;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue)}
      {suffix}
    </span>
  );
};

/* ══════════════════════════════════════════
   DATA CONSTANTS
   ══════════════════════════════════════════ */

const stats = [
  {
    target: 218,
    prefix: "+",
    suffix: "%",
    decimals: 0,
    label: "Organic Traffic",
    sub: "average client growth",
  },
  {
    target: 4.7,
    prefix: "",
    suffix: "x",
    decimals: 1,
    label: "Lead Gen Rate",
    sub: "vs industry standard",
  },
  {
    target: 8.9,
    prefix: "",
    suffix: "x",
    decimals: 1,
    label: "Paid ROAS",
    sub: "month-3 campaign returns",
  },
  {
    target: 99,
    prefix: "",
    suffix: "+",
    decimals: 0,
    label: "Happy Clients",
    sub: "across 6 countries",
  },
];

const capabilities = [
  {
    num: "01",
    title: "High-Performance Web",
    desc: "WordPress, Shopify, and custom React/Next.js builds tailored for rapid load times, conversion, and effortless scalability.",
  },
  {
    num: "02",
    title: "SEO & Answer Engine Optimization",
    desc: "Dominate Google organic rankings and establish clear authority across AI search engines like ChatGPT and Perplexity.",
  },
  {
    num: "03",
    title: "Lead Generation & Performance",
    desc: "Precision funnels, CRO, and targeted paid acquisition that systematically turns website traffic into qualified revenue.",
  },
  {
    num: "04",
    title: "Intelligent Workflows & AI",
    desc: "Modern AI integrations, custom automations, and intelligent tools designed to streamline business operations.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Consult & Align",
    desc: "We dive deep into your brand, target audience, and business goals on a discovery call to map out a clear growth blueprint.",
  },
  {
    step: "02",
    title: "Craft & Execute",
    desc: "From clean code to conversion copy and campaign setup, our team executes with extreme attention to detail and milestone updates.",
  },
  {
    step: "03",
    title: "Scale & Measure",
    desc: "We track every key metric with transparent weekly and monthly reporting, continuously iterating to maximize your return on investment.",
  },
];

/* ══════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════ */

const AboutPage = () => {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>About Us | Kola Communications</title>
        <meta
          name="description"
          content="Kola Communications is a Mumbai-based website development and digital marketing agency empowering brands across India, Australia, the US, the UK, and UAE."
        />
        <link rel="canonical" href="https://www.kolacommunications.com/about" />
      </Helmet>

      <CustomCursor />
      <ContactForm open={contactOpen} onClose={() => setContactOpen(false)} />

      <div className="relative overflow-hidden">
        <ColumnGuides />

        {/* ══════════════════════════════════════════
            ABOUT HERO SECTION (FROM HOME PAGE)
           ══════════════════════════════════════════ */}
        <div className="pt-16 md:pt-24">
          <AboutSection />
        </div>

        {/* ══════════════════════════════════════════
            MINIMAL STATS ROW WITH ANIMATED COUNTERS
           ══════════════════════════════════════════ */}
        <section className="py-16 border-t border-b border-border bg-[#fafafa]">
          <div className="max-w-[1080px] mx-auto px-6 md:px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    <AnimatedCounter
                      value={s.target}
                      prefix={s.prefix}
                      suffix={s.suffix}
                      decimals={s.decimals}
                    />
                  </p>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {s.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {s.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CORE FOCUS & SPECIALIZATION
           ══════════════════════════════════════════ */}
        <section className="py-24 section-container p-6 md:p-10">
          <div className="max-w-[1080px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  What We Do
                </span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
                  Engineered for commercial impact.
                </h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground max-w-md">
                We combine creative design with robust engineering and growth marketing to build digital assets that consistently deliver results.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {capabilities.map((cap) => (
                <div
                  key={cap.num}
                  className="p-8 rounded-2xl border border-border bg-card/60 hover:bg-card transition-colors"
                >
                  <span className="text-xs font-mono font-bold text-muted-foreground">
                    {cap.num}
                  </span>
                  <h3 className="text-xl font-bold mt-3 mb-2 text-foreground">
                    {cap.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            OUR 3-STEP PROCESS
           ══════════════════════════════════════════ */}
        <section className="py-24 border-t border-border bg-[#fafafa]">
          <div className="max-w-[1080px] mx-auto px-6 md:px-10">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                How We Work
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
                Simple, transparent process.
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                No bloated handoffs or confusing jargon. Clear milestones from day one.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {processSteps.map((item) => (
                <div key={item.step} className="flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center text-sm font-semibold text-foreground mb-6 shadow-sm">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CLIENT TESTIMONIAL BANNER (FROM HOME PAGE)
           ══════════════════════════════════════════ */}
        <TestimonialBanner />

        {/* ══════════════════════════════════════════
            SIMPLE MINIMAL CTA BANNER
           ══════════════════════════════════════════ */}
        <section className="py-16 border-t border-border text-black">
          <div className="max-w-[1080px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-black/50 mb-1">
                Let's collaborate
              </p>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                Ready to elevate your digital presence?
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setContactOpen(true)}
                className="rounded-full bg-white border text-black px-7 py-3 text-sm font-medium hover:bg-white/90 transition whitespace-nowrap"
              >
                Schedule a Discovery Call
              </button>
            </div>
          </div>
        </section>
      </div>

      <CTAFooter />
    </div>
  );
};

export default AboutPage;
