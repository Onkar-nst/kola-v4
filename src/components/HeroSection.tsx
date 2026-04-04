import avatarImg from "@/assets/avatar.jpg";
import heroMockups from "@/assets/hero-mockups.jpg";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-12 md:pb-20 section-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 w-fit text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-green-accent" />
            Available for August'25
          </div>

          <h1 className="heading-xl">
            <span className="text-text-tertiary">Design that</span>
            <br />
            delivers results.
          </h1>

          <p className="body-lg max-w-md">
            <span className="font-semibold">Strategic design that drives growth, not just looks good.</span>{" "}
            <span className="text-muted-foreground">I create everything your brand needs to attract customers and turn them into sales.</span>
          </p>

          <a href="#contact" className="inline-flex items-center gap-3 rounded-full bg-primary text-primary-foreground pl-2 pr-6 py-2 w-fit text-sm font-medium hover:opacity-90 transition-opacity group">
            <img src={avatarImg} alt="Kola Communications" className="w-9 h-9 rounded-full object-cover border-2 border-foreground/20" width={36} height={36} />
            Book a call with me
          </a>
        </div>

        <div className="relative">
          <img src={heroMockups} alt="Portfolio showcase with multiple device mockups" className="w-full h-auto rounded-2xl" width={1280} height={960} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
