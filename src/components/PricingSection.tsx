import {
  Check,
  RefreshCw,
  MessageSquare,
  Send,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import pricingBg from "@/assets/pricing-card-bg.jpg";
import AnimatedHeading from "@/components/AnimatedHeading";

/* ---------------- DATA ---------------- */
const features = [
  "Flexible engagement terms",
  "Dedicated account manager",
  "Monthly performance reports",
  "Monthly performance reports",
  "Unlimited strategy requests",
  "Priority support",
];

const singleFeatures = [
  "Clearly defined Scope",
  "Fixed timeline",
  "Dedicated project manager",
  "Regular milestone updates ",
];

/* ---------------- FLOATING CARD ---------------- */
const FloatingCard = () => {
  return (
    <motion.div
      initial={{ rotate: -4 }}
      animate={{ rotate: [-4, 4, -4] }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: [0.45, 0, 0.55, 1], // smoother than default
      }}
      style={{
        transformOrigin: "top center", //  CRITICAL (pendulum pivot)
        willChange: "transform",
      }}
      className="
        relative rounded-[22px] overflow-hidden
        bg-black text-white
        border border-white/10
        shadow-[0_1px_1px_rgba(0,0,0,0.08),
                0_8px_24px_rgba(0,0,0,0.18),
                0_20px_40px_rgba(0,0,0,0.25)]
      "
    >
      <div className="relative h-[220px] md:h-[260px]">
        <img
          src={pricingBg}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="Subscription"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative p-6 flex flex-col justify-end h-full">
          <div className="text-xs bg-white text-black px-3 py-1 rounded-full w-fit mb-3 shadow-sm">
            Pause or cancel anytime
          </div>

          <p className="text-[17px] font-medium">Digital marketing services</p>

          <p className="text-[14px] text-white/75">
            for brands ready to scale.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/* ---------------- COMPONENT ---------------- */
const PricingSection = () => {
  return (
    <section className="py-24  section-container">
      <div className="mx-auto max-w-[1100px] p-2 md:p-10">
        {/* ================= HEADER ================= */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20 items-center">
          <AnimatedHeading
            lines={["Transparent pricing.", "Real results, no surprises."]}
            className="hidden md:block text-[clamp(2.6rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em]"
          />
          <AnimatedHeading
            lines={["Transparent", "pricing.", "Real results", "no surprises."]}
            className="md:hidden text-[clamp(2.6rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em]"
          />
        </div>

        {/* ================= STEPS ================= */}
        <div className="grid sm:grid-cols-3 gap-10 mb-20">
          {[
            {
              icon: RefreshCw,
              title: "Consult",
              desc: "Book a free discovery call and share your business goals with our team",
            },
            {
              icon: MessageSquare,
              title: "Strategise",
              desc: "We build a tailored digital marketing plan designed around your objectives.",
            },
            {
              icon: Send,
              title: "Grow",
              desc: "Watch your brand gain visibility, leads, and revenue — results you can measure.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title}>
              <div className="flex items-center gap-3 mb-2">
                <Icon size={18} />
                <span className="font-medium">{title}</span>
              </div>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        {/* ================= BACKGROUND CONTAINER (IMPORTANT) ================= */}
        <div className="rounded-xl border border-[#e8e8e8] bg-[#f7f7f7] p-2 md:p-4 ">
          {/* ================= MAIN ================= */}
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6 mb-6">
            {/* LEFT */}
            <div className="space-y-3">
              <FloatingCard />

              <div
                className="
                rounded-xl
                border border-border
                bg-white
                p-6
                shadow-[0_1px_2px_rgba(0,0,0,0.04),
                        0_6px_20px_rgba(0,0,0,0.06)]
              "
              >
                <div className="flex items-center gap-2 text-xs mb-4">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Limited slots available
                </div>

                <h3 className="text-2xl font-semibold mb-2">
                  Partner with us today
                </h3>

                <p className="text-sm text-muted-foreground">
                  Work directly with a dedicated team that treats your growth as
                  their own.
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div
              className="
              rounded-xl
              border border-border
              bg-white
              p-6 md:p-8
              shadow-[0_1px_2px_rgba(0,0,0,0.04),
                      0_10px_30px_rgba(0,0,0,0.08)]
            "
            >
              <h3 className="text-2xl font-semibold mb-3">Monthly Retainer</h3>

              <p className="text-sm text-muted-foreground mb-6">
                <span className="font-semibold text-foreground">
                  A fully managed monthly engagement covering strategy, execution, and reporting —
                </span>{" "}
                so you can focus on running your business. 
              </p>

              <div className="border-t border-border pt-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mb-8">
                  {features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <Check size={16} />
                      {f}
                    </div>
                  ))}
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="
                    rounded-full bg-black text-white
                    px-6 py-3 text-sm font-medium
                    shadow-lg hover:opacity-90 transition
                  "
                >
                Book a Free Call
                </motion.button>
              </div>
            </div>
          </div>

          {/* ================= BOTTOM ================= */}
          <div className="rounded-[22px] bg-black text-white p-6 md:p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-3">One-Time Project</h3>
                <p className="text-sm text-white/70">
                  End-to-end digital marketing execution for a specific campaign or launch. Perfect for businesses with a defined goal and timeline. 
                </p>
              </div>

              <div className="flex flex-row sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {singleFeatures.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <Check size={16} />
                      {f}
                    </div>
                  ))}
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="
                    flex items-center gap-2
                    bg-white text-black
                    px-6 py-3 rounded-full
                    font-medium
                  "
                >
                  Request a Proposal <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
