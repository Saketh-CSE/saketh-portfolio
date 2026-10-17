import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

describe('portfolio page', () => {
  it('renders the complete portfolio and portfolio-only assistant', () => {
    render(<ThemeProvider><App /></ThemeProvider>);

    expect(screen.getByRole('heading', { name: /Bhimavarapu Saketha Ram/i })).toBeInTheDocument();
    for (const id of ['about', 'projects', 'skills', 'education', 'certifications', 'contact']) {
      expect(document.getElementById(id)).toBeInTheDocument();
    }
    expect(screen.getByText('Saketh’s projects, skills, and background')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore projects' })).toHaveAttribute('href', '#projects');

    const projectLinks = screen.getAllByRole('link');
    const destinations = projectLinks.map((link) => link.getAttribute('href'));
    expect(destinations).toContain('https://github.com/Saketh-CSE/Discover-Andhrapradesh');
    expect(destinations).toContain('https://discover-andhrapradesh.onrender.com/');
    expect(destinations).toContain('https://github.com/Saketh-CSE/Smart-Webcam-attendance-System');
    expect(destinations).toContain('https://attendance-management-system-using-gamma.vercel.app/');
  });
});
