import { describe, expect, it } from 'vitest';
import { getBindingDrawProgress } from './ContactBinding.jsx';

describe('contact binding scroll choreography', () => {
  it('emerges as Contact enters, converges through the section, and retracts by the end', () => {
    expect(getBindingDrawProgress(0)).toBe(0);
    expect(getBindingDrawProgress(0.5)).toBe(1);
    expect(getBindingDrawProgress(0.95)).toBeCloseTo(0.4167, 3);
    expect(getBindingDrawProgress(1)).toBe(0);
  });

  it('stagger varies the emergence timing across independent strands', () => {
    expect(getBindingDrawProgress(0.1, 0)).toBeGreaterThan(getBindingDrawProgress(0.1, 6));
    expect(getBindingDrawProgress(0.7, 6)).toBe(1);
  });
});
