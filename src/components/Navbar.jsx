import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { navigationItems } from '../data/portfolio.js';
import ThemeToggle from './ThemeToggle.jsx';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const sections = navigationItems.map((item) => document.querySelector(item.href)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current) setActiveSection(`#${current.target.id}`);
    }, { rootMargin: '-24% 0px -62% 0px', threshold: [0, 0.12, 0.5] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return <header className="site-header">
    <a className="wordmark" href="#top" aria-label="Saketha Ram, home"><span className="wordmark-mark">SR</span><span className="wordmark-name">Saketha Ram</span></a>
    <button ref={menuButtonRef} className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={17} /> : <Menu size={17} />}</button>
    <nav className={`nav-panel${menuOpen ? ' is-open' : ''}`} id="primary-nav" aria-label="Main navigation">
      <div className="nav-links">{navigationItems.map((item) => <a href={item.href} key={item.href} aria-current={activeSection === item.href ? 'location' : undefined} onClick={() => { setActiveSection(item.href); setMenuOpen(false); }}>{item.label}{activeSection === item.href && <motion.span className="nav-indicator" layoutId="nav-indicator" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}</a>)}</div>
      <div className="nav-actions"><ThemeToggle /><a className="nav-contact" href="#contact" onClick={() => setMenuOpen(false)}>Let’s talk <ArrowUpRight size={14} aria-hidden="true" /></a></div>
    </nav>
  </header>;
}
