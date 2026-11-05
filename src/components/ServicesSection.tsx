import { motion } from "framer-motion";
import { useState, memo, useCallback } from "react";
import {
  Plus,
  Globe,
  Search,
  Bot,
  Smartphone,
  Target,
  Magnet,
  Megaphone,
  PenLine,
  Palette,
  type LucideIcon,
} from "lucide-react";

/* ---------------- DATA ---------------- */

import {
  SiWordpress,
  SiShopify,
  SiWebflow,
  SiFramer,
  SiWoocommerce,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiNodedotjs,
  SiPostgresql,
  SiSupabase,
  SiVercel,
  SiGithub,
  SiCloudflare,
  SiFigma,
  SiCanva,
  SiGoogleanalytics,
  SiGoogleads,
  SiGoogletagmanager,
  SiGooglesearchconsole,
  SiSemrush,
  SiHubspot,
  SiMeta,
  SiZapier,
  SiPython,
} from "react-icons/si";

const techStack = [
  { icon: SiWordpress, name: "WordPress" },
  { icon: SiShopify, name: "Shopify" },
  { icon: SiWebflow, name: "Webflow" },
  { icon: SiFramer, name: "Framer" },
  { icon: SiWoocommerce, name: "WooCommerce" },
  { icon: SiReact, name: "React" },
  { icon: SiNextdotjs, name: "Next.js" },
  { icon: SiTypescript, name: "TypeScript" },
  { icon: SiJavascript, name: "JavaScript" },
  { icon: SiTailwindcss, name: "Tailwind" },
  { icon: SiNodedotjs, name: "Node.js" },
  { icon: SiPostgresql, name: "PostgreSQL" },
  { icon: SiSupabase, name: "Supabase" },
  { icon: SiVercel, name: "Vercel" },
  { icon: SiGithub, name: "GitHub" },
  { icon: SiCloudflare, name: "Cloudflare" },
  { icon: SiFigma, name: "Figma" },
  { icon: SiCanva, name: "Canva" },
  { icon: SiGoogleanalytics, name: "Analytics" },
  { icon: SiGoogleads, name: "Google Ads" },
  { icon: SiGoogletagmanager, name: "Tag Manager" },
  { icon: SiGooglesearchconsole, name: "Search Console" },
  { icon: SiSemrush, name: "Semrush" },
  { icon: SiHubspot, name: "HubSpot" },
  { icon: SiMeta, name: "Meta Ads" },
  { icon: SiZapier, name: "Zapier" },
  { icon: SiPython, name: "Python" },
];

type Service = {
  icon: LucideIcon;
  title: string;
  desc: string;
  href: string;
};

/* Order matters: the four core services come first. Descriptions stay in the
   page even when collapsed, so search engines and AI tools can read them. */
const services: Service[] = [
  {
    icon: Globe,
    title: "Website Development",
    desc: "Custom-coded, WordPress and Shopify websites built to load fast, rank on Google and turn visitors into enquiries. Every site is mobile-first, SEO-ready and designed around your business goals, not a template.",
    href: "/services#web-dev",
  },
  {
    icon: Search,
    title: "SEO, AEO & GEO",
    desc: "Get found on Google and recommended by AI tools like ChatGPT, Gemini and Perplexity. We combine technical SEO, answer engine optimisation (AEO) and generative engine optimisation (GEO) to keep your visibility growing.",
    href: "/services#seo-aeo",
  },
  {
    icon: Bot,
    title: "AI Automation",
    desc: "Put repetitive work on autopilot. We build AI agents, chatbots and automated workflows that connect your CRM, email, WhatsApp and internal tools, saving hours every week and replying to leads in seconds.",
    href: "/services#ai-tools",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    desc: "iOS and Android apps built for real users, from MVP to full launch. We design, develop and publish fast, intuitive apps, with the backend, analytics and App Store support you need to grow after go-live.",
    href: "/services",
  },
  {
    icon: Target,
    title: "Performance Marketing",
    desc: "ROI-focused Google Ads, Meta Ads and LinkedIn campaigns built around measurable results. We handle targeting, creative and conversion tracking, then optimise budgets every week so your cost per lead keeps falling.",
    href: "/services#performance-marketing",
  },
  {
    icon: Magnet,
    title: "Lead Generation & Conversion",
    desc: "Turn traffic into qualified leads. We build high-converting landing pages, forms and follow-up funnels, then test every step so more visitors become enquiries and more enquiries become paying customers.",
    href: "/services#lead-gen",
  },
  {
    icon: Megaphone,
    title: "Social Media Marketing",
    desc: "Instagram, LinkedIn and Facebook managed as a growth channel. Strategy, content calendars, reels and community management work together to build an audience that knows, trusts and buys from your brand.",
    href: "/services#social-media",
  },
  {
    icon: PenLine,
    title: "Content Creation & Strategy",
    desc: "SEO blog posts, website copy and campaign content planned around what your customers actually search for. Every piece is written to rank, answer real questions and move readers closer to contacting you.",
    href: "/services#content-strategy",
  },
  {
    icon: Palette,
    title: "Brand Identity & Design",
    desc: "Logos, colour systems, typography and brand guidelines that make your business instantly recognisable. We create visual identities that look credible and consistent across your website, social media and print.",
    href: "/services#brand-identity",
  },
];

