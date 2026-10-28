import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { profile, socialLinks } from '../data/portfolio.js';

const DURATION = 5200;
const SCAN_START = 0.3;
const DUST = Array.from({ length: 46 }, (_, index) => ({
  x: ((index * 73 + 19) % 997) / 997,
  y: ((index * 137 + 43) % 991) / 991,
  size: 0.55 + ((index * 17) % 13) / 10,
  drift: ((index * 29) % 23) / 10,
  phase: ((index * 31) % 97) / 97,
}));

export function getNameRevealProgress(progress) {
  if (progress <= SCAN_START) return 0;
  return Math.min(1, Math.max(0, (progress - SCAN_START) / (1 - SCAN_START)));
}

function pointAt(progress, bounds, nameBounds) {
  if (progress < SCAN_START) {
    const t = progress / SCAN_START;
    return {
      x: (0.12 + t * 0.76) * bounds.width,
      y: (0.25 + Math.sin(t * Math.PI * 2) * 0.13) * bounds.height,
    };
  }

  const reveal = getNameRevealProgress(progress);
  const beamX = nameBounds.left - bounds.left + reveal * nameBounds.width;
  return {
    x: beamX,
    y: nameBounds.top - bounds.top + nameBounds.height * (0.5 + Math.sin(reveal * Math.PI) * 0.05),
  };
}

