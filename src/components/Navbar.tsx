import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const avatarImg =
  "https://oskiqdthpejzihtjybwc.supabase.co/storage/v1/object/public/kola-website%20images/logo-2.png";
const logo = "https://kolacommunications.com/favicon.png";

const navLinks = [
  { label: "Work", to: "/#work" },
  { label: "Services", to: "/#services" },
  { label: "Pricing", to: "/#pricing" },
  { label: "Project", to: "/#project" },
  { label: "Blog", to: "/#blog" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  // 🔥 NEW STATE
  const [forceExpand, setForceExpand] = useState(false);

  // 🔥 SCROLL LOGIC (UNCHANGED BEHAVIOR)
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      // scroll down → compact + reset manual expand
      if (current > lastScroll && current > 60) {
        setCompact(true);
        setForceExpand(false); // 👈 important
      } else {
        setCompact(false);
      }

      setLastScroll(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  // 🔥 FINAL STATE USED IN UI
  const isCompact = forceExpand ? false : compact;

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[calc(100%-48px)] md:w-auto">

      <motion.div
        animate={{
          padding: isCompact ? "6px 10px" : "10px 18px",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="
          flex items-center justify-between gap-6
          backdrop-blur-2xl
          bg-white/20
          border border-black/8
          shadow-[0_4px_24px_rgba(0,0,0,0.06)]
          rounded-full
        "
      >

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5 text-sm font-medium">
          <img src={logo} className="w-8 h-8 rounded-full" />
          <img src={avatarImg} className="w-16 h-8 rounded-full" />
        </Link>

        {/* DESKTOP LINKS */}
        <motion.div
          animate={{
            opacity: isCompact ? 0 : 1,
            width: isCompact ? 0 : "auto",
          }}
          className="hidden md:flex items-center gap-7 overflow-hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm text-black/80 hover:text-black transition"
            >
              {link.label}
            </Link>
          ))}
        </motion.div>

        {/* CONTACT */}
        <motion.div
          animate={{
            opacity: isCompact ? 0 : 1,
            width: isCompact ? 0 : "auto",
          }}
          className="hidden md:inline-flex"
        >
          <Link
            to="/#contact"
            className="rounded-full -mr-14 bg-black text-white px-5 py-2 text-sm font-medium whitespace-nowrap"
          >
            Contact
          </Link>
        </motion.div>

        {/* 🔥 DESKTOP DOTS */}
        <motion.div
          animate={{ opacity: isCompact ? 1 : 0 }}
          onClick={(e) => {
            e.stopPropagation(); // 👈 important
            setForceExpand((prev) => !prev);
          }}
          className="hidden md:flex items-center gap-1 cursor-pointer"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              className="w-1.5 h-1.5 rounded-full bg-black"
            />
          ))}
        </motion.div>

        {/* MOBILE BUTTON (UNCHANGED) */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex items-center gap-1 p-2"
        >
          {mobileOpen ? (
            <X size={20} />
          ) : (
            <>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  className="w-1.5 h-1.5 rounded-full bg-black"
                />
              ))}
            </>
          )}
        </button>
      </motion.div>

      {/* MOBILE MENU (UNCHANGED) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setMobileOpen(false)}
            />

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
              <div className="flex items-center justify-between px-5 py-4 border-b border-black/6">
                <div className="flex items-center gap-3">
                  <img src={logo} className="w-9 h-9 rounded-full" />
                  <img src={avatarImg} className="w-9 h-9 rounded-full" />
                </div>
                <button onClick={() => setMobileOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col px-5 py-3">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 text-[15px] text-black/70 hover:text-black border-b border-black/5"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="px-5 pb-5 pt-1">
                <Link
                  to="/#contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-full bg-black text-white py-3 text-sm font-medium w-full"
                >
                  Contact
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;