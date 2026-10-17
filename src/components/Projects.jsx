import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { projects } from '../data/portfolio.js';
import Reveal from './Reveal.jsx';
import SectionKicker from './SectionKicker.jsx';
import ProjectArtwork from './ProjectArtwork.jsx';

export default function Projects() {
  const reduceMotion = useReducedMotion();
  return <section className="projects section-wrap section-block" id="projects" aria-labelledby="projects-title">
    <SectionKicker number="02" title="SELECTED WORK" note="MADE WITH PURPOSE" />
    <div className="section-heading"><div><p className="eyebrow">A few things I’ve built</p><h2 id="projects-title">Selected <em>projects.</em></h2></div><span className="heading-note">Three ideas, explored<br />through code and craft.</span></div>
    <div className="project-list">{projects.map((project, index) => <motion.article className={`project-card project-${project.number}`} key={project.number} initial={reduceMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : index * 0.04 }}>
      <ProjectArtwork type={project.cover} label={project.coverLabel} />
      <div className="project-info"><div className="project-index">{project.number} <span>{project.category}</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="tech-list">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div><div className="project-links">{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">Visit live site <ArrowUpRight size={13} aria-hidden="true" /></a>}<a href={project.repositoryUrl ?? 'https://github.com/Saketh-CSE'} target="_blank" rel="noreferrer">{project.repositoryUrl ? 'GitHub repository' : 'GitHub profile'} <ArrowUpRight size={13} aria-hidden="true" /></a></div></div>
    </motion.article>)}</div>
  </section>;
}
