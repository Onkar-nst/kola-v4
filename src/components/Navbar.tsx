import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import avatarImg from "@/assets/avatar.jpg";

const navLinks = ["Work", "Services", "Pricing","Project", "Blog"];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll && current > 60) {
        setCompact(true);
      } else {
        setCompact(false);
      }
      setLastScroll(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[calc(100%-48px)] md:w-auto">

      {/* ================= MAIN BAR ================= */}
      <motion.div
        initial={false}
        animate={{
          padding: compact ? "6px 10px" : "10px 18px",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="
          flex items-center justify-between md:justify-start gap-6
          backdrop-blur-2xl
          bg-white/20
          border border-black/8
          shadow-[0_4px_24px_rgba(0,0,0,0.06)]
          rounded-full
          relative
        "
      >
        {/* ===== LOGO ===== */}
        <a className="flex items-center gap-2.5 text-sm font-medium whitespace-nowrap relative z-10">
          <img src={avatarImg} className="w-8 h-8 rounded-full flex-shrink-0" />
          <motion.span
            animate={{ opacity: compact ? 0 : 1, width: compact ? 0 : "auto" }}
            className="overflow-hidden text-black font-semibold"
          >
            Kola Communications
          </motion.span>
        </a>

        {/* ===== DESKTOP LINKS ===== */}
        <motion.div
          animate={{ opacity: compact ? 0 : 1, width: compact ? 0 : "auto" }}
          className="hidden md:flex items-center gap-7 overflow-hidden"
        >
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm text-black/80 hover:text-black transition-colors"
            >
              {link}
            </a>
          ))}
        </motion.div>

        {/* ===== CONTACT BUTTON (desktop) ===== */}
        <motion.a
          href="#contact"
          animate={{ opacity: compact ? 0 : 1, width: compact ? 0 : "auto" }}
          className="hidden  -mr-14 md:inline-flex items-center rounded-full bg-black text-white px-5 py-2 text-sm font-medium overflow-hidden whitespace-nowrap"
        >
          Contact
        </motion.a>

        {/* ===== COMPACT DOTS ===== */}
        <motion.div
          animate={{ opacity: compact ? 1 : 0 }}
          className="hidden md:flex items-center gap-1"
          style={{ pointerEvents: compact ? "auto" : "none" }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
              className="w-1.5 h-1.5 rounded-full bg-black"
            />
          ))}
        </motion.div>

        {/* ===== MOBILE HAMBURGER ===== */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-1 text-black"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.div>

      {/* ================= MOBILE DROPDOWN ================= */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel — matches Image 4: white card, avatar+name header, links, contact */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="
                md:hidden
                absolute left-0 right-0 mt-2
                bg-white
                border border-black/8
                shadow-[0_8px_32px_rgba(0,0,0,0.10)]
                rounded-2xl
                overflow-hidden
                z-50
              "
            >
              {/* Header row: avatar + name + close */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-black/6">
                <div className="flex items-center gap-3">
                  <img src={avatarImg} className="w-9 h-9 rounded-full" />
                  <span className="text-sm font-semibold text-black">Kola Communications</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 text-black/50 hover:text-black transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex flex-col px-5 py-3">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="py-3 text-[15px] text-black/70 hover:text-black transition-colors border-b border-black/5 last:border-0"
                  >
                    {link}
                  </motion.a>
                ))}
              </div>

              {/* Contact button */}
              <div className="px-5 pb-5 pt-1">
                <motion.a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  className="flex items-center justify-center rounded-full bg-black text-white py-3 text-sm font-medium w-full"
                >
                  Contact
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </nav>
  );
};

export default Navbar;