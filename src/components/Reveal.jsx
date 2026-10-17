import { motion, useReducedMotion } from 'framer-motion';

export default function Reveal({ as: Component = 'div', children, className, delay = 0, ...props }) {
  const reduceMotion = useReducedMotion();
  return <motion.div
    className={className}
    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.08 }}
    transition={reduceMotion ? { duration: 0 } : { duration: 0.55, delay, ease: [0.2, 0.7, 0.2, 1] }}
    {...props}
  >{children}</motion.div>;
}
