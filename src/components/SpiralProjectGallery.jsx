import { ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import ProjectArtwork from './ProjectArtwork.jsx';

function ProjectSlide({ project, direction, reduceMotion, animateIn = true }) {
  return <motion.article
    key={project.number}
    className={`project-card project-${project.number} spiral-card`}
    custom={direction}
    initial={!animateIn || reduceMotion ? false : { opacity: 0, y: direction * 24, rotateY: direction * 3 }}
    animate={animateIn ? { opacity: 1, y: 0, rotateY: 0 } : undefined}
    exit={!animateIn || reduceMotion ? undefined : { opacity: 0, y: direction * -20, rotateY: direction * -2 }}
    transition={{ duration: reduceMotion || !animateIn ? 0 : 0.34, ease: [0.2, 0.7, 0.2, 1] }}
    aria-labelledby={`project-${project.number}-title`}
  >
    <ProjectArtwork type={project.cover} label={project.coverLabel} />
    <div className="project-info">
      <div className="project-index">{project.number} <span>{project.category}</span></div>
      <h3 id={`project-${project.number}-title`}>{project.title}</h3>
      <p>{project.description}</p>
      <div className="tech-list">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
      <div className="project-links">
        {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Visit live site <ArrowUpRight size={13} aria-hidden="true" /></a>}
        <a href={project.repositoryUrl ?? 'https://github.com/Saketh-CSE'} target="_blank" rel="noopener noreferrer">{project.repositoryUrl ? 'GitHub repository' : 'GitHub profile'} <ArrowUpRight size={13} aria-hidden="true" /></a>
      </div>
    </div>
  </motion.article>;
}

export function getActiveIndex(progress, count) {
  if (count <= 0) return 0;
  return Math.min(count - 1, Math.max(0, Math.floor(Math.max(0, progress) * count)));
}

export default function SpiralProjectGallery({ projects }) {
  const galleryRef = useRef(null);
  const previousIndexRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const [compact, setCompact] = useState(() => window.matchMedia?.('(max-width: 900px)').matches ?? window.innerWidth <= 900);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const { scrollYProgress } = useScroll({ target: galleryRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 27, mass: 0.28 });
  const orbitRotation = useTransform(progress, [0, 1], [reduceMotion ? 0 : -58, reduceMotion ? 0 : 302]);
  const selected = projects[activeIndex] ?? projects[0];

  useEffect(() => {
    const query = window.matchMedia?.('(max-width: 900px)');
    if (query) {
      const update = (event) => setCompact(event.matches);
      setCompact(query.matches);
      query.addEventListener?.('change', update);
      return () => query.removeEventListener?.('change', update);
    }
    const update = () => setCompact(window.innerWidth <= 900);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const syncActiveProject = useCallback((value) => {
    const nextIndex = getActiveIndex(value, projects.length);
    if (nextIndex === previousIndexRef.current) return;
    setDirection(nextIndex > previousIndexRef.current ? 1 : -1);
    previousIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  }, [projects.length]);

  useMotionValueEvent(progress, 'change', syncActiveProject);
  useEffect(() => syncActiveProject(progress.get()), [progress, syncActiveProject]);

  if (!projects.length) return null;

  return <>
    {(compact || reduceMotion) && <div className={`project-list${compact ? ' project-list--mobile' : ' project-list--reduced'}`}>
      {projects.map((project) => <ProjectSlide key={project.number} project={project} direction={0} reduceMotion={reduceMotion} animateIn={false} />)}
    </div>}
    <div className="project-spiral" ref={galleryRef} data-active-project={selected.number} hidden={compact || reduceMotion} aria-hidden={compact || reduceMotion || undefined} inert={compact || reduceMotion || undefined}>
      <div className="project-spiral__stage" role="region" aria-label="Featured project, use page scroll to change projects">
        <div className="project-orbit-anchor" aria-hidden="true">
          <motion.div className="project-orbit" style={reduceMotion ? {} : { rotate: orbitRotation, scaleY: 0.31 }}>
            <span /><span /><span />
          </motion.div>
        </div>
        <div className="project-spiral__cards" aria-live="polite">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <ProjectSlide key={selected.number} project={selected} direction={direction} reduceMotion={reduceMotion} />
          </AnimatePresence>
        </div>
        <div className="spiral-progress" aria-hidden="true"><span>PROJECT {String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span><i><b style={{ transform: `scaleX(${(activeIndex + 1) / projects.length})` }} /></i></div>
      </div>
    </div>
  </>;
}
