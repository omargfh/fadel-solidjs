import { Component, Show } from 'solid-js'
import {
  getField,
  updateField,
  getCloudKey,
  updateCloudKey,
  cloudKeyExists,
  clearCloudKey,
  getSettingOption
} from '../store'
import { FieldId } from '../types'
import axios from 'axios'
interface FieldProps {
  id: FieldId
}

export const Field: Component<FieldProps> = ({ id }) => {
  const field = getField(id)
  let fileInputRef: HTMLInputElement | undefined
  let isUploading = $signal(false)

  const openFilePicker = () => {
    if (fileInputRef) fileInputRef.click()
  }

  const handleFile = (
    e: Event & {
      currentTarget: HTMLInputElement
      target: Element
    }
  ) => {
    const file = e.currentTarget.files?.[0]

    if (file) {
      // Determine if file can be uploaded to ImageBB
      let local = getSettingOption('use_cloud') === 'false'

      // Get user API key
      let api_key: string | null = getCloudKey()
      if (!local && !cloudKeyExists()) {
        api_key = prompt("Enter your ImageBB API Key:");
        if (api_key === null || api_key === '') {
          local = true;
          clearCloudKey()
        } else {
          updateCloudKey(api_key)
        }
      }

      if (!local) {
        reset()
        isUploading = true
        let body = new FormData();
        body.set('key', api_key as string);
        body.append('image', file);
        axios.post(getSettingOption('cloud_host'), body).then(res => {
          updateField(id, { label: file.name, imagesrc: res.data.data.url, isLocal: false })
        })
        .catch(err => {
          updateField(id, { label: file.name, imagesrc: URL.createObjectURL(file), isLocal: true })
          alert("Error uploading image to ImageBB. Please check your API key and try again. If the problem persists, please contact the developer.")
        })
        .finally(() => {
          isUploading = false
        })
      }
      else {
        updateField(id, { label: file.name, imagesrc: URL.createObjectURL(file), isLocal: true })
      }
    }
  }

  const reset = () => {
    updateField(id, { label: '', imagesrc: '', isLocal: false })
  }

  return (
    <>
      <div>
        <label for={field.name} class="mb-2 text-xs uppercase text-gray-300 flex items-center">
          <img slot="icon" class="mr-1 w-6 h-6" src={`icons/${id}.svg`} width="24" alt="" />
          {field.name}
        </label>

        <div class="relative mb-1">
          {/* ---------------------- */}
          {/* Image URL & Local File */}
          {/* ---------------------- */}

          <input
            type="text"
            id={field.name}
            class={`bg-[#26292b] text-white text-sm rounded-lg rounded-b-none focus:ring-4 ring-gray-500 outline-none block w-full h-14 p-3 ${
              field.isLocal && '!bg-[#06453d]'
            } ${field.imagesrc && 'pr-24'}`}
            placeholder="Enter URL or Open Local File"
            value={field.isLocal ? 'Local File' : field.imagesrc}
            readOnly={field.isLocal}
            onInput={(e) => updateField(id, { imagesrc: e.currentTarget.value })}
          />

          <Show when={field.imagesrc}>
            <button
              onClick={reset}
              type="submit"
              class={`text-[#a0a0a0] hover:text-[#ededed] absolute right-12 top-1/2 -translate-y-1/2 p-3`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17.6585 4.92888C18.049 4.53836 18.6822 4.53835 19.0727 4.92888C19.4632 5.3194 19.4632 5.95257 19.0727 6.34309L13.4158 12L19.0727 17.6568C19.4632 18.0473 19.4632 18.6805 19.0727 19.071C18.6822 19.4615 18.049 19.4615 17.6585 19.071L12.0016 13.4142L6.34481 19.071C6.3387 19.0771 6.33254 19.0831 6.32632 19.089C5.93455 19.4614 5.31501 19.4554 4.93059 19.071C4.6377 18.7781 4.56447 18.3487 4.71092 17.9876C4.75973 17.8672 4.83296 17.7544 4.93059 17.6568L10.5874 12L4.93059 6.34314C4.54006 5.95262 4.54006 5.31945 4.93059 4.92893C5.32111 4.5384 5.95428 4.5384 6.3448 4.92893L12.0016 10.5857L17.6585 4.92888Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </Show>

          <button
            title="Open File Picker"
            onClick={openFilePicker}
            type="submit"
            class="text-black absolute right-2 top-1/2 -translate-y-1/2 bg-[#ededed] hover:bg-[#c7c7c7] focus:ring-4 focus:outline-none focus:ring-white rounded-lg px-2 py-1"
          >
            <Show when={!isUploading} fallback={<div role="status" class="dot-flashing mx-3"></div>}>
              <img class="w-6 h-6" src="icons/upload.svg" alt="" />
            </Show>
          </button>

          <input ref={fileInputRef} onChange={handleFile} type="file" hidden />
        </div>

        {/* ---------------------- */}
        {/*         Label          */}
        {/* ---------------------- */}
        <input
          type="text"
          class="bg-[#26292b] text-white text-sm rounded-lg rounded-t-none focus:ring-4 ring-gray-500 outline-none block w-full h-14 p-3"
          placeholder="Label"
          value={field.label}
          onInput={(e) => updateField(id, { label: e.currentTarget.value })}
        />
      </div>
    </>
  )
}
