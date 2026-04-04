import { motion } from "framer-motion";
import { memo, useMemo } from "react";

/**
 * Props:
 * lines: string[] → each string = one line
 * className?: string
 * once?: boolean
 * blur?: number
 * stagger?: number
 * duration?: number
 */

const AnimatedHeading = ({
  lines = [],
  className = "",
  once = true,
  blur = 10,
  stagger = 0.08,
  duration = 0.7,
}) => {
  // 🧠 memoize split words (optimization)
  const splitLines = useMemo(
    () => lines.map((line) => line.split(" ")),
    [lines]
  );

  const container = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: { staggerChildren: stagger },
      },
    }),
    [stagger]
  );

  const word = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: 24,
        scale: 0.98,
        filter: `blur(${blur}px)`,
      },
      show: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
          duration,
          ease: [0.22, 1, 0.36, 1],
        },
      },
    }),
    [blur, duration]
  );

  return (
    <motion.h2
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-120px" }}
      className={className}
    >
      {splitLines.map((line, lineIndex) => (
        <div
          key={lineIndex}
          className={`block whitespace-nowrap ${
            lineIndex === 0
              ? "text-muted-foreground font-medium"
              : "text-foreground font-semibold"
          }`}
        >
          {line.map((wordText, i) => (
            <motion.span
              key={i}
              variants={word}
              className="inline-block mr-3"
            >
              {wordText}
            </motion.span>
          ))}
        </div>
      ))}
    </motion.h2>
  );
};

export default memo(AnimatedHeading);