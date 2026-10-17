import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

const suggestedQuestions = ['Tell me about the projects', 'What skills does Saketha have?', 'How can I get in touch?'];

function getAnswer(question) {
  const query = question.toLowerCase();
  if (/project|built|work|tourism|andhra|attendance|restaurant|face|recognition|reservation/.test(query)) {
    return <>There are three featured projects: <a href="#projects">Discover Andhra Pradesh</a>, a tourism guide; <a href="#projects">Smart Attendance System</a>, with face and liveness checks; and a responsive <a href="#projects">Restaurant Landing Page</a> with menu and reservation interface.</>;
  }
  if (/skill|language|technology|tech stack|tools|python|react|database|cloud/.test(query)) {
    return <>The portfolio lists Python, C, C++, JavaScript, HTML, CSS, React, SQL, MongoDB, Flask, Git, GitHub, AWS fundamentals, and computer science foundations including DSA, OOP, operating systems, DBMS, and networks. <a href="#skills">See the skills section.</a></>;
  }
  if (/education|university|degree|college|study|gpa|grade/.test(query)) {
    return <>Saketha is pursuing a B.Tech in Computer Science and Engineering at Vignan’s University (2023–2027). <a href="#education">See education.</a></>;
  }
  if (/certif|certificate|nptel|english test|aws certified|course|learning/.test(query)) {
    return <>The listed learning includes Machine Learning with Python, NPTEL E-Business, NPTEL Management Information System, Preliminary English Test (B1), C++ Data Structures in the STL, three job simulations, and AWS Certified Cloud Practitioner. Some dates are not specified in the supplied resume. <a href="#certifications">See certifications.</a></>;
  }
  if (/contact|email|reach|linkedin|github|resume|hire|connect/.test(query)) {
    return <>You can reach Saketha at <a href="mailto:rsaketh033@gmail.com">rsaketh033@gmail.com</a>, or visit <a href="https://github.com/Saketh-CSE" target="_blank" rel="noreferrer">GitHub</a> and <a href="https://linkedin.com/in/saketha-ram-b71371351" target="_blank" rel="noreferrer">LinkedIn</a>. <a href="#contact">Go to contact.</a></>;
  }
  if (/who|about|background|introduc|saketha|person/.test(query)) {
    return <>Bhimavarapu Saketha Ram is a computer science undergraduate at Vignan’s University, interested in software engineering, web development, Python, and machine learning. <a href="#about">Read the about section.</a></>;
  }
  if (/location|where|based/.test(query)) return <>The portfolio says Saketha is based in India. <a href="#contact">Go to contact.</a></>;
  return 'I can only answer questions about information on this portfolio. Try asking about projects, skills, education, or contact details.';
}

export default function PortfolioChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hi! I can help you explore Saketha’s projects, skills, education, or contact details. What would you like to know?' }]);
  const [question, setQuestion] = useState('');
  const launcherRef = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    inputRef.current?.focus();
    return undefined;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  const ask = (value) => {
    const clean = value.trim();
    if (!clean) return;
    setMessages((current) => [...current, { role: 'user', content: clean }, { role: 'assistant', content: getAnswer(clean) }]);
    setQuestion('');
  };

  return <>
    <button ref={launcherRef} className="chat-launcher" type="button" onClick={() => setIsOpen((open) => !open)} aria-label="Ask the portfolio assistant" aria-expanded={isOpen} aria-controls="portfolio-chat"><span className="chat-launcher-icon" aria-hidden="true"><MessageCircle size={18} /></span><span>Ask about this portfolio</span></button>
    <section className={`chat-panel${isOpen ? ' is-open' : ''}`} id="portfolio-chat" role="dialog" aria-modal="false" aria-labelledby="chat-title" aria-hidden={!isOpen} inert={!isOpen}>
      <div className="chat-header"><div className="chat-avatar" aria-hidden="true">SR</div><div className="chat-header-copy"><h2 id="chat-title">Portfolio assistant</h2><p><span className="status-dot" /> Only answers about this portfolio</p></div><button className="chat-close" type="button" aria-label="Close portfolio assistant" onClick={() => { setIsOpen(false); launcherRef.current?.focus(); }}><X size={18} /></button></div>
      <div className="chat-messages" ref={messagesRef} role="log" aria-live="polite" aria-relevant="additions text">{messages.map((message, index) => <div className={`chat-message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`} key={`${message.role}-${index}`}><p>{message.role === 'assistant' ? message.content : message.content}</p></div>)}</div>
      <div className="chat-suggestions" aria-label="Suggested questions">{suggestedQuestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => ask(suggestion)}>{suggestion.split(' ').slice(0, 2).join(' ')}</button>)}</div>
      <form className="chat-form" onSubmit={(event) => { event.preventDefault(); ask(question); }}><label className="visually-hidden" htmlFor="chat-input">Ask a question about this portfolio</label><input ref={inputRef} id="chat-input" name="question" type="text" maxLength={240} placeholder="Ask about this portfolio…" autoComplete="off" required value={question} onChange={(event) => setQuestion(event.target.value)} /><button type="submit" aria-label="Send message"><Send size={16} aria-hidden="true" /></button></form><p className="chat-scope-note">Portfolio information only · No external AI service</p>
    </section>
  </>;
}
