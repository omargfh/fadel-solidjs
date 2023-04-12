import { onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import { IFields, IField, FieldId, IBBAPIParams } from './types'

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
  }
])

const [ibbApiParams, updateIbbApiParams] = createStore<IBBAPIParams>({ api_key: null });

const getImageBBApiKey = () => {
  if (localStorage.getItem('fadel-imagebb-api-key') !== null) {
    updateIbbApiParams({ api_key: localStorage.getItem('fadel-imagebb-api-key')! });
  }
  return ibbApiParams.api_key;
}

const imageBBApiKeyExists = () => {
  return ibbApiParams.api_key !== null && ibbApiParams.api_key !== '';
}

const updateImageBBApiKey = (apiKey: string) => {
  updateIbbApiParams({ api_key: apiKey });
  localStorage.setItem('fadel-imagebb-api-key', apiKey);
}

const clearImageBBApiKey = () => {
  updateIbbApiParams({ api_key: null });
  localStorage.removeItem('fadel-imagebb-api-key');
}

const getField = (fieldId: FieldId) => {
  return fields.find((field) => field.id === fieldId)!
}

const hasLocalFiles = () => {
  return fields.some((field) => field.isLocal)
}

const updateField = (fieldId: FieldId, value: Partial<IField>) => {
  updateFields((field) => field.id === fieldId, value)
}

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

  // Load API key
  getImageBBApiKey()
})

export {
  fields,
  getField,
  hasLocalFiles,
  updateField,
  updateImageBBApiKey,
  imageBBApiKeyExists,
  clearImageBBApiKey,
  getImageBBApiKey
}