function paintSearchlight(canvas, progress, time, nameElement) {
  const context = canvas?.getContext?.('2d');
  if (!context) return;
  const bounds = canvas.getBoundingClientRect();
  const nameBounds = nameElement?.getBoundingClientRect?.() ?? {
    left: bounds.width * 0.2, top: bounds.height * 0.42, width: bounds.width * 0.6, height: bounds.height * 0.15,
  };
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.max(1, Math.round(bounds.width * dpr));
  const height = Math.max(1, Math.round(bounds.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  const w = bounds.width, h = bounds.height;
  const light = pointAt(progress, bounds, nameBounds);
  const lx = light.x, ly = light.y;
  const sourceX = lx + w * 0.11, sourceY = ly + h * 0.09;

  context.clearRect(0, 0, w, h);
  context.fillStyle = 'rgba(2, 7, 9, .985)';
  context.fillRect(0, 0, w, h);
  context.globalCompositeOperation = 'destination-out';
  context.beginPath();
  context.moveTo(sourceX, sourceY);
  context.lineTo(lx - w * 0.31, ly + h * 0.43);
  context.quadraticCurveTo(lx - w * 0.16, ly + h * 0.16, lx, ly);
  context.quadraticCurveTo(lx + w * 0.14, ly - h * 0.14, lx + w * 0.31, ly - h * 0.43);
  context.closePath();
  const beam = context.createRadialGradient(sourceX, sourceY, 3, lx, ly, Math.max(w, h) * 0.46);
  beam.addColorStop(0, 'rgba(255,255,255,.38)');
  beam.addColorStop(0.52, 'rgba(255,255,255,.22)');
  beam.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = beam;
  context.fill();
  const radius = Math.max(80, Math.min(w, h) * 0.17);
  const hotspot = context.createRadialGradient(lx, ly, 0, lx, ly, radius);
  hotspot.addColorStop(0, 'rgba(255,255,255,.99)');
  hotspot.addColorStop(0.42, 'rgba(255,255,255,.9)');
  hotspot.addColorStop(0.78, 'rgba(255,255,255,.56)');
  hotspot.addColorStop(1, 'rgba(255,255,255,0)');
  context.beginPath();
  context.arc(lx, ly, radius, 0, Math.PI * 2);
  context.fillStyle = hotspot;
  context.fill();
  context.globalCompositeOperation = 'source-over';
  context.save();
  context.globalCompositeOperation = 'screen';
  const tealHalo = context.createRadialGradient(lx, ly, radius * 0.48, lx, ly, radius * 1.9);
  tealHalo.addColorStop(0, 'rgba(52, 144, 134, .08)');
  tealHalo.addColorStop(1, 'rgba(52, 144, 134, 0)');
  context.fillStyle = tealHalo;
  context.fillRect(lx - radius * 2, ly - radius * 2, radius * 4, radius * 4);
  context.fillStyle = 'rgba(236, 184, 104, .42)';
  context.shadowColor = 'rgba(238, 179, 89, .8)';
  context.shadowBlur = 28;
  for (const mote of DUST) {
    const flutter = Math.sin(time * 0.0007 + mote.phase * Math.PI * 2) * mote.drift;
    const x = (mote.x * w + flutter + w) % w;
    const y = (mote.y * h - (time * 0.008 * mote.drift) % h + h) % h;
    const distance = Math.hypot(x - lx, y - ly);
    if (distance < radius * 1.55) {
      context.globalAlpha = Math.max(0.08, 0.72 * (1 - distance / (radius * 1.8)));
      context.beginPath();
      context.arc(x, y, mote.size, 0, Math.PI * 2);
      context.fill();
    }
  }
  context.restore();
}

export default function CinematicIntro({ initiallyComplete = false, onComplete }) {
  const canvasRef = useRef(null);
  const nameRef = useRef(null);
  const completeRef = useRef(initiallyComplete);
  const skipRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(initiallyComplete ? 1 : 0);
  const [isComplete, setIsComplete] = useState(initiallyComplete);
  const [showOverlay, setShowOverlay] = useState(!initiallyComplete);

  const finish = useCallback(() => {
    if (completeRef.current) return;
    completeRef.current = true;
    setProgress(1);
    setIsComplete(true);
    if (document.activeElement === skipRef.current) nameRef.current?.focus({ preventScroll: true });
    window.setTimeout(() => setShowOverlay(false), reduceMotion ? 0 : 760);
    try { sessionStorage.setItem('saketh-cinematic-intro-seen', 'true'); } catch { /* Session storage is optional. */ }
    onComplete?.();
  }, [onComplete, reduceMotion]);

  useEffect(() => {
    if (initiallyComplete) return undefined;
    skipRef.current?.focus({ preventScroll: true });
    if (reduceMotion) {
      finish();
      return undefined;
    }

    let raf = 0;
    const startedAt = performance.now();
    let lastPercentageUpdate = 0;
    const frame = (now) => {
      const timeline = Math.min(1, Math.max(0, (now - startedAt) / DURATION));
      paintSearchlight(canvasRef.current, timeline, now, nameRef.current);
      if (now - lastPercentageUpdate > 80 || timeline === 1) {
        setProgress(timeline);
        lastPercentageUpdate = now;
      }
      if (timeline >= 1) finish();
      else raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const onResize = () => paintSearchlight(canvasRef.current, Math.min(1, (performance.now() - startedAt) / DURATION), performance.now(), nameRef.current);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [finish, initiallyComplete, reduceMotion]);

  const nameReveal = getNameRevealProgress(progress);
  return <section className={`hero section-wrap cinematic-hero${isComplete ? ' is-intro-complete' : ' is-intro-running'}`} id="top" aria-labelledby="hero-title" aria-label={profile.fullName}>
    {showOverlay && <div className={`intro-overlay${isComplete ? ' is-fading' : ''}`} aria-hidden="true">
      <div className="intro-room">
        <div className="intro-window-light" />
        <div className="intro-workspace"><div className="intro-monitor"><span>const ideas = build<span className="intro-teal">(care)</span>;</span><i>01&nbsp;&nbsp; / &nbsp;&nbsp;CREATE</i></div><div className="intro-desk" /></div>
        <p className="intro-side-note">NOTES FROM THE PROCESS<br /><span>GUNTUR · INDIA</span></p>
        <p className="intro-coordinate">FIELD STUDY&nbsp; / &nbsp;01</p>
      </div>
      <canvas ref={canvasRef} className="intro-light-canvas" aria-hidden="true" />
      <div className="intro-grain" />
    </div>}
    <div className="intro-name-wrap">
      <p className="intro-kicker">A CREATIVE DEVELOPER’S PORTFOLIO</p>
      <h1 id="hero-title" ref={nameRef} tabIndex="-1" aria-label={profile.fullName} style={{ '--name-reveal': `${nameReveal * 100}%` }}><span>BHIMAVARAPU</span><span><em>SAKETHA</em> RAM</span></h1>
      <span className="intro-name-rule" />
      <p className="intro-manifesto">Curiosity in motion. Ideas made real.</p>
    </div>
    <div className={`cinematic-hero-content${isComplete ? ' is-visible' : ''}`} inert={!isComplete || undefined} aria-hidden={!isComplete || undefined}>
      <div className="cinematic-hero-copy">
        <p className="eyebrow"><span className="status-dot" /> Computer Science · Vignan’s University</p>
        <p className="hero-intro">Building thoughtful digital experiences.<br /><span>Software engineering, web development, Python, and machine learning.</span></p>
        <div className="hero-actions"><a className="button button-primary" href="#projects">Explore projects <ArrowDown size={14} aria-hidden="true" /></a><a className="button button-quiet" href="/resume.pdf" target="_blank" rel="noopener noreferrer">View Resume <ArrowUpRight size={14} aria-hidden="true" /></a></div>
        <div className="hero-social">{socialLinks.map((item) => <a href={item.href} target="_blank" rel="noreferrer" key={item.label}>{item.label} <ArrowUpRight size={12} aria-hidden="true" /></a>)}<span className="hero-location">Based in India</span></div>
        <a className="hero-scroll" href="#about"><span className="scroll-line" /> Scroll to explore <ArrowDown size={12} aria-hidden="true" /></a>
      </div>
      <div className="hero-art" aria-label="Field notes from Andhra Pradesh">
        <div className="art-topline"><span>FIELD NOTES / 01</span><span>ANDHRA PRADESH</span></div><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-coordinate">AP<br /><span>01 — 03</span></div><div className="art-route" /><div className="art-cross cross-one">+</div><div className="art-cross cross-two">+</div><div className="art-bottomline"><span>CODE WITH CURIOSITY</span><span>EST. 2023</span></div><div className="glass-profile"><div className="profile-overline"><span>PROFILE / 01</span><span className="status-dot" /></div><p className="profile-role">Computer Science<br />undergraduate</p><p className="profile-focus">Software engineering · web · Python · ML</p><div className="profile-footer"><span>VIGNAN’S UNIVERSITY</span><span>2023 — 2027</span></div></div><span className="floating-skill skill-python">Python</span><span className="floating-skill skill-react">React</span>
      </div>
    </div>
    {!isComplete && <>
      <div className="intro-progress" id="cinematic-intro-status" role="status" aria-live="off"><span>ENTERING THE PORTFOLIO</span><strong>{Math.round(progress * 100)}%</strong><span className="intro-progress-track"><i style={{ width: `${progress * 100}%` }} /></span></div>
      <button ref={skipRef} type="button" className="intro-skip" onClick={finish} aria-label="Skip cinematic introduction">Skip intro <span aria-hidden="true">↗</span></button>
    </>}
  </section>;
}
