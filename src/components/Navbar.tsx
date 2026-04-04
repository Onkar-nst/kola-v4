import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import avatarImg from "@/assets/avatar.jpg";

const navLinks = ["Work", "Services", "Pricing", "Blog"];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`flex items-center rounded-full border border-border bg-card/80 backdrop-blur-xl px-4 py-2.5 shadow-sm transition-all duration-300 ${
          scrolled ? "gap-2" : "gap-8"
        }`}
      >
        <a href="#" className="flex items-center gap-2.5 font-semibold text-foreground text-sm whitespace-nowrap">
          <img src={avatarImg} alt="Kola Communications" className="w-8 h-8 rounded-full object-cover" width={32} height={32} />
          <span className={`transition-all duration-300 overflow-hidden ${scrolled ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"}`}>
            Kola Communications
          </span>
        </a>

        <div className={`hidden md:flex items-center transition-all duration-300 ${scrolled ? "gap-0 max-w-0 overflow-hidden opacity-0" : "gap-6 max-w-[500px] opacity-100"}`}>
          {navLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
              {link}
            </a>
          ))}
        </div>

        <a href="#contact" className={`hidden md:inline-flex items-center rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:opacity-90 transition-all duration-300 whitespace-nowrap ${scrolled ? "max-w-0 overflow-hidden opacity-0 px-0" : "max-w-[200px] opacity-100"}`}>
          Contact
        </a>

        {/* Collapsed dots indicator */}
        <div className={`hidden md:flex items-center gap-1 transition-all duration-300 ${scrolled ? "opacity-100" : "opacity-0 max-w-0 overflow-hidden"}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
          <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-1">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden mt-2 rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-4 shadow-lg">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                {link}
              </a>
            ))}
            <a href="#contact" onClick={() => setMobileOpen(false)} className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium">
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
