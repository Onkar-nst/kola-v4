import avatarImg from "@/assets/avatar.jpg";

const TestimonialBanner = () => {
  return (
    <section className="py-24  border-border border-b border-t">
    <div className=" section-container px-10">
      <blockquote className="text-center max-w-3xl mx-auto">
        <p className="text-xl md:text-2xl lg:text-3xl leading-snug font-medium text-foreground">
          "Working with Kola Communications has been a game-changer for our business. Their innovative approach to content and design helped us connect more deeply with our audience."
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <img src={avatarImg} alt="Dhairya Shah" className="w-10 h-10 rounded-full object-cover" width={40} height={40} loading="lazy" style={{filter: 'hue-rotate(120deg)'}} />
          <div className="text-left">
            <p className="text-sm font-semibold">Dhairya Shah</p>
            <p className="text-xs text-muted-foreground">Content & Design</p>
          </div>
        </div>
      </blockquote>
      </div>
    </section>
  );
};

export default TestimonialBanner;
