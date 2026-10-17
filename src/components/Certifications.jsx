import { certifications } from '../data/portfolio.js';
import { Award } from 'lucide-react';
import Reveal from './Reveal.jsx';

export default function Certifications() {
  return <section className="certifications section-wrap" id="certifications" aria-labelledby="certifications-title"><Reveal className="education-details glass-surface"><div className="cert-heading"><h2 id="certifications-title"><Award size={17} aria-hidden="true" /> Certificates & learning</h2><span>SELECTED</span></div><ul className="cert-list">{certifications.map((certificate) => <li key={certificate.name}><span>{certificate.name}</span><span>{certificate.date}</span></li>)}</ul></Reveal></section>;
}
