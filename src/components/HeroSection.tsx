import { useState, useEffect } from "react";
import AnimatedHeading from "@/components/AnimatedHeading";
import ContactForm from "@/components/ContactForm";

/* ─── Animation keyframes (injected once) ─────────────────────────────── */
const ANIM_STYLES = `
  @keyframes gp-floatA {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    33%      { transform: translateY(-10px) rotate(.7deg); }
    66%      { transform: translateY(5px) rotate(-.5deg); }
  }
  @keyframes gp-floatB {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-14px); }
  }
  @keyframes gp-floatC {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    40%      { transform: translateY(9px) rotate(-.7deg); }
    80%      { transform: translateY(-6px) rotate(.45deg); }
  }
  @keyframes gp-scan {
    0%   { transform: translateY(-100%); opacity: 0; }
    8%   { opacity: .35; }
    92%  { opacity: .35; }
    100% { transform: translateY(1200%); opacity: 0; }
  }
  .gp-fa   { animation: gp-floatA 7s ease-in-out infinite; }
  .gp-fb   { animation: gp-floatB 9s ease-in-out infinite; }
  .gp-fc   { animation: gp-floatC 8s 1.5s ease-in-out infinite; }
  .gp-scan { animation: gp-scan 5.5s 1.2s ease-in-out infinite; }
`;

/* ─── Pipeline steps data ──────────────────────────────────────────────── */
const STEPS = [
  {
    label: "Strategy & Research",
    sub: "Market analysis · audience mapping",
    color: "#0ea5e9",
    bg: "#e0f2fe",
    metric: "2.4x ROI",
  },
  {
    label: "Content & Creative",
    sub: "SEO-optimised copy · visual assets",
    color: "#8b5cf6",
    bg: "#ede9fe",
    metric: "+68% Traffic",
  },
  {
    label: "Paid & Organic Reach",
    sub: "Multi-channel campaign execution",
    color: "#ec4899",
    bg: "#fce7f3",
    metric: "3.1M Reach",
  },
  {
    label: "Conversion Optimisation",
    sub: "Landing pages · A/B testing · CRO",
    color: "#10b981",
    bg: "#d1fae5",
    metric: "+41% CVR",
  },
  {
    label: "Analytics & Iteration",
    sub: "Real-time dashboards · reporting",
    color: "#f59e0b",
    bg: "#fef3c7",
    metric: "8.9x ROAS",
  },
];

/* ─── Floating metric chip ─────────────────────────────────────────────── */
function MetricChip({
  floatClass,
  borderColor,
  label,
  value,
  valueColor,
  sub,
  className = "",
}) {
  return (
    <div
      className={`${floatClass} ${className} absolute z-10 rounded-xl bg-white px-3.5 py-2.5 min-w-[124px]`}
      style={{
        border: `1px solid ${borderColor}`,
        boxShadow: `0 4px 20px ${borderColor}55`,
      }}
    >
      <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1 font-medium">
        {label}
      </div>
      <div
        className="text-[19px] font-bold leading-none mb-1"
        style={{ color: valueColor }}
      >
        {value}
      </div>
      <div className="text-[10px] text-emerald-500 font-medium">{sub}</div>
    </div>
  );
}

