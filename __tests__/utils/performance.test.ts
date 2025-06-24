import { describe, expect, it } from 'vitest'
import {
  cagr,
  maxDrawdown,
  hitRatio,
  sortinoRatio,
  informationRatio,
  rollingAlpha3Y,
  rollingAlpha5Y,
  rollingAlpha10Y,
} from '../../src/utils/performance'

// Deterministic pseudo-random generator (Park–Miller LCG)
function createRng(seed = 1) {
  let state = seed % 2147483647
  if (state <= 0) state += 2147483646
  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

describe('performance utilities', () => {
  it('calculates CAGR correctly for constant 1% monthly returns', () => {
    const monthly = Array(12).fill(0.01) // 1% per month for 1 year
    const result = cagr(monthly, 12)
    const expected = Math.pow(1.01 ** 12, 1 / 1) - 1
    expect(result).toBeCloseTo(expected, 6)
  })

  it('handles flat series', () => {
    const flat = Array(100).fill(0)
    expect(cagr(flat)).toBe(0)
    expect(maxDrawdown(flat)).toBe(0)
    expect(hitRatio(flat)).toBe(1)
  })

  it('handles negative returns', () => {
    const negative = [-0.02, -0.01, -0.03, 0.02, 0.01]
    expect(hitRatio(negative)).toBeCloseTo(0.4, 4)
    // Max drawdown should occur at third element
    const dd = maxDrawdown(negative)
    // Compute expected DD manually
    const equity = [1]
    for (const r of negative) equity.push(equity[equity.length - 1] * (1 + r))
    let peak = 1
    let maxDD = 0
    for (const v of equity) {
      if (v > peak) peak = v
      const ddLocal = (peak - v) / peak
      if (ddLocal > maxDD) maxDD = ddLocal
    }
    expect(dd).toBeCloseTo(maxDD, 6)
  })

  it('computes Sortino ratio vs naïve calculation', () => {
    const rng = createRng(42)
    const returns = Array.from({ length: 252 }, () => rng() * 0.02 - 0.01) // Uniform -1%..1%
    const sr = sortinoRatio(returns, 252, 0)

    // Brute force expected within test for independence
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length
    const downside = returns
      .filter(r => r < 0)
      .map(r => r ** 2)
      .reduce((a, b) => a + b, 0) / returns.length
    const annMean = mean * 252
    const annDownside = Math.sqrt(downside) * Math.sqrt(252)
    const expected = annDownside === 0 ? 0 : annMean / annDownside
    expect(sr).toBeCloseTo(expected, 6)
  })

  it('computes information ratio correctly', () => {
    const rng = createRng(123)
    const port = Array.from({ length: 252 }, () => rng() * 0.03 - 0.015)
    const bench = Array.from({ length: 252 }, () => rng() * 0.02 - 0.01)

    const ir = informationRatio(port, bench)

    // manual
    const excess = port.map((r, i) => r - bench[i])
    const meanExcess = excess.reduce((a, b) => a + b, 0) / excess.length
    const sd = Math.sqrt(
      excess.reduce((a, b) => a + (b - meanExcess) ** 2, 0) / excess.length,
    )
    const expected = sd === 0 ? 0 : (meanExcess * 252) / (sd * Math.sqrt(252))
    expect(ir).toBeCloseTo(expected, 6)
  })

  it('computes rolling alphas of correct length and magnitude', () => {
    const rng = createRng(99)
    const n = 252 * 11 // 11 years daily
    const port = Array.from({ length: n }, () => rng() * 0.002 - 0.001)
    const bench = Array.from({ length: n }, () => rng() * 0.0015 - 0.00075)

    const alpha3 = rollingAlpha3Y(port, bench)
    const alpha5 = rollingAlpha5Y(port, bench)
    const alpha10 = rollingAlpha10Y(port, bench)

    expect(alpha3.length).toBe(n - 3 * 252 + 1)
    expect(alpha5.length).toBe(n - 5 * 252 + 1)
    expect(alpha10.length).toBe(n - 10 * 252 + 1)

    // Verify values computed with generic function
    expect(alpha3[0]).toBeCloseTo(cagr(port.slice(0, 3 * 252)) - cagr(bench.slice(0, 3 * 252)), 6)
  })
}) 