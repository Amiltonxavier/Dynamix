import { useState, useEffect, useCallback } from 'react'
import type { FormField, FieldOption } from '../types/form'
import type { ImportedField } from '../schemas/importFieldSchema'
import { INITIAL_FIELDS, CITY_DB } from '../constants/fields'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function useDynamicForm() {
  const [fields, setFields] = useState<FormField[]>([])
  const [countryLoading, setCountryLoading] = useState(false)
  const [nextId, setNextId] = useState(13)

  useEffect(() => {
    setFields(INITIAL_FIELDS)
    setNextId(INITIAL_FIELDS.length + 1)
  }, [])

  const getCityField = useCallback(
    async (countryValue: string): Promise<FieldOption[]> => {
      setCountryLoading(true)
      await sleep(300)
      setCountryLoading(false)
      return CITY_DB[countryValue] || []
    },
    [],
  )

  const handleFieldChange = useCallback(
    async (field: FormField, newValue: string) => {
      let updatedFields = fields.map(f => {
        if (f.id === field.id) {
          return { ...f, currentValue: newValue }
        }
        return f
      })

      if (field.name === 'country') {
        const newCities = newValue ? await getCityField(newValue) : []
        updatedFields = updatedFields.map(f => {
          if (f.dependsOn === 'country') {
            return {
              ...f,
              currentValue: '',
              dynamicOptions: newCities,
              disabled: !newValue,
            }
          }
          return f
        })
      }

      setFields(updatedFields)
    },
    [fields, getCityField],
  )

  const addField = useCallback(
    (data: {
      label: string
      type: string
      placeholder?: string
      required: boolean
      defaultValue?: string
      minLength?: number
      maxLength?: number
      min?: number
      max?: number
      pattern?: string
      options?: FieldOption[]
    }) => {
      const newField: FormField = {
        id: nextId,
        label: data.label,
        default: data.type === 'checkbox' ? false : (data.defaultValue ?? ''),
        type: data.type,
        required: data.required,
        ...(data.placeholder && { placeholder: data.placeholder }),
        ...(data.minLength !== undefined && { minLength: data.minLength }),
        ...(data.maxLength !== undefined && { maxLength: data.maxLength }),
        ...(data.min !== undefined && { min: data.min }),
        ...(data.max !== undefined && { max: data.max }),
        ...(data.pattern && { pattern: data.pattern }),
        ...(data.options && { options: data.options }),
      }
      setFields(prev => [...prev, newField])
      setNextId(prev => prev + 1)
    },
    [nextId],
  )

  const updateField = useCallback(
    (id: number, data: {
      label: string
      type: string
      placeholder?: string
      required: boolean
      defaultValue?: string
      minLength?: number
      maxLength?: number
      min?: number
      max?: number
      pattern?: string
      options?: FieldOption[]
    }) => {
      setFields(prev =>
        prev.map(f =>
          f.id === id
            ? {
                ...f,
                label: data.label,
                type: data.type,
                required: data.required,
                default: data.type === 'checkbox' ? false : (data.defaultValue ?? ''),
                ...(data.placeholder && { placeholder: data.placeholder }),
                ...(data.minLength !== undefined ? { minLength: data.minLength } : { minLength: undefined }),
                ...(data.maxLength !== undefined ? { maxLength: data.maxLength } : { maxLength: undefined }),
                ...(data.min !== undefined ? { min: data.min } : { min: undefined }),
                ...(data.max !== undefined ? { max: data.max } : { max: undefined }),
                ...(data.pattern ? { pattern: data.pattern } : { pattern: undefined }),
                ...(data.options ? { options: data.options } : { options: undefined }),
              }
            : f,
        ),
      )
    },
    [],
  )

  const removeField = useCallback((id: number) => {
    setFields(prev => prev.filter(f => f.id !== id))
  }, [])

  const importFields = useCallback(
    (imported: ImportedField[], mode: 'replace' | 'append') => {
      const mapped: FormField[] = imported.map((item, i) => ({
        id: item.id ?? nextId + i,
        label: item.label,
        type: item.type,
        required: item.required,
        default: item.default ?? (item.type === 'checkbox' ? false : ''),
        ...(item.placeholder && { placeholder: item.placeholder }),
        ...(item.minLength !== undefined && { minLength: item.minLength }),
        ...(item.maxLength !== undefined && { maxLength: item.maxLength }),
        ...(item.min !== undefined && { min: item.min }),
        ...(item.max !== undefined && { max: item.max }),
        ...(item.pattern && { pattern: item.pattern }),
        ...(item.options && { options: item.options }),
        ...(item.name && { name: item.name }),
        ...(item.dependsOn && { dependsOn: item.dependsOn }),
        ...(item.disabled && { disabled: item.disabled }),
      }))

      setFields(prev => (mode === 'replace' ? mapped : [...prev, ...mapped]))
      const maxId = Math.max(...mapped.map(f => f.id), -1)
      setNextId(prev => Math.max(prev, maxId + 1))
    },
    [nextId],
  )

  const reorderFields = useCallback((fromIndex: number, toIndex: number) => {
    setFields(prev => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }, [])

  const clearFields = useCallback(() => {
    setFields([])
  }, [])

  return {
    fields,
    countryLoading,
    handleFieldChange,
    addField,
    updateField,
    removeField,
    reorderFields,
    importFields,
    clearFields,
  }
}
