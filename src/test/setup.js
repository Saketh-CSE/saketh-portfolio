import '@testing-library/jest-dom/vitest';

if (!globalThis.IntersectionObserver) {
  globalThis.IntersectionObserver = class IntersectionObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}


if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function getContext() { return null; };
}
