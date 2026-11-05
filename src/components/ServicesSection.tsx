import { motion } from "framer-motion";
import { memo } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  Search,
  Bot,
  Smartphone,
  Target,
  Magnet,
  Megaphone,
  PenLine,
  Palette,
  ArrowUpRight,
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

/* Order matters: the four core services come first. Copy is visible on the
   page (not hidden in an accordion) so search engines and AI tools read it. */
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
    <div className="w-9 h-9 sm:w-10 sm:h-10 border border-black/10 bg-white flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-0.5">
      <Icon size={17} className="text-black/70 group-hover:text-black transition-colors" />
    </div>
    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[11px] font-medium bg-black text-white whitespace-nowrap opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 ease-out z-20">
      {name}
    </div>
  </div>
));

/* ---------------- SERVICE CARD ---------------- */
const ServiceCard = memo(({ service, index }: { service: Service; index: number }) => {
  const Icon = service.icon;
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="bg-background"
    >
      <Link
        to={service.href}
        className="group flex h-full flex-col p-6 md:p-7 lg:p-8 transition-colors hover:bg-black/[0.025]"
      >
        <div className="flex items-start justify-between mb-6 md:mb-8">
          <span className="w-11 h-11 flex items-center justify-center bg-foreground text-background shrink-0">
            <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <ArrowUpRight
            size={18}
            aria-hidden="true"
            className="text-black/25 transition-all duration-300 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
        <h3 className="text-[17px] md:text-lg font-semibold tracking-[-0.01em] mb-2.5">
          {service.title}
        </h3>
        <p className="text-[14px] md:text-[14.5px] leading-[1.65] text-muted-foreground">
          {service.desc}
        </p>
      </Link>
    </motion.li>
  );
});

/* ---------------- COMPONENT ---------------- */

const ServicesSection = () => (
  <section id="services" className="py-12 md:py-16 lg:py-20 content-visibility-auto">
    <div className="section-container w-full px-6 md:px-8 lg:px-10">
      {/* HEADER */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-16 items-end mb-10 md:mb-14">
        <h2 className="text-[clamp(2rem,3.5vw,3.2rem)] leading-[1.05] tracking-[-0.02em]">
          <span className="text-muted-foreground font-medium">Services that </span>
          <span className="text-foreground font-semibold">supercharge your business.</span>
        </h2>
        <p className="text-base md:text-lg text-muted-foreground leading-[1.6] max-w-[560px]">
          A full-service digital agency in Mumbai. We build websites, mobile apps and AI
          automation, and grow brands with SEO, AEO and performance marketing, for businesses
          across India and worldwide.
        </p>
      </div>

      {/* SERVICES GRID — 1px gaps over a border-coloured background draw hairline dividers */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
        {services.map((service, i) => (
          <ServiceCard key={service.title} service={service} index={i} />
        ))}
      </ul>

      {/* TECH STACK */}
      <div className="mt-10 md:mt-14 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground shrink-0">
          Tools &amp; platforms we work with
        </p>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <TechIcon key={tech.name} icon={tech.icon} name={tech.name} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default memo(ServicesSection);
