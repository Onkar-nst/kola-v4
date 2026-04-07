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
  { name: "name",    label: "Your Name",                  type: "text",     placeholder: "Jane Smith",           required: true  },
  { name: "email",   label: "Email Address",               type: "email",    placeholder: "jane@company.com",     required: true  },
  { name: "company", label: "Company / Brand",             type: "text",     placeholder: "Acme Inc.",            required: false },
  { name: "message", label: "Tell us about your project",  type: "textarea", placeholder: "Goals, timeline, budget…", required: true },
];

/* shared inner content — reused by both mobile + desktop variants */
const Inner = ({ status, values, focused, errorMsg, handleChange, handleClose, handleSubmit, setFocused }: any) => (
  <AnimatePresence mode="wait">
    {status === "success" ? (
      <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <motion.div initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.08 }}>
          <CheckCircle2 size={48} strokeWidth={1.4} className="text-black mb-4" />
        </motion.div>
        <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          className="text-[20px] font-semibold tracking-tight mb-2">We'll be in touch!</motion.h3>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="text-[13px] text-black/45 leading-relaxed mb-8 max-w-[280px]">
          Thanks for reaching out. Our team usually responds within one business day.
        </motion.p>
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}
          onClick={handleClose}
          className="px-5 py-2 rounded-full border border-black/12 text-[13px] font-medium hover:bg-black hover:text-white transition-colors duration-200">
          Close
        </motion.button>
      </motion.div>
    ) : (
      <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {/* header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-black/6">
          <div>
            <p className="text-[14px] font-semibold">Start a project</p>
            <p className="text-[11px] text-black/35 mt-0.5">Kola Communications · Replies same day</p>
          </div>
          <button onClick={handleClose}
            className="w-7 h-7 rounded-full bg-black/6 hover:bg-black/12 flex items-center justify-center transition-colors">
            <X size={13} />
          </button>
        </div>

        {/* fields */}
        <div className="px-5 py-4 space-y-3.5 max-h-[55vh] overflow-y-auto">
          {fields.map((field, i) => (
            <motion.div key={field.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.045, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <label className="block text-[10px] uppercase tracking-[0.14em] text-black/35 font-medium mb-1.5">
                {field.label}{field.required && <span className="text-black/20 ml-0.5">*</span>}
              </label>
              <div className={`relative rounded-xl border transition-all duration-200 ${
                focused === field.name ? "border-black shadow-[0_0_0_3px_rgba(0,0,0,0.05)]" : "border-black/10"
              } bg-black/[0.02]`}>
                {field.type === "textarea" ? (
                  <textarea name={field.name} value={values[field.name]} onChange={handleChange}
                    onFocus={() => setFocused(field.name)} onBlur={() => setFocused(null)}
                    placeholder={field.placeholder} rows={3}
                    className="w-full bg-transparent px-3.5 py-2.5 text-[13px] text-black placeholder:text-black/22 outline-none resize-none" />
                ) : (
                  <input type={field.type} name={field.name} value={values[field.name]} onChange={handleChange}
                    onFocus={() => setFocused(field.name)} onBlur={() => setFocused(null)}
                    placeholder={field.placeholder}
                    className="w-full bg-transparent px-3.5 py-2.5 text-[13px] text-black placeholder:text-black/22 outline-none" />
                )}
              </div>
            </motion.div>
          ))}
          {errorMsg && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-red-500">{errorMsg}</motion.p>
          )}
        </div>

        {/* footer */}
        <div className="px-5 pb-5 pt-1">
          <motion.button onClick={handleSubmit} disabled={status === "loading"}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-3 rounded-xl bg-black text-white text-[13px] font-medium disabled:opacity-60">
            {status === "loading" ? <Loader2 size={15} className="animate-spin" /> : (<><span>Send Message</span><Send size={13} /></>)}
            <motion.span initial={{ x: "-100%", opacity: 0 }} whileHover={{ x: "200%", opacity: 0.1 }}
              transition={{ duration: 0.5 }} className="absolute inset-0 bg-white skew-x-12 pointer-events-none" />
          </motion.button>
          <p className="text-center text-[10px] text-black/22 mt-2.5">No spam. We respect your privacy.</p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ContactForm: React.FC<ContactFormProps> = ({ open, onClose, prefillService = "" }) => {
  const [values, setValues]   = useState({ name: "", email: "", company: "", message: "" });
  const [focused, setFocused] = useState<string | null>(null);
  const [status, setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues(v => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!values.name || !values.email || !values.message) {
      setErrorMsg("Please fill in your name, email, and message."); return;
    }
    setStatus("loading"); setErrorMsg("");
    const { error } = await supabase.from("contact_submissions").insert([{
      name: values.name, email: values.email, company: values.company,
      message: values.message, service: prefillService,
    }]);
    if (error) { setStatus("error"); setErrorMsg("Something went wrong. Please try again."); }
    else setStatus("success");
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setStatus("idle"); setValues({ name: "", email: "", company: "", message: "" }); setErrorMsg(""); }, 400);
  };

  const innerProps = { status, values, focused, errorMsg, handleChange, handleClose, handleSubmit, setFocused };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }} onClick={handleClose}
            style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
          />

          {/* ── MOBILE: slides up from bottom ── */}
          <motion.div key="mobile-sheet"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999 }}
            className="md:hidden bg-white rounded-t-[24px] shadow-[0_-8px_40px_rgba(0,0,0,0.18)] overflow-hidden"
          >
            <Inner {...innerProps} />
          </motion.div>

          {/* ── DESKTOP: perfectly centered in viewport ── */}
          <motion.div key="desktop-dialog"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "fixed",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "480px",
              zIndex: 9999,
            }}
            className="hidden md:block bg-white rounded-[20px] shadow-[0_32px_80px_rgba(0,0,0,0.22)] overflow-hidden"
          >
            <Inner {...innerProps} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactForm;