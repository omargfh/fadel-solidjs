import { Component, Show } from 'solid-js'
import { fields, hasLocalFiles } from '../store'

import '../assets/dot-flashing-animation.css'

export const ShareButton: Component = () => {
  let isLoading = $signal(false)
  let isDisabled = $signal(false)

  $effect(() => {
    isDisabled = hasLocalFiles()
  })

  const share = async () => {
    const isLocalhost = location.origin.includes('localhost')
    const url = `${location.origin}?fields=${encodeURIComponent(btoa(JSON.stringify(fields)))}`
    let finalUrl = url

    isLoading = true

    try {
      if (isLocalhost) throw 0

      const formData = new FormData()
      formData.append('url', url)

      finalUrl = await (
        await fetch(`https://corsproxy.io/?${encodeURIComponent('https://cutt.ly/scripts/shortenUrl.php')}`, {
          method: 'POST',
          body: formData,
        })
      ).text()
    } finally {
      isLoading = false
      prompt('Copy to clipboard: Ctrl+C', finalUrl)
    }
  }

  return (
    <button
      onClick={share}
      type="button"
      class="text-black  bg-[#ffef5c] hover:bg-[#f5d909] focus:ring-4 focus:ring-[#fbfad0] rounded-lg font-bold text-sm px-5 py-1 h-16 grid place-content-center uppercase disabled:!bg-[#a0a0a0] disabled:cursor-not-allowed"
      disabled={isDisabled}
    >
      <Show when={!isLoading} fallback={<div role="status" class="dot-flashing"></div>}>
        <Show when={!isDisabled} fallback="cannot share local files">
          <span>share</span>
        </Show>
      </Show>
    </button>
  )
}