/* ---------------- TECH ICON ITEM ---------------- */
const TechIcon = memo(({ icon: Icon, name }: { icon: typeof SiWordpress; name: string }) => (
  <div className="relative group">
    <div
      className="w-9 h-9 sm:w-10 sm:h-10 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-xl border border-black/10 bg-white flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-transform duration-200 group-hover:scale-105 group-hover:-translate-y-0.5"
    >
      <Icon size={18} className="text-black/80 group-hover:text-black transition-colors md:scale-105 lg:scale-100" />
    </div>

    {/* TOOLTIP */}
    <div
      className="
        pointer-events-none
        absolute bottom-full left-1/2 -translate-x-1/2 mb-2
        px-2.5 py-1
        text-[11px] font-medium
        rounded-md
        bg-black text-white
        whitespace-nowrap
        opacity-0 scale-95
        group-hover:opacity-100 group-hover:scale-100
        transition-all duration-150 ease-out z-20
      "
    >
      {name}
    </div>
  </div>
));

/* ---------------- SERVICE ROW ---------------- */
interface ServiceRowProps {
  service: Service;
  isOpen: boolean;
  onToggle: () => void;
}

const ServiceRow = memo(({ service, isOpen, onToggle }: ServiceRowProps) => (
  <div>
    {/* ROW */}
    <div
      onClick={onToggle}
      className="flex items-center justify-between group cursor-pointer select-none py-1 md:py-1.5 lg:py-1"
    >
      {/* LEFT CONTENT */}
      <div className="flex items-center gap-3.5 md:gap-4">
        {/* ICON */}
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center bg-black text-white shadow-md lg:shadow-lg shrink-0"
        >
          <service.icon
            aria-hidden="true"
            strokeWidth={1.6}
            className="w-4 h-4 md:w-[18px] md:h-[18px] lg:w-5 lg:h-5"
          />
        </div>

        {/* TEXT */}
        <h3 className="text-[15px] sm:text-base md:text-[16.5px] lg:text-lg font-medium group-hover:text-black/75 transition-colors">
          {service.title}
        </h3>
      </div>

      {/* PLUS BUTTON */}
      <motion.button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        whileTap={{ scale: 0.9 }}
        className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-black/15 flex items-center justify-center hover:bg-black/[0.05] transition-colors shrink-0"
        aria-label={`Toggle ${service.title}`}
        aria-expanded={isOpen}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <Plus size={15} />
        </motion.div>
      </motion.button>
    </div>

    {/* EXPAND TEXT — always rendered (collapsed to 0 height) so it stays crawlable */}
    <motion.div
      initial={false}
      animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0, marginTop: isOpen ? 8 : 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden pl-12 md:pl-[54px] lg:pl-[60px] pr-2 lg:pr-4 text-sm md:text-[14.5px] lg:text-base text-muted-foreground"
    >
      <p className="pb-2 leading-[1.6] lg:leading-normal">{service.desc}</p>
    </motion.div>
  </div>
));

/* ---------------- COMPONENT ---------------- */

const ServicesSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = useCallback((i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  }, []);

  return (
    <section id="services" className="min-h-0 lg:min-h-[90vh] flex items-center py-10 md:py-14 lg:py-12 content-visibility-auto">
      <div className="section-container w-full px-6 md:px-8 lg:p-10">
        <div className="grid grid-cols-1 md:grid-cols-[0.95fr_1.05fr] lg:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-10 lg:gap-16 items-start lg:items-center">
          {/* ================= LEFT COLUMN (Sticky) ================= */}
          <div className="md:sticky md:top-28 lg:top-32 space-y-6 md:space-y-8">
            <h2 className="text-[clamp(2rem,3.5vw,3.2rem)] lg:text-[clamp(2.2rem,4vw,3.2rem)] leading-[1.05] tracking-[-0.02em] mb-6 md:mb-8 lg:mb-16">
              <span className="text-muted-foreground font-medium">Services that </span>
              <span className="text-foreground font-semibold">supercharge your business.</span>
            </h2>

            {/* TECH STACK */}
            <motion.div
              className="flex flex-wrap gap-2 sm:gap-2.5 md:gap-2.5 lg:gap-3 mt-6 md:mt-8 lg:mt-10"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {techStack.map((tech) => (
                <TechIcon key={tech.name} icon={tech.icon} name={tech.name} />
              ))}
            </motion.div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="flex flex-col gap-4 md:gap-5 lg:gap-6">
            {services.map((service, i) => (
              <ServiceRow
                key={service.title}
                service={service}
                isOpen={openIndex === i}
                onToggle={() => handleToggle(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(ServicesSection);

