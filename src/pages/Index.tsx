import { lazy, Suspense } from "react";
import ColumnGuides from "@/components/ColumnGuides";
import CustomCursor from "@/components/CustomCursor";

/* 🔥 Lazy imports */
const HeroSection = lazy(() => import("@/components/HeroSection"));
const ClientLogos = lazy(() => import("@/components/ClientLogos"));
const ProjectsSection = lazy(() => import("@/components/ProjectsSection"));
const TestimonialBanner = lazy(() => import("@/components/TestimonialBanner"));
const ServicesSection = lazy(() => import("@/components/ServicesSection"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const PricingSection = lazy(() => import("@/components/PricingSection"));
const TestimonialsSection = lazy(
  () => import("@/components/TestimonialsSection"),
);
const FAQSection = lazy(() => import("@/components/FAQSection"));
const BlogSection = lazy(() => import("@/components/BlogSection"));
const CTAFooter = lazy(() => import("@/components/CTAFooter"));
const SectionDivider = lazy(() => import("@/components/SectionDivider"));
const TechStack = lazy(() => import("@/components/TechStack"));

const SectionLoader = () => (
  <div className="py-20 text-center text-sm text-muted-foreground">
    Loading section...
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <CustomCursor />

      <div className="relative overflow-hidden">
        <ColumnGuides />

        <Suspense fallback={<SectionLoader />}>
          <HeroSection />
          <ClientLogos />
          <ProjectsSection />
          <TestimonialBanner />
          <TechStack />
          <SectionDivider />
          <ServicesSection />
          <AboutSection />
          <SectionDivider />
          <PricingSection />
          <SectionDivider />
          <TestimonialsSection />
          <FAQSection />
          <BlogSection />
        </Suspense>
      </div>

      <Suspense fallback={<SectionLoader />}>
        <CTAFooter />
      </Suspense>
    </div>
  );
};

export default Index;
