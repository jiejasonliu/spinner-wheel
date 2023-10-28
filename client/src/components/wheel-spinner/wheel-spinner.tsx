import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  buildCSSBezierCurve,
  degreeToRadian,
  radianToDegree,
  clamp,
  isDegreeInRange,
} from "@/helpers/math";
import { WheelDrawerInfo } from "./draw/wheel-drawer-info";

const THRESHOLD = 0.03; // degs per second to stop spinning
const ROTATION_FACTOR = 0.25; // how fast to rotate
const EXTRA_SPINS = 12; // roughly  how many extra spins?
const DAMPING_FACTOR = 0.992; // by how much should we slow down the spinner

const COLORS = ["#003f5c", "#58508d", "#bc5090", "#ff6361", "#ffa600"];

interface SpinPhysics {
  lastDrawn: number;
  totalDegreesRotated: number;
  timeStepRotations: number;
  spinCount: number;
}

export type SpinnerSegment = { name: string; weight: number };

export interface WheelSpinnerProps {
  segments: SpinnerSegment[];
  dimensions?: { w: number; h: number };
  idleSpeed?: number; // radians per second
  onCrossSegment?: () => void;
  onSpinFinished?: (name: string) => void;
}

export interface WheelSpinnerForwardRef {
  startSpin: () => void;
}

export const WheelSpinner = forwardRef<
  WheelSpinnerForwardRef,
  WheelSpinnerProps
