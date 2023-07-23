import React, { useEffect, useMemo, useRef } from "react";
import {
  buildCSSBezierCurve,
  degreeToRadian,
  radianToDegree,
} from "../../helpers/math";

// const DEGS_PER_FRAME = 720 / 60;
const ROTATIONS_PER_SECOND = 2;
const EXTRA_SPINS = 12;

export function WheelSpinner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentAngleRef = useRef<number>(0.0);
  const spinTimeMillisRef = useRef<number>(0.0);

  const angleToRotateRef = useRef<number>(0.0);

  // refs to be used internally for tracking
  const _totalDegreesRotatedRef = useRef<number>(0.0);
  const _lastDrawnRef = useRef<number>(0.0);
  const _dampenRef = useRef(0.0);
  const _spinTimeCounterRef = useRef<number>(0.0);

  const bezierFn = useMemo(
    () => buildCSSBezierCurve(0.25, -0.14, 0.7, 1.28),
    []
  );

  useEffect(() => {
    requestAnimationFrame(draw);
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={500} height={500}></canvas>;
      <button onClick={handleSpinClick}>Spin</button>
    </div>
  );

  function handleSpinClick() {
    // request animation by setting how long we should spin for
    spinTimeMillisRef.current = 5000.0 + 5000.0 * Math.random();
    angleToRotateRef.current = 10.37;
  }

  function draw(now: number) {
    const ctx = canvasRef?.current?.getContext("2d");
    if (!ctx) return;

    const timeDelta = _lastDrawnRef.current ? now - _lastDrawnRef.current : 0;
    _lastDrawnRef.current = now;

    // skip double frame renders
    if (timeDelta >= 0.0 && timeDelta <= 0.00001) {
      requestAnimationFrame(draw);
      return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const results = [
      { mood: "Angry", total: 1499, shade: "#0a9627" },
      { mood: "Happy", total: 478, shade: "#960A2C" },
      { mood: "Sad", total: 332, shade: "#332E2E" },
      { mood: "Meh", total: 195, shade: "#F73809" },
    ];

    const totalScore = results.reduce((sum, { total }) => sum + total, 0);

    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;

    // move angle if there's an spin animation requested
    if (angleToRotateRef.current > 0.0) {
      const degsPerFrame = (360 / 60) * ROTATIONS_PER_SECOND;

      ctx.translate(centerX, centerY);
      const degreesToRotate = degsPerFrame * (1 - _dampenRef.current);
      console.log(1 - _dampenRef.current);
      ctx.rotate(degreeToRadian(degreesToRotate));
      ctx.translate(-centerX, -centerY);

      _totalDegreesRotatedRef.current += degreesToRotate;

      if (_totalDegreesRotatedRef.current / 360 >= EXTRA_SPINS / 2) {
        _dampenRef.current += 0.003;
        if (_dampenRef.current > 0.9) {
          _dampenRef.current = 0.9;
        }
      }

      if (_totalDegreesRotatedRef.current / 360 >= EXTRA_SPINS) {
        const currentRotationRadians = getRotationRadiansFromContext(ctx);
        const currentRotationDegs = radianToDegree(currentRotationRadians);
        if (
          Math.abs(angleToRotateRef.current - currentRotationDegs) <=
          degsPerFrame
        ) {
          // because we have a large delta, we just want to directly set
          // the transform to the rolled rotation when it's close enough
          const desiredRotation = angleToRotateRef.current;
          ctx.resetTransform();
          ctx.translate(centerX, centerY);
          const desiredRotationRadians = degreeToRadian(desiredRotation);
          ctx.rotate(desiredRotationRadians);
          ctx.translate(-centerX, -centerY);

          angleToRotateRef.current = 0.0;
          _totalDegreesRotatedRef.current = desiredRotation;
          _dampenRef.current = 0;

          const matrix = ctx.getTransform();
          const currentRotationRadians = Math.atan2(matrix.b, matrix.a);
          const currentRotationDegs = radianToDegree(currentRotationRadians);
          console.log(currentRotationDegs);
        }
      }
    }

    // if (angleToRotateRef.current > 0.0) {
    //   const degsPerFrame = (360 / 60) * ROTATIONS_PER_SECOND;

    //   const totalDegrees =
    //     360 * ROTATIONS_PER_SECOND * EXTRA_SPINS + angleToRotateRef.current;
    //   const timeStep = _totalDegreesRotatedRef.current / totalDegrees;

    //   const yStep = bezierFn(timeStep)[1];
    //   _totalDegreesRotatedRef.current += degsPerFrame;
    //   // _totalDegreesRotatedRef.current += yStep;

    //   ctx.translate(centerX, centerY);
    //   const radians = degreeToRadian(
    //     degsPerFrame * yStep * ROTATIONS_PER_SECOND
    //   );
    //   ctx.rotate(radians);
    //   ctx.translate(-centerX, -centerY);

    //   if (_totalDegreesRotatedRef.current / 360 >= EXTRA_SPINS) {
    //     const matrix = ctx.getTransform();
    //     const currentRotationRadians = Math.atan2(matrix.b, matrix.a);
    //     const currentRotationDegs = radianToDegree(currentRotationRadians);
    //     if (
    //       Math.abs(angleToRotateRef.current - currentRotationDegs) <=
    //       degsPerFrame
    //     ) {
    //       // because we have a large delta, we just want to directly set
    //       // the transform to the rolled rotation when it's close enough
    //       const desiredRotation = angleToRotateRef.current;
    //       ctx.resetTransform();
    //       ctx.translate(centerX, centerY);
    //       const desiredRotationRadians = degreeToRadian(desiredRotation);
    //       ctx.rotate(desiredRotationRadians);
    //       ctx.translate(-centerX, -centerY);

    //       _totalDegreesRotatedRef.current = desiredRotation;
    //       angleToRotateRef.current = 0.0;

    //       const matrix = ctx.getTransform();
    //       const currentRotationRadians = Math.atan2(matrix.b, matrix.a);
    //       const currentRotationDegs = radianToDegree(currentRotationRadians);
    //       console.log(currentRotationDegs);
    //     }
    //   }
    // }

    let currentAngle = 0;
    for (const moodValue of results) {
      //calculating the angle the slice (portion) will take in the chart
      const portionAngle = (moodValue.total / totalScore) * 2 * Math.PI;
      const beginAngle = currentAngle;
      const endAngle = currentAngle + portionAngle;

      //drawing an arc and a line to the center to differentiate the slice from the rest
      ctx.beginPath();
      ctx.arc(centerX, centerY, 200, beginAngle, endAngle);
      currentAngle += portionAngle;
      ctx.lineTo(centerX, centerY);
      //filling the slices with the corresponding mood's color
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
      ctx.font = "bold 12px Arial";
      const textMetrics = ctx.measureText(moodValue.mood);
      const textWidthOffset = textMetrics.width * 0.4; // 40% looks better
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
}
