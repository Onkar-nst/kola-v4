import {
  Twitter,
  Instagram,
  Dribbble,
  Linkedin,
} from "lucide-react";

/* 🔥 SOCIAL LINKS */
const socials = [
  {
    icon: Instagram,
    href: "https://www.instagram.com/p/DG5c5GTPtgh/",
  },
  {
    icon: Linkedin,
    href: "https://in.linkedin.com/company/kolacommunications",
  },

];

const CTAFooter = () => {
  return (
    <footer
      id="contact"
      className="bg-black text-white pt-24 pb-16 mt-16 relative overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-6">

        {/* ================= HERO TEXT ================= */}
        <h2 className="text-[clamp(2.8rem,6vw,5rem)] leading-[1.05] tracking-[-0.03em] font-semibold mb-20">
          <span className="text-white">Lets create</span>
          <br />
          <span className="text-white/40">
            incredible work together.
          </span>
        </h2>

        {/* ================= TOP GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-14">

          {/* EMAIL */}
          <div>
            <p className="text-sm text-white/60 mb-2">Email</p>
            <a
              href="mailto:business@kolacommunications.com"
              className="text-lg font-medium hover:opacity-70 transition"
            >
              business@kolacommunications.com
            </a>
          </div>

          {/* CALL */}
          <div>
            <p className="text-sm text-white/60 mb-2">Call Us</p>
            <a
              href="tel:+918108969630"
              className="text-lg font-medium hover:opacity-70 transition"
            >
              +91-8108969630
            </a>
          </div>

          {/* SOCIAL */}
          <div>
            <p className="text-sm text-white/60 mb-3">Social</p>

            <div className="flex items-center gap-2">

              {/* followers pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-black text-xs font-medium">
                Kola <span className="opacity-70">Agency</span>
              </div>

              {socials.map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-9 h-9 rounded-full
                    bg-white/10
                    flex items-center justify-center
                    hover:bg-white hover:text-black
                    transition-all duration-300
                  "
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ================= DIVIDER ================= */}
        <div className="border-t border-white/10 pt-10">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

            {/* MENU */}
            <div>
              <p className="text-xs text-white/60 uppercase tracking-widest mb-4">
                Menu
              </p>

              <div className="flex gap-12">
                <div className="flex flex-col gap-3">
                  <a href="#work" className="hover:opacity-70">
                    Work
                  </a>
                  <a href="#pricing" className="hover:opacity-70">
                    Pricing
                  </a>
                </div>

                <div className="flex flex-col gap-3">
                  <a href="#services" className="hover:opacity-70">
                    Services
                  </a>
                  <a href="#blog" className="hover:opacity-70">
                    Blog
                  </a>
                </div>
              </div>
            </div>

            {/* LEGAL */}
            <div>
              <p className="text-xs text-white/60 uppercase tracking-widest mb-4">
                Legal
              </p>

              <div className="flex flex-col gap-3">
                <a href="#" className="hover:opacity-70">
                  Terms of service
                </a>
                <a href="#" className="hover:opacity-70">
                  Privacy Policy
                </a>
              </div>
            </div>

            {/* CONTACT + ADDRESS */}
            <div className="flex flex-col md:items-end gap-2 text-sm text-white/80">
              <p>© 2026 Kola Communications</p>
              <p className="max-w-[260px] text-right">
                C42, Modi Nagar CHS, Opposite Wanjawadi,
                Kandivali West, Mumbai - 400067
              </p>
            </div>
          </div>
        </div>

        {/* ================= HUGE TEXT ================= */}
        <div className="mt-20 relative">

          <p
            className="
              text-[clamp(5rem,18vw,14rem)]
              font-black
              tracking-[-0.04em]
              text-white/10
              leading-none
              whitespace-nowrap
              select-none
            "
          >
            KOLA
          </p>

          {/* blur glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

      </div>
    </footer>
  );
};

export default CTAFooter;