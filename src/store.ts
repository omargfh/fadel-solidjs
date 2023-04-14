import axios from 'axios'
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

const getField = (fieldId: FieldId) => {
  return fields.find((field) => field.id === fieldId)!
}

const hasLocalFiles = () => {
  return fields.some((field) => field.isLocal)
}

const updateField = (fieldId: FieldId, value: Partial<IField>) => {
  updateFields((field) => field.id === fieldId, value)
}

const addToField = async (fieldId: FieldId, file: File) => {
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
      // Reset field if possible
      updateField(fieldId, { label: '', imagesrc: '', isLocal: false })
      let body = new FormData();
      body.set('key', api_key as string);
      body.append('image', file);
      await axios.post(getSettingOption('cloud_host'), body).then(res => {
        updateField(fieldId, { label: file.name, imagesrc: res.data.data.url, isLocal: false })
      })
      .catch(err => {
        updateField(fieldId, { label: file.name, imagesrc: URL.createObjectURL(file), isLocal: true })
        alert("Error uploading image to ImageBB. Please check your API key and try again. If the problem persists, please contact the developer.")
      })
    }
    else {
      updateField(fieldId, { label: file.name, imagesrc: URL.createObjectURL(file), isLocal: true })
    }
  }
}

// Settings Store
type Settings = Record<string, string>
const [settings, updateSettings] = createStore<Settings>({
  'initialized': 'false',
  'touchscreen': 'false',
  'use_cloud': 'true',
  'cloud_key': '',
  'cloud_host': 'https://api.imgbb.com/1/upload',
  'pwa_mounted': 'false'
})
const saveSettings = () => {
  // Save to localstorage
  localStorage.setItem('fadel-web-settings', JSON.stringify({...settings, 'updated_at': new Date().toISOString()}))
}
const loadSettings = () => {
  try {
    const settings = JSON.parse(localStorage.getItem('fadel-web-settings') || '{}')
    updateSettings(settings)
  }
  catch (e) {
    console.error('Error loading settings', e)
  }
}

const setSettingOption = (key: string, value: string) => {
  if (!settings['initialized']) {
    loadSettings()
  }
  updateSettings({ [key]: value })
  saveSettings()
}

const getSettingOption = (key: string) => {
  return settings[key]
}


const getCloudKey = () => {
  return settings['cloud_key']
}

const cloudKeyExists = () => {
  const cloud_key = settings['cloud_key']
  return cloud_key !== null && cloud_key !== '';
}

const updateCloudKey = (apiKey: string) => {
  setSettingOption('cloud_key', apiKey)
}

const updateCloudHost = (host: string) => {
  setSettingOption('cloud_host', host)
}

const clearCloudKey = () => {
  setSettingOption('cloud_key', '')
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

  // Load settings
  loadSettings()
})



export {
  fields,
  getField,
  hasLocalFiles,
  updateField,
  addToField,
  clearCloudKey,
  setSettingOption,
  getSettingOption,
  getCloudKey,
  cloudKeyExists,
  updateCloudKey,
  settings
}