import { Component, createEffect, createSignal, onMount, Show } from 'solid-js'

interface ImgProps {
  imageurl: string
  clip?: { top?: number; left?: number }
}

export const Img: Component<ImgProps> = (props) => {
  let isLoading = $signal(true)
  const img = new Image(0, 0)

  onMount(() => {
    img.addEventListener('loadstart', () => {
      isLoading = true
    })
    img.addEventListener('load', () => {
      isLoading = false
    })
  })

  createEffect(() => {
    img.src = props.imageurl
  })

  return (
    <Show when={props.imageurl}>
      <Show
        when={!isLoading}
        fallback={
          <div
            class="bg-[#26292b] text-white text-12 w-full h-full min-w-[50vw] min-h-[50vh] m-auto grid place-content-center"
            style={`grid-area: 1 / 1 / 3 / 3; clip-path: inset(${props.clip?.top || 0}% 0 0 ${
              props.clip?.left || 0
            }%);`}
          >
            Loading...
          </div>
        }
      >
        <img
          class="object-contain w-full h-full"
          style={`grid-area: 1 / 1 / 3 / 3; clip-path: inset(${props.clip?.top || 0}% 0 0 ${props.clip?.left || 0}%);`}
          src={props.imageurl}
          alt=""
          draggable={false}
        />
      </Show>
    </Show>
  )
}
