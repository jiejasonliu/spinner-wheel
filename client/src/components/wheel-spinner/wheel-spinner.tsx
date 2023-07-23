import React, { useEffect, useMemo, useRef } from "react";
import {
  buildCSSBezierCurve,
  degreeToRadian,
  radianToDegree,
  clamp,
} from "../../helpers/math";

const THRESHOLD = 0.05; // degs per second to stop spinning
const ROTATION_FACTOR = 0.25; // how fast to rotate
const EXTRA_SPINS = 8; // roughly  how many extra spins?
const DAMPING_FACTOR = 0.9875; // by how much should we slow down the spinner

const COLORS = ["#003f5c", "#58508d", "#bc5090", "#ff6361", "#ffa600"];

interface SpinPhysics {
  lastDrawn: number;
  totalDegreesRotated: number;
  timeStepRotations: number;
  spinCount: number;
}

export function WheelSpinner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const hasSpanOnceRef = useRef<boolean>(false);
  const dampenedDegreesPerFrameRef = useRef<number>(0.0); // set this to start spinning
  const winnerRef = useRef<string>("");

  // refs to be used internally for tracking
  const spinPhysicsRef = useRef<SpinPhysics>({
    lastDrawn: 0.0,
    totalDegreesRotated: 0.0,
    timeStepRotations: 0.0,
    spinCount: 0.0,
  });

  const bezierFn = useMemo(() => buildCSSBezierCurve(0.1, -3, -5, 100), []);

  useEffect(() => {
    requestAnimationFrame(draw);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} width={500} height={500}></canvas>
      <button onClick={handleSpinClick}>Spin</button>
    </>
  );

  function handleSpinClick() {
    clearStates();
    hasSpanOnceRef.current = true;

    const spinPhysics = spinPhysicsRef.current;
    spinPhysics.spinCount = EXTRA_SPINS + 10 * Math.random(); // introduce randomness to spin

    // request animation by setting degs per frame spin
    dampenedDegreesPerFrameRef.current = 30;
  }

  function draw(timestamp: number) {
    const ctx = canvasRef?.current?.getContext("2d");
    if (!ctx) return;

    const spinPhysics = spinPhysicsRef.current;

    // calculate ms since last draw
    const timeDelta = spinPhysics.lastDrawn
      ? timestamp - spinPhysics.lastDrawn
      : 0;
    spinPhysics.lastDrawn = timestamp;

    // skip double frame renders
    if (timeDelta >= 0.0 && timeDelta <= 0.00001) {
      requestAnimationFrame(draw);
      return;
    }

    // clear sceeen
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const results = [
      { mood: "Angry", total: 1499, shade: COLORS[0] },
      { mood: "Happy", total: 478, shade: COLORS[1] },
      { mood: "Sad", total: 332, shade: COLORS[2] },
      { mood: "Meh", total: 195, shade: COLORS[3] },
    ];

    const totalScore = results.reduce((sum, { total }) => sum + total, 0);

    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;

    if (dampenedDegreesPerFrameRef.current > 0.0) {
      const degsPerFrame = dampenedDegreesPerFrameRef.current;

      const totalDegrees = (360 / ROTATION_FACTOR) * spinPhysics.spinCount;
      const timeStep = spinPhysics.timeStepRotations / totalDegrees;

      // increment timeStep and track total degrees rotated
      // we use this to determine when we should apply the damping force
      ctx.translate(centerX, centerY);
      const yStep = clamp(bezierFn(timeStep)[1], -1, 1);
      spinPhysics.timeStepRotations += degsPerFrame;
      spinPhysics.totalDegreesRotated += degsPerFrame * yStep;
      const radians = degreeToRadian(degsPerFrame * yStep);
      ctx.rotate(radians);
      ctx.translate(-centerX, -centerY);

      // apply damping force to slow down the spin
      if (spinPhysics.totalDegreesRotated / 360 >= spinPhysics.spinCount / 3) {
        dampenedDegreesPerFrameRef.current *= DAMPING_FACTOR;
      }

      // check for result when within the threshold
      if (degsPerFrame <= THRESHOLD) {
        console.log(
          "threshold to stop",
          radianToDegree(getRotationRadiansFromContext(ctx))
        );

        // calculate winner
        const landedAngle = radianToDegree(getRotationRadiansFromContext(ctx));
        const winner = calculateWinner(results, landedAngle, 0.0);
        winnerRef.current = winner;

        clearStates();
      }
    }
    // idle animation if not spun yet
    else if (!hasSpanOnceRef.current) {
      ctx.translate(centerX, centerY);
      ctx.rotate(Math.PI / 512);
      ctx.translate(-centerX, -centerY);
    }

    let currentAngle = 0;
    for (const moodValue of results) {
      // calculating the angle the slice (portion) will take in the chart
      const portionAngle = (moodValue.total / totalScore) * 2 * Math.PI;
      const beginAngle = currentAngle;
      const endAngle = currentAngle + portionAngle;

      // drawing an arc and a line to the center to differentiate the slice from the rest
      ctx.beginPath();
      ctx.arc(centerX, centerY, 200, beginAngle, endAngle);
      currentAngle += portionAngle;
      ctx.lineTo(centerX, centerY);
      // filling the slices with the corresponding mood's color
      ctx.fillStyle = moodValue.shade;
      ctx.fill();

      // draw text and center on pie
      const pieRadius = Math.min(ctx.canvas.width / 2, ctx.canvas.height / 2);
      const labelX =
        ctx.canvas.width / 2 +
        (pieRadius / 2) * Math.cos(beginAngle + (endAngle - beginAngle) / 2);
      const labelY =
        ctx.canvas.height / 2 +
        (pieRadius / 2) * Math.sin(beginAngle + (endAngle - beginAngle) / 2);
      ctx.fillStyle = "white";

      if (winnerRef.current === moodValue.mood) {
        ctx.fillStyle = "turquoise";
      }

      ctx.font = "bold 24px Calibri";
      const textMetrics = ctx.measureText(moodValue.mood);
      const textWidthOffset = textMetrics.width * 0.5;
      const textHeightOffset =
        (textMetrics.actualBoundingBoxAscent +
          textMetrics.actualBoundingBoxDescent) *
        0.5;
      ctx.fillText(
        moodValue.mood,
        labelX - textWidthOffset,
        labelY + textHeightOffset
      );
    }

    requestAnimationFrame(draw);
  }

  function getRotationRadiansFromContext(ctx: CanvasRenderingContext2D) {
    const mat = ctx.getTransform();
    const rad = Math.atan2(mat.b, mat.a);
    if (rad < 0) {
      return rad + Math.PI * 2;
    }
    return rad;
  }

  /**
   *
   * @param data spinner data
   * @param landedAngle counterclockwise angle we landed on
   * @param offset clockwise angle offset to apply (default origin is right of circle)
   */
  function calculateWinner(data: any[], landedAngle: number, offset: number) {
    const totalScore = data.reduce(
      (sum: number, dataObject) => sum + dataObject.total,
      0
    );
    const computedAngle = 360 - landedAngle + offset; // clockwise

    let lastAngle = 0;
    for (let i = 0; i < data.length; i++) {
      const portionAngle = radianToDegree(
        (data[i].total / totalScore) * 2 * Math.PI
      );
      const beginRange = lastAngle;
      const endRange = lastAngle + portionAngle;
      if (beginRange <= computedAngle && computedAngle < endRange) {
        console.log("winner is", data[i].mood);
        return data[i].mood;
      }
      lastAngle = endRange;
    }
  }

  function clearStates() {
    const spinPhysics = spinPhysicsRef.current;
    dampenedDegreesPerFrameRef.current = 0.0;
    spinPhysics.timeStepRotations = 0.0;
    spinPhysics.totalDegreesRotated = 0.0;

    winnerRef.current = "";
  }
}
