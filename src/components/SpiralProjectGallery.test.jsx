import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import SpiralProjectGallery, { getActiveIndex } from './SpiralProjectGallery.jsx';
import { projects } from '../data/portfolio.js';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('SpiralProjectGallery', () => {
  it('maps scroll progress deterministically to one project, in either direction', () => {
    expect([0, 0.2, 0.34, 0.66, 0.67, 1].map((progress) => getActiveIndex(progress, projects.length))).toEqual([0, 0, 1, 1, 2, 2]);
    expect([0.8, 0.4, 0].map((progress) => getActiveIndex(progress, projects.length))).toEqual([2, 1, 0]);
  });

  it('shows one active project at a time on desktop', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
    render(<SpiralProjectGallery projects={projects} />);

    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Discover Andhra Pradesh' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /visit live site/i })).toHaveAttribute('href', projects[0].liveUrl);
    expect(screen.getByRole('link', { name: /github repository/i })).toHaveAttribute('href', projects[0].repositoryUrl);
  });

  it('renders every project in a simple vertical list on compact screens', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
    render(<SpiralProjectGallery projects={projects} />);

    expect(screen.getAllByRole('article')).toHaveLength(projects.length);
    for (const project of projects) expect(screen.getByRole('heading', { name: project.title })).toBeInTheDocument();
    expect(document.querySelector('.project-spiral')).toHaveAttribute('hidden');
  });
});
