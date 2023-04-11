export type FieldId = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'

export interface IField {
  id: FieldId
  name: string
  label: string
  imagesrc: string
  isLocal: boolean
}

export interface IBBAPIParams {
  api_key: string | null
}

export type IFields = IField[]
