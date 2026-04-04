import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Calendar } from "lucide-react";
import avatarJoseph from "@/assets/avatar.jpg";
import AnimatedHeading from "@/components/AnimatedHeading";

const faqs = [
  {
    q: "How long does a typical project take to complete?",
    a: "Project timelines vary based on complexity. A simple project might take 2–3 weeks, while more comprehensive designs can take 1–2 months. I will provide a specific estimate after our initial consultation.",
  },
  {
    q: "Can you work with my existing brand and designs?",
    a: "Absolutely! I can work within your existing brand guidelines while enhancing and improving the overall design.",
  },
  {
    q: "What makes your design process unique?",
    a: "I combine strategic thinking with creative execution. Every design decision is backed by research.",
  },
  {
    q: "Do you offer ongoing support after the project is completed?",
    a: "Yes, I offer post-launch support packages including bug fixes and updates.",
  },
  {
    q: "How do you handle confidentiality and intellectual property rights?",
    a: "All work is handled with strict confidentiality and proper agreements.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 border-t border-b border-border section-container">
      <div className="max-w-[1100px] p-4 md:p-10">
        <div className="grid lg:grid-cols-2 gap-14">
          {/* ================= LEFT ================= */}
          <div>
            <AnimatedHeading
              lines={["Your questions", "answered."]}
              className="
    text-[clamp(2.4rem,5vw,3.5rem)]
    leading-[1.1]
    tracking-[-0.02em]
    font-semibold
    mb-12
  "
              highlightClassName="text-[#9b9b9b]"
            />

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <motion.div
                    key={index}
                    layout
                    className={`
                      rounded-[18px]
                      border
                      transition
                      ${
                        isOpen
                          ? "border-gray-300 bg-[#f8f8f8]"
                          : "border-gray-300 bg-[#fafafa] hover:bg-[#f5f5f5]"
                      }
                    `}
                  >
                    {/* HEADER */}
                    <button
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="w-full flex items-center justify-between px-5 py-4"
                    >
                      <div className="flex items-center gap-4">
                        {index !== 0 && (
                          <span className="text-xs text-[#999] font-mono">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        )}
                        <span className="text-[14px] font-medium text-[#111]">
                          {faq.q}
                        </span>
                      </div>

                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      </motion.div>
                    </button>

                    {/* CONTENT */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.25,
                            ease: [0.25, 1, 0.5, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-[14px] text-[#666] leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ================= RIGHT CTA ================= */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="
              rounded-[22px]
              border border-gray-300
              bg-[#fafafa]
              p-8
              shadow-[0_1px_1px_rgba(0,0,0,0.04),
                      0_12px_30px_rgba(0,0,0,0.06)]
              h-fit
              lg:sticky lg:top-28
            "
          >
            <img src={avatarJoseph} className="w-14 h-14 rounded-full mb-6" />

            <p className="text-[#8a8a8a] text-lg">Still not sure?</p>

            <h3 className="text-[28px] font-semibold leading-tight mt-1">
              Book a free discovery call.
            </h3>

            <p className="text-sm text-[#666] mt-4 leading-relaxed">
              Learn more about how I work and how I can help you take the next
              step.
            </p>

            <div className="flex items-center gap-4 mt-6">
              <motion.button
                whileTap={{ scale: 0.96 }}
                className="
                  flex items-center gap-2
                  bg-black text-white
                  px-5 py-3
                  rounded-full
                  text-sm font-medium
                  shadow-lg
                "
              >
                <Calendar size={16} />
                Schedule Now
              </motion.button>

              <span className="text-sm text-[#999]">Cal.com</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
