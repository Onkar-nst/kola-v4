"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2 } from "lucide-react";

interface ContactFormProps {
  open: boolean;
  onClose: () => void;
  prefillService?: string;
}

const fields = [
  { name: "name",    label: "Your Name",                  type: "text",     placeholder: "Jane Smith",               required: true  },
  { name: "email",   label: "Email Address",              type: "email",    placeholder: "jane@company.com",         required: true  },
  { name: "company", label: "Company / Brand",            type: "text",     placeholder: "Acme Inc.",                required: false },
  { name: "message", label: "Tell us about your project", type: "textarea", placeholder: "Goals, timeline, budget…", required: true  },
];

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
};

const ContactForm: React.FC<ContactFormProps> = ({ open, onClose, prefillService = "" }) => {
  const [values, setValues] = useState({ name: "", email: "", company: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const isDesktop = useIsDesktop();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName:    values.name,
          email:       values.email,
          companyName: values.company,
          message:     values.message,
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStatus("idle");
      setValues({ name: "", email: "", company: "", message: "" });
    }, 300);
  };

  const innerContent = (
    <FormInner
      status={status}
      values={values}
      handleChange={handleChange}
      handleClose={handleClose}
      handleSubmit={handleSubmit}
    />
  );

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 9998,
            }}
          />

          {!isDesktop && (
            <motion.div
              key="mobile-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                backgroundColor: "#fff",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                overflow: "hidden",
              }}
            >
              {innerContent}
            </motion.div>
          )}

          {isDesktop && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <motion.div
                key="desktop-modal"
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                style={{
                  width: 480,
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
                  pointerEvents: "auto",
                  overflow: "hidden",
                }}
              >
                {innerContent}
              </motion.div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

type InnerProps = {
  status: string;
  values: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleClose: () => void;
  handleSubmit: () => void;
};

const FormInner: React.FC<InnerProps> = ({ status, values, handleChange, handleClose, handleSubmit }) => (
  <AnimatePresence mode="wait">
    {status === "success" ? (
      <motion.div
        key="success"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center py-16 px-8 text-center"
      >
        <CheckCircle2 size={48} className="mb-4" />
        <h3 className="text-[20px] font-semibold mb-2">We'll be in touch!</h3>
        <p className="text-[13px] text-black/45 mb-6">
          Thanks for reaching out. We'll respond within one business day.
        </p>
        <button onClick={handleClose} className="px-5 py-2 rounded-full border">
          Close
        </button>
      </motion.div>
    ) : (
      <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="flex justify-between items-start px-5 pt-5 pb-4 border-b border-black/8">
          <div>
            <p className="text-[14px] font-semibold">Start a project</p>
            <p className="text-[11px] text-black/35">Kola Communications</p>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/5 transition"
          >
            <X size={14} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-[10px] uppercase tracking-wide text-black/40 mb-1">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={values[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full border border-black/10 px-3 py-2 rounded-xl text-[13px] resize-none focus:outline-none focus:border-black/30 transition"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={values[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full border border-black/10 px-3 py-2 rounded-xl text-[13px] focus:outline-none focus:border-black/30 transition"
                />
              )}
            </div>
          ))}
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            className="w-full py-3 bg-black text-white rounded-xl flex items-center justify-center gap-2 text-[13px] font-medium disabled:opacity-50 transition"
          >
            {status === "loading" ? "Sending…" : <> Send Message <Send size={13} /> </>}
          </button>
          {status === "error" && (
            <p className="text-[11px] text-red-500 text-center mt-2">
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ContactForm;