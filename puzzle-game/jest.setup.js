import '@testing-library/jest-dom';

// Only keep the mocks you actually need
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Only mock AudioContext if your tests need it
if (!window.AudioContext) {
  window.AudioContext = jest.fn().mockImplementation(() => ({
    createOscillator: jest.fn(),
    createGain: jest.fn(),
    destination: {}
  }));
}

// Only mock next/font if you use it
jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'inter',
    style: { fontFamily: 'Inter' },
  }),
}));