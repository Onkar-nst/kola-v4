

import { motion } from "framer-motion";


const Shimmer = ({ className = "" }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-black/[0.04] rounded-[6px] ${className}`}>
    <motion.div
      className="absolute inset-0 -translate-x-full"
      animate={{ translateX: ["−100%", "100%"] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.2 }}
      style={{
        background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.04) 50%, transparent 100%)",
      }}
    />
  </div>
);


const StaggerIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);


const ProseSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <StaggerIn delay={delay} className="mb-12">
    <Shimmer className="h-2.5 w-28 mb-5 rounded-full" />
    <div className="h-px bg-black/[0.04] mb-6" />
    <div className="space-y-3">
      <Shimmer className="h-3.5 w-full" />
      <Shimmer className="h-3.5 w-[92%]" />
      <Shimmer className="h-3.5 w-[85%]" />
      <Shimmer className="h-3.5 w-[78%]" />
      <Shimmer className="h-3.5 w-[60%]" />
    </div>
  </StaggerIn>
);


const FaqSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <StaggerIn delay={delay} className="mb-12">
    <Shimmer className="h-2.5 w-20 mb-5 rounded-full" />
    <div className="h-px bg-black/[0.04] mb-2" />
    {[0, 1, 2].map((i) => (
      <div key={i} className="border-b border-black/[0.06] py-4 flex items-center justify-between">
        <Shimmer className="h-3 rounded-full" style={{ width: `${52 + i * 8}%` } as React.CSSProperties} />
        <Shimmer className="h-3 w-3 rounded-full shrink-0 ml-4" />
      </div>
    ))}
  </StaggerIn>
);


const SidebarCardSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <StaggerIn delay={delay} className="py-3 border-b border-black/[0.05] last:border-b-0">
    <Shimmer className="w-full h-[120px] rounded-[10px] mb-2.5" />
    <Shimmer className="h-3 w-[70%] mb-1.5 rounded-full" />
    <Shimmer className="h-2.5 w-[50%] rounded-full" />
  </StaggerIn>
);

/* ══════════════════════════════════════════
   MAIN LOADER EXPORT
══════════════════════════════════════════ */

const ProjectPageLoader = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden">

        {/* ═══════ HERO ═══════ */}
        <section className="section-container pt-24 pb-0 relative z-10">
          <div className="max-w-[1100px] mx-auto px-4 md:px-10">

            {/* Back button */}
            <StaggerIn delay={0} className="mb-10">
              <Shimmer className="h-4 w-14 rounded-full" />
            </StaggerIn>

            {/* Hero image — desktop full width */}
            <StaggerIn delay={0.08} className="hidden md:block mb-10">
              <Shimmer className="w-full h-[500px] lg:h-[540px] rounded-[20px]" />
            </StaggerIn>

            {/* Hero image — mobile two-card hint */}
            <StaggerIn delay={0.08} className="md:hidden mb-8 flex gap-3 overflow-hidden">
              <Shimmer className="h-[240px] rounded-[18px] shrink-0" style={{ width: "82vw" } as React.CSSProperties} />
              <Shimmer className="h-[240px] rounded-[18px] shrink-0 opacity-40" style={{ width: "62vw" } as React.CSSProperties} />
            </StaggerIn>

            {/* Title */}
            <StaggerIn delay={0.14} className="mb-4 space-y-3">
              <Shimmer className="h-9 w-[55%] rounded-[6px]" />
            </StaggerIn>

            {/* Tags */}
            <StaggerIn delay={0.18} className="flex gap-2 pb-10 pt-1">
              {[72, 96, 60, 80].map((w, i) => (
                <Shimmer key={i} className="h-6 rounded-full" style={{ width: `${w}px` } as React.CSSProperties} />
              ))}
            </StaggerIn>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-black/[0.06]" />

        {/* ═══════ CONTENT ═══════ */}
        <section className="section-container pt-14 pb-28 relative z-10">
          <div className="max-w-[1100px] mx-auto px-4 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-8 lg:gap-16">

              {/* LEFT */}
              <div>
                <ProseSkeleton delay={0.22} />
                <ProseSkeleton delay={0.30} />
                <FaqSkeleton   delay={0.38} />

                {/* CTA placeholder */}
                <StaggerIn delay={0.44} className="mt-14 pt-10 border-t border-black/[0.05]">
                  <Shimmer className="h-2.5 w-20 mb-4 rounded-full" />
                  <Shimmer className="h-6 w-[55%] mb-2 rounded-[6px]" />
                  <Shimmer className="h-6 w-[45%] mb-6 rounded-[6px]" />
                  <Shimmer className="h-4 w-24 rounded-full" />
                </StaggerIn>
              </div>

              {/* RIGHT sidebar */}
              <div className="hidden md:block">
                <StaggerIn delay={0.26}>
                  <Shimmer className="h-2.5 w-24 mb-5 rounded-full" />
                  <SidebarCardSkeleton delay={0.30} />
                  <SidebarCardSkeleton delay={0.35} />
                  <SidebarCardSkeleton delay={0.40} />
                  <Shimmer className="h-3 w-14 mt-5 rounded-full" />
                </StaggerIn>
              </div>

            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectPageLoader;