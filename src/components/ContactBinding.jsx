import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

const strands = [
  { d: 'M-55 74 C95 122 210 332 412 210 C552 125 686 115 955 258', tone: 'gold', weight: 'ribbon' },
  { d: 'M-50 315 C144 255 254 52 456 196 C610 304 752 336 952 102', tone: 'teal', weight: 'ribbon' },
  { d: 'M-48 190 C162 332 241 28 454 194 C628 360 762 42 956 202', tone: 'gold', weight: 'ribbon' },
  { d: 'M-42 132 C152 78 258 288 438 205 C597 130 756 176 956 290', tone: 'teal', weight: 'fine' },
  { d: 'M-52 264 C142 345 274 92 462 186 C628 270 771 89 952 132', tone: 'gold', weight: 'fine' },
  { d: 'M-40 34 C180 174 270 366 447 204 C607 58 763 316 956 242', tone: 'teal', weight: 'fine' },
  { d: 'M-50 352 C170 108 250 130 455 198 C640 260 760 30 950 82', tone: 'gold', weight: 'fine' },
];

export function getBindingDrawProgress(progress, index = 0) {
  const start = 0.04 + index * 0.025;
  const finish = 0.48 + index * 0.035;
  if (progress <= start || progress >= 1) return 0;
  if (progress < finish) return (progress - start) / (finish - start);
  if (progress <= 0.88) return 1;
  return (1 - progress) / 0.12;
}

function BindingStrand({ strand, index, progress, reduceMotion }) {
  const start = 0.04 + index * 0.025;
  const finish = 0.48 + index * 0.035;
  const draw = useTransform(progress, [0, start, finish, 0.88, 1], [0, 0, 1, 1, 0]);
  const opacity = useTransform(progress, [0, start, finish, 0.92, 1], [0, 0, 0.88, 0.55, 0]);
  return <motion.path
    d={strand.d}
    pathLength="1"
    key={strand.d}
    className={`binding-strand binding-strand--${strand.tone} binding-strand--${strand.weight}`}
    style={reduceMotion ? { pathLength: 1, opacity: 0.55 } : { pathLength: draw, opacity }}
  />;
}

export default function ContactBinding() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const progress = useSpring(scrollYProgress, { stiffness: 45, damping: 23, mass: 0.32 });
  const settle = useTransform(progress, [0, 0.52, 0.88, 1], [12, 0, -3, 0]);

  return <div className="contact-binding" ref={ref} aria-hidden="true">
    <motion.svg viewBox="0 0 900 390" preserveAspectRatio="xMidYMid slice" style={reduceMotion ? {} : { y: settle }}>
      <defs>
        <linearGradient id="binding-gold" x1="0" x2="1"><stop stopColor="#c89959" stopOpacity="0" /><stop offset=".48" stopColor="#d1a55f" stopOpacity=".86" /><stop offset="1" stopColor="#e3c383" stopOpacity="0" /></linearGradient>
        <linearGradient id="binding-teal" x1="0" x2="1"><stop stopColor="#4f827c" stopOpacity="0" /><stop offset=".52" stopColor="#59938a" stopOpacity=".72" /><stop offset="1" stopColor="#73a9a0" stopOpacity="0" /></linearGradient>
      </defs>
      {strands.map((strand, index) => <BindingStrand key={strand.d} strand={strand} index={index} progress={progress} reduceMotion={reduceMotion} />)}
    </motion.svg>
    <span className="binding-knot" />
  </div>;
}
