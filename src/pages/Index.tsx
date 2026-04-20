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
        <title>Kola Communications | Website & Digital Marketing Agency</title>
        <meta
          name="description"
          content="Kola Communications — WordPress websites, Shopify stores, custom coded web solutions, SEO, AEO, social media and lead generation. Trusted by brands worldwide."
        />
        <meta
          name="keywords"
          content="Kola Communications, Kola Communications Website, Website Development Agency Mumbai, WordPress Website Development India, Shopify Website Development India, Custom Coded Website India, Digital Marketing Agency Mumbai, SEO Agency Mumbai, AEO Agency India, Social Media Agency Mumbai, Lead Generation Agency India, Website Design Agency India, Kola Agency Mumbai, Web Development Company India, WordPress Development Company Mumbai, Shopify Store Development India, Custom Website Design India, SEO Services India, AEO Services India, Social Media Marketing Mumbai, Lead Generation Services India, Digital Solutions Agency Mumbai, Website Agency India, Kola Communications Services, Kola Communications Portfolio"
        />
        <meta property="og:title" content="Kola Communications | Website & Digital Marketing Agency" />
        <meta
          property="og:description"
          content="Kola Communications — WordPress websites, Shopify stores, custom coded web solutions, SEO, AEO, social media and lead generation. Trusted by brands worldwide."
        />
        <meta property="og:url" content="https://www.kolacommunications.com" />
        <meta property="og:image" content="https://www.kolacommunications.com/og-image.jpg" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.kolacommunications.com" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["LocalBusiness", "ProfessionalService"],
            "name": "Kola Communications",
            "url": "https://www.kolacommunications.com",
            "logo": "https://www.kolacommunications.com/logo.png",
            "image": "https://www.kolacommunications.com/og-image.jpg",
            "description": "Kola Communications is a Mumbai-based website and digital marketing agency specialising in WordPress, Shopify, custom coded development, SEO, AEO, social media and lead generation.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Mumbai",
              "addressRegion": "Maharashtra",
              "addressCountry": "IN"
            },
            "areaServed": [
              { "@type": "Country", "name": "India" },
              { "@type": "Country", "name": "Australia" },
              { "@type": "Country", "name": "United Kingdom" },
              { "@type": "Country", "name": "United Arab Emirates" },
              { "@type": "Country", "name": "United States" }
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Digital Marketing & Website Services",
              "itemListElement": [
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "WordPress Website Development" }},
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Shopify Store Development" }},
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Coded Website Development" }},
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SEO" }},
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AEO" }},
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Social Media Marketing" }},
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Lead Generation" }},
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Content Writing" }},
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AI Tools Development" }}
              ]
            },
            "sameAs": [
              "https://www.linkedin.com/company/kolacommunications",
              "https://www.instagram.com/kolacommunications",
              "https://www.facebook.com/kolacommunications"
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