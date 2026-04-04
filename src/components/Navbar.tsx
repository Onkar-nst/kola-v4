import { useState } from "react";
import { Menu, X } from "lucide-react";
import avatarImg from "@/assets/avatar.jpg";

const navLinks = ["Work", "Services", "Pricing", "Blog"];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-8 rounded-full border border-border bg-card/80 backdrop-blur-xl px-4 py-2.5 shadow-sm">
        <a href="#" className="flex items-center gap-2.5 font-semibold text-foreground text-sm">
          <img src={avatarImg} alt="Joseph Alexander" className="w-8 h-8 rounded-full object-cover" width={32} height={32} />
          Joseph Alexander
        </a>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {link}
            </a>
          ))}
        </div>

        <a href="#contact" className="hidden md:inline-flex items-center rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
          Contact
        </a>

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
