import avatarImg from "@/assets/avatar.jpg";

const logos = ["CoreOS", "Luminary", "45 Degrees°", "Coolfire", "Nexus", "Vertex"];

const ClientLogos = () => {
  return (
    <section className="py-10 border-t border-border overflow-hidden">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex -space-x-2">
              {[1,2,3,4,5].map((i) => (
                <img key={i} src={avatarImg} alt="Client" className="w-8 h-8 rounded-full border-2 border-background object-cover" width={32} height={32} loading="lazy" style={{filter: `hue-rotate(${i * 60}deg)`}} />
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex gap-0.5 text-foreground">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
              </div>
              <span className="text-xs text-muted-foreground font-medium">99+ Happy clients</span>
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden w-full">
            <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
              {[...logos, ...logos].map((logo, i) => (
                <span key={i} className="text-lg md:text-xl font-bold text-muted-foreground/60 shrink-0">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
