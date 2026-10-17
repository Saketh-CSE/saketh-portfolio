import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { getPortfolioReply } from '../data/portfolioChat.js';

const suggestedQuestions = ['What has Saketh built?', 'What roles is he looking for?', 'What skills does he have?'];

function renderMessage(content) {
  if (typeof content === 'string') return content;
  return content.map((part, index) => part.href
    ? <span key={`${part.href}-${index}`}> <a href={part.href} target={part.href.startsWith('http') ? '_blank' : undefined} rel={part.href.startsWith('http') ? 'noopener noreferrer' : undefined}>{part.label}</a></span>
    : <span key={`text-${index}`}>{part.text}</span>);
}

export default function PortfolioChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hey! I’m Saketh’s AI assistant. Ask me about his projects, skills, or what he’s studying.' }]);
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
    setMessages((current) => [...current, { role: 'user', content: clean }, { role: 'assistant', content: getPortfolioReply(clean, current) }]);
    setQuestion('');
  };

  return <>
    <button ref={launcherRef} className="chat-launcher" type="button" onClick={() => setIsOpen((open) => !open)} aria-label="Ask the portfolio assistant" aria-expanded={isOpen} aria-controls="portfolio-chat"><span className="chat-launcher-icon" aria-hidden="true"><MessageCircle size={18} /></span><span>Ask about this portfolio</span></button>
    <section className={`chat-panel${isOpen ? ' is-open' : ''}`} id="portfolio-chat" role="dialog" aria-modal="false" aria-labelledby="chat-title" aria-hidden={!isOpen} inert={!isOpen}>
      <div className="chat-header"><div className="chat-avatar" aria-hidden="true">SR</div><div className="chat-header-copy"><h2 id="chat-title">Portfolio assistant</h2><p><span className="status-dot" /> Saketh’s projects, skills, and background</p></div><button className="chat-close" type="button" aria-label="Close portfolio assistant" onClick={() => { setIsOpen(false); launcherRef.current?.focus(); }}><X size={18} /></button></div>
      <div className="chat-messages" ref={messagesRef} role="log" aria-live="polite" aria-relevant="additions text">{messages.map((message, index) => <div className={`chat-message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`} key={`${message.role}-${index}`}><p>{message.role === 'assistant' ? renderMessage(message.content) : message.content}</p></div>)}</div>
      <div className="chat-suggestions" aria-label="Suggested questions">{suggestedQuestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => ask(suggestion)}>{suggestion}</button>)}</div>
      <form className="chat-form" onSubmit={(event) => { event.preventDefault(); ask(question); }}><label className="visually-hidden" htmlFor="chat-input">Ask a question about this portfolio</label><input ref={inputRef} id="chat-input" name="question" type="text" maxLength={240} placeholder="Ask about Saketh’s portfolio…" autoComplete="off" required value={question} onChange={(event) => setQuestion(event.target.value)} /><button type="submit" aria-label="Send message"><Send size={16} aria-hidden="true" /></button></form><p className="chat-scope-note">Portfolio info only · Replies stay on this device</p>
    </section>
  </>;
}
