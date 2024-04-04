# SimpleSelectionFrame

## Описание

```SimpleSelectionFrame``` - это библиотека для работы с контейнерной перемещаемой рамкой.<br/> 

## Возможности

* Позволяет пользователю создавать, изменять и перемещать рамку внутри родительского контейнера;
* Все входные и выходные данные о положении рамки передаются в процентах;
* Положение рамки регулируется относительно левой и верхней грани родительского контейнера;
* Адаптировано под сенсорные устройства.

## Установка

```
npm i simple-selection-frame
```

## Использование

### Конструктор класса
```typescript
constructor(container: HTMLElement, initialState?: Partial<IState>)
```

### Пример использования
```typescript
// Контейнер должен включать свойство position: relative
const container = document.getElementById('container');
const simpleSelectionFrame = new SimpleSelectionFrame(container, {minSizes: {width: 10, height: 10}});

// Установка положения области
simpleSelectionFrame.setBoxArea({top: 10, left: 10, width: 50, height: 50});

// Получение текущего положения области
simpleSelectionFrame.state.areaPosition;

// Включение сохранения пропорций области
simpleSelectionFrame.state.keepAspectRatio = true;

// Включение/выключение визуального отображения точек управления
simpleSelectionFrame.togglePointsOff();

// Включение/выключение сервиса SimpleSelectionFrame
simpleSelectionFrame.toggleDisable();
```

## Публичные методы
```
reset(areaPosition = initialAreaPosition): void
```
Сбрасывает рамку к начальному состоянию.<br/>
Размеры области по умолчанию: top: 0%, left: 0%, width: 100%, height: 100%.

areaPosition (необязательный) - объект, содержащий начальные значения для положения и размеров области.

```
setBoxArea({ top, left, width, height }: IArea): void
```
Задает новую позицию и размер области, перемещая все точки с учетом ограничений контейнера и минимального размера области.
top - новое значение для верхней позиции области (в процентах).
left - новое значение для левой позиции области (в процентах).
width - новая ширина области (в процентах).
height - новая высота области (в процентах).

```
togglePointsOff(): void
```
Переключает видимость точек на области.<br/>
Отключает или включает видимость элементов через стили.<br/>
Область по-прежнему можно перемещать.

```
toggleDisable(): void
```
Переключает отключение работы SimpleSelectionFrame.<br/>
Убирает точки, запрещает двигать область и убирает фон вне области.

```
initialize(): void
```
Переинициализирует рамку

## Интерфейс состояния

Состояние управляется геттером и сеттером ```state```, <br/>
начальное состояние при создании экземпляра может быть передано в параметрах экземпляра класса.
```ts
interface IState {
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
```
Интерфейс ```IArea``` принимает числовое значение которое описывается в относительных величинах - процентах
```ts
interface IArea {
top: number;
left: number;
width: number;
height: number;
}
```


## События
У контейнера на котором работает SimpleSelectionFrame можно прослушать событие
```js
container.addEventListener("areaChanged", (event) => {...})
```
event.detail возвращает объект интерфейса ```IArea```

## Стили

Внутри родительского контейнера создаются DOM элементы области и 8 точек управления.<br/>
Вы можете перезаписывать и управлять дизайном отображения элементов с классами
```css
.simpleSelectionFrame__*** 
```


## Лицензия

MIT License

## Автор

Nikitin Roman

@stelsovich1 telegram

Maximaster co.

@maximaster_ru telegram
