import {IArea} from "./IArea.ts";
import {ISizes} from "../SimpleSelectionFrame.ts";

export interface IState {
    /**
     * Позиция области рамки.
     */
    areaPosition: IArea;
    /**
     * Данные о предыдущем положении области
     */
    prevAreaPosition: IArea;
    /**
     * Идет ли изменение размера области
     */
    isResizing: boolean;
    /**
     * Идет ли перемещение области
     */
    isMoving: boolean;
    /**
     * Сохраняется ли пропорция области
     */
    keepAspectRatio: boolean;
    /**
     * Скрыты ли элементы управления
     */
    isHidden: boolean;
    /**
     * Флаг работы SimpleSelectionFrame
     */
    isDisabled: boolean;
    /**
     * Минимальная высота и ширина области рамки в процентах.
     */
    minSizes: ISizes;
    /**
     * Активная точка.
     * Точка от которой начинаются изменения положения
     */
    activePoint: HTMLElement | null;
    /**
     * Условие, при выполнении которого не будут выполняться
     * обработчики событий на рамке SimpleSelectionFrame
     */
    preventEventCondition: boolean;
}