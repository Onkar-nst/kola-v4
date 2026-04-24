import type { VercelRequest, VercelResponse } from '@vercel/node';
import TurndownService from 'turndown';

const WP_BASE = 'https://cms.kolacommunications.com/wp-json/wp/v2';

// Static markdown for homepage content (lives in React components, not WP)
const HOMEPAGE_MARKDOWN = `
# Kola Communications — Digital Marketing Agency
 
Kola Communications is a full-service digital marketing agency offering website development, SEO, AEO, lead generation, performance marketing, brand design, social media marketing, content strategy, and AI-powered applications — helping businesses across India, Australia, US, Europe, and the Middle East turn their digital presence into measurable growth.
 
## What Is Kola Communications?
Kola Communications is a digital marketing and web development agency based in India, working with brands across five continents. We design, build, and grow digital products — from high-performance websites to full-scale SEO and lead generation strategies — for businesses that want results, not just deliverables.
 
## Services We Offer
 
### Website Development
We build high-performance websites on WordPress, Shopify, and custom-coded stacks using React and Tailwind CSS. Our websites are fast, mobile-first, conversion-focused, and built to rank on Google. We also specialise in headless CMS architecture for brands that need scalability without compromising on design.
 
### SEO & AEO (Answer Engine Optimisation)
We run targeted SEO campaigns that increase organic traffic, improve keyword rankings, and build long-term search authority. We also optimise content for AEO — ensuring your brand appears in AI-generated answers from Google SGE, ChatGPT, Perplexity, and other answer engines. This is what separates modern SEO from traditional SEO.
 
### Lead Generation & Conversion Optimisation
We design and execute lead generation strategies that attract the right audience and convert them into paying customers. From landing page design to CRO audits, we focus on turning traffic into revenue.
 
### Brand Identity & Design
We create visual identities — logos, brand guidelines, typography systems, and design languages — that communicate what your business stands for and make you impossible to forget.
 
### Performance Marketing & Paid Advertising
We run paid advertising campaigns on Google, Meta, and other platforms, optimised for ROAS and built around your actual business goals — not vanity metrics.
 
### Social Media Marketing
We manage and grow social media presence across platforms, combining content strategy with community engagement to build audiences that convert.
 
### Content Creation & Strategy
We create blogs, case studies, landing page copy, and editorial content that ranks on search engines, answers real buyer questions, and builds topical authority in your industry.
 
### AI-Powered Tools & Applications
We build custom AI-powered tools and applications tailored to your business — from intelligent chatbots and automated workflows to data-driven decision support systems.
 
## Who We Work With
We partner with D2C brands, luxury labels, B2B companies, e-commerce stores, and growth-stage startups across India, Australia, the US, Europe, and the Middle East. Whether you need a Shopify store, a WooCommerce build, a full SEO strategy, or a complete digital overhaul — we've done it across industries.
 
## Why Choose Kola Communications?
- We go beyond aesthetics. Every website, campaign, and strategy we deliver is designed to produce measurable business impact.
- We are detail-obsessed. We treat every project with the same dedication and care we would want for our own brand.
- We combine creativity, data, and technology. Our team brings together designers, developers, SEO specialists, and performance marketers under one roof.
- We have global experience. We have worked with brands across India, Australia, the United States, Europe, and the Middle East.
- We build for the future. From headless WordPress to AEO optimisation, we use modern stacks and strategies — not outdated playbooks.
 
## About Kola Communications
Kola Communications was founded on a simple belief: every business, regardless of size, deserves a powerful digital presence. What started as a passion for creative problem-solving has grown into a full-service agency trusted by brands across five continents. We don't do templates. Every project starts with understanding your business model, your customers, and what is actually blocking growth — then we build accordingly.
 
## Frequently Asked Questions
 
**What services does Kola Communications offer?**
Kola Communications offers website development (WordPress, Shopify, custom-coded), SEO, AEO, lead generation, conversion optimisation, brand identity and design, performance marketing, social media marketing, content strategy, and AI-powered tools and applications.
 
**Which countries does Kola Communications serve?**
We work with clients across India, Australia, the United States, Europe, and the Middle East.
 
**Does Kola Communications build Shopify and WooCommerce stores?**
Yes. We build and optimise both Shopify and WooCommerce e-commerce stores, including custom checkout flows, payment gateway integrations for Indian markets (Razorpay, PayU, Cashfree), and performance optimisation.
 
**What is AEO and does Kola Communications offer it?**
AEO stands for Answer Engine Optimisation — the practice of optimising your content to appear in AI-generated answers from tools like Google SGE, ChatGPT, and Perplexity. Yes, Kola Communications offers AEO as part of our SEO services.
 
**Does Kola Communications work with startups?**
Yes. We work with growth-stage startups, D2C brands, B2B companies, luxury labels, and established businesses looking to scale their digital presence.
 
**How do I start a project with Kola Communications?**
Visit https://kolacommunications.com and use the contact form or start a project button to get in touch with our team.
 
## Our Work
Explore our client projects at https://kolacommunications.com/projects
 
## Blog & Insights
Read our latest thinking on web development, SEO, AEO, and digital marketing at https://kolacommunications.com/blogs
 
## Contact Kola Communications
Visit https://kolacommunications.com to start a project or get in touch with our team.
`.trim();

async function getPageMarkdown(pathname: string): Promise<string | null> {
  try {
    // Blog post pages — fetch from WordPress
    const blogMatch = pathname.match(/^\/blogs\/(.+)$/);
    if (blogMatch) {
      const slug = blogMatch[1];
      const res = await fetch(`${WP_BASE}/posts?slug=${slug}&_fields=title,content,excerpt`);
      const posts = await res.json();
      if (!posts.length) return null;

      const post = posts[0];
      const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });

      return `# ${post.title.rendered}\n\n${td.turndown(post.content.rendered)}`;
    }

    // Homepage — use static markdown (content lives in React)
    if (pathname === '/' || pathname === '') {
      return HOMEPAGE_MARKDOWN;
    }

    // Other pages — return a generic fallback
    return `# Kola Communications\n\nVisit https://kolacommunications.com${pathname} for more information.`;
  } catch (err) {
    console.error('Markdown generation error:', err);
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const accept = req.headers['accept'] || '';

  if (!accept.includes('text/markdown')) {
    return res.status(406).send('Not Acceptable');
  }

  const pathname = req.url?.split('?')[0] || '/';
  const markdown = await getPageMarkdown(pathname);

  if (!markdown) {
    return res.status(404).send('# Not Found\n\nThe requested page could not be found.');
  }

  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Vary', 'Accept');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.send(markdown);
}
