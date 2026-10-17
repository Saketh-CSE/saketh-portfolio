import { education } from '../data/portfolio.js';
import Reveal from './Reveal.jsx';
import SectionKicker from './SectionKicker.jsx';

export default function Education() {
  return <section className="education section-wrap section-block" id="education" aria-labelledby="education-title"><SectionKicker number="04" title="EDUCATION" note="LEARNING IN PROGRESS" /><div className="education-grid"><Reveal className="education-intro"><p className="eyebrow">The foundation</p><h2 id="education-title">Learning to<br /><em>build better.</em></h2></Reveal><Reveal className="education-details glass-surface" delay={0.08}><span className="education-panel-label">ACADEMIC PATH</span><article className="education-entry"><div className="education-date">{education.dates}</div><div><h3>{education.institution}</h3><p>{education.degree}</p><span className="education-note">Currently pursuing</span></div></article></Reveal></div></section>;
}
