/** Generic financial / probability utilities for ASTS-Model. */

export function evPerShare(evMillions, sharesMillions, cashMillions = 0, debtMillions = 0) {
  if (sharesMillions <= 0) return NaN;
  return (evMillions + cashMillions - debtMillions) / sharesMillions;
}

/** Linear interpolation between anchor points. */
export function lerp(a, b, t) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

/** Clamp value to range. */
export function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}
