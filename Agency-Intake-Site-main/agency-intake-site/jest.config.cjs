const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './'
})

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '^lenis$': '<rootDir>/__mocks__/lenis.js',
    '^gsap$': '<rootDir>/__mocks__/gsap.js',
    '^gsap/Observer$': '<rootDir>/__mocks__/gsapObserver.js',
    '^gl-matrix$': '<rootDir>/__mocks__/glMatrix.js',
    '^framer-motion$': '<rootDir>/__mocks__/framerMotion.js'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ]
}

module.exports = createJestConfig(customJestConfig)


