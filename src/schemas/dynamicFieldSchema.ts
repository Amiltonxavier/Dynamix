import { z } from 'zod'
import type { FormField } from '../types/form'

export function generateFieldSchema(fields: FormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const field of fields) {
    const key = `field-${field.id}`

    if (field.type === 'checkbox') {
      shape[key] = field.required
        ? z.literal(true, { message: 'Campo obrigatório' })
        : z.boolean().optional()
      continue
    }

    if (field.type === 'number') {
      let s = z.coerce.number()
      if (field.min !== undefined) s = s.min(Number(field.min), `Mínimo ${field.min}`)
      if (field.max !== undefined) s = s.max(Number(field.max), `Máximo ${field.max}`)
      if (field.required) s = s.refine(v => !isNaN(v), 'Campo obrigatório')
      shape[key] = s
      continue
    }

    let s = z.string()

    if (field.type === 'email') {
      s = s.email('E-mail inválido')
    }
    if (field.minLength) {
      s = s.min(field.minLength, `Mínimo ${field.minLength} caracteres`)
    }
    if (field.maxLength) {
      s = s.max(field.maxLength, `Máximo ${field.maxLength} caracteres`)
    }
    if (field.pattern) {
      s = s.regex(new RegExp(field.pattern), 'Formato inválido')
    }
    if (field.required) {
      s = s.min(1, 'Campo obrigatório')
    }

    shape[key] = s
  }

  return z.object(shape)
}
