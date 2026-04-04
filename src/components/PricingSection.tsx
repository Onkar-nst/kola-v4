import { Check, RefreshCw, MessageSquare, Send, ArrowRight } from "lucide-react";
import pricingBg from "@/assets/pricing-card-bg.jpg";

const features = [
  "No contracts or commitments",
  "Pause or cancel anytime",
  "Multiple Brands",
  "Unlimited requests",
  "Avg 48 hour turnaround",
  "Framer development",
];

const singleFeatures = [
  "Clearly defined scope",
  "Fixed timeline",
  "3 revision rounds",
  "Milestone updates",
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-16 md:py-24 section-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
        <h2 className="heading-lg">
          <span className="text-text-tertiary">Simple pricing.</span>
          <br />
          Standout designs.
        </h2>
        <p className="body-lg text-muted-foreground">
          <span className="font-semibold text-foreground">Clear costs, no hidden fees.</span>{" "}
          Select from monthly subscriptions or individual project rates.
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          { icon: RefreshCw, title: "Subscribe", desc: "Subscribe via stripe & start requesting through my trello board." },
          { icon: MessageSquare, title: "Request", desc: "Request whatever service I offer, from branding to web design." },
          { icon: Send, title: "Receive", desc: "Receive your design within 48 hours on average." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Icon size={20} className="text-foreground" />
              <h3 className="font-bold">{title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
        {/* Left: visual card */}
        <div className="rounded-2xl overflow-hidden relative min-h-[400px]">
          <img src={pricingBg} alt="Subscription design services" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
          <div className="relative z-10 p-6 flex flex-col justify-end h-full text-primary-foreground">
            <div className="inline-flex items-center gap-2 rounded-full bg-card/20 backdrop-blur px-3 py-1.5 text-xs font-medium mb-4 w-fit">
              Pause or cancel anytime
            </div>
            <p className="text-lg font-semibold">Subscription design services</p>
            <p className="text-sm opacity-80">for brands who move fast.</p>
            <div className="flex items-center gap-2 mt-4">
              <span className="w-2 h-2 rounded-full bg-green-accent" />
              <span className="text-xs">Slots available</span>
            </div>
          </div>
        </div>

        {/* Right: pricing details */}
        <div className="card-surface p-8 flex flex-col">
          <p className="text-xs text-muted-foreground mb-2">Skip the agency markup and work directly with an experienced designer.</p>
          <h3 className="heading-md mb-2">Unlimited Design</h3>
          <p className="text-sm text-muted-foreground mb-6">
            <span className="font-semibold text-foreground">One flat monthly rate for unlimited design requests.</span>{" "}
            Ideal for ongoing design requirements.
          </p>
          <div className="border-t border-border pt-6">
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl md:text-5xl font-bold tracking-tight">$8,000</span>
              <span className="text-muted-foreground text-sm">/ month</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-foreground shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <a href="#contact" className="inline-flex items-center justify-center w-full rounded-full bg-primary text-primary-foreground py-3 font-medium hover:opacity-90 transition-opacity">
              Get Started
            </a>
          </div>
        </div>
      </div>

      {/* Single Project */}
      <div className="card-surface p-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="heading-md mb-2">Single Project</h3>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Comprehensive design services for any project scope.</span>{" "}
              Ideal for one-time design needs or individual tasks.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="grid grid-cols-2 gap-2">
              {singleFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-foreground shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
              Get quote <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
