import "./simpleSelectionFrame.css";

import {IArea} from "./types/IArea";
import {IPosition} from "./types/IPosition";
import {initialAreaPosition} from "./utils/InitialAreaPosition";
import {initialPointPositions} from "./utils/InitialPointPositions";
import {Point} from "./utils/Point";
import {pointDependencies} from "./utils/PointDependencies";
import {_initialState} from "./utils/_initialState";
import {IState} from "./types/IState";

export interface ISizes {
  width: number;
  height: number;
}

/**
 * Класс для работы с координатами рамки обрезки.
 * При инициализации создаются элементы управления образующие рамку.
 * Область за рамкой затемняется.
 */
export class SimpleSelectionFrame {
  // Поля для хранения элементов контейнера, области и точек
  private readonly container: HTMLElement;

  private simpleSelectionState: IState = { ..._initialState };

  // элемент области с бекграундом за пределами рамки
  private area: HTMLElement | undefined;

  // словарь для хранения положений точек в области
  private pointsPosition: Record<Point, IPosition> = { ...initialPointPositions };

  // набор из всех элементов точек
  private points: NodeListOf<HTMLElement> | undefined;

  // Начальное положение для X координаты при нажатии
  private startX = 0;

  // Начальное положение для Y координаты при нажатии
  private startY = 0;

  // Начальное положение для left положения области при нажатии
  private startLeft = 0;

  // Начальное положение для top положения области при нажатии
  private startTop = 0;

  // TODO Реализовать передачу в параметры минимальных размеров области.
  //  Организовать проверку минимальных размеров области
  //  рамки при изменении размеров вручную

  // Событие для реагирования на изменение положения и размеров области
  public readonly areaChangedEvent: CustomEvent<IArea>;


  constructor(container: HTMLElement, initialState?: Partial<IState>) {
    // Сохраняем ссылки на элементы
    this.container = container;
    this.simpleSelectionState = { ...this.simpleSelectionState, ...initialState };
    this.areaChangedEvent = new CustomEvent("areaChanged", {
      detail: this.simpleSelectionState.areaPosition,
    });
    this.initialize();
  }

  /**
   * Состояние SimpleSelectionFrame
   */
  public get state(): IState {
    return this.simpleSelectionState;
  }

  public set state(newState: IState) {
    this.simpleSelectionState = { ...this.simpleSelectionState, ...newState };
  }

  /**
   * Сбрасывает рамку к начальному состоянию.
   * Размеры области по-умолчанию top 0% left 0% width 100% height 100%.
   */
  public reset(areaPosition = initialAreaPosition): void {
    this.setBoxArea({ ...areaPosition });
    this.simpleSelectionState = { ..._initialState };
  }

  /**
   * Тогглер для отключения видимости точек на области.
   * Отключает видимость элементов через стили.
   * Область по-прежнему можно перемещать.
   */
  public togglePointsOff(): void {
    this.simpleSelectionState = {...this.simpleSelectionState, isHidden: !this.simpleSelectionState.isHidden};

    if (this.simpleSelectionState.isHidden) {
      (this.points as NodeListOf<HTMLElement>).forEach((point) => {
        point.style.visibility = "hidden";
      });

      return;
    }

    (this.points as NodeListOf<HTMLElement>).forEach((point) => {
      point.style.visibility = "unset";
    });
  }

  /**
   * Тоглер для отключения работы SimpleSelectionFrame.
   * убирает точки, запрещает двигать область,
   * убирает background вне области.
   */
  public toggleDisable(): void {
    this.simpleSelectionState = {...this.simpleSelectionState, isDisabled: !this.simpleSelectionState.isDisabled};

    if (this.simpleSelectionState.isDisabled) {
      (this.points as NodeListOf<HTMLElement>).forEach((point) => {
        point.style.display = "none";
      });

      (this.area as HTMLElement).style.display = "none";

      return;
    }

    (this.points as NodeListOf<HTMLElement>).forEach((point) => {
      point.style.display = "block";
    });
    (this.area as HTMLElement).style.display = "block";
  }

