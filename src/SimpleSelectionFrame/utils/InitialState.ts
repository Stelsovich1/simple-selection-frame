import {IState} from "../types/IState.ts";
import {initialAreaPosition} from "./InitialAreaPosition.ts";

export const initialState: IState = {
    areaPosition: { ...initialAreaPosition },
    prevAreaPosition: { ...initialAreaPosition },
    activePoint: null,
    isResizing: false,
    isMoving: false,
    keepAspectRatio: false,
    isHidden: false,
    isDisabled: false,
    minSizes: {width: 5, height: 5},
    preventEventCondition: false
}