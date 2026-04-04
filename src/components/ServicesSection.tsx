import {
  Rocket,
  Diamond,
  Monitor,
  Layout,
  Wand2,
  Box,
  MessageSquare,
} from "lucide-react";

const services = [
  { icon: Rocket, label: "Framer Development" },
  { icon: Diamond, label: "Brand Design" },
  { icon: Monitor, label: "Web Apps" },
  { icon: Layout, label: "Landing Pages" },
  { icon: Wand2, label: "Motion Graphics" },
  { icon: Box, label: "3D Design" },
  { icon: MessageSquare, label: "UX / UI Consultation" },
];

const techStack = [
  "Figma",
  "Framer",
  "Webflow",
  "Rive",
  "Blender",
  "Trello",
  "ChatGPT",
  "Claude",
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 md:py-28 section-container p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

        {/* LEFT */}
        <div>
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
            <span className="text-muted-foreground font-medium">
              Services that
            </span>
            <br />
            <span className="text-foreground font-semibold">
              supercharge your business.
            </span>
          </h2>

          {/* TECH STACK */}
          <div className="mt-12">
            <p className="text-sm text-muted-foreground mb-5">
              My tech stack
            </p>

            <div className="flex flex-wrap gap-3">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-xl border border-border bg-muted/40 text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-6">

          {services.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-5 group cursor-pointer"
            >
              {/* ICON */}
              <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shadow-md">
                <Icon size={18} strokeWidth={2} />
              </div>

              {/* TEXT */}
              <span className="text-lg md:text-xl font-medium text-foreground tracking-tight">
                {label}
              </span>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default ServicesSection;