import {
  Check,
  RefreshCw,
  MessageSquare,
  Send,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import pricingBg from "@/assets/pricing-card-bg.jpg";

/* ---------------- ANIMATION ---------------- */

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const word = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.98,
    filter: "blur(10px)",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* ---------------- DATA ---------------- */

const features = [
  "No contracts or commitments",
  "Pause or cancel anytime",
  "Multiple Brands",
  "Unlimited requests",
  "Avg 48 hour turnaround",
  "Framer development",
];

const singleFeatures = [
  "Clearly defined scope",
  "Fixed timeline",
  "3 revision rounds",
  "Milestone updates",
];

/* ---------------- COMPONENT ---------------- */

const PricingSection = () => {
  const line1 = ["Simple", "pricing."];
  const line2 = ["Standout", "designs."];

  return (
    <section id="pricing" className="py-28 section-container">

      {/* ================= HEADER ================= */}
      <div className="grid lg:grid-cols-2 gap-16 mb-20 items-start">

        {/* Animated Heading */}
        <motion.h2
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-120px" }}
          className="text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-tight"
        >
          <div className="block whitespace-nowrap text-muted-foreground font-medium">
            {line1.map((w, i) => (
              <motion.span key={i} variants={word} className="inline-block mr-3">
                {w}
              </motion.span>
            ))}
          </div>

          <div className="block whitespace-nowrap text-foreground font-semibold">
            {line2.map((w, i) => (
              <motion.span key={i} variants={word} className="inline-block mr-3">
                {w}
              </motion.span>
            ))}
          </div>
        </motion.h2>

        {/* Right Text */}
        <p className="text-lg text-muted-foreground max-w-md">
          <span className="text-foreground font-semibold">
            Clear costs, no hidden fees.
          </span>{" "}
          Select from monthly subscriptions or individual project rates.
        </p>
      </div>

      {/* ================= STEPS ================= */}
      <div className="grid md:grid-cols-3 gap-12 mb-20">
        {[
          {
            icon: RefreshCw,
            title: "Subscribe",
            desc: "Subscribe via stripe & start requesting through my trello board.",
          },
          {
            icon: MessageSquare,
            title: "Request",
            desc: "Request whatever service I offer, from branding to web design.",
          },
          {
            icon: Send,
            title: "Receive",
            desc: "Receive your design within 48 hours on average.",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="space-y-3">
            <div className="flex items-center gap-3">
              <Icon size={18} />
              <span className="font-medium">{title}</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              {desc}
            </p>
          </div>
        ))}
      </div>

      {/* ================= MAIN ================= */}
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 mb-8">

        {/* LEFT */}
        <div className="relative">

          {/* TOP IMAGE CARD */}
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-black text-white">
            <div className="relative h-[260px]">
              <img
                src={pricingBg}
                className="absolute inset-0 w-full h-full object-cover opacity-70"
                alt=""
              />
              <div className="absolute inset-0 bg-black/60" />

              <div className="relative p-6 flex flex-col justify-end h-full">
                <div className="text-xs bg-white/20 px-3 py-1 rounded-full w-fit mb-3 backdrop-blur">
                  Pause or cancel anytime
                </div>

                <p className="text-lg font-medium">
                  Subscription design services
                </p>
                <p className="text-sm opacity-80">
                  for brands who move fast.
                </p>
              </div>
            </div>
          </div>

          {/* LOWER CARD */}
          <div className="mt-4 rounded-2xl border border-border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Slots available
            </div>

            <h3 className="text-2xl font-semibold mb-2">
              Hire me today
            </h3>

            <p className="text-sm text-muted-foreground">
              Skip the agency markup and work directly with an experienced designer.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="rounded-2xl border border-border bg-muted/40 p-8 shadow-sm">

          <p className="text-xs text-muted-foreground mb-2">
            Skip the agency markup and work directly with an experienced designer.
          </p>

          <h3 className="text-2xl font-semibold mb-3">
            Unlimited Design
          </h3>

          <p className="text-sm text-muted-foreground mb-6">
            <span className="font-semibold text-foreground">
              One flat monthly rate for unlimited design requests.
            </span>{" "}
            Ideal for ongoing design requirements.
          </p>

          <div className="border-t border-border pt-6">

            <div className="flex items-end gap-2 mb-6">
              <span className="text-5xl font-semibold tracking-tight">
                $8,000
              </span>
              <span className="text-sm text-muted-foreground mb-1">
                / month
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-6 mb-8">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <Check size={16} />
                  {f}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button className="rounded-full bg-black text-white px-6 py-3 text-sm font-medium shadow-md">
                Get Started
              </button>
              <span className="text-muted-foreground text-sm">
                stripe
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM ================= */}
      <div className="rounded-2xl bg-black text-white p-8 shadow-xl">

        <div className="grid lg:grid-cols-2 gap-8 items-center">

          <div>
            <h3 className="text-2xl font-semibold mb-3">
              Single Project
            </h3>

            <p className="text-sm text-white/70">
              Comprehensive design services for any project scope.
              Ideal for one-time design needs or individual tasks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

            <div className="grid grid-cols-2 gap-3 text-sm">
              {singleFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check size={16} />
                  {f}
                </div>
              ))}
            </div>

            <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium">
              Get quote <ArrowRight size={16} />
            </button>

          </div>
        </div>
      </div>

    </section>
  );
};

export default PricingSection;