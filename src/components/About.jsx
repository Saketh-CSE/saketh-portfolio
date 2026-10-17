import { ArrowDownRight } from 'lucide-react';
import Reveal from './Reveal.jsx';
import SectionKicker from './SectionKicker.jsx';

export default function About() {
  return <section className="about section-wrap section-block" id="about" aria-labelledby="about-title">
    <SectionKicker number="01" title="ABOUT" note="THE PERSON BEHIND THE WORK" />
    <div className="about-grid"><Reveal className="about-heading-panel glass-surface"><span className="panel-index">A NOTE ON MY APPROACH</span><h2 id="about-title">Curious by nature.<br /><em>Intentional by design.</em></h2><span className="panel-mark" aria-hidden="true">SR</span></Reveal><Reveal className="about-copy glass-surface" delay={0.08}><p>I’m a computer science undergraduate who enjoys making useful ideas work in the real world. My interests span the full journey: shaping a clear interface, building the systems behind it, and making the details feel considered.</p><p>From a regional tourism guide to a face-verification attendance system, I look for the human problem behind the technical challenge.</p><a className="text-link" href="#contact">A little more about what I do <ArrowDownRight size={14} aria-hidden="true" /></a></Reveal></div>
  </section>;
}
