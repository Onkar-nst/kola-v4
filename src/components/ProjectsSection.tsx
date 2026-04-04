import { ArrowUpRight } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const projects = [
  { title: "Kora Consulting Site", tags: ["Web Design", "Framer Dev"], img: project1 },
  { title: "KYMA AI Agency", tags: ["Branding", "Web Design"], img: project2 },
  { title: "Mugen Design Studio", tags: ["Web Design", "UX/UI"], img: project3 },
  { title: "Axiom Ecommerce Site", tags: ["Ecommerce", "Framer Dev"], img: project4 },
];

const ProjectsSection = () => {
  return (
    <section id="work" className="py-16 md:py-24 section-container">
      <div className="flex items-end justify-between mb-10">
        <h2 className="heading-lg">Latest Projects</h2>
        <a href="#" className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          View all my projects <ArrowUpRight size={16} />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <a key={project.title} href="#" className="group block card-surface overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-[3/2] overflow-hidden">
              <img src={project.img} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={600} height={400} />
            </div>
            <div className="p-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{project.title}</h3>
                <div className="flex gap-2 mt-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs text-muted-foreground bg-secondary rounded-full px-2.5 py-0.5">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="w-9 h-9 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <ArrowUpRight size={16} />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