>(
  (
    {
      segments,
      dimensions = { w: 500, h: 500 },
      idleSpeed = Math.PI / 768,
      onCrossSegment,
      onSpinFinished,
    }: WheelSpinnerProps,
    ref
  ) => {
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

    const rafHandle = useRef<number | undefined>(undefined);

    const bezierFn = useMemo(() => buildCSSBezierCurve(0.1, -4.5, -5, 100), []);
    const degreesCrossingEachSegment = useMemo(
      () => getClockwiseDegreesCrossingEachSegment(),
      [segments]
    );
    const drawFunction = useCallback(draw, [segments]);

    useEffect(() => {
      rafHandle.current = requestAnimationFrame(drawFunction);
      return () => {
        rafHandle.current && cancelAnimationFrame(rafHandle.current);
      };
    }, [segments]);

    useImperativeHandle(ref, () => ({
      startSpin() {
        clearStates();
        hasSpanOnceRef.current = true;

        const spinPhysics = spinPhysicsRef.current;
        spinPhysics.spinCount = EXTRA_SPINS + 10 * Math.random(); // introduce randomness to spin

        // request animation by setting degs per frame spin
        dampenedDegreesPerFrameRef.current = 20;
      },
    }));

    return (
      <>
        <canvas
          ref={canvasRef}
          width={dimensions.w}
          height={dimensions.h}
        ></canvas>
      </>
    );

    function draw(timestamp: number) {
      const ctx = canvasRef?.current?.getContext("2d");
      if (!ctx) return;

      const canvas = ctx.canvas;
      const spinPhysics = spinPhysicsRef.current;

      // calculate ms since last draw
      const timeDelta = spinPhysics.lastDrawn
        ? timestamp - spinPhysics.lastDrawn
        : 0;
      spinPhysics.lastDrawn = timestamp;

      // skip double frame renders
      if (timeDelta >= 0.0 && timeDelta <= 0.00001) {
        rafHandle.current = requestAnimationFrame(draw);
        return;
      }

      // clear sceeen (extra padding to invalidate text overflow)
      ctx.clearRect(0, 0, canvas.width * 1.1, canvas.height * 1.1);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // when we start dampening, we can assume that the animation has started
      if (dampenedDegreesPerFrameRef.current > 0.0) {
        const degsPerFrame = dampenedDegreesPerFrameRef.current;

        const totalDegrees = (360 / ROTATION_FACTOR) * spinPhysics.spinCount;
        const timeStep = spinPhysics.timeStepRotations / totalDegrees;

        // increment timeStep and track total degrees rotated
        // we use this to determine when we should apply the damping force
        ctx.translate(centerX, centerY);
        const yStep = clamp(bezierFn(timeStep)[1], -1, 1);
        const degToSpin = degsPerFrame * yStep;
        const radiansToSpin = degreeToRadian(degToSpin);

        spinPhysics.timeStepRotations += degsPerFrame;
        spinPhysics.totalDegreesRotated += degToSpin;
        ctx.rotate(radiansToSpin);
        ctx.translate(-centerX, -centerY);

        // apply damping force to slow down the spin
        if (
          spinPhysics.totalDegreesRotated / 360 >=
          spinPhysics.spinCount / 3
        ) {
          dampenedDegreesPerFrameRef.current *= DAMPING_FACTOR;
        }

        // emit lifecycle if crossing a segment
        const clockwiseCurrentRotation =
          360 - radianToDegree(getRotationRadiansFromContext(ctx));
        const thresholdRange = degToSpin * 0.5;
        if (
          degreesCrossingEachSegment.some((targetDegree) =>
            isDegreeInRange(
              targetDegree,
              clockwiseCurrentRotation,
              thresholdRange
            )
          )
        ) {
          onCrossSegment?.();
        }

        // check for result when within the threshold
        if (degsPerFrame <= THRESHOLD) {
          console.log(
            "threshold to stop",
            radianToDegree(getRotationRadiansFromContext(ctx))
          );

          // calculate winner
          const landedAngle = radianToDegree(
            getRotationRadiansFromContext(ctx)
          );
          const winner = calculateWinner(segments, landedAngle, 0.0);
          clearStates();

          if (winner) {
            onSpinFinished?.(winner);
            winnerRef.current = winner;
          }
        }
      }
      // idle animation if not spun yet
      else if (!hasSpanOnceRef.current) {
        ctx.translate(centerX, centerY);
        ctx.rotate(idleSpeed);
        ctx.translate(-centerX, -centerY);
      }

      const totalWeights = segments.reduce(
        (sum, segment) => sum + segment.weight,
        0
      );
      const pieRadius = Math.min(centerX, centerY);

      function drawForSegments(
        drawFn: (info: WheelDrawerInfo, drawIndex: number) => void
      ) {
        let currentAngle = 0;
        for (let i = 0; i < segments.length; i++) {
          const segment = segments[i];

          // calculating the angle the slice (portion) will take in the chart
          const portionAngle = (segment.weight / totalWeights) * 2 * Math.PI;
          const beginAngle = currentAngle;
          const endAngle = currentAngle + portionAngle;
          currentAngle += portionAngle;

          drawFn(
            {
              segment,
              angles: { beginAngle, endAngle, portionAngle },
            },
            i
          );
        }
      }

      // draw wheel fill
      drawForSegments((info: WheelDrawerInfo, drawIndex: number) => {
        const { beginAngle, endAngle } = info.angles;
        const color = COLORS[drawIndex % COLORS.length];

        // drawing an arc and a line to the center to differentiate the slice from the rest
        ctx.beginPath();
        ctx.arc(centerX, centerY, pieRadius, beginAngle, endAngle);
        ctx.lineTo(centerX, centerY);
        // filling the slices with the corresponding mood's color
        ctx.fillStyle = color;
        ctx.fill();
      });

      // draw names
      drawForSegments((info: WheelDrawerInfo) => {
        const { beginAngle, endAngle } = info.angles;
        const segment = info.segment;

        // text configuration
        ctx.fillStyle =
          winnerRef.current === segment.name ? "turquoise" : "white";
        const fontSize = Math.min(
          24,
          Math.min(canvas.width, canvas.height) / 8
        );
        ctx.font = `bold ${Math.round(fontSize)}px Calibri`;
        const textMetrics = ctx.measureText(segment.name);
        const textWidthOffset = textMetrics.width * 0.5;
        const textHeightOffset =
          (textMetrics.actualBoundingBoxAscent +
            textMetrics.actualBoundingBoxDescent) *
          0.5;

        // render text without the real rotation
        // we calculate these offsets to position text relative to where it should be on pie rotation
        // but we render it without the real rotation so that the text is always right side up
        const currentRotationRads = getRotationRadiansFromContext(ctx);
        const beginAngleOffset = beginAngle + currentRotationRads;
        const endAngleOffset = endAngle + currentRotationRads;
        const labelX =
          centerX +
          (pieRadius / 2) *
            Math.cos(
              beginAngleOffset + (endAngleOffset - beginAngleOffset) / 2
            );
        const labelY =
          centerY +
          (pieRadius / 2) *
            Math.sin(
              beginAngleOffset + (endAngleOffset - beginAngleOffset) / 2
            );
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(-currentRotationRads);
        ctx.translate(-centerX, -centerY);
        ctx.fillText(
          segment.name,
          labelX - textWidthOffset,
          labelY + textHeightOffset
        );
        ctx.restore();
      });

      rafHandle.current = requestAnimationFrame(draw);
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
    function calculateWinner(
      segments: SpinnerSegment[],
      landedAngle: number,
      offset: number
    ) {
      const totalWeight = segments.reduce(
        (sum: number, segment) => sum + segment.weight,
        0
      );
      const computedAngle = 360 - landedAngle + offset; // clockwise

      let lastAngle = 0;
      for (const segment of segments) {
        const portionAngle = radianToDegree(
          (segment.weight / totalWeight) * 2 * Math.PI
        );
        const beginRange = lastAngle;
        const endRange = lastAngle + portionAngle;

        if (beginRange <= computedAngle && computedAngle < endRange) {
          console.log("winner is", segment.name);
          return segment.name;
        }
        lastAngle = endRange;
      }
    }

    function getClockwiseDegreesCrossingEachSegment(): number[] {
      const totalWeight = segments.reduce(
        (sum: number, segment) => sum + segment.weight,
        0
      );

      const clockwiseAnglesCrossingEachSegment: number[] = [];
      let lastAngle = 0;

      for (const segment of segments) {
        const portionAngle = radianToDegree(
          (segment.weight / totalWeight) * 2 * Math.PI
        );
        const segmentDividerAngle = lastAngle + portionAngle;
        clockwiseAnglesCrossingEachSegment.push(segmentDividerAngle);
        lastAngle = segmentDividerAngle;
      }
      return clockwiseAnglesCrossingEachSegment;
    }

    function clearStates() {
      const spinPhysics = spinPhysicsRef.current;
      dampenedDegreesPerFrameRef.current = 0.0;
      spinPhysics.timeStepRotations = 0.0;
      spinPhysics.totalDegreesRotated = 0.0;

      winnerRef.current = "";
    }
  }
);
