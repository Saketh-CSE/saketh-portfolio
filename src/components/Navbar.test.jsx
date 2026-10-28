import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from './Navbar.jsx';
import { ThemeProvider } from '../context/ThemeContext.jsx';

beforeEach(() => {
  localStorage.setItem('portfolio-theme', 'light');
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getRect() {
    if (this.classList?.contains('venom-cta-slot')) {
      return { x: 400, y: 20, left: 400, top: 20, right: 500, bottom: 56, width: 100, height: 36, toJSON() {} };
    }
    return { x: 0, y: 0, left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, toJSON() {} };
  });
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.dataset.theme = 'light';
});

describe('Navbar', () => {
  it('preserves the contact CTA link and label', () => {
    render(<ThemeProvider><Navbar /></ThemeProvider>);
    expect(screen.getByRole('link', { name: 'Let’s talk' })).toHaveAttribute('href', '#contact');
  });

  it('restores the light and dark theme switch and applies its selection', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><Navbar /></ThemeProvider>);
    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('opens its menu and closes it on Escape with focus returned to the toggle', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><Navbar /></ThemeProvider>);
    const toggle = screen.getByRole('button', { name: 'Open navigation menu' });

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });
});
