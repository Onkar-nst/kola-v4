import avatarImg from "@/assets/avatar.jpg";

const testimonials = [
  { quote: "The new UI design cut our customer support tickets in half. It's been a game-changer for us.", name: "Martina Martinez", title: "Customer Manager at SupportEase" },
  { quote: "Working with Joseph felt like having a seasoned design partner who truly understood our vision.", name: "Thomas Weber", title: "Co-founder of KYMA" },
  { quote: "Our website conversion rate improved significantly thanks to Joseph's expertise.", name: "Ben Harper", title: "CTO of Nexus" },
  { quote: "Joseph's design approach brought clarity to our complex data visualizations. Our users are thrilled!", name: "Michael Wong", title: "Data Scientist at DataSphere" },
  { quote: "The rebranding exceeded our expectations. It's given us a competitive edge in our industry.", name: "Natalie Rivera", title: "Brand Manager at UnityBrands" },
  { quote: "The redesign transformed our brand image. We've seen a 30% increase in engagement since launch.", name: "Emma Kraft", title: "CMO of TechVista" },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24 section-container p-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">Trusted by many</p>
          <h2 className="heading-lg">
            <span className="text-text-tertiary">Hear from what my</span>{" "}
            clients have to say.
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-bold">99+ Happy clients</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t, i) => (
          <div key={i} className="card-surface p-6 flex flex-col gap-4">
            <p className="text-sm text-foreground leading-relaxed">"{t.quote}"</p>
            <div className="flex items-center gap-3 mt-auto">
              <img src={avatarImg} alt={t.name} className="w-9 h-9 rounded-full object-cover" loading="lazy" width={36} height={36} style={{filter: `hue-rotate(${i * 50}deg) saturate(0.7)`}} />
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
