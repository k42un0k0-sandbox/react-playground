import { motion, Target } from "framer-motion";
import { ComponentProps } from "react";

export default function Fade({
  children,
  initial,
  animate,
  exit,
  ...props
}: {
  initial?: Target;
  animate?: Target;
  exit?: Target;
} & Omit<ComponentProps<typeof motion.div>, "initial" | "animate" | "exit">) {
  return (
    <motion.div
      initial={{ opacity: 0, ...initial }}
      animate={{ opacity: 1, ...animate }}
      exit={{ opacity: 0, ...exit }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
