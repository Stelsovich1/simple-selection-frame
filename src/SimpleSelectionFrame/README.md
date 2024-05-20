# SimpleSelectionFrame

## Description

```SimpleSelectionFrame``` is a library for working with a movable container frame.<br/>

## Features

* Create, modify, move the frame within the parent container;
* All input and output data about the frame position is transmitted as a percentage;
* The frame position is adjusted relative to the left and top borders of the parent container;
* Adapted for touch devices;

![example.gif](public%2Fexample.gif)

## Installation

```
npm i simple-selection-frame
```

## Usage

### Class constructor
```typescript
constructor(container: HTMLElement, initialState?: Partial<IState>)
```

### Example
```typescript
// The container must include position: relative property
const container = document.getElementById('container');
const simpleSelectionFrame = new SimpleSelectionFrame(container, {minSizes: {width: 10, height: 10}});

// Set the area position
simpleSelectionFrame.setBoxArea({top: 10, left: 10, width: 50, height: 50});

// Get the current area position
simpleSelectionFrame.state.areaPosition;

// Enable maintaining the aspect ratio of the area
simpleSelectionFrame.state.keepAspectRatio = true;

// Toggle the visual display of control points
simpleSelectionFrame.togglePointsOff();

// Toggle the SimpleSelectionFrame service on/off
simpleSelectionFrame.toggleDisable();
```

## Public methods

```
reset(areaPosition = initialAreaPosition): void
```
Resets the frame to its initial state.<br/>
areaPosition: IArea (optional) -  an object containing the initial position and size values for the area.
```
setBoxArea({ top, left, width, height }: IArea): void
```
Sets the new position and size of the area, moving all points subject to container constraints and minimum area size.<br/>
top - new value for the top position of the area (as a percentage).<br/>
left - new value for the left position of the area (as a percentage).<br/>
width - new width of the area (as a percentage).<br/>
height - new height of the area (as a percentage).<br/>

```
togglePointsOff(): void
```
Toggles the visibility of the points on the area.<br/>
Disables or enables the visibility of elements through styles.<br/>
The area can still be moved.

```
toggleDisable(): void
```
Toggles the disabling of ```SimpleSelectionFrame```.<br/>
Removes points, prohibits moving the area, and removes the background outside the area.

```
initialize(): void
```
Reinitialized the frame

## State

The state is controlled by the getter and setter ```state```, <br/>
and the initial state when creating an instance can be passed in the instance parameters of the class:
```ts
interface IState {
    /**
     * Frame area position.
     */
    areaPosition: IArea;
    /**
     * Previous area position data
     */
    prevAreaPosition: IArea;
    /**
     * Is the area being resized?
     */
    isResizing: boolean;
    /**
     * Is the area being moved?
     */
    isMoving: boolean;
    /**
     * Is the aspect ratio of the area maintained?
     */
    keepAspectRatio: boolean;
    /**
     * Are the controls hidden?
     */
    isHidden: boolean;
    /**
     * SimpleSelectionFrame operation flag
     */
    isDisabled: boolean;
    /**
     * Minimum height and width of the frame area as a percentage.
     */
    minSizes: ISizes;
    /**
     * Active point.
     * The point from which the position changes begin
     */
    activePoint: HTMLElement | null;
    /**
     * A condition under which the event handlers on the SimpleSelectionFrame frame will not be executed
     */
    preventEventCondition: boolean;
}
```

```IArea``` interface accepts a numeric value that is described in relative terms - percentages:
```ts
interface IArea {
top: number;
left: number;
width: number;
height: number;
}
```

## Events
The container on which ```SimpleSelectionFrame``` is running can listen for the event

```js
container.addEventListener("areaChanged", (event) => {...})
```
```event.detail``` returns an object of the ```IArea``` interface

## Styles
The area and 8 control points DOM elements are created inside the parent container.<br/>
You can override and control the design of element rendering with classes.

```css
.simpleSelectionFrame__*** 
```


## License

MIT License

## Author

Nikitin Roman

@stelsovich1 telegram

Maximaster co.

@maximaster_ru telegram
