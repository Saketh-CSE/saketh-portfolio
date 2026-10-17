import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PortfolioChat from './PortfolioChat.jsx';
import { getPortfolioReply, replyToText } from '../data/portfolioChat.js';

afterEach(cleanup);

describe('PortfolioChat', () => {
  it('answers portfolio questions and redirects unrelated topics', async () => {
    const user = userEvent.setup();
    render(<PortfolioChat />);

    await user.click(screen.getByRole('button', { name: 'Ask the portfolio assistant' }));
    await user.type(screen.getByRole('textbox', { name: 'Ask a question about this portfolio' }), 'What projects are featured?{enter}');
    expect(screen.getByText(/Discover Andhra Pradesh/)).toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: 'Ask a question about this portfolio' }), 'Tell me a joke{enter}');
    expect(screen.getByText(/focused on Saketh’s portfolio/i)).toBeInTheDocument();
  });

  it('keeps project context through consecutive follow-ups', async () => {
    const user = userEvent.setup();
    render(<PortfolioChat />);
    await user.click(screen.getByRole('button', { name: 'Ask the portfolio assistant' }));
    const input = screen.getByRole('textbox', { name: 'Ask a question about this portfolio' });

    await user.type(input, 'Tell me about the attendance project{enter}');
    expect(screen.getByText(/eye-blink liveness checks/i)).toBeInTheDocument();
    await user.type(input, 'What tech stack did you use?{enter}');
    expect(screen.getAllByText(/Python, Flask, React Native, REST APIs, Machine learning/i).at(-1)).toBeInTheDocument();
    await user.type(input, 'Is it complete?{enter}');
    expect(screen.getByText(/doesn’t document whether this project is complete/i)).toBeInTheDocument();
  });
});

