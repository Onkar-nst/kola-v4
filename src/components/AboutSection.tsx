import { useState } from "react";
import { Twitter, Dribbble, Linkedin } from "lucide-react";
import aboutPhoto from "@/assets/about-photo.jpg";

const workHistory = [
  { company: "KYMA", role: "Full-Stack Designer", years: "2012–2024" },
  { company: "Mugen", role: "Staff Product Designer", years: "2020–2022" },
  { company: "Axiom", role: "Designer", years: "2016–2020" },
];

const AboutSection = () => {
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="py-16 md:py-24 section-container">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 items-start">
        <div className="flex flex-col gap-4">
          <img src={aboutPhoto} alt="Joseph Alexander" className="w-full rounded-2xl object-cover aspect-[4/5]" loading="lazy" width={320} height={400} />
          <div>
            <p className="font-bold text-lg">Joseph Alexander</p>
            <p className="text-sm text-muted-foreground">Full-stack Designer</p>
          </div>
          <div className="flex gap-2">
            {[Twitter, Dribbble, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-80 transition-opacity">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="heading-lg mb-8">
            <span className="text-text-tertiary">Designing experiences that</span>{" "}
            solve real problems.
          </h2>

          <div className="space-y-4 body-md text-muted-foreground max-w-2xl">
            <p>I love turning ideas into something real through design. What started as a hobby turned into a career when I discovered how design can make things both look great and work better.</p>
            <p>I focus on creating user interfaces that serve a real purpose – making sure they're not just pretty, but actually solve problems. Whether I'm working on a mobile app or a website, my goal is to make something that feels natural and easy to use.</p>
            <p>I'm a bit of a perfectionist when it comes to the small stuff, but I think that's what makes good design great.</p>
          </div>

          <div className="mt-10">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Work History</h3>
            <div className="space-y-3">
              {(showAll ? workHistory : workHistory.slice(0, 2)).map((w) => (
                <div key={w.company} className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-semibold">{w.company}</p>
                    <p className="text-sm text-muted-foreground">{w.role}</p>
                  </div>
                  <span className="text-sm text-muted-foreground font-mono">{w.years}</span>
                </div>
              ))}
            </div>
            {!showAll && (
              <button onClick={() => setShowAll(true)} className="mt-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Show all →
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
