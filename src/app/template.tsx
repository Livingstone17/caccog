"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Page-level transition: a slow, calm fade with a slight rise. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.15 : 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
