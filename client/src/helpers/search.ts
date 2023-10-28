export function piecewiseBinarySearch({
  calculateScore,
  target,
  max,
}: {
  target: number;
  max: number;
  calculateScore: (val: number) => number;
}) {
  let min = 0;

  while (min <= max) {
    const guess = Math.floor((min + max) / 2);
    const score = calculateScore(guess);

    if (Math.abs(score - target) <= 1e-4) {
      return guess;
    } else if (score < target) {
      min = guess + 1;
    } else {
      max = guess - 1;
    }
  }

  return max;
}
