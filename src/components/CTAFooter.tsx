import { Mail, Calendar, Twitter, Instagram, Dribbble, Linkedin } from "lucide-react";

const CTAFooter = () => {
  return (
    <footer id="contact" className="dark-surface py-16 md:py-24 mt-8">
      <div className="section-container">
        <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-[-0.03em] font-bold mb-16">
          <span className="text-text-tertiary">Lets build</span>
          <br />
          <span className="text-text-tertiary">incredible work together.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <p className="text-sm text-text-tertiary mb-2">Email</p>
            <a href="mailto:joseph@launchnow.design" className="font-semibold hover:underline">joseph@launchnow.design</a>
          </div>
          <div>
            <p className="text-sm text-text-tertiary mb-2">Call Me</p>
            <a href="#" className="font-semibold hover:underline">Book Now</a>
          </div>
          <div>
            <p className="text-sm text-text-tertiary mb-2">Social</p>
            <div className="flex gap-2">
              {[Twitter, Instagram, Dribbble, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full border border-text-tertiary/30 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-text-tertiary/20 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-xs text-text-tertiary uppercase tracking-widest mb-3">Menu</p>
              <div className="flex gap-6">
                <div className="flex flex-col gap-2">
                  <a href="#work" className="text-sm hover:underline">Work</a>
                  <a href="#pricing" className="text-sm hover:underline">Pricing</a>
                </div>
                <div className="flex flex-col gap-2">
                  <a href="#services" className="text-sm hover:underline">Services</a>
                  <a href="#blog" className="text-sm hover:underline">Blog</a>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-text-tertiary uppercase tracking-widest mb-3">Legal</p>
              <div className="flex flex-col gap-2">
                <a href="#" className="text-sm hover:underline">Terms of service</a>
                <a href="#" className="text-sm hover:underline">Privacy Policy</a>
              </div>
            </div>
            <div className="flex items-end justify-start md:justify-end">
              <p className="text-sm text-text-tertiary">© 2026 Joseph Alexander</p>
            </div>
          </div>
        </div>

        <div className="mt-16 overflow-hidden">
          <p className="text-[clamp(4rem,15vw,12rem)] font-black tracking-[-0.04em] text-text-tertiary/20 whitespace-nowrap leading-none select-none">
            JOSEPH
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CTAFooter;
