import { useState, useRef, memo, useEffect } from "react";
import { ArrowUpRight, Megaphone, Star, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ContactForm from "@/components/ContactForm";

const SPLINE_SCENE = "https://prod.spline.design/zyP-FoNAy1RNLOZx/scene.splinecode";

/* ─── Client Avatars with optimized image dimensions ─── */
const clientAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop&q=80",
];

/* ─── High Performance 3D Hero Component ─── */
const MainframeHero = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [is3DLoaded, setIs3DLoaded] = useState(false);
  const splineRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = splineRef.current;
    if (!el) return;

    // Clean spline logo watermark cleanly
    const cleanupBadge = () => {
      const root = (el as any)?.shadowRoot as ShadowRoot | undefined;
      const badge = root?.querySelector("#logo");
      if (badge) {
        badge.remove();
        setIs3DLoaded(true);
        return true;
      }
      return false;
    };

    if (cleanupBadge()) return;

    const observer = new MutationObserver(() => {
      if (cleanupBadge()) {
        observer.disconnect();
      }
    });

    if ((el as any)?.shadowRoot) {
      observer.observe((el as any).shadowRoot, { childList: true, subtree: true });
    }

    const timer = setTimeout(() => {
      cleanupBadge();
      setIs3DLoaded(true);
      observer.disconnect();
    }, 2500);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <ContactForm open={contactOpen} onClose={() => setContactOpen(false)} />

      <section className="relative overflow-hidden bg-white text-black min-h-[90vh] flex items-center pt-28 sm:pt-36 pb-16">
        <div className="section-container w-full max-w-[1080px] mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-12 items-center">
            {/* ================= LEFT: TYPOGRAPHY & CTA ================= */}
            <div className="text-center lg:text-left">
              {/* EYEBROW BADGE */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-black/10 bg-black/[0.02] mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11.5px] font-medium tracking-wide uppercase text-black/70">
                  199+ Brands Scaled Across 6 Markets
                </span>
              </div>

              {/* MAIN HEADLINE */}
              <h1 className="mb-6 text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[1.1] tracking-[-0.03em]">
                <span className="block text-black/40 font-medium mb-1">
                  We Are Your
                </span>

                <span className="flex flex-wrap items-center justify-center lg:justify-start gap-x-[0.25em] gap-y-2 text-black font-semibold">
                  <span className="inline-block px-3 py-0.5 rounded-xl bg-black text-white font-semibold shadow-sm">
                    Digital Growth
                  </span>
                  <span className="inline-flex items-center justify-center shrink-0 rounded-full w-[0.92em] h-[0.92em] bg-black text-white">
                    <Megaphone className="w-[0.52em] h-[0.52em] -rotate-12" />
                  </span>
                  <span>Partner.</span>
                </span>
              </h1>

              {/* SUB-HEADLINE */}
              <p className="text-base sm:text-[17px] text-black/60 max-w-[480px] mx-auto lg:mx-0 leading-[1.65] mb-8">
                From custom-coded web architectures and generative AI discovery (AEO) to precision lead funnels — we build digital platforms that dominate.
              </p>

              {/* CTA BUTTON */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="
                    group inline-flex items-center gap-3
                    px-7 py-4 rounded-full
                    text-sm font-medium text-white bg-black
                    shadow-[0_4px_16px_rgba(0,0,0,0.12)]
                    hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]
                    hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                  "
                >
                  <span>Start Your Project</span>
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    <ArrowUpRight size={13} className="text-white" />
                  </span>
                </button>

                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-5 py-4 rounded-full border border-black/15 bg-black/[0.02] text-sm font-medium text-black hover:border-black/35 hover:bg-black/[0.04] transition-all"
                >
                  <span>View Projects</span>
                  <ArrowRight size={14} className="text-black/50" />
                </Link>
              </div>


            </div>

            {/* ================= RIGHT: HIGH-PERFORMANCE 3D STAGE ================= */}
            <div className="relative h-[380px] sm:h-[460px] lg:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#F3F4F6] to-[#E5E7EB] border border-black/10 shadow-[0_12px_36px_rgba(0,0,0,0.04)] group">
              <spline-viewer
                ref={splineRef}
                url={SPLINE_SCENE}
                className={`w-full h-full block pointer-events-none transition-opacity duration-500 ${
                  is3DLoaded ? "opacity-100" : "opacity-95"
                }`}
              />

              {/* Bottom Interactive HUD Tag */}
              <div className="absolute bottom-4 left-4 right-4 z-10 px-4 py-2.5 rounded-2xl bg-white/85 backdrop-blur-md border border-black/10 flex items-center justify-between text-xs text-black/70 shadow-sm">
                <span className="font-medium flex items-center gap-1.5">
                  <Sparkles size={12} className="text-black/60" />
                  Kola 3D Studio Lab
                </span>
                <span className="text-[11px] text-black/40">Interactive 3D Stage</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default memo(MainframeHero);







