import { Point } from "../utils/Point";

export interface IPointDependencies {

  /**
   * Массив точек координата которых зависит от X
   */
  oX: Point[];

  /**
   * Массив точек координата которых зависит от Y
   */
  oY: Point[];
}
