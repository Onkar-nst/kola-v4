import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Calendar } from "lucide-react";
import avatarJoseph from "@/assets/avatar.jpg";

const faqs = [
  {
    q: "How long does a typical project take to complete?",
    a: "Project timelines vary based on complexity. A simple project might take 2-3 weeks, while more comprehensive designs can take 1-2 months. I will provide a specific estimate after our initial consultation.",
  },
  {
    q: "Can you work with my existing brand and designs?",
    a: "Absolutely! I can work within your existing brand guidelines while enhancing and improving the overall design. I'm experienced in maintaining brand consistency while pushing creative boundaries.",
  },
  {
    q: "What makes your design process unique?",
    a: "I combine strategic thinking with creative execution. Every design decision is backed by research and aligned with your business goals, ensuring both aesthetic appeal and functional effectiveness.",
  },
  {
    q: "Do you offer ongoing support after the project is completed?",
    a: "Yes, I offer post-launch support packages to ensure everything continues to run smoothly. This includes bug fixes, minor updates, and design refinements as needed.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-20 section-container p-4 border-t border-border">
      <div className="max-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* FAQ Left */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-tight mb-10"
            >
              <span className="text-foreground">Your questions</span>
              <br />
              <span className="text-muted-foreground">answered.</span>
            </motion.h2>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-border rounded-xl overflow-hidden bg-card"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      {index > 0 && (
                        <span className="text-sm text-muted-foreground font-mono">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      )}
                      <span className="text-sm font-medium text-foreground">{faq.q}</span>
                    </div>
                    {openIndex === index ? (
                      <Minus size={16} className="text-muted-foreground shrink-0" />
                    ) : (
                      <Plus size={16} className="text-muted-foreground shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Card Right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="border border-border rounded-2xl p-8 bg-card h-fit lg:sticky lg:top-32"
          >
            <img
              src={avatarJoseph}
              alt="Joseph"
              className="w-16 h-16 rounded-full object-cover mb-6"
              loading="lazy"
            />
            <p className="text-muted-foreground text-lg">Still not sure?</p>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mt-1">
              Book a free discovery call.
            </h3>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              Learn more about how I work and how I can help you and your business take the next step.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-5 py-3 text-sm font-medium hover:opacity-90 transition-opacity">
                <Calendar size={16} />
                Schedule Now
              </button>
              <span className="text-sm text-muted-foreground">Cal.com</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
