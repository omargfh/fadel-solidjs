import { Component, JSX } from 'solid-js'

interface LabelProps {
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'bottomCenter'
  class?: string
  children: JSX.Element
  clip?: { x: number }
}

export const Label: Component<LabelProps> = (props) => {
  let label: HTMLSpanElement | undefined

  const styles = {
    topLeft: 'top: 1rem; left: 1rem;',
    topRight: 'top: 1rem; right: 1rem;',
    bottomLeft: 'bottom: 1rem; left: 1rem;',
    bottomRight: 'bottom: 1rem; right: 1rem;',
    bottomCenter: 'bottom: 1rem; left: 50%; transform: translateX(-50%);',
  }

  function adjustClip(): string {
    const clip = props.clip
    // if (label && clip && clip.x) {
    //   // Get bounds
    //   const {
    //     left: labelLeft,
    //     right: labelRight,
    //   } = label.getBoundingClientRect()
    //   if (props.position.includes('Left')) {
    //     return `clip-path: inset(0 ${clip.x}% 0 0);`
    //   }
    //   else if (props.position.includes('Right')) {
    //     return `clip-path: inset(0 0 0 ${100 - clip.x}%);`
    //   }
    // }
    return ''
  }

  return (
    <span
      ref={label}
      class={`absolute text-white z-20 text-sm ${props.class} overflow-none max-w-full whitespace-nowrap`}
      style={`text-shadow: 1px 1px 1px rgba(0,0,0); ${styles[props.position]}; ${adjustClip()}};`}
    >
      {props.children}
    </span>
  )
}