  /**
   * Метод для задания новой позиции и размера области и перемещения всех точек,
   * с учетом ограничений контейнера и минимального размера области.
   * @param top
   * @param left
   * @param width
   * @param height
   */
  public setBoxArea({ top, left, width, height }: IArea): void {
    // Добавляем ограничения, чтобы область не превышала 100%
    // и не выходила за контейнер
    let constrainLeft = Math.max(0, Math.min(left, 100 - width));
    let constrainTop = Math.max(0, Math.min(top, 100 - height));

    const constrainWidth = Math.max(this.simpleSelectionState.minSizes.width, Math.min(width, 100 - constrainLeft));
    const constrainHeight = Math.max(this.simpleSelectionState.minSizes.height, Math.min(height, 100 - constrainTop));
    
    
    constrainLeft = constrainWidth === this.simpleSelectionState.minSizes.width && !this.simpleSelectionState.isMoving 
        ? this.simpleSelectionState.prevAreaPosition.left : constrainLeft;
    constrainTop = constrainHeight === this.simpleSelectionState.minSizes.height && !this.simpleSelectionState.isMoving 
        ? this.simpleSelectionState.prevAreaPosition.top : constrainTop;

    // Обновляем значение areaPosition
    this.simpleSelectionState.areaPosition.top = constrainTop;
    this.simpleSelectionState.areaPosition.left = constrainLeft;
    this.simpleSelectionState.areaPosition.width = constrainWidth;
    this.simpleSelectionState.areaPosition.height = constrainHeight;

    // Вычисляем новые координаты для каждой точки
    const pointNWLeft = constrainLeft;
    const pointNWTop = constrainTop;
    const pointNLeft = constrainLeft + constrainWidth / 2;
    const pointNTop = constrainTop;
    const pointNELeft = constrainLeft + constrainWidth;
    const pointNETop = constrainTop;
    const pointELeft = constrainLeft + constrainWidth;
    const pointETop = constrainTop + constrainHeight / 2;
    const pointSELeft = constrainLeft + constrainWidth;
    const pointSETop = constrainTop + constrainHeight;
    const pointSLeft = constrainLeft + constrainWidth / 2;
    const pointSTop = constrainTop + constrainHeight;
    const pointSWLeft = constrainLeft;
    const pointSWTop = constrainTop + constrainHeight;
    const pointWLeft = constrainLeft;
    const pointWTop = constrainTop + constrainHeight / 2;

    // Присваиваем новые координаты соответствующим точкам
    this.pointsPosition[Point.NW] = { left: pointNWLeft, top: pointNWTop };
    this.pointsPosition[Point.N] = { left: pointNLeft, top: pointNTop };
    this.pointsPosition[Point.NE] = { left: pointNELeft, top: pointNETop };
    this.pointsPosition[Point.E] = { left: pointELeft, top: pointETop };
    this.pointsPosition[Point.SE] = { left: pointSELeft, top: pointSETop };
    this.pointsPosition[Point.S] = { left: pointSLeft, top: pointSTop };
    this.pointsPosition[Point.SW] = { left: pointSWLeft, top: pointSWTop };
    this.pointsPosition[Point.W] = { left: pointWLeft, top: pointWTop };

    this.updatePoints();
    this.setClipPath();
    this.container.dispatchEvent(this.areaChangedEvent);
  }

  /**
  * Создает элементы внутри контейнера
  */
  private createElements(): void {
    // элемент для области затемнения
    const area = document.createElement("div");

    area.className = "simpleSelectionFrame__area";

    // добавляем его в контейнер
    this.container.append(area);

    const pointCursors: Record<Point, string> = {
      [Point.E]: "ew-resize",
      [Point.N]: "ns-resize",
      [Point.S]: "ns-resize",
      [Point.W]: "ew-resize",
      [Point.NE]: "nesw-resize",
      [Point.NW]: "nwse-resize",
      [Point.SE]: "nwse-resize",
      [Point.SW]: "nesw-resize",
    };

    for (const pointClass of Object.values(Point)) {
      const point = document.createElement("div");

      point.className = `simpleSelectionFrame__point ${pointClass}`;
      point.style.cursor = pointCursors[pointClass]; // задаем стиль курсора для точки
      // добавляем его в контейнер
      this.container.append(point);
    }
  }

