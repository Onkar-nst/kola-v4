import { Rocket, Diamond, Monitor, Layout, Wand2, Box, MessageSquare } from "lucide-react";

const services = [
  { icon: Rocket, label: "Framer Development" },
  { icon: Diamond, label: "Brand Design" },
  { icon: Monitor, label: "Web Apps" },
  { icon: Layout, label: "Landing Pages" },
  { icon: Wand2, label: "Motion Graphics" },
  { icon: Box, label: "3D Design" },
  { icon: MessageSquare, label: "UX / UI Consultation" },
];

const techStack = ["Figma", "Framer", "Webflow", "Rive", "Blender", "Trello", "ChatGPT", "Claude"];

const ServicesSection = () => {
  return (
    <section id="services" className="py-16 md:py-24 section-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <h2 className="heading-lg">
            <span className="text-text-tertiary">Services that</span>
            <br />
            supercharge your business.
          </h2>

          <div className="mt-10">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">My tech stack</p>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span key={tech} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {services.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-4 py-4 px-2 rounded-xl hover:bg-secondary/50 transition-colors group cursor-pointer">
              <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                <Icon size={20} />
              </div>
              <span className="text-lg font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
