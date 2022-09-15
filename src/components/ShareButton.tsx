import { Component, Show } from 'solid-js'
import { fields } from '../store'

import '../assets/dot-flashing-animation.css'

export const ShareButton: Component = () => {
  let isLoading = $signal(false)

  const share = async () => {
    const url = `${location.origin}?fields=${btoa(JSON.stringify(fields))}`
    let finalUrl = url

    isLoading = true

    try {
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
      class="text-black  bg-[#ffef5c] hover:bg-[#f5d909] focus:ring-4 focus:ring-[#fbfad0] rounded-lg font-bold text-sm px-5 py-2.5 h-16 grid place-content-center"
    >
      <Show when={!isLoading} fallback={<div role="status" class="dot-flashing"></div>}>
        <span>SHARE</span>
      </Show>
    </button>
  )
}
