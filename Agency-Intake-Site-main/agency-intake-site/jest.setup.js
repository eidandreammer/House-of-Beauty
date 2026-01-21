import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock canvas for color wheel tests
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn(() => ({
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    arc: jest.fn(),
    closePath: jest.fn(),
    fillStyle: '',
    fill: jest.fn(),
    strokeStyle: '',
    lineWidth: 0,
    stroke: jest.fn(),
    createRadialGradient: jest.fn(() => ({
      addColorStop: jest.fn(),
    })),
  })),
})

// Mock culori
jest.mock('culori', () => ({
  harmony: jest.fn(() => ['#000000', '#ffffff']),
  formatHex: jest.fn((color) => color),
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

global.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}))

// Polyfill fetch/Request/Response for next/server in tests
try {
  const undici = require('undici')
  if (!global.fetch) {
    global.fetch = undici.fetch
  }
  if (!global.Headers) {
    global.Headers = undici.Headers
  }
  if (!global.Request) {
    global.Request = undici.Request
  }
  if (!global.Response) {
    global.Response = undici.Response
  }
} catch {}
