"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ContactFormProps {
  open: boolean;
  onClose: () => void;
  prefillService?: string;
}

const fields = [
  { name: "name", label: "Your Name", type: "text", placeholder: "Jane Smith", required: true },
  { name: "email", label: "Email Address", type: "email", placeholder: "jane@company.com", required: true },
  { name: "company", label: "Company / Brand", type: "text", placeholder: "Acme Inc.", required: false },
  { name: "message", label: "Tell us about your project", type: "textarea", placeholder: "Goals, timeline, budget…", required: true },
];

const Inner = ({ status, values, focused, errorMsg, handleChange, handleClose, handleSubmit, setFocused }: any) => (
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
      <div>
        {/* HEADER */}
        <div className="flex justify-between px-5 pt-5 pb-4 border-b">
          <div>
            <p className="text-[14px] font-semibold">Start a project</p>
            <p className="text-[11px] text-black/35">Kola Communications</p>
          </div>
          <button onClick={handleClose} className="w-7 h-7 flex items-center justify-center">
            <X size={14} />
          </button>
        </div>

        {/* FORM */}
        <div className="px-5 py-4 space-y-3">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="text-[10px] uppercase text-black/40">
                {field.label}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={values[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full border px-3 py-2 rounded-xl"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={values[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full border px-3 py-2 rounded-xl"
                />
              )}
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="px-5 pb-5">
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-black text-white rounded-xl flex items-center justify-center gap-2"
          >
            Send Message <Send size={14} />
          </button>
        </div>
      </div>
    )}
  </AnimatePresence>
);

const ContactForm: React.FC<ContactFormProps> = ({ open, onClose, prefillService = "" }) => {
  const [values, setValues] = useState({ name: "", email: "", company: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: any) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setStatus("loading");

    const { error } = await supabase.from("contact_submissions").insert([values]);

    if (error) {
      setStatus("error");
    } else {
      setStatus("success");
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStatus("idle");
      setValues({ name: "", email: "", company: "", message: "" });
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
            onClick={handleClose}
          />

          {/* MOBILE */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[9999] md:hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
          >
            <Inner
              status={status}
              values={values}
              errorMsg={errorMsg}
              handleChange={handleChange}
              handleClose={handleClose}
              handleSubmit={handleSubmit}
            />
          </motion.div>

          {/* DESKTOP (FIXED CENTER) */}
          <motion.div
            className="hidden md:block bg-white rounded-2xl shadow-2xl z-[9999]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              translate: "-50% -50%", 
              width: "480px",
            }}
          >
            <Inner
              status={status}
              values={values}
              errorMsg={errorMsg}
              handleChange={handleChange}
              handleClose={handleClose}
              handleSubmit={handleSubmit}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactForm;