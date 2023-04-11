import { Component, For } from 'solid-js'
import { Field } from './components/Field'
import { ShareButton } from './components/ShareButton'
import { Viewer } from './components/Viewer'
import { fields } from './store'
import { Modal } from './components/Modal'
import ImageBBKeyButton from './components/ImageBBKeyButton'
const App: Component = () => {
  return (
    <>
      <div class="flex flex-row">
        <div class="container flex flex-col justify-between p-4 w-[350px] overflow-auto h-screen">
          <div class="grid gap-8 md:grid-rows-5">
            <For each={fields}>{(field) => <Field id={field.id} />}</For>
            <div class="flex flex-col gap-5 m-2">
              <ShareButton />
              <ImageBBKeyButton />
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
