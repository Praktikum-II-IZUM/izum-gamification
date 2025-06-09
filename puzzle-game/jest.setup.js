import '@testing-library/jest-dom';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

window.AudioContext = jest.fn().mockImplementation(() => ({
  createOscillator: jest.fn(),
  createGain: jest.fn(),
  destination: {}
}));

jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'inter',
    style: { fontFamily: 'Inter' },
  }),
}));
