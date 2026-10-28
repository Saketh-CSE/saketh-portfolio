import { Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle() {
  const { theme, toggleTheme, transition } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const Icon = theme === 'dark' ? Sun : Moon;
  return <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${nextTheme} theme`} title={`Switch to ${nextTheme} theme`} aria-pressed={theme === 'dark'} aria-busy={Boolean(transition)}><AnimatePresence mode="wait" initial={false}><motion.span className="theme-toggle-icon" key={theme} initial={{ opacity: 0, rotate: -85, scale: 0.35 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 85, scale: 0.35 }} transition={{ duration: 0.48, ease: [0.22, 0.8, 0.2, 1] }}><Icon size={17} aria-hidden="true" /></motion.span></AnimatePresence></button>;
}
