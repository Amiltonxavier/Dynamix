export interface FieldOption {
  value: string
  label: string
}

export interface FormField {
  id: number
  label: string
  name?: string
  default: string | number | boolean
  type: string
  required: boolean
  placeholder?: string
  minLength?: number
  maxLength?: number
  min?: number | string
  max?: number | string
  pattern?: string
  options?: FieldOption[]
  dependsOn?: string
  disabled?: boolean
  currentValue?: string | number | boolean
  dynamicOptions?: FieldOption[]
}

export type CityDB = Record<string, FieldOption[]>
