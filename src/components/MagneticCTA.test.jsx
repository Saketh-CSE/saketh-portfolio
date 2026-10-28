import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import MagneticCTA from './MagneticCTA.jsx';
import { ThemeProvider } from '../context/ThemeContext.jsx';
import { getVenomPalette } from './venomPalette.js';

const renderCTA = (props) => render(<MagneticCTA {...props} />, { wrapper: ThemeProvider });

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
  document.documentElement.dataset.theme = 'light';
  localStorage.removeItem('portfolio-theme');
});

describe('Nexus Venom CTA adaptation', () => {
  it('preserves the single accessible contact link and click behavior', () => {
    const onClick = vi.fn();
    renderCTA({ onClick });

    const cta = screen.getByRole('link', { name: /let’s talk/i });
    expect(cta).toHaveAttribute('href', '#contact');
    fireEvent.click(cta);
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getAllByRole('link', { name: /let’s talk/i })).toHaveLength(1);
  });

  it('keeps the animation stage fixed and non-interactive outside the CTA', () => {
    renderCTA();
    const stage = document.querySelector('.venom-stage');
    expect(stage).not.toHaveAttribute('aria-hidden', 'true');
    expect(stage.style.position).toBe('fixed');
    expect(stage.style.inset).toBe('0');
    expect(stage.style.pointerEvents).toBe('none');
    expect(stage.querySelectorAll('canvas')).toHaveLength(3);
    expect([...stage.querySelectorAll('canvas')].every((canvas) => canvas.getAttribute('aria-hidden') === 'true')).toBe(true);
  });

  it('keeps a glossy white fallback pill in dark theme when WebGL is unavailable', () => {
    localStorage.setItem('portfolio-theme', 'dark');
    renderCTA();
    const cta = screen.getByRole('link', { name: /let’s talk/i });
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(cta.style.backgroundImage).toContain('linear-gradient');
    expect(cta.style.color).toBe('rgb(17, 20, 17)');
  });

  it('uses black Venom for light theme and white Venom for dark theme', () => {
    expect(getVenomPalette('light').body).toEqual([0.008, 0.008, 0.01]);
    expect(getVenomPalette('light').shadow).toEqual([0.025, 0.03, 0.027]);
    expect(getVenomPalette('dark').body).toEqual([0.97, 0.98, 0.96]);
    expect(getVenomPalette('dark').shadow).toEqual([0.38, 0.41, 0.39]);
  });
});