  /**
   * Инициализирует рамку
   */
  public initialize(): void {
    this.createElements();
    this.area = this.container.querySelector(".simpleSelectionFrame__area") as HTMLElement;
    this.points = this.container.querySelectorAll(".simpleSelectionFrame__point");
    this.setNewPositionOfPointsAndArea();

    ["mousedown", "touchstart"].forEach((eventType) => {
      window.addEventListener(
        eventType as keyof WindowEventMap,
        (event: Event) => {
          if (!event.target || this.simpleSelectionState.isDisabled) {
            return;
          }

          const isMouseEvent = event instanceof MouseEvent;
          const pointer = isMouseEvent ? event : ((event as TouchEvent).touches[0] as Touch);

          const isPoint = Array.from(this.points as NodeListOf<HTMLElement>).includes(event.target as HTMLElement);

          // клик на элементе сквозь рамку
          const isInsideArea =
            this.container.contains(event.target as Node) &&
            !(this.area as HTMLElement).contains(event.target as HTMLElement) &&
            !isPoint;

          if (this.simpleSelectionState.preventEventCondition) {
            return;
          }

          if (isPoint) {
            event.preventDefault();
            this.simpleSelectionState = {...this.simpleSelectionState, isResizing:true}
            this.simpleSelectionState.activePoint = event.target as HTMLElement;

            if ("clientY" in pointer) {
              this.startY = pointer.clientY - this.simpleSelectionState.activePoint.offsetTop;
            }

            if ("clientX" in pointer) {
              this.startX = pointer.clientX - this.simpleSelectionState.activePoint.offsetLeft;
            }
          }

          if (isInsideArea) {
            event.preventDefault();
            this.simpleSelectionState = {...this.simpleSelectionState, isMoving:true}

            if ("clientY" in pointer) {
              this.startY = pointer.clientY;
            }

            if ("clientX" in pointer) {
              this.startX = pointer.clientX;
            }

            this.startLeft = this.simpleSelectionState.areaPosition.left;
            this.startTop = this.simpleSelectionState.areaPosition.top;
            this.container.style.cursor = "move";
          }
        },
        { passive: false },
      );
    });

    ["mouseup", "touchend"].forEach((eventType) => {
      window.addEventListener(eventType as keyof WindowEventMap, this.onEndMoving.bind(this));
    });

    ["mousemove", "touchmove"].forEach((eventType) => {
      window.addEventListener(
        eventType as keyof WindowEventMap,
        (event: Event) => {
          if (this.simpleSelectionState.preventEventCondition) {
            return;
          }

          if (this.simpleSelectionState.isResizing) {
            this.onResizing(event as MouseEvent | TouchEvent);
          }

          if (this.simpleSelectionState.isMoving) {
            this.onMoving(event as MouseEvent | TouchEvent);
          }
        },
        { passive: false },
      );
    });
  }

  private onMoving(event: MouseEvent | TouchEvent): void {
    event.preventDefault();

    if (this.simpleSelectionState.activePoint) {
      return;
    }

    // получаем координаты и размеры области в процентах
    const { width, height } = this.simpleSelectionState.areaPosition;

    const isMouseEvent = event instanceof MouseEvent;
    const pointer = isMouseEvent ?  event as MouseEvent : ((event as TouchEvent).touches[0] as Touch);

    // получаем координаты курсора мыши в пикселях
    const mouseX = pointer.clientX;
    const mouseY = pointer.clientY;

    // вычисляем смещение курсора в пикселях
    const dx = mouseX - this.startX;
    const dy = mouseY - this.startY;

    // переводим смещение в проценты относительно ширины и высоты контейнера
    const dLeft = (dx / this.container.offsetWidth) * 100;
    const dTop = (dy / this.container.offsetHeight) * 100;

    // вычисляем новые координаты области с учетом смещения
    let newLeft = this.startLeft + dLeft;
    let newTop = this.startTop + dTop;

    // ограничиваем новые координаты в пределах контейнера
    newLeft = Math.max(0, Math.min(newLeft, 100 - width));
    newTop = Math.max(0, Math.min(newTop, 100 - height));

    // запускаем метод для установки новых значений для точек и области
    this.setBoxArea({
      top: newTop,
      left: newLeft,
      width,
      height,
    });
  }

  private onEndMoving(): void {
    this.simpleSelectionState = {...this.simpleSelectionState, isMoving: false, isResizing: false}
    this.simpleSelectionState.activePoint = null;
    this.startX = 0;
    this.startY = 0;
    this.container.style.cursor = "unset";
  }

