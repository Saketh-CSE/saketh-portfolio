import { skillGroups } from '../data/portfolio.js';
import Reveal from './Reveal.jsx';
import SectionKicker from './SectionKicker.jsx';

export default function Skills() {
  return <section className="skills section-wrap section-block" id="skills" aria-labelledby="skills-title"><SectionKicker number="03" title="TOOLKIT" note="WHAT I WORK WITH" /><div className="skills-grid"><Reveal className="skills-intro-panel"><p className="eyebrow">A growing practice</p><h2 id="skills-title">Tools for<br /><em>good work.</em></h2><p className="skills-intro">A practical toolkit for building and understanding software, from the first interface to the data underneath.</p></Reveal><Reveal className="skill-groups" delay={0.08}>{skillGroups.map((group, index) => <div className="skill-group glass-surface" key={group.title}><span className="skill-number">0{index + 1}</span><div><h3>{group.title}</h3><p>{group.skills.map((skill, skillIndex) => <span className="skill-chip" key={skill}>{skill}</span>)}</p></div></div>)}</Reveal></div></section>;
}
