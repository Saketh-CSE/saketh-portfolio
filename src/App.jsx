import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import Skills from './components/Skills.jsx';
import Education from './components/Education.jsx';
import Certifications from './components/Certifications.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import PortfolioChat from './components/PortfolioChat.jsx';
import ThemeTransition from './components/ThemeTransition.jsx';
import Hero from './components/Hero.jsx';
import CinematicAtmosphere from './components/CinematicAtmosphere.jsx';
import StoryReveal from './components/StoryReveal.jsx';

function hasSeenIntro() {
  if (import.meta.env.MODE === 'test') return true;
  try { return sessionStorage.getItem('saketh-cinematic-intro-seen') === 'true'; }
  catch { return false; }
}

export default function App() {
  const [introComplete, setIntroComplete] = useState(hasSeenIntro);
  return <>
    <div className={`portfolio-site${introComplete ? '' : ' is-intro-running'}`}>
      <a className="skip-link" href="#main">Skip to content</a>
      <CinematicAtmosphere />
      <Navbar isInert={!introComplete} />
      <main id="main">
        <Hero initiallyComplete={introComplete} onComplete={() => setIntroComplete(true)} />
        <div className="portfolio-content" inert={!introComplete || undefined} aria-hidden={!introComplete || undefined}>
          <About />
          <StoryReveal />
          <Projects />
          <Skills />
          <Education />
          <Certifications />
          <Contact />
        </div>
      </main>
      <div className="portfolio-footer-wrap" inert={!introComplete || undefined} aria-hidden={!introComplete || undefined}><Footer /></div>
      <div className="portfolio-chat-wrap" inert={!introComplete || undefined} aria-hidden={!introComplete || undefined}><PortfolioChat /></div>
      <ThemeTransition />
    </div>
  </>;
}
