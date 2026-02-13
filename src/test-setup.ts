import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Global test setup
afterEach(() => {
  cleanup()
})