/**
 * @returns B(t) as [x, y] where 0 <= t <= 1
 */
export function buildCSSBezierCurve(
  x0: number,
  x1: number,
  y0: number,
  y1: number
) {
  return function (t: number): [number, number] {
    // clamp
    if (t < 0) t = 0;
    if (t > 1) t = 1;

    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    const p0 = [0, 0];
    const p1 = [x0, x1];
    const p2 = [y0, y1];
    const p3 = [1, 1];

    const vector: [number, number] = [0, 0];
    for (let i = 0; i < 2; i++) {
      vector[i] =
        uuu * p0[i] + 3 * uu * t * p1[i] + 3 * u * tt * p2[i] + ttt * p3[i];
    }
    return vector;
  };
}

export function degreeToRadian(degree: number) {
  return degree * (Math.PI / 180);
}

export function radianToDegree(radian: number) {
  return radian * (180 / Math.PI);
}

export function clamp(num: number, min: number, max: number) {
  if (num < min) return min;
  if (num > max) return max;
  return num;
}


// [-180 to 180)
export function normalizeDegree(degree: number) {
  degree = degree % 360;
  if ( degree >= 180) {
    return degree - 360;
  }
  if ( degree < -180) {
    return degree + 360;
  }
  return degree;
}

// https://stackoverflow.com/a/15070642/14278524
export function isDegreeInRange(targetDegree: number, current: number, range: number) {
  const normalizedDiff = normalizeDegree(targetDegree - current);
  return normalizedDiff >= -range && normalizedDiff < range;
}

export function roundPlaces(numberToRound: number, places: number) {
  const truncator = Math.pow(10, places);
  return Math.round(numberToRound * truncator) / truncator;
}