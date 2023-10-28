import { SpinnerSegment } from "../wheel-spinner";

interface WheelAngles {
  beginAngle: number; // angle start
  endAngle: number; // angle end
  portionAngle: number; // angle arc (end - begin)
}

export interface WheelDrawerInfo {
  segment: SpinnerSegment;
  angles: WheelAngles;
}
