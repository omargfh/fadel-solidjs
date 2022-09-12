import { Component, JSX } from 'solid-js'

interface LabelProps {
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'bottomCenter'
  class?: string
  children: JSX.Element
}

export const Label: Component<LabelProps> = (props) => {
  const styles = {
    topLeft: 'top: 1rem; left: 1rem;',
    topRight: 'top: 1rem; right: 1rem;',
    bottomLeft: 'bottom: 1rem; left: 1rem;',
    bottomRight: 'bottom: 1rem; right: 1rem;',
    bottomCenter: 'bottom: 1rem; left: 50%; transform: translateX(-50%);',
  }

  return (
    <span
      class={`absolute text-white z-20 text-sm ${props.class}`}
      style={`text-shadow: 1px 1px 1px rgba(0,0,0); ${styles[props.position]}`}
    >
      {props.children}
    </span>
  )
}
