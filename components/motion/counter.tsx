"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type CounterProps = {
  value: string;
};

export function Counter({ value }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const numericValue = Number.parseInt(value, 10);
  const hasNumber = Number.isFinite(numericValue);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 1800, bounce: 0 });
  const [displayValue, setDisplayValue] = useState(hasNumber ? "0" : value);

  useEffect(() => {
    if (!isInView || !hasNumber) {
      return;
    }

    motionValue.set(numericValue);
  }, [hasNumber, isInView, motionValue, numericValue]);

  useEffect(() => {
    if (!hasNumber) {
      return undefined;
    }

    return springValue.on("change", (latest) => {
      setDisplayValue(`${Math.round(latest)}${value.replace(String(numericValue), "")}`);
    });
  }, [hasNumber, numericValue, springValue, value]);

  return (
    <motion.span ref={ref} className="tabular-nums">
      {displayValue}
    </motion.span>
  );
}
