/** Mutation targets for ASTS-Model math modules. */
export const MUTATION_TEST_FILES = [
  "constellation.test.js",
  "valuation.test.js",
  "monte-carlo.test.js",
  "dilution.test.js",
  "coverage-orbit.test.js",
  "link-budget.test.js",
  "device.test.js",
  "share.test.js"
];

export const MUTATION_TARGETS = [
  {
    id: "coverage-frac-cap",
    file: "js/math/constellation.js",
    description: "Remove coverage fraction cap at 1",
    apply: (src) => src.replace("return Math.min(1, satCount / coverageSats);", "return satCount / coverageSats;")
  },
  {
    id: "rev-proxy-multiply",
    file: "js/math/constellation.js",
    description: "Drop ARPU annualization in wholesale revenue",
    apply: (src) =>
      src.replace("annualRevenueM: activeSubsM * arpuMonthly * 12", "annualRevenueM: activeSubsM * arpuMonthly")
  },
  {
    id: "ev-per-share-cash",
    file: "js/math/device.js",
    description: "Drop cash from evPerShare",
    apply: (src) =>
      src.replace(
        "return (evMillions + cashMillions - debtMillions) / sharesMillions;",
        "return (evMillions - debtMillions) / sharesMillions;"
      )
  },
  {
    id: "runway-months",
    file: "js/math/valuation.js",
    description: "Drop quarterly-to-months factor in runway",
    apply: (src) =>
      src.replace("return (cashM / burnQuarterlyM) * 3;", "return cashM / burnQuarterlyM;")
  },
  {
    id: "mc-failure-skip",
    file: "js/math/monte-carlo.js",
    description: "Never count launch failures",
    apply: (src) => src.replace("if (rng() < failureRate)", "if (false && rng() < failureRate)")
  },
  {
    id: "dilution-conversion",
    file: "js/math/dilution.js",
    description: "Always convert notes regardless of price",
    apply: (src) =>
      src.replace(
        "const inMoney = stockPrice >= (n.conversionPrice ?? Infinity);",
        "const inMoney = true;"
      )
  },
  {
    id: "fspl-distance",
    file: "js/math/link-budget.js",
    description: "Break FSPL distance term",
    apply: (src) => src.replace("4 * Math.PI * distM", "distM")
  },
  {
    id: "overlap-coverage",
    file: "js/math/coverage-orbit.js",
    description: "Linear overlap instead of probabilistic",
    apply: (src) =>
      src.replace(
        "return Math.min(1, 1 - Math.pow(1 - f, satCount));",
        "return Math.min(1, f * satCount);"
      )
  }
];
