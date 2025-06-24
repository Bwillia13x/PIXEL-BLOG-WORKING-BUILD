export type NumericArray = number[];

/**
 * Compound Annual Growth Rate (CAGR)
 * @param returns Array of periodic returns as decimals (e.g. 0.01 for 1%).
 * @param periodsPerYear Number of return observations per year (default 252 for daily).
 * @returns Annualised CAGR as decimal.
 */
export function cagr(returns: NumericArray, periodsPerYear = 252): number {
  if (!returns.length) return 0;

  // total compounded growth
  const totalGrowth = returns.reduce((acc, r) => acc * (1 + r), 1);
  const years = returns.length / periodsPerYear;
  if (years === 0) return 0;
  return Math.pow(totalGrowth, 1 / years) - 1;
}

/**
 * Maximum drawdown based on a sequence of periodic returns.
 * @param returns Array of periodic returns.
 * @returns Max drawdown as positive decimal (e.g. 0.2 means -20% peak-to-trough).
 */
export function maxDrawdown(returns: NumericArray): number {
  if (!returns.length) return 0;

  let peak = 1;
  let trough = 1;
  let maxDD = 0;
  let equity = 1;

  for (const r of returns) {
    equity *= 1 + r;
    if (equity > peak) {
      peak = equity;
      trough = equity;
    }
    if (equity < trough) {
      trough = equity;
      const drawdown = (peak - trough) / peak; // positive value
      if (drawdown > maxDD) maxDD = drawdown;
    }
  }
  return maxDD;
}

/**
 * Hit ratio – proportion of periods with non-negative return.
 * @param returns Array of periodic returns.
 */
export function hitRatio(returns: NumericArray): number {
  if (!returns.length) return 0;
  const hits = returns.filter(r => r >= 0).length;
  return hits / returns.length;
}

/**
 * Sortino ratio – annualised.
 * @param returns Periodic returns.
 * @param periodsPerYear Observations per year.
 * @param riskFreeRate Annual risk-free rate (decimal), default 0.
 */
export function sortinoRatio(
  returns: NumericArray,
  periodsPerYear = 252,
  riskFreeRate = 0,
): number {
  if (returns.length === 0) return 0;

  const periodRf = riskFreeRate / periodsPerYear;
  const excess = returns.map(r => r - periodRf);
  const meanExcess = excess.reduce((a, b) => a + b, 0) / returns.length;

  const downsideSquares = excess
    .filter(r => r < 0)
    .map(r => r ** 2);

  const downsideDev = Math.sqrt(
    downsideSquares.reduce((a, b) => a + b, 0) / returns.length,
  );

  if (downsideDev === 0) return 0;

  // annualise
  const annExcess = meanExcess * periodsPerYear;
  const annDownside = downsideDev * Math.sqrt(periodsPerYear);
  return annExcess / annDownside;
}

/**
 * Information ratio – annualised.
 * @param portReturns Portfolio periodic returns.
 * @param benchReturns Benchmark periodic returns (must match length).
 * @param periodsPerYear Observations per year.
 */
export function informationRatio(
  portReturns: NumericArray,
  benchReturns: NumericArray,
  periodsPerYear = 252,
): number {
  if (portReturns.length === 0 || portReturns.length !== benchReturns.length) {
    return 0;
  }

  const excess = portReturns.map((r, i) => r - benchReturns[i]);
  const meanExcess = excess.reduce((a, b) => a + b, 0) / excess.length;
  const sdExcess = Math.sqrt(
    excess.reduce((a, b) => a + (b - meanExcess) ** 2, 0) / excess.length,
  );
  if (sdExcess === 0) return 0;
  return (meanExcess * periodsPerYear) / (sdExcess * Math.sqrt(periodsPerYear));
}

/**
 * Generic helper to compute rolling alpha (portfolio CAGR – benchmark CAGR) for a given window.
 */
export function rollingAlpha(
  portReturns: NumericArray,
  benchReturns: NumericArray,
  windowYears: number,
  periodsPerYear = 252,
): NumericArray {
  const window = windowYears * periodsPerYear;
  const n = Math.min(portReturns.length, benchReturns.length);
  const out: number[] = [];
  for (let i = 0; i + window <= n; i += 1) {
    const portSlice = portReturns.slice(i, i + window);
    const benchSlice = benchReturns.slice(i, i + window);
    const alpha = cagr(portSlice, periodsPerYear) - cagr(benchSlice, periodsPerYear);
    out.push(alpha);
  }
  return out;
}

export const rollingAlpha3Y = (
  port: NumericArray,
  bench: NumericArray,
  periodsPerYear = 252,
) => rollingAlpha(port, bench, 3, periodsPerYear);

export const rollingAlpha5Y = (
  port: NumericArray,
  bench: NumericArray,
  periodsPerYear = 252,
) => rollingAlpha(port, bench, 5, periodsPerYear);

export const rollingAlpha10Y = (
  port: NumericArray,
  bench: NumericArray,
  periodsPerYear = 252,
) => rollingAlpha(port, bench, 10, periodsPerYear); 