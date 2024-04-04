import {IState} from "../types/IState";
import {initialAreaPosition} from "./InitialAreaPosition";

export const _initialState: IState = {
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