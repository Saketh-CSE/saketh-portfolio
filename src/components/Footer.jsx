import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { profile, socialLinks } from '../data/portfolio.js';

export default function Footer() {
  return <footer className="site-footer section-wrap"><a className="footer-brand" href="#top">SR<span> / </span>SAKETHA RAM</a><p>Built with curiosity and care.</p><div className="footer-links">{socialLinks.map((link) => <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>{link.label} <ArrowUpRight size={11} aria-hidden="true" /></a>)}<a href={`mailto:${profile.email}`}>Email <ArrowUpRight size={11} aria-hidden="true" /></a><a href="#top">Back to top <ArrowUp size={11} aria-hidden="true" /></a></div><small>© {new Date().getFullYear()} Bhimavarapu Saketha Ram</small></footer>;
}
