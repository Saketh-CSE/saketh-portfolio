import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeTransition() {
  const { transition, finishThemeTransition } = useTheme();
  if (!transition) return null;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const radius = Math.ceil(Math.hypot(width, height) + 80);
  const { id, from, to, x, y } = transition;
  const rotateStart = from === 'dark' ? -13 : 13;

  return <motion.div
    key={id}
    className={`theme-eclipse theme-eclipse--${to}`}
    aria-hidden="true"
    initial={{ clipPath: `circle(0px at ${x}px ${y}px)`, rotateY: rotateStart, scale: 0.97, opacity: 0.94 }}
    animate={{ clipPath: `circle(${radius}px at ${x}px ${y}px)`, rotateY: 0, scale: 1, opacity: 1 }}
    transition={{ duration: 1.02, ease: [0.19, 0.76, 0.24, 1] }}
    onAnimationComplete={() => finishThemeTransition(id)}
    style={{ transformPerspective: 1500, transformOrigin: `${x}px ${y}px`, '--origin-x': `${x}px`, '--origin-y': `${y}px` }}
  >
    <span className="theme-eclipse__orb" style={{ left: x, top: y }} />
  </motion.div>;
}
