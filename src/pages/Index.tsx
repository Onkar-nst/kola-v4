import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ClientLogos from "@/components/ClientLogos";
import ProjectsSection from "@/components/ProjectsSection";
import TestimonialBanner from "@/components/TestimonialBanner";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import BlogSection from "@/components/BlogSection";
import CTAFooter from "@/components/CTAFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ClientLogos />
      <ProjectsSection />
      <TestimonialBanner />
      <ServicesSection />
      <AboutSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <BlogSection />
      <CTAFooter />
    </div>
  );
};

export default Index;