/* ─── Growth Pipeline Visual ───────────────────────────────────────────── */
function GrowthPipelineVisual() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((p) => (p + 1) % STEPS.length),
      2400,
    );
    return () => clearInterval(id);
  }, []);

  const current = STEPS[active];

  return (
    <>
      <style>{ANIM_STYLES}</style>

      <div className="relative pt-6 pb-6 px-3 sm:px-7">
        {/* Chip: top-right — Organic Traffic */}
        <MetricChip
          floatClass="gp-fa"
          borderColor="#bae6fd"
          label="Organic Traffic"
          value="+218%"
          valueColor="#0ea5e9"
          sub="▲ vs last quarter"
          className="-top-2 -right-1 sm:-right-4"
        />

        {/* Chip: bottom-left — Lead Gen Rate */}
        <MetricChip
          floatClass="gp-fb"
          borderColor="#ddd6fe"
          label="Lead Gen Rate"
          value="4.7x"
          valueColor="#8b5cf6"
          sub="▲ Industry avg: 1.2x"
          className="-bottom-2 -left-1 sm:-left-5"
        />

        {/* Chip: mid-right — Paid ROAS (hidden on mobile) */}
        <MetricChip
          floatClass="gp-fc"
          borderColor="#fde68a"
          label="Paid ROAS"
          value="8.9x"
          valueColor="#f59e0b"
          sub="▲ Month 3 result"
          className="hidden sm:block top-[42%] -right-3 lg:-right-5"
        />

        {/* ── Main panel ── */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-xl shadow-gray-200/60 p-5 sm:p-6">
          {/* Scan-line shimmer */}
          <div
            className="gp-scan pointer-events-none absolute left-0 right-0 z-10"
            style={{
              height: "1.5px",
              background:
                "linear-gradient(90deg, transparent, rgba(14,165,233,0.25), transparent)",
            }}
          />

          {/* Panel header */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-[10px] text-gray-400 uppercase tracking-[0.12em] font-semibold">
              Growth Pipeline
            </span>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="w-2 h-2 rounded-full bg-gray-200" />
            </div>
          </div>

          {/* Steps */}
          {STEPS.map((step, i) => {
            const on = active === i;
            return (
              <div key={i} className="flex items-stretch">
                {/* Node + vertical connector */}
                <div className="flex flex-col items-center flex-shrink-0 w-10">
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      background: on ? step.bg : "#f8fafc",
                      border: on
                        ? `1.5px solid ${step.color}`
                        : "1.5px solid #e2e8f0",
                      color: on ? step.color : "#cbd5e1",
                      boxShadow: on ? `0 0 14px ${step.color}30` : "none",
                      transition: "all .45s ease",
                    }}
                  >
                    {i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      style={{
                        width: 1.5,
                        flex: 1,
                        minHeight: 12,
                        margin: "3px 0",
                        background: on
                          ? `linear-gradient(to bottom, ${step.color}60, transparent)`
                          : "#e2e8f0",
                        transition: "background .45s ease",
                      }}
                    />
                  )}
                </div>

                {/* Step content */}
                <div
                  style={{
                    flex: 1,
                    marginLeft: 10,
                    padding: "7px 10px",
                    borderRadius: 9,
                    marginBottom: i < STEPS.length - 1 ? 2 : 0,
                    background: on ? `${step.bg}80` : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    transition: "background .45s ease",
                  }}
                >
                  <div className="min-w-0">
                    <div
                      style={{
                        fontSize: 12.5,
                        fontWeight: 600,
                        marginBottom: 2,
                        color: on ? "#0f172a" : "#cbd5e1",
                        transition: "color .45s ease",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {step.label}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: on ? "#64748b" : "#e2e8f0",
                        transition: "color .45s ease",
                      }}
                    >
                      {step.sub}
                    </div>
                  </div>

                  {/* Metric badge */}
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      padding: "3px 8px",
                      borderRadius: 6,
                      color: on ? step.color : "#e2e8f0",
                      background: on ? step.bg : "transparent",
                      border: on
                        ? `1px solid ${step.color}40`
                        : "1px solid transparent",
                      transition: "all .45s ease",
                    }}
                  >
                    {step.metric}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Progress bar footer */}
          <div className="mt-4 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
                Current Phase
              </span>
              <span
                className="text-[11px] font-semibold truncate ml-2 max-w-[140px]"
                style={{ color: current.color, transition: "color .4s ease" }}
              >
                {current.label}
              </span>
            </div>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                style={{
                  height: "100%",
                  borderRadius: 99,
                  width: `${((active + 1) / STEPS.length) * 100}%`,
                  background: `linear-gradient(90deg, ${STEPS[0].color}, ${current.color})`,
                  transition: "width .55s cubic-bezier(.4,0,.2,1)",
                }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: i <= active ? STEPS[i].color : "#e2e8f0",
                    transition: "background .4s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Hero Section ─────────────────────────────────────────────────────── */
const HeroSection = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <section className="pt-32 pb-12 md:mt-32 md:pb-20 section-container p-4 md:p-10">
      <ContactForm open={contactOpen} onClose={() => setContactOpen(false)} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left: copy — unchanged from your original */}
        <div className="flex flex-col gap-6">
          <AnimatedHeading
            lines={["Digital experiences", "that drive real results."]}
            className="
              text-[clamp(2rem,3.4vw,3.5rem)]
              leading-[1.05]
              tracking-[-0.025em]
              max-w-[760px]
            "
          />
          <p className="body-lg max-w-md">
            <span className="font-semibold">
              From website development to SEO, lead generation and beyond{" "}
            </span>
            <span className="text-muted-foreground">
              — we craft data-driven digital marketing strategies that grow your
              brand, reach the right audience, and turn clicks into customers.
            </span>
          </p>
          <button
            onClick={() => {
              setContactOpen(true);
              setMobileOpen(false);
            }}
            className="inline-flex items-center gap-3 rounded-full bg-primary text-primary-foreground p-4 py-2 w-fit text-md font-medium hover:opacity-90 transition-opacity group"
          >
            Book a call with us
          </button>
        </div>

        {/* Right: animated visual */}
        <div className="w-full">
          <GrowthPipelineVisual />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
