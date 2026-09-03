import { useEffect, useRef, useState } from "react";

// The original clip carried a grey studio backdrop baked into the footage.
// This is the same clip with the background keyed out frame by frame and
// composited onto white, so the hero ground is genuinely white.
const VIDEO_SRC = "/video/hero-white.mp4";

const NAV_LINKS = ["Labs", "Studio", "Openings", "Shop"];
const EMAIL = "business@kolacommunications.com";

const TYPED_TEXT =
  "Great brands don't wait to be found. Tell us what you're here to grow.";

const SERVICE_PILLS = [
  "Website Development",
  "SEO & AEO",
  "Social Media",
  "Lead Generation",
  "AI Solutions",
];

/* How much of the clip a full-width pointer sweep covers. 1 = the whole
   timeline; trim it if the tail of the clip overshoots the turn. */
const TRACK_RANGE = 1;

/* ─── Typewriter ─── */
const useTypewriter = (text: string, speed = 38, startDelay = 600) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
};

/* ─── Mouse-tracked background video ───
   The clip is a pan of the TV head turning, so mapping the pointer's absolute
   X position straight onto the timeline makes the head face the cursor: far
   left of the window = frame 0, far right = the last frame. Seeks are queued
   rather than fired per event — the next one only goes out once the previous
   `seeked` lands, so the decoder is never flooded. */
const useFaceTracking = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const targetTime = useRef(0);
  const seeking = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const seek = () => {
      if (seeking.current) return;
      if (Math.abs(video.currentTime - targetTime.current) < 0.02) return;
      seeking.current = true;
      video.currentTime = targetTime.current;
    };

    const onSeeked = () => {
      seeking.current = false;
      seek();
    };

    const onMouseMove = (e: MouseEvent) => {
      const duration = video.duration;
      if (!duration || Number.isNaN(duration)) return;

      /* 0 → 1 across the hero's own box, so the head only tracks while the
         cursor is over this section. */
      const box = sectionRef.current?.getBoundingClientRect();
      if (!box || box.width === 0) return;
      const ratio = Math.min(Math.max((e.clientX - box.left) / box.width, 0), 1);
      targetTime.current = ratio * duration * TRACK_RANGE;
      seek();
    };

    /* Park on the middle frame so the head starts looking straight ahead. */
    const onLoaded = () => {
      targetTime.current = (video.duration * TRACK_RANGE) / 2;
      seek();
    };

    const section = sectionRef.current;
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("loadedmetadata", onLoaded);
    section?.addEventListener("mousemove", onMouseMove);
    return () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadedmetadata", onLoaded);
      section?.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return { videoRef, sectionRef };
};

const PILL_BASE =
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] transition-colors duration-200";

/* ─── Blur-reveal text ───
   The whole paragraph clears while the cursor is over it and eases back to
   blurred the moment it leaves. */
const MAX_BLUR = 4;

const BlurRevealText = ({
  lines,
  className = "",
}: {
  lines: string[];
  className?: string;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <p
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`select-none ${className}`}
      style={{
        fontSize: "clamp(18px, 4vw, 26px)",
        lineHeight: 1.3,
        fontWeight: 400,
        color: "#000",
        filter: hovered ? "blur(0px)" : `blur(${MAX_BLUR}px)`,
        transition: "filter 0.45s ease",
      }}
    >
      {lines.map((line, i) => (
        <span key={line}>
          {i > 0 && <br />}
          {line}
        </span>
      ))}
    </p>
  );
};

/* ─── Navbar ─── */
const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-10 flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span
            className="text-[21px] sm:text-[26px] tracking-tight text-black"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Mainframe®
          </span>
          <span
            aria-hidden="true"
            className="text-[25px] sm:text-[30px] text-black select-none"
            style={{ letterSpacing: "-0.02em" }}
          >
            ✳︎
          </span>
        </div>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center text-[23px] text-black">
          {NAV_LINKS.map((link, i) => (
            <span key={link}>
              <a href="#" className="hover:opacity-60 transition-opacity">
                {link}
              </a>
              {i < NAV_LINKS.length - 1 && <span>,&nbsp;</span>}
            </span>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href={`mailto:${EMAIL}`}
          className="hidden md:inline text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex flex-col gap-[5px]"
        >
          <span
            className="w-6 h-[2px] bg-black transition-transform duration-300"
            style={{ transform: open ? "translateY(7px) rotate(45deg)" : "none" }}
          />
          <span
            className="w-6 h-[2px] bg-black transition-opacity duration-300"
            style={{ opacity: open ? 0 : 1 }}
          />
          <span
            className="w-6 h-[2px] bg-black transition-transform duration-300"
            style={{ transform: open ? "translateY(-7px) rotate(-45deg)" : "none" }}
          />
        </button>
      </header>

      {/* Mobile overlay */}
      <div
        className="md:hidden fixed inset-0 z-[9] bg-white/95 backdrop-blur-sm flex flex-col justify-center items-start px-8 gap-8 transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href="#"
            onClick={() => setOpen(false)}
            className="text-[32px] font-medium text-black"
          >
            {link}
          </a>
        ))}
        <a
          href={`mailto:${EMAIL}`}
          onClick={() => setOpen(false)}
          className="text-[32px] font-medium text-black underline underline-offset-2"
        >
          Get in touch
        </a>
      </div>
    </>
  );
};

/* ─── Hero ─── */
const MainframeHero = ({ showNav = false }: { showNav?: boolean }) => {
  const { videoRef, sectionRef } = useFaceTracking();
  const { displayed, done } = useTypewriter(TYPED_TEXT);
  const [pillsIn, setPillsIn] = useState(false);

  /* The pills land on their own clock — they don't wait on the typing. */
  useEffect(() => {
    const t = setTimeout(() => setPillsIn(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      ref={sectionRef}
      data-hero
      className="relative h-screen bg-white"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* The hero lives inside the same 1080 column the page rules are drawn
          at — the footage stops at the lines, and the margins stay page white. */}
      <div className="relative h-full w-full max-w-[1080px] mx-auto overflow-hidden border-l border-r border-border">
      {/* Absolute, not fixed — the clip belongs to this section alone and must
          not sit behind the rest of the page. */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 z-0 w-full h-full"
        style={{ objectFit: "cover", objectPosition: "62% center" }}
      />

      {showNav && <Navbar />}

      <section className="relative z-[2] h-full flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden">
        <div className="relative z-10 max-w-xl">
          {/* Blurred intro label — clears word by word under the cursor */}
          <BlurRevealText
            className="mb-5 sm:mb-6"
            lines={[
              "99+ brands, 6 markets, one obsession: your growth.",
              "Real people, real revenue, relationships that outlast the campaign.",
            ]}
          />

          {/* Typewriter */}
          <p
            className="text-black mb-5 sm:mb-6"
            style={{
              fontSize: "clamp(18px, 4vw, 26px)",
              lineHeight: 1.35,
              fontWeight: 400,
              minHeight: "54px",
            }}
          >
            {displayed}
            {!done && (
              <span
                className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px]"
                style={{ animation: "blink 1s step-end infinite" }}
              />
            )}
          </p>

          {/* Action pills */}
          <div
            className="flex flex-wrap gap-y-1"
            style={{
              opacity: pillsIn ? 1 : 0,
              transform: pillsIn ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {SERVICE_PILLS.map(
              (label) => (
                <button
                  key={label}
                  type="button"
                  className={`${PILL_BASE} bg-white text-black border border-black/10 hover:bg-black hover:text-white`}
                >
                  {label}
                </button>
              )
            )}

          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default MainframeHero;
