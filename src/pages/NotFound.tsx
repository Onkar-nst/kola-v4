import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  /* Animation variants */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const floatVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: { duration: 4, repeat: Infinity, ease: [0.42, 0, 0.58, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-black/3 rounded-full blur-3xl opacity-5" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-black/3 rounded-full blur-3xl opacity-5" />
      </div>

      <motion.div
        className="relative z-10 max-w-2xl mx-auto px-6 md:px-10 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Number */}
        <motion.div
          variants={numberVariants}
          className="mb-8 md:mb-12"
        >
          <motion.h1
            variants={floatVariants}
            initial="initial"
            animate="animate"
            className="text-[120px] md:text-[180px] font-bold leading-none tracking-tighter text-black"
          >
            404
          </motion.h1>
        </motion.div>

        {/* Main heading */}
        <motion.div variants={itemVariants} className="mb-4 md:mb-6">
          <h2
            className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight text-black"
          >
            Page Not Found
          </h2>
        </motion.div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="mb-6 md:mb-8 flex justify-center">
          <div className="w-12 h-1 bg-black/20 rounded-full" />
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg text-black/50 leading-relaxed max-w-md mx-auto mb-10 md:mb-12"
        >
          Sorry, the page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Back button */}
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-black/20 text-black text-sm font-medium rounded-lg hover:bg-black/5 transition-colors duration-300"
          >
            <ArrowLeft size={16} />
            Go Back
          </motion.button>

          {/* Home button */}
          <motion.a
            href="/"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center px-6 py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/85 transition-colors duration-300"
          >
            Back to Home
          </motion.a>
        </motion.div>

        {/* Footer text */}
        <motion.p
          variants={itemVariants}
          className="mt-12 md:mt-16 text-xs text-black/30 tracking-widest uppercase"
        >
          Error Code: {location.pathname.substring(1) || 'unknown'}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFound;