  private onResizing(event: MouseEvent | TouchEvent): void {
    if (!this.simpleSelectionState.isResizing && !this.simpleSelectionState.activePoint) {
      return;
    }

    event.preventDefault();

    const isMouseEvent = event instanceof MouseEvent;
    const pointer = isMouseEvent ? event as MouseEvent : ((event as TouchEvent).touches[0] as Touch);

    const pointClassName = (this.simpleSelectionState.activePoint as HTMLElement).classList.item(1) as Point;

    let newLeft = pointer.clientX - this.startX;
    let newTop = pointer.clientY - this.startY;

    const oldLeft = this.pointsPosition[pointClassName].left;
    const oldTop = this.pointsPosition[pointClassName].top;

    // Ограничиваем позицию point в пределах контейнера
    // гарантируем что Left не будет меньше 0 и не больше 100% ширины контейнера
    // расчеты в пикселях.
    newLeft = Math.max(0, Math.min(newLeft, this.container.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, this.container.offsetHeight));

    // пересчитываем в проценты
    newLeft = (newLeft / this.container.offsetWidth) * 100;
    newTop = (newTop / this.container.offsetHeight) * 100;

    // TODO проверить где еще можно переиспользовать проверку по коду
    const isWithinConstraints = this.checkPointConstraints(pointClassName, { left: newLeft, top: newTop });

    if (!isWithinConstraints) {
      return;
    }

    // TODO  вынести городушку в отдельный метод
    let resultLeft: number;
    let resultTop: number;

    switch (pointClassName) {

      case Point.E:
      case Point.W: {
        resultLeft = newLeft;
        resultTop = oldTop;

        break;
      }

      case Point.N:
      case Point.S: {
        resultLeft = oldLeft;
        resultTop = newTop;

        break;
      }

      case Point.NE:
      case Point.SE:
      case Point.SW:
      case Point.NW: {
        resultLeft = newLeft;
        resultTop = newTop;

        break;
      }

      default: {
        return;
      }
    }

    if (this.simpleSelectionState.keepAspectRatio) {
      this.resizeAreaWithKeepAspectRatio(pointClassName, { left: resultLeft, top: resultTop });

      return;
    }

    this.handlePointPosition(pointClassName, { left: resultLeft, top: resultTop });
  }

  /**
   * Метод для проверки, не нарушают ли новые координаты точки
   * ограничения по ширине и высоте области.
   * @param point - точка, для которой проверяются новые координаты
   * @param newCoordinates - новые координаты точки в процентах
   * @returns true, если новые координаты не нарушают ограничения,
   * и false, если нарушают
   */
  private checkPointConstraints(point: Point, newCoordinates: IPosition): boolean {
    const { left: newLeft, top: newTop } = newCoordinates;

    // TODO проверить эти кейсы на избыточность,
    //  поместить эти городушки в понятные переменные
    switch (point) {
      case Point.NW: {
        return newLeft <= this.simpleSelectionState.areaPosition.left + this.simpleSelectionState.areaPosition.width - this.simpleSelectionState.minSizes.width
          && newTop <= this.simpleSelectionState.areaPosition.top + this.simpleSelectionState.areaPosition.height - this.simpleSelectionState.minSizes.height;
      }
      case Point.N: {
        return newTop <= this.simpleSelectionState.areaPosition.top + this.simpleSelectionState.areaPosition.height - this.simpleSelectionState.minSizes.height;
      }
      case Point.NE: {
        return newLeft >= this.simpleSelectionState.areaPosition.left + this.simpleSelectionState.minSizes.width
          && newTop <= this.simpleSelectionState.areaPosition.top + this.simpleSelectionState.areaPosition.height - this.simpleSelectionState.minSizes.height;
      }
      case Point.E: {
        return newLeft >= this.simpleSelectionState.areaPosition.left + this.simpleSelectionState.minSizes.width;
      }
      case Point.SE: {
        return newLeft >= this.simpleSelectionState.areaPosition.left + this.simpleSelectionState.minSizes.width
          && newTop >= this.simpleSelectionState.areaPosition.top + this.simpleSelectionState.minSizes.height;
      }
      case Point.S: {
        return newTop >= this.simpleSelectionState.areaPosition.top + this.simpleSelectionState.minSizes.height;
      }
      case Point.SW: {
        return newLeft <= this.simpleSelectionState.areaPosition.left + this.simpleSelectionState.areaPosition.width - this.simpleSelectionState.minSizes.width
          && newTop >= this.simpleSelectionState.areaPosition.top + this.simpleSelectionState.minSizes.height;
      }
      case Point.W: {
        return newLeft <= this.simpleSelectionState.areaPosition.left + this.simpleSelectionState.areaPosition.width - this.simpleSelectionState.minSizes.width;
      }

      default: {
        return false;
      }
    }
  }


