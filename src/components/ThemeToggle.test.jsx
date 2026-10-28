import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../context/ThemeContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.dataset.theme = 'light';
});

describe('ThemeToggle', () => {
  it('starts in light mode and switches to dark mode', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);

    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem('portfolio-theme')).toBe('dark');
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('restores a saved theme preference', () => {
    localStorage.setItem('portfolio-theme', 'dark');
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('keeps the final theme consistent when toggled rapidly', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(document.documentElement).toHaveAttribute('data-theme-transitioning', 'true');

    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(localStorage.getItem('portfolio-theme')).toBe('light');
  });
});
