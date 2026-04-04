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
import ColumnGuides from "@/components/ColumnGuides";
import CustomCursor from "@/components/CustomCursor";
import SectionDivider from "@/components/SectionDivider";


const Index = () => {
  return (
    <div className="min-h-screen bg-background ">
      <CustomCursor />
      <ColumnGuides />
      <Navbar />
      <HeroSection />
      <ClientLogos />
      <ProjectsSection />
      <SectionDivider />
      <TestimonialBanner />
      <SectionDivider />
      <ServicesSection />
      <SectionDivider />
      <AboutSection />
      <SectionDivider />
      <PricingSection />
      <SectionDivider />
      <TestimonialsSection />
      <SectionDivider />
      <FAQSection />
      <SectionDivider />
      <BlogSection />
      <CTAFooter />
    </div>
  );
};

export default Index;
