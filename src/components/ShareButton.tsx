import { Component } from 'solid-js'
import { fields } from '../store'

export const ShareButton: Component = () => {
  const share = () => {
    const url = `${location.origin}?fields=${btoa(JSON.stringify(fields))}`
    prompt('Copy to clipboard: Ctrl+C', url)
  }

  return (
    <button
      onClick={share}
      type="button"
      class="text-black  bg-[#ffef5c] hover:bg-[#f5d909] focus:ring-4 focus:ring-[#fbfad0] rounded-lg font-bold text-sm px-5 py-2.5 h-16"
    >
      <span>SHARE</span>
    </button>
  )
}
