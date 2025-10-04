import { describe, it, expect } from 'vitest'
import { makeAbsolute } from '../../lib/url'

describe('makeAbsolute', () => {
  it('joins relative paths to base', () => {
    expect(makeAbsolute('https://example.com', 'about')).toBe('https://example.com/about')
    expect(makeAbsolute('https://example.com/', '/about')).toBe('https://example.com/about')
  })

  it('preserves query and hash', () => {
    expect(makeAbsolute('https://example.com', '/search?q=foo#top')).toBe(
      'https://example.com/search?q=foo#top',
    )
  })
})

