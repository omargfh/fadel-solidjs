import { Component } from 'solid-js'
import { Cursor } from './Cursor'
import { Label } from './Label'
import { fields } from '../store'
import { Img } from './Image'
import { FieldId } from '../types'

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

  function mouseMove(e: MouseEvent) {
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
    zoomLevel = direction > 0 ? zoomLevel / 1.25 : zoomLevel * 1.25
  }

  function wheel(e: WheelEvent) {
    e.preventDefault()
    const direction = Math.sign(e.deltaY) // 1 or -1

    zoom(direction)
  }

  function mouseDown() {
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
      >
        <div class="contents pointer-events-none select-none">
          <$for each={ActiveFields}>{(field) => <Label position={field.id}>{field.label}</Label>}</$for>
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
