import { IPointDependencies } from "../types/IPointDependencies";
import { Point } from "./Point";

/**
 * объект-словарь, который хранит зависимости точек друг от друга.
 * Ключ - имя точки, значение - объект с массивами точек,
 * от которых зависит координата X или Y.
 * Например, точка "n" зависит от точек "ne" и "nw" по оси X,
 * а точка "e" зависит от точек "ne" и "se" по оси Y
 */
export const pointDependencies: Record<Point, IPointDependencies> = {
  [Point.E]: { oX: [Point.NE, Point.SE], oY: [] },
  [Point.N]: { oX: [], oY: [Point.NW, Point.NE] },
  [Point.NE]: { oX: [Point.E, Point.SE], oY: [Point.N, Point.NW] },

  [Point.NW]: { oX: [Point.W, Point.SW], oY: [Point.N, Point.NE] },
  [Point.S]: { oX: [], oY: [Point.SE, Point.SW] },
  [Point.SE]: { oX: [Point.E, Point.NE], oY: [Point.S, Point.SW] },
  [Point.SW]: { oX: [Point.W, Point.NW], oY: [Point.S, Point.SE] },
  [Point.W]: { oX: [Point.SW, Point.NW], oY: [] },
};
