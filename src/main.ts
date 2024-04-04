import './style.css'
import {SimpleSelectionFrame} from "./SimpleSelectionFrame/SimpleSelectionFrame.ts";
import {IArea} from "./SimpleSelectionFrame/types/IArea.ts";


window.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector<HTMLDivElement>('#SSF')
    const ssf = new SimpleSelectionFrame(container, {minSizes: {width: 15, height: 15}})
    const widthInput = document.querySelector<HTMLInputElement>('#width')
    const heightInput = document.querySelector<HTMLInputElement>('#height')
    const minWidthInput = document.querySelector<HTMLInputElement>('#minWidth')
    const minHeightInput = document.querySelector<HTMLInputElement>('#minHeight')
    const keepAspectRatio = document.querySelector<HTMLButtonElement>('[data-keep-aspect-ratio]')
    const reset = document.querySelector<HTMLButtonElement>('[data-reset]')
    const disable = document.querySelector<HTMLButtonElement>('[data-disable]')
    const pointsOff = document.querySelector<HTMLButtonElement>('[data-points-off]')

    const coordinates = document.querySelector<HTMLSpanElement>('.coordinates')
    coordinates.innerText = `x: ${ssf.state.areaPosition.left} %
    y: ${ssf.state.areaPosition.top} %
    width: ${ssf.state.areaPosition.width} %
    height: ${ssf.state.areaPosition.height} %`

    container.addEventListener("areaChanged", (event) => {
        widthInput.value = String(Math.round((event as CustomEvent<IArea>).detail.width * 100) / 100);
        heightInput.value = String(Math.round((event as CustomEvent<IArea>).detail.height * 100) / 100);

        coordinates.innerText = `x: ${String(Math.round((event as CustomEvent<IArea>).detail.left * 100) / 100)} %
        y: ${String(Math.round((event as CustomEvent<IArea>).detail.top * 100) / 100)} % 
        width: ${String(Math.round((event as CustomEvent<IArea>).detail.width * 100) / 100)} % 
        height: ${String(Math.round((event as CustomEvent<IArea>).detail.height * 100) / 100)} %`
    })

    minWidthInput?.addEventListener('change', () => {
        ssf.state.minSizes.width = Number(minWidthInput.value)
    })
    minHeightInput?.addEventListener('change', () => {
        ssf.state.minSizes.height = Number(minHeightInput.value)
    })
    widthInput?.addEventListener('change', () => {
        ssf.setBoxArea({...ssf.state.areaPosition, width: Number(widthInput.value)})
    })
    heightInput?.addEventListener('change', () => {
        ssf.setBoxArea({...ssf.state.areaPosition, height: Number(heightInput.value)})
    })
    keepAspectRatio?.addEventListener('click', () => {
        ssf.state = {...ssf.state, keepAspectRatio: !ssf.state.keepAspectRatio}
        keepAspectRatio.classList.toggle("toggled")
    })
    reset?.addEventListener('click', () => {
        ssf.reset()
    })
    disable?.addEventListener('click', () => {
        ssf.toggleDisable()
        disable.classList.toggle("toggled")
    })
    pointsOff?.addEventListener('click', () => {
        ssf.togglePointsOff()
        pointsOff.classList.toggle("toggled")
    })
})




