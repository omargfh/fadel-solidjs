import { Component, For, Show } from 'solid-js'
import { Field } from './components/Field'
import { ShareButton } from './components/ShareButton'
import { Viewer } from './components/Viewer'
import { fields } from './store'
import { Modal } from './components/Modal'
import CloudKeyButton from './components/CloudKeyButton'

const App: Component = () => {
  let mobileSidebarActive = $signal(false)
  return (
    <>
      <div class="flex flex-row">
        <button
          class={`sidebar-button ${mobileSidebarActive ? 'open' : ''} text-black bg-[#24a8e0] focus:ring-4 focus:ring-[#fbfad0] rounded-lg font-bold text-sm px-0 py-1 h-16 grid place-content-center uppercase disabled:!bg-[#a0a0a0] disabled:cursor-not-allowed`}
          onClick={() => { mobileSidebarActive = !mobileSidebarActive }}
        >
          <Show when={!mobileSidebarActive} fallback={
            <svg class="w-6 h-6 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          }>
            <svg class="w-6 h-6 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </Show>
        </button>
        <div id="sidebar" class={`container flex flex-col justify-between p-4 w-[350px] overflow-auto h-screen ${mobileSidebarActive ? 'open' : ''}`}>
          <div class="grid gap-8 md:grid-rows-5">
            <For each={fields}>{(field) => <Field id={field.id} />}</For>
            <div class="flex flex-col gap-5 m-2">
              <ShareButton />
              <CloudKeyButton />
            </div>
            <div class="text-xs text-gray-400 text-center">
            Created by
            <a class="underline underline-offset-4 ml-1" href="https://github.com/SamyzKhalil" target="_blank">
              Abdelrahman Khalil
            </a>
          </div>
          </div>
        </div>

        <Viewer />
      </div>
    </>
  )
}

export default App
