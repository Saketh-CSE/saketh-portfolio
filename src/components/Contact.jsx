import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal.jsx';
import SectionKicker from './SectionKicker.jsx';

export default function Contact() {
  return <section className="contact section-wrap section-block" id="contact" aria-labelledby="contact-title"><Reveal className="contact-card"><SectionKicker number="05" title="SAY HELLO" note="GOOD THINGS START WITH A CONVERSATION" /><div className="contact-content"><div><p className="eyebrow">Have an idea in mind?</p><h2 id="contact-title">Let’s make<br /><em>it thoughtful.</em></h2></div><a className="contact-email" href="mailto:rsaketh033@gmail.com">rsaketh033@gmail.com <ArrowUpRight size={16} aria-hidden="true" /></a></div><div className="contact-bottom"><span>GUNTUR, INDIA</span><span>OPEN TO A GOOD CONVERSATION</span></div></Reveal></section>;
}
