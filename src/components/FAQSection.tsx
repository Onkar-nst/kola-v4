import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How long does a typical project take to complete?", a: "Project timelines vary based on complexity. A simple project might take 2-3 weeks, while more comprehensive designs can take 1-2 months. I will provide a specific estimate after our initial consultation." },
  { q: "Can you work with my existing brand and designs?", a: "Absolutely! I'm experienced in working with established brands. I will ensure all new designs align perfectly with your existing brand guidelines and visual identity." },
  { q: "What is your revision policy?", a: "Each project includes multiple rounds of revisions to ensure the final design meets your expectations. The specific number depends on the project package you choose." },
  { q: "Do you offer ongoing design support?", a: "Yes! My subscription plan offers unlimited design requests with an average 48-hour turnaround. It's perfect for brands that need ongoing design support." },
  { q: "What if I need to pause my subscription?", a: "You can pause or cancel your subscription at any time. When you pause, your billing stops and resumes when you're ready to continue." },
];

const FAQSection = () => {
  return (
    <section className="py-16 md:py-24 section-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="heading-lg">
            <span className="text-text-tertiary">Got questions?</span>
            <br />
            I've got answers.
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-border">
              <AccordionTrigger className="text-left font-semibold text-sm py-5 hover:no-underline">
                <span className="text-muted-foreground mr-3 font-mono text-xs">0{i + 1}</span>
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
