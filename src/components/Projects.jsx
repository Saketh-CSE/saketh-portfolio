import { projects } from '../data/portfolio.js';
import SectionKicker from './SectionKicker.jsx';
import SpiralProjectGallery from './SpiralProjectGallery.jsx';

export default function Projects() {
  return <section className="projects section-wrap section-block" id="projects" aria-labelledby="projects-title">
    <SectionKicker number="02" title="SELECTED WORK" note="MADE WITH PURPOSE" />
    <div className="section-heading"><div><p className="eyebrow">A few things I’ve built</p><h2 id="projects-title">Selected <em>projects.</em></h2></div><span className="heading-note">Three ideas, explored<br />through code and craft.</span></div>
    <SpiralProjectGallery projects={projects} />
  </section>;
}
