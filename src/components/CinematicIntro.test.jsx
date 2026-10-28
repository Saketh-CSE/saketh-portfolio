import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CinematicIntro, { getNameRevealProgress } from './CinematicIntro.jsx';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  sessionStorage.clear();
});

describe('CinematicIntro', () => {
  it('uses the cinematic reveal as the only portfolio hero and keeps the name semantic', () => {
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    render(<CinematicIntro initiallyComplete onComplete={vi.fn()} />);

    expect(screen.getByRole('region', { name: 'Bhimavarapu Saketha Ram' })).toHaveAttribute('id', 'top');
    expect(screen.getByRole('heading', { name: 'Bhimavarapu Saketha Ram' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore projects/ })).toHaveAttribute('href', '#projects');
    expect(screen.getByRole('link', { name: /View Resume/ })).toHaveAttribute('href', '/resume.pdf');
  });

  it('keeps the name hidden before its scan and reveals only the flashlight-traversed portion', () => {
    expect(getNameRevealProgress(0)).toBe(0);
    expect(getNameRevealProgress(0.3)).toBe(0);
    expect(getNameRevealProgress(0.8)).toBeGreaterThan(0.5);
    expect(getNameRevealProgress(0.8)).toBeLessThan(1);
    expect(getNameRevealProgress(1)).toBe(1);
  });

  it('keeps the title masked at 0 and 30 percent, reveals progressively at 80, then completes at 100', () => {
    const frames = [];
    vi.stubGlobal('requestAnimationFrame', vi.fn((callback) => { frames.push(callback); return frames.length; }));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    vi.spyOn(performance, 'now').mockReturnValue(1000);
    const onComplete = vi.fn();
    render(<CinematicIntro onComplete={onComplete} />);
    const title = screen.getByRole('heading', { name: 'Bhimavarapu Saketha Ram' });
    const advance = (progress) => act(() => frames.shift()(1000 + progress * 5200));

    expect(title.style.getPropertyValue('--name-reveal')).toBe('0%');
    advance(0.3);
    expect(title.style.getPropertyValue('--name-reveal')).toBe('0%');
    advance(0.8);
    expect(Number.parseFloat(title.style.getPropertyValue('--name-reveal'))).toBeCloseTo(71.43, 1);
    expect(screen.getByRole('status')).toHaveTextContent('80%');
    expect(screen.getByRole('button', { name: 'Skip cinematic introduction' })).toBeInTheDocument();
    advance(1);
    expect(title.style.getPropertyValue('--name-reveal')).toBe('100%');
    expect(screen.queryByRole('button', { name: 'Skip cinematic introduction' })).not.toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('offers an immediate keyboard-accessible exit and remembers completion for this session', async () => {
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<CinematicIntro onComplete={onComplete} />);

    const skip = screen.getByRole('button', { name: 'Skip cinematic introduction' });
    expect(skip).toHaveFocus();
    await user.click(skip);

    expect(onComplete).toHaveBeenCalledOnce();
    expect(sessionStorage.getItem('saketh-cinematic-intro-seen')).toBe('true');
    expect(screen.getByRole('link', { name: /Explore projects/ })).toHaveAttribute('href', '#projects');
    expect(screen.queryByRole('button', { name: 'Skip cinematic introduction' })).not.toBeInTheDocument();
  });
});
