import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { socialLinks } from '../data/portfolio.js';
import Reveal from './Reveal.jsx';

export default function Hero() {
  return <section className="hero section-wrap" id="top" aria-labelledby="hero-title">
    <Reveal className="hero-copy">
      <p className="eyebrow"><span className="status-dot" /> Computer Science · Vignan’s University</p>
      <h1 id="hero-title">Bhimavarapu<br /><em>Saketha Ram.</em></h1>
      <div className="hero-lower"><p className="hero-intro">Building thoughtful digital experiences.<br /><span>Software engineering, web development, Python, and machine learning.</span></p><div className="hero-actions"><a className="button button-primary" href="#projects">Explore projects <ArrowDown size={14} aria-hidden="true" /></a><a className="button button-quiet" href="/resume.pdf" target="_blank" rel="noopener noreferrer">View Resume <ArrowUpRight size={14} aria-hidden="true" /></a></div></div>
      <div className="hero-social">{socialLinks.map((item) => <a href={item.href} target="_blank" rel="noreferrer" key={item.label}>{item.label} <ArrowUpRight size={12} aria-hidden="true" /></a>)}<span className="hero-location">Based in India</span></div>
      <a className="hero-scroll" href="#about"><span className="scroll-line" /> Scroll to explore <ArrowDown size={12} aria-hidden="true" /></a>
    </Reveal>
    <Reveal className="hero-art" delay={0.12}><div className="art-topline"><span>FIELD NOTES / 01</span><span>ANDHRA PRADESH</span></div><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-coordinate">AP<br /><span>01 — 03</span></div><div className="art-route" /><div className="art-cross cross-one">+</div><div className="art-cross cross-two">+</div><div className="art-bottomline"><span>CODE WITH CURIOSITY</span><span>EST. 2023</span></div><div className="glass-profile"><div className="profile-overline"><span>PROFILE / 01</span><span className="status-dot" /></div><p className="profile-role">Computer Science<br />undergraduate</p><p className="profile-focus">Software engineering · web · Python · ML</p><div className="profile-footer"><span>VIGNAN’S UNIVERSITY</span><span>2023 — 2027</span></div></div><span className="floating-skill skill-python">Python</span><span className="floating-skill skill-react">React</span></Reveal>
  </section>;
}
