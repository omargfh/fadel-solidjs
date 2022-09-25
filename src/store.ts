import { onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import { IFields, IField, FieldId } from './types'

const [fields, updateFields] = createStore<IFields>([
  {
    id: 'topLeft',
    name: 'Top Left',
    label: '',
    imagesrc: '',
    isLocal: false,
  },
  {
    id: 'topRight',
    name: 'Top Right',
    label: '',
    imagesrc: '',
    isLocal: false,
  },
  {
    id: 'bottomLeft',
    name: 'Bottom Left',
    label: '',
    imagesrc: '',
    isLocal: false,
  },
  {
    id: 'bottomRight',
    name: 'Bottom Right',
    label: '',
    imagesrc: '',
    isLocal: false,
  },
])

onMount(() => {
  const fieldsB64 = new URL(location.href).searchParams.get('fields')

  if (fieldsB64) {
    try {
      const fields = JSON.parse(decodeURIComponent(atob(fieldsB64)))
      updateFields(fields)
      history.pushState(null, '', '/')
    } catch (e) {
      console.log("Couldn't load fields: ", e)
    }
  }
})

const getField = (fieldId: FieldId) => {
  return fields.find((field) => field.id === fieldId)!
}

const hasLocalFiles = () => {
  return fields.some((field) => field.isLocal)
}

const updateField = (fieldId: FieldId, value: Partial<IField>) => {
  updateFields((field) => field.id === fieldId, value)
}

export { fields, getField, hasLocalFiles, updateField }
