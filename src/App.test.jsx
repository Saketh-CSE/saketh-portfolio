import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { projects } from './data/portfolio.js';

describe('portfolio page', () => {
  it('renders the complete portfolio and portfolio-only assistant', () => {
    const { container } = render(<ThemeProvider><App /></ThemeProvider>);

    expect(screen.getByRole('heading', { name: 'Bhimavarapu Saketha Ram' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /From a local.*to impact.*Built with care/i })).toBeInTheDocument();
    for (const id of ['about', 'projects', 'skills', 'education', 'certifications', 'contact']) {
      expect(document.getElementById(id)).toBeInTheDocument();
    }
    expect(screen.getByText('Saketh’s projects, skills, and background')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore projects' })).toHaveAttribute('href', '#projects');
    expect(container.querySelectorAll('#contact .contact-binding path')).toHaveLength(7);

    const projectLinks = screen.getAllByRole('link');
    const destinations = projectLinks.map((link) => link.getAttribute('href'));
    expect(destinations).toContain(projects[0].repositoryUrl);
    expect(destinations).toContain(projects[0].liveUrl);
    expect(screen.getByRole('heading', { name: 'Discover Andhra Pradesh' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Smart Attendance System' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Restaurant Landing Page' })).not.toBeInTheDocument();
  });
});
