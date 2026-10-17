import '@testing-library/jest-dom/vitest';

if (!globalThis.IntersectionObserver) {
  globalThis.IntersectionObserver = class IntersectionObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