describe('portfolio chatbot response behavior', () => {
  it('introduces itself as Saketh’s assistant, not Saketh', () => {
    expect(replyToText(getPortfolioReply('Are you Saketh?'))).toMatch(/AI assistant, not Saketh himself/i);
    expect(replyToText(getPortfolioReply('Who am I talking to?'))).toMatch(/AI assistant, not Saketh himself/i);
  });

  it('answers profile and missing-information questions from portfolio facts', () => {
    expect(replyToText(getPortfolioReply('Where does he study?'))).toContain('Vignan’s University');
    expect(replyToText(getPortfolioReply('Hey, what do you do?'))).toMatch(/computer science undergraduate/i);
    expect(replyToText(getPortfolioReply('Is the attendance project finished?', [
      { role: 'user', content: 'Tell me about the attendance project' },
    ]))).toMatch(/doesn’t document whether this project is complete/i);
  });

  it('does not carry a project topic across to a new portfolio subject', () => {
    const history = [
      { role: 'user', content: 'Tell me about the attendance project' },
      { role: 'assistant', content: '...' },
      { role: 'user', content: 'What skills does Saketh have?' },
      { role: 'assistant', content: '...' },
    ];
    expect(replyToText(getPortfolioReply('Why did they choose this approach?', history))).not.toContain('Smart Attendance System');
  });

  it('keeps technical help within the portfolio scope', () => {
    expect(replyToText(getPortfolioReply('Can you teach me Python?'))).toMatch(/not set up as a general Python tutor/i);
    expect(replyToText(getPortfolioReply('Why did you use React?'))).toMatch(/reusable pieces/i);
  });

  it('varies conversational greetings without changing their meaning', () => {
    const first = replyToText(getPortfolioReply('Hey'));
    const later = replyToText(getPortfolioReply('Hey', [{ role: 'assistant', content: 'Welcome' }]));
    expect(first).not.toBe(later);
    expect(first + later).toMatch(/Saketh/);
  });

  it('answers recruiter questions from one career preference source', () => {
    expect(replyToText(getPortfolioReply('Which roles is Saketh looking for?'))).toMatch(/Frontend Developer, Software Developer, React Developer, Full-Stack Developer, Python Developer, AI\/ML Intern/);
    expect(replyToText(getPortfolioReply('Is he open to internships or full-time jobs?'))).toMatch(/internships and full-time positions/i);
    expect(replyToText(getPortfolioReply('What is the expected CTC?'))).toBe('Expected full-time CTC: ₹6–7 LPA, negotiable depending on the role and responsibilities.');
    expect(replyToText(getPortfolioReply('What stipend does he expect?'))).toBe('Expected stipend: ₹15,000 per month.');
    expect(replyToText(getPortfolioReply('Is he open to remote, hybrid, or on-site?'))).toMatch(/Remote, hybrid, and on-site opportunities are all acceptable/i);
    expect(replyToText(getPortfolioReply('When can he join?'))).toBe('Available to join immediately, subject to eligibility.');
    expect(replyToText(getPortfolioReply('Is he open to Python opportunities?'))).toMatch(/Python Developer is one of his preferred roles/i);
  });

  it('keeps a career follow-up connected and refuses to invent unknown terms', () => {
    const history = [{ role: 'user', content: 'What is his expected full-time salary?' }];
    expect(replyToText(getPortfolioReply('Is it negotiable?', history))).toMatch(/₹6–7 LPA, negotiable depending on the role and responsibilities/i);
    expect(replyToText(getPortfolioReply('Is the internship stipend negotiable?'))).toMatch(/isn’t documented/i);
    expect(replyToText(getPortfolioReply('What is the minimum stipend?'))).toMatch(/isn’t documented/i);
    expect(replyToText(getPortfolioReply('What is the minimum salary?'))).toMatch(/isn’t documented/i);
    expect(replyToText(getPortfolioReply('Has he had any internship experience?'))).toMatch(/can’t confirm that/i);
    expect(replyToText(getPortfolioReply('Can he relocate to a preferred city?'))).toMatch(/isn’t documented/i);
    expect(replyToText(getPortfolioReply('Is he eligible for this opening?'))).toMatch(/depends on the employer’s requirements/i);
  });

  it('understands a short follow-up about the preferred roles', () => {
    const history = [{ role: 'user', content: 'Which roles is Saketh looking for?' }];
    expect(replyToText(getPortfolioReply('Is he open to all of those?', history))).toMatch(/those are the roles Saketh is looking for/i);
  });

  it('answers the supplied project and recruiter sequence without losing knowledge or returning localhost links', () => {
    const questions = [
      'Who am I talking to?',
      'What skills does he have?',
      'What has Saketh built?',
      'What is his contact information?',
      'What are his projects?',
      'What has Saketh built?',
      'Tell me more about the attendance system.',
      'What technologies did he use?',
      'Where can I see that project?',
      'What is his location?',
    ];
    const conversation = [];
    const replies = questions.map((question) => {
      const reply = getPortfolioReply(question, conversation);
      conversation.push({ role: 'user', content: question }, { role: 'assistant', content: reply });
      return reply;
    });
    const firstBuildAnswer = replyToText(replies[2]);
    const repeatedBuildAnswer = replyToText(replies[5]);
    expect(firstBuildAnswer).toContain('Discover Andhra Pradesh');
    expect(firstBuildAnswer).toContain('Smart Attendance System');
    expect(firstBuildAnswer).toContain('Restaurant Landing Page');
    expect(repeatedBuildAnswer).toContain('Discover Andhra Pradesh');
    expect(repeatedBuildAnswer).toContain('Smart Attendance System');
    expect(replyToText(replies[6])).toMatch(/eye-blink liveness checks/i);
    expect(replyToText(replies[7])).toMatch(/Python, Flask, React Native, REST APIs, Machine learning/i);
    expect(replyToText(replies[8])).toContain('Live site');
    expect(replyToText(replies[9])).toContain('Guntur, India');
    expect(replies.flat().filter((part) => part.href).map((part) => part.href).join(' ')).not.toMatch(/localhost/i);
    expect(replies[1].find((part) => part.label === 'See the skills section')?.href).toBe('/#skills');
    expect(replies[8].find((part) => part.label === 'Live site')?.href).toBe('https://attendance-management-system-using-gamma.vercel.app/');
  });

  it('provides a working path to the deployed portfolio home without inventing a domain', () => {
    const reply = getPortfolioReply('What is Saketh’s portfolio URL?');
    expect(replyToText(reply)).toMatch(/already on Saketh’s portfolio/i);
    expect(reply.find((part) => part.label === 'Portfolio home')?.href).toBe('/');
  });
});