  /**
   * Метод управляет новыми координатами для активной точки.
   * Устанавливает для точки новые координаты,
   * обновляет зависимости с другими точками
   * и устанавливает область рамки в соответствии с новыми значениями
   * @param point
   * @param newCoordinates
   * @private
   */
  private handlePointPosition(point: Point, newCoordinates: IPosition): void {
    this.pointsPosition[point] = newCoordinates;
    this.updateDependentPoints(point, newCoordinates);
    this.setNewPositionOfPointsAndArea();
  }

  /**
   * Метод пересчитывает область с учетом сохранения соотношения сторон
   * текущей области
   * @private
   */
  private resizeAreaWithKeepAspectRatio(point: Point, newCoordinates: IPosition): void {
    // TODO Это костыль, чтобы запоминать предыдущее положение точки
    //  нужно пересмотреть эту часть кода
    const rightBottom = this.pointsPosition[Point.SE];

    this.handlePointPosition(point, newCoordinates);

    let width: number = this.simpleSelectionState.prevAreaPosition.width;
    let height: number = this.simpleSelectionState.prevAreaPosition.height;

    // TODO эти значения являются костылём для одной точки
    //  NW - поскольку при изменении её координаты,
    //  нам бы понадобилось закрепить рамку
    //  по её нижней и правой грани. Возможно найдется решение поизящнее.
    let left = Number.NaN;
    let top = Number.NaN;

    switch (point) {
      case Point.SE:
      case Point.SW:
      case Point.E:
      case Point.W: {
        width = this.simpleSelectionState.areaPosition.width;
        height = this.simpleSelectionState.areaPosition.width / (this.simpleSelectionState.prevAreaPosition.width / this.simpleSelectionState.prevAreaPosition.height);

        break;
      }

      case Point.NE:
      case Point.N:
      case Point.S: {
        width = this.simpleSelectionState.areaPosition.height * (this.simpleSelectionState.prevAreaPosition.width / this.simpleSelectionState.prevAreaPosition.height);
        height = this.simpleSelectionState.areaPosition.height;

        break;
      }

      case Point.NW: {

        width = this.simpleSelectionState.areaPosition.height * (this.simpleSelectionState.prevAreaPosition.width / this.simpleSelectionState.prevAreaPosition.height);
        height = this.simpleSelectionState.areaPosition.height;

        // "Закрепляем" правую и нижнюю границы рамки
        left = Math.abs(rightBottom.left - width);
        top = rightBottom.top - height;

        break;
      }

      default: {
        return;
      }
    }

    // Костыль проверки - если у нас превышен максимальный размер области,
    // то возвращается прежний размер рамки - ничего не меняется,
    // иначе доходя до предела максимального размера, происходит баг,
    // меняющий размер рамки с нарушением соотношения сторон
    if (height >= 100 || width >= 100) {

      this.setBoxArea(this.simpleSelectionState.prevAreaPosition);

      return;
    }

    this.setBoxArea({ top: top || this.simpleSelectionState.areaPosition.top, left: left || this.simpleSelectionState.areaPosition.left, width, height });
  }

  /**
   * Устанавливает новые позиции точек и области
   * @private
   */
  private setNewPositionOfPointsAndArea(): void {
    this.updatePoints();
    this.setAreaPosition();
    this.setClipPath();
  }

  /**
   * Обновляет стили положений точек управления рамкой
   * @private
   */
  private updatePoints(): void {
    for (const point of this.points as NodeListOf<HTMLElement>) {
      const pointClassName = point.classList.item(1);
      const { left: leftCoordinate, top: topCoordinate } = this.pointsPosition[pointClassName as Point];

      point.style.top = `${topCoordinate}%`;
      point.style.left = `${leftCoordinate}%`;
    }
  }


