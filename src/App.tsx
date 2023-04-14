import { Component, For, onMount, Show } from 'solid-js'
import { Field } from './components/Field'
import { ShareButton } from './components/ShareButton'
import { Viewer } from './components/Viewer'
import { fields, getSettingOption, setSettingOption } from './store'
import { Modal } from './components/Modal'
import CloudKeyButton from './components/CloudKeyButton'
import { settings } from './store'
import UseCloudButton from './components/UseCloudButton'

const App: Component = () => {
  let mobileSidebarActive = $signal(false)
  let expectsTouch = $memo(settings.touchscreen === 'true')
  let isPWA = $memo(settings.pwa === 'true')
  let installPromptDismissed = $signal(false)
  onMount(() => {
    // Detect PWA
    const androidCondition = window.matchMedia('(display-mode: standalone)').matches
    const iOSCondition = window.navigator.standalone === true
    if (androidCondition || iOSCondition) {
      setSettingOption('pwa_mounted', 'true')
    }
    else {
      setSettingOption('pwa_mounted', 'false')
    }
  })

  return (
    <>
      <Show when={!(getSettingOption('pwa_mounted') === 'true') && expectsTouch && !installPromptDismissed}>
        {/* prompt user to install */}
        <div class="fixed bottom-0 left-0 w-full bg-[#24a8e0] text-white text-center py-4 z-200">
          <div class="text-lg font-bold">Install this app</div>
          <div class="text-sm">Install this app to use gestures.</div>
          <button class="bg-[#fbfad0] text-black font-bold text-sm px-4 py-2 rounded-lg mt-2" onClick={() => {
            installPromptDismissed = true
          }}>Dismiss</button>
        </div>
      </Show>
      <div class={`flex flex-row ${expectsTouch ? 'touch' : ''}`}>
        <Show when={expectsTouch}>
          <button
            class={`sidebar-button ${mobileSidebarActive ? 'translate-x-[200px] sm:translate-x-[250px] md:translate-x-[450px] lg:translate-x-[4 50px]' : ''} text-black bg-[#24a8e0] focus:ring-4 focus:ring-[#fbfad0] rounded-lg font-bold text-sm px-0 py-1 h-16 grid place-content-center uppercase disabled:!bg-[#a0a0a0] disabled:cursor-not-allowed`}
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
        </Show>
        <div id="sidebar" class={`container flex flex-col justify-between p-4 w-[200px] sm:w-[250px] md:w-[450px] lg:w-[450px] overflow-auto h-screen gap-0 ${mobileSidebarActive ? 'translate-x-0 open' : ''}`}>
          <div class="grid gap-8 md:grid-rows-0"> {/* changed from md:grid-cols-5 to md:grid-rows-0 */}
            <For each={fields}>{(field) => <Field id={field.id} />}</For>
            <div class="flex flex-col gap-5 m-2">
              <UseCloudButton />
              <ShareButton />
              <CloudKeyButton />
            </div>
            <div class="text-xs text-gray-400 text-center flex flex-col gap-2">
              <span>
                Created by
                <a class="underline underline-offset-4 ml-1" href="https://github.com/SamyzKhalil" target="_blank">
                  Abdelrahman Khalil
                </a>
              </span>
              <span>
                V1.1 by
                <a class="underline underline-offset-4 ml-1" href="https://github.com/omargfh" target="_blank">
                  Omar Ibrahim
                </a>
              </span>
            </div>
          </div>
        </div>

        <Viewer />
      </div>
    </>
  )
}

export default App
