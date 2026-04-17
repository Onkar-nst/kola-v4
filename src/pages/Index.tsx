import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";

import ColumnGuides from "@/components/ColumnGuides";
import CustomCursor from "@/components/CustomCursor";
import SectionSkeleton from "@/components/SectionSkeleton";

const HeroSection = lazy(() => import("@/components/HeroSection"));
const ClientLogos = lazy(() => import("@/components/ClientLogos"));
const ProjectsSection = lazy(() => import("@/components/ProjectsSection"));
const TestimonialBanner = lazy(() => import("@/components/TestimonialBanner"));
const ServicesSection = lazy(() => import("@/components/ServicesSection"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const PricingSection = lazy(() => import("@/components/PricingSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const CTAFooter = lazy(() => import("@/components/CTAFooter"));
const SectionDivider = lazy(() => import("@/components/SectionDivider"));
const BlogSection = lazy(() => import("@/components/BlogSection"));

const SectionLoader = () => <SectionSkeleton />;

const Index = () => {
  return (
    <div className="min-h-screen bg-background">

      <Helmet>
        <title>Kola Communications | AI, Web & Growth Solutions</title>

        <meta
          name="description"
          content="Kola Communications builds high-performance websites, AI-powered tools, and marketing systems that drive traffic, leads, and conversions."
        />

        <meta
          name="keywords"
          content="website development, SEO agency, AI tools, digital marketing, performance marketing India"
        />

        <meta name="robots" content="index, follow" />

        <link rel="canonical" href="https://kolacommunications.com/" />

        {/* Open Graph */}
        <meta property="og:title" content="Kola Communications | AI, Web & Growth" />
        <meta
          property="og:description"
          content="We build websites, AI tools, and growth systems that scale businesses."
        />
        <meta property="og:url" content="https://kolacommunications.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Kola Communications" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kola Communications" />
        <meta
          name="twitter:description"
          content="AI-powered digital solutions and growth systems."
        />

        {/* 🔥 AEO (Organization Schema) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Kola Communications",
            url: "https://kolacommunications.com",
            logo: "https://kolacommunications.com/logo.png",
            sameAs: [
              "https://www.linkedin.com/company/kolacommunications",
              "https://www.instagram.com/kolacommunications"
            ]
          })}
        </script>
      </Helmet>

      <CustomCursor />

      <div className="relative overflow-hidden">
        <ColumnGuides />

        <Suspense fallback={<SectionLoader />}>
          <HeroSection />
          <ClientLogos />
          <AboutSection />
          <SectionDivider />
          <ServicesSection />
          <SectionDivider />
          <TestimonialBanner />
          <ProjectsSection />
          <SectionDivider />
          <PricingSection />
          <SectionDivider />
          <BlogSection />
          <FAQSection />
          <TestimonialsSection />
        </Suspense>
      </div>

      <Suspense fallback={<SectionLoader />}>
        <CTAFooter />
      </Suspense>
    </div>
  );
};

export default Index;