  /**
   * Метод для центрирования точки в области зависимых (NWSE)
   * @param pointNames
   * @private
   */
  private centerPoints(pointNames: Point[]): void {
    pointNames.forEach((pointName: Point) => {
      const dependencies = pointDependencies[pointName];

      if (dependencies.oX.length > 0) {
        // Вычисляем среднее значение координаты
        // X для точек из массива cX
        let sumY = 0;

        for (const point of dependencies.oX) {
          sumY += this.pointsPosition[point].top;
        }

        // Присваиваем это значение точке,
        // от которой зависит центральная координата Y
        this.pointsPosition[pointName].top = sumY / dependencies.oX.length;
      }

      if (dependencies.oY.length > 0) {
        // Вычисляем среднее значение координаты Y для точек из массива cY
        let sumX = 0;

        for (const point of dependencies.oY) {
          sumX += this.pointsPosition[point].left;
        }

        // Присваиваем это значение точке,
        // от которой зависит центральная координата X
        this.pointsPosition[pointName].left = sumX / dependencies.oY.length;
      }
    });
  }

  /**
   * Обновляет взаимосвязи между точками.
   * @param pointName - название точки, которую мы изменили
   * @param newCoordinates - её новые координаты в %
   * @private
   */
  private updateDependentPoints(pointName: Point, newCoordinates: IPosition): void {
    // Получаем зависимости точки из объекта-словаря
    const dependencies = pointDependencies[pointName];

    // Ограничиваем позицию point в пределах контейнера
    // гарантируем что Left не будет меньше 0 и не больше 100% ширины контейнера
    // расчеты в пикселях.

    // Проверяем, есть ли зависимости по оси X
    if (dependencies.oX.length > 0) {
      for (const point of dependencies.oX) {
        this.pointsPosition[point].left = newCoordinates.left;
      }
    }

    // Проверяем, есть ли зависимости по оси Y
    if (dependencies.oY.length > 0) {
      for (const point of dependencies.oY) {
        this.pointsPosition[point].top = newCoordinates.top;
      }
    }

    this.centerPoints([Point.N, Point.S, Point.E, Point.W]);
  }


  private setAreaPosition(): void {
    this.simpleSelectionState.prevAreaPosition = { ...this.simpleSelectionState.areaPosition };
    this.simpleSelectionState.areaPosition.width = this.pointsPosition[Point.E].left - this.pointsPosition[Point.W].left;
    this.simpleSelectionState.areaPosition.height = this.pointsPosition[Point.S].top - this.pointsPosition[Point.N].top;

    const leftValues = Object.values(this.pointsPosition).map((position) => {
      return position.left;
    });
    const minLeft = Math.min(...leftValues);

    const topValues = Object.values(this.pointsPosition).map((position) => {
      return position.top;
    });
    const minTop = Math.min(...topValues);

    this.simpleSelectionState.areaPosition.left = minLeft;
    this.simpleSelectionState.areaPosition.top = minTop;


    if (this.simpleSelectionState.areaPosition.width <= this.simpleSelectionState.minSizes.width) {
      this.setBoxArea({
        top: this.simpleSelectionState.areaPosition.top,
        left: this.simpleSelectionState.areaPosition.left,
        width: this.simpleSelectionState.minSizes.width,
        height: this.simpleSelectionState.areaPosition.height,
      });

      return;
    }

    if (this.simpleSelectionState.areaPosition.height <= this.simpleSelectionState.minSizes.height) {
      this.setBoxArea({
        top: this.simpleSelectionState.areaPosition.top,
        left: this.simpleSelectionState.areaPosition.left,
        width: this.simpleSelectionState.areaPosition.width,
        height: this.simpleSelectionState.minSizes.height,
      });

      return;
    }

    this.container.dispatchEvent(this.areaChangedEvent);
  }

  /**
   * Вырезает область "окна" внутри рамки.
   * @private
   */
  private setClipPath(): void {
    // координаты и размеры области в процентах
    const { top, left, width, height } = this.simpleSelectionState.areaPosition;

    // вычисляем вершины прямоугольника, который вырезает бекграунд
    const x1 = left; // левая верхняя вершина по x
    const y1 = top; // левая верхняя вершина по y
    const x2 = left + width; // правая нижняя вершина по x
    const y2 = top + height; // правая нижняя вершина по y

    // устанавливаем свойство clip-path для элемента area
    (this.area as HTMLElement).style.clipPath = `polygon(
    0% 0%,
    0% 100%,
    ${x1}% 100%,
    ${x1}% ${y1}%, 
    ${x2}% ${y1}%, 
    ${x2}% ${y2}%, 
    ${x1}% ${y2}%, 
    ${x1}% 100%, 
    100% 100%,
    100% 0%
  )`;
  }
}
