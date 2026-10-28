import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

const trails = [
  { d: 'M-180 290 C180 80 285 610 690 315 S1150 120 1490 395', delay: 0 },
  { d: 'M-170 640 C240 390 340 60 760 320 S1170 730 1500 500', delay: 0.08 },
  { d: 'M-160 90 C190 490 440 560 760 250 S1200 40 1500 270', delay: 0.16 },
];

export default function CinematicAtmosphere() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 42, damping: 22, mass: 0.3 });
  const rotate = useTransform(progress, [0, 1], [reduceMotion ? -2 : -8, reduceMotion ? 2 : 11]);
  const y = useTransform(progress, [0, 1], [reduceMotion ? 0 : 30, reduceMotion ? 0 : -55]);
  const opacity = useTransform(progress, [0, 0.12, 0.88, 1], [0.38, 0.72, 0.58, 0.34]);
  const firstTrail = useTransform(progress, [0, 1], [0.22, 1]);
  const secondTrail = useTransform(progress, [0, 1], [0.26, 1]);
  const thirdTrail = useTransform(progress, [0, 1], [0.3, 1]);
  const trailProgress = [firstTrail, secondTrail, thirdTrail];

  return <motion.div className="cinematic-atmosphere" aria-hidden="true" style={{ rotate, y, opacity }}>
    <div className="atmosphere-vignette" />
    <svg className="atmosphere-trails" viewBox="0 0 1320 760" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="trail-gold" x1="0" x2="1"><stop stopColor="currentColor" stopOpacity="0" /><stop offset=".48" stopColor="currentColor" stopOpacity=".78" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient>
        <linearGradient id="trail-teal" x1="0" x2="1"><stop stopColor="currentColor" stopOpacity="0" /><stop offset=".5" stopColor="currentColor" stopOpacity=".6" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient>
      </defs>
      {trails.map((trail, index) => <motion.path key={trail.d} d={trail.d} pathLength="1" className={index === 1 ? 'trail trail-gold' : 'trail trail-teal'} style={reduceMotion ? {} : { pathLength: trailProgress[index], strokeDasharray: '1 1', strokeDashoffset: trail.delay }} />)}
    </svg>
    <span className="atmosphere-orbit atmosphere-orbit--one" />
    <span className="atmosphere-orbit atmosphere-orbit--two" />
  </motion.div>;
}
