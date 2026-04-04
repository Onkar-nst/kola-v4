import avatarImg from "@/assets/avatar.jpg";

const TestimonialBanner = () => {
  return (
    <section className="py-16 md:py-24 border-border border-b border-t">
    <div className=" section-container px-10">
      <blockquote className="text-center max-w-3xl mx-auto">
        <p className="text-xl md:text-2xl lg:text-3xl leading-snug font-medium text-foreground">
          "Working with Joseph felt like having a seasoned design partner who truly understood our vision for KYMA and brought it to life in ways we hadn't even imagined."
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <img src={avatarImg} alt="Thomas Weber" className="w-10 h-10 rounded-full object-cover" width={40} height={40} loading="lazy" style={{filter: 'hue-rotate(120deg)'}} />
          <div className="text-left">
            <p className="text-sm font-semibold">Thomas Weber</p>
            <p className="text-xs text-muted-foreground">Co-founder of KYMA</p>
          </div>
        </div>
      </blockquote>
      </div>
    </section>
  );
};

export default TestimonialBanner;
