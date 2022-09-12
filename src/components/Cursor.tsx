import { Component, Show } from 'solid-js'

type Props = {
  offset: { x: number; y: number }
  showY: boolean
  showX: boolean
  height: number | null
  isDragging: boolean
}

export const Cursor: Component<Props> = (props) => {
  return (
    <>
      {/* Dot */}
      <span
        class="w-3 h-3 absolute z-20 bg-black bg-opacity-50 border border-white rounded-full transition-property-[scale] ease-linear duration-75"
        style={`translate: ${props.offset.x - 6}px ${props.offset.y - 6}px; ${props.isDragging && 'scale: 1.3'}`}
      />

      {/* CursorY */}
      <Show when={props.showY}>
        <span
          class="absolute w-[2px] h-full bg-black bg-opacity-50 z-10 ring-1 ring-white ring-opacity-25"
          style={`transform: matrix(1, 0, 0, 1, ${props.offset.x - 1}, 0); left: 0; height: ${props.height}%`}
        />
      </Show>

      {/* CursorX */}
      <Show when={props.showX}>
        <span
          class="absolute w-full h-[2px] bg-black bg-opacity-50 z-10 ring-1 ring-white ring-opacity-25"
          style={`transform: matrix(1, 0, 0, 1, 0, ${props.offset.y - 1}); top: 0`}
        />
      </Show>
    </>
  )
}
