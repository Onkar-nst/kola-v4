export interface Project {
  slug: string;
  title: string;
  client: string;
  tags: string[];
  tech: string;
  img: string;
  hoverImg: string;
  liveUrl: string;
  requirement: string;
  approach: string;
}

export const projects: Project[] = [
  {
    slug: "laser-technologies",
    title: "Laser Technologies",
    client: "Laser Technologies",
    tags: ["WordPress", "SEO", "Web Design"],
    tech: "WordPress",
    img: "https://images.unsplash.com/photo-1581093804475-577d72e35330?w=800&q=80",
    hoverImg: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    liveUrl: "#",
    requirement:
      "Laser Technologies required a professional and high-performing website to showcase their extensive range of laser cutting, engraving, welding, and marking machines. The goal was to establish credibility in a technically demanding industry while making it easy for potential buyers across India to explore products and get in touch.",
    approach:
      "We developed a clean, structured WordPress website tailored to their industrial audience. Product categories were clearly organised with detailed specifications and high-quality imagery to support informed purchasing decisions. SEO optimization ensured strong visibility for key search terms in the laser machinery space, while a responsive design and optimized performance delivered a seamless experience across all devices.",
  },
  {
    slug: "roy-infra",
    title: "Roy Infra & Developers",
    client: "Roy Infra & Developers",
    tags: ["WordPress", "Branding", "Web Design"],
    tech: "WordPress",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    hoverImg: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
    liveUrl: "#",
    requirement:
      "Roy Infra & Developers required a professional digital presence to represent their construction and civil engineering business based in Mumbai. The website needed to highlight their core capabilities including building construction, heritage restoration, interior design, and exterior design while building credibility with prospective clients.",
    approach:
      "We built a modern, responsive WordPress website with a structured layout that clearly presented their services and completed projects. The design balanced professionalism with approachability, reinforcing trust with visitors. A clean navigation structure ensured easy access to service information, while consistent branding throughout the site strengthened their identity in the competitive Mumbai construction market.",
  },
  {
    slug: "miva-robotics",
    title: "MIVA Robotics",
    client: "MIVA Robotics",
    tags: ["WordPress", "UI/UX", "Web Design"],
    tech: "WordPress",
    img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
    hoverImg: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    liveUrl: "#",
    requirement:
      "MIVA Robotics required a sophisticated website to represent their AI-powered robotics and industrial automation solutions. The platform needed to communicate complex technical capabilities including their product range, subscription-based service model, and industry applications in a clear and compelling way for both technical and non-technical audiences.",
    approach:
      "We designed and developed a custom WordPress website with a bold, modern aesthetic that matched the cutting-edge nature of MIVA's products. Dedicated sections for their product lineup, industry focus areas, and service models were structured to guide visitors through their offerings intuitively. Strong visual hierarchy, performance optimization, and SEO-friendly architecture ensured the site was as smart as the technology it represented.",
  },
  {
    slug: "clayton-holidays",
    title: "Clayton Holidays",
    client: "Clayton Holidays",
    tags: ["WordPress", "Luxury", "Landing Page"],
    tech: "WordPress",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    hoverImg: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    liveUrl: "#",
    requirement:
      "Clayton Holidays required a visually immersive website to promote their luxury private villa perched above the Western Ghats in Lonavala. The objective was to capture the exclusivity of the property, highlight premium amenities, and drive direct booking inquiries through an elegant and high-converting digital presence.",
    approach:
      "We developed a WordPress website with a rich, visual-first design that brought the villa's stunning surroundings to life on screen. High-resolution imagery, immersive layouts, and carefully crafted copy conveyed the property's premium appeal and architectural character. Key amenities were showcased in a clean, scannable format, while clear calls-to-action including WhatsApp and direct call integrations made it effortless for visitors to book their stay.",
  },
];