import { IPosition } from "../types/IPosition.ts";
import { Point } from "./Point.ts";

export const initialPointPositions: Record<Point, IPosition> = {
  [Point.E]: { top: 50, left: 100 },
  [Point.N]: { top: 0, left: 50 },
  [Point.NE]: { top: 0, left: 100 },
  [Point.NW]: { top: 0, left: 0 },
  [Point.S]: { top: 100, left: 50 },
  [Point.SE]: { top: 100, left: 100 },
  [Point.SW]: { top: 100, left: 0 },
  [Point.W]: { top: 50, left: 0 },
};
