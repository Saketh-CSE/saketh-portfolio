import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { projects } from '../data/portfolio.js';
import ProjectArtwork from './ProjectArtwork.jsx';

export default function StoryReveal() {
  const sceneRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ['start end', 'end start'] });
  const progress = useSpring(scrollYProgress, { stiffness: 48, damping: 22, mass: 0.3 });
  const clipPath = useTransform(progress, [0.12, 0.52, 0.9], ['inset(36% 30% 34% 30% round 50%)', 'inset(0% 0% 0% 0% round 4px)', 'inset(8% 4% 8% 4% round 4px)']);
  const y = useTransform(progress, [0, 1], [reduceMotion ? 0 : 70, reduceMotion ? 0 : -45]);
  const rotate = useTransform(progress, [0, 0.55, 1], [reduceMotion ? 0 : -3, 0, reduceMotion ? 0 : 2]);
  const featured = projects[0];

  return <section className="story-reveal section-wrap" ref={sceneRef} aria-labelledby="story-title">
    <div className="story-meta"><span>01 / THE PROCESS</span><span>IDEAS INTO EXPERIENCE</span></div>
    <h2 className="story-title" id="story-title"><span>From a local</span><span className="story-middle"><em>idea</em><motion.span className="story-artwork" style={reduceMotion ? {} : { clipPath, y, rotate }}><ProjectArtwork type={featured.cover} label={featured.coverLabel} /></motion.span><em>to impact.</em></span><span>Built with care.</span></h2>
    <p className="story-caption">A field guide to Andhra Pradesh, shaped into a digital place to explore.</p>
    <span className="story-light story-light--gold" aria-hidden="true" />
    <span className="story-light story-light--teal" aria-hidden="true" />
  </section>;
}
