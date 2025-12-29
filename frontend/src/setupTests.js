import '@testing-library/jest-dom';

// jsdom doesn't implement ResizeObserver used by recharts; provide a minimal stub
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!global.ResizeObserver) {
  global.ResizeObserver = ResizeObserver;
}
