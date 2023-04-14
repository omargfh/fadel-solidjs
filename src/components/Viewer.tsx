import { Component, createEffect, onMount } from 'solid-js'
import { Cursor } from './Cursor'
import { Label } from './Label'
import { fields, getSettingOption, setSettingOption, settings } from '../store'
import { Img } from './Image'
import { FieldId } from '../types'
import { usePinch, useDrag, useGesture } from 'solid-gesture'

interface SimulatedMouseMoveEvent {
  clientX: number,
  clientY: number,
  pageX: number,
  pageY: number,
  offsetX: number,
  offsetY: number,
}

export const Viewer: Component = ({}) => {
  let view: HTMLDivElement | undefined
  let viewOffsetTopPerc = $signal(0)
  let viewOffsetLeftPerc = $signal(0)

  let content: HTMLDivElement | undefined
  let contentOffsetTopPerc = $signal(0)
  let contentOffsetLeftPerc = $signal(0)

  let zoomLevel = $signal(1)
  let lastPoint = $signal<{ x: number; y: number } | null>(null)
  let isDragging = $signal(false)
  let contentTranslate = $signal({
    x: 0,
    y: 0,
  })

  let expectsTouch = $signal(false)

  onMount(() => {
    // General touch detection (https://stackoverflow.com/questions/55833326/wrong-maxtouchpoints-and-ontouchstart-in-document-in-chrome-mobile-emulati/67909182#67909182)
    // Bug in FireFox+Windows 10, navigator.maxTouchPoints is incorrect when script is running inside frame.
    // TBD: report to bugzilla.
    const navigator = (window.top || window).navigator;
    const maxTouchPoints = Number.isFinite(navigator.maxTouchPoints) ? navigator.maxTouchPoints : navigator.msMaxTouchPoints;
    if (Number.isFinite(maxTouchPoints)) {
        // Windows 10 system reports that it supports touch, even though it acutally doesn't (ignore msMaxTouchPoints === 256).
        if (maxTouchPoints > 0 && maxTouchPoints !== 256) {
            expectsTouch = true;
            return;
        }
    }
    else if ('ontouchstart' in window) {
        expectsTouch = true;
        return;
    }
  })

  createEffect(() => {
    if (expectsTouch) {
      setSettingOption('touchscreen', 'true')
    } else {
      setSettingOption('touchscreen', 'false')
    }
  }, [expectsTouch]);


  function simulateMouseMovement(e: TouchEvent) {
    if (!view || !content) return

    const {
      left: contentOffsetLeft,
      top: contentOffsetTop,
    } = view.getBoundingClientRect()

    const mouseEvent: SimulatedMouseMoveEvent = {
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
      pageX: e.touches[0].pageX,
      pageY: e.touches[0].pageY,
      offsetX: e.touches[0].clientX - contentOffsetLeft,
      offsetY: e.touches[0].clientY - contentOffsetTop,
    }

    if (e.touches.length == 1) {
      mouseMove(mouseEvent)
    }
  }
  const binders = useGesture(
    {
      onDrag: ({ active, delta, touches, event}) => {
        if (touches === 1) {
          simulateMouseMovement(event as TouchEvent)
        }
        if (touches === 2 && active) {
          contentTranslate = {
            x: contentTranslate.x + delta[0] / zoomLevel,
            y: contentTranslate.y + delta[1] / zoomLevel,
          }
        }
      },
      onPinch: ({ active, offset: [scale], pinching, touches}) => {
        if (touches === 2 && active && pinching) {
          zoomLevel = scale;
          return;
        }
      }
    }, {
      eventOptions: {
        passive: false,
      },
      drag: {
        filterTaps: true,
        threshold: 10,
        pointer: { touch: true },
      },
      pinch: {
        pointer: { touch: true },
      }
    })

    const noPWABinders = useDrag(({ active, delta, touches, event }) => {
      if (touches === 1) {
        simulateMouseMovement(event as TouchEvent)
      }
    }, {
      eventOptions: {
        passive: false,
      },
      pointer: { touch: true }
    })

  function mouseMove(e: MouseEvent | SimulatedMouseMoveEvent) {
    if (!view || !content) return

    let viewWidth = view.clientWidth
    let viewHeight = view.clientHeight

    const {
      width: contentWidth,
      height: contentHeight,
      left: contentOffsetLeft,
      top: contentOffsetTop,
    } = content.getBoundingClientRect()

    viewOffsetTopPerc = (e.offsetY / viewHeight) * 100
    viewOffsetLeftPerc = (e.offsetX / viewWidth) * 100

    contentOffsetTopPerc = ((e.clientY - contentOffsetTop) / contentHeight) * 100
    contentOffsetLeftPerc = ((e.clientX - contentOffsetLeft) / contentWidth) * 100

    if (isDragging) {
      if (lastPoint) {
        contentTranslate = {
          x: contentTranslate.x + (e.pageX - lastPoint.x) / zoomLevel,
          y: contentTranslate.y + (e.pageY - lastPoint.y) / zoomLevel,
        }
      }

      lastPoint = { x: e.pageX, y: e.pageY }
    }
  }

  function zoom(direction: number) {
    zoomLevel *= Math.exp(direction * -0.1)
  }

  function wheel(e: WheelEvent) {
    e.preventDefault()
    const direction = Math.sign(e.deltaY) // 1 or -1
    zoom(direction)
  }

  function mouseDown() {
    if (expectsTouch) return
    isDragging = true
  }

  function mouseUp() {
    isDragging = false
    lastPoint = null
  }

  const ActiveFields = $memo(fields.filter((field) => field.imagesrc))

  const getClip = (fieldId: FieldId) =>
    ({
      topLeft: undefined,
      topRight: { left: contentOffsetLeftPerc },
      bottomLeft: { top: contentOffsetTopPerc },
      bottomRight: { left: contentOffsetLeftPerc, top: contentOffsetTopPerc },
    }[fieldId])


  return (
    <>
      <div
        class="relative flex w-screen h-screen overflow-hidden cursor-none"
        style={`background: url('/pattern.svg')`}
        ref={view}
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
        onMouseMove={mouseMove}
        onWheel={wheel}
        {...((getSettingOption('pwa_mounted') === 'true' && expectsTouch) ? binders() : noPWABinders())}
      >
        <div class="contents pointer-events-none select-none">
          <$for each={ActiveFields}>{(field) => <Label position={field.id} clip={{
            x: 100 - ((viewOffsetLeftPerc / 100) * (view?.clientWidth || 1) - 6) / (view?.clientWidth || 1) * 100,
          }}>{field.label}</Label>}</$for>
          <Label position="bottomCenter" class="text-xs">
            {(zoomLevel * 100).toFixed(0)}%
            {/* | {-contentTranslate().x.toFixed(0)}x {contentTranslate().y.toFixed(0)}y */}
          </Label>

          <Cursor
            offset={{
              x: (viewOffsetLeftPerc / 100) * (view?.clientWidth || 1),
              y: (viewOffsetTopPerc / 100) * (view?.clientHeight || 1),
            }}
            height={ActiveFields.length === 3 ? viewOffsetTopPerc : 100}
            showY={ActiveFields.length > 1}
            showX={ActiveFields.length > 2}
            isDragging={isDragging}
          />

          <div
            class="grid place-items-center mx-auto transition-property-[scale] duration-100 ease-linear h-max m-auto grid-cols-2 grid-rows-2"
            style={`scale: ${zoomLevel}; transform: matrix(1, 0, 0, 1, ${contentTranslate.x}, ${contentTranslate.y});`}
            ref={content}
          >
            <$for each={fields}>{(field) => <Img imageurl={field.imagesrc} clip={getClip(field.id)} />}</$for>
          </div>
        </div>
      </div>
    </>
  )
}
