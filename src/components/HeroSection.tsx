import avatarImg from "@/assets/avatar.jpg";
import heroMockups from "@/assets/hero-mockups.jpg";
import AnimatedHeading from "@/components/AnimatedHeading";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-12 md:mt-40 md:pb-20 section-container p-4 md:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-6">

          {/* <h1 className="heading-lg">
            <span className="text-text-tertiary"></span>
            <br />
            real results.
          </h1> */}

          <AnimatedHeading
                    lines={["Digital experiences","that drive" ,"real results."]}
                    className="
                      text-[clamp(2.5rem,4vw,3.5rem)]
                      leading-[1.05]
                      tracking-[-0.025em]
                      
                      max-w-[760px]
                    "
                  />
          <p className="body-lg max-w-md">
            <span className="font-semibold">From website development to SEO, lead generation and beyond - we craft data-driven digital marketing strategies that grow your brand, </span>{" "}
            <span className="text-muted-foreground">reach the right audience, and turn clicks into customers.</span>
          </p>

          <a href="#contact" className="inline-flex items-center gap-3 rounded-full bg-primary text-primary-foreground p-4 py-2 w-fit text-md font-medium hover:opacity-90 transition-opacity group">
            Book a call with us
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
