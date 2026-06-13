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

    if (field.type === 'file') {
      if (field.isArray) {
        let arr = z.array(z.any())
        if (field.required) arr = arr.min(1, 'Adicione ao menos um arquivo')
        shape[key] = arr
      } else {
        let s: z.ZodTypeAny = z.any()
        if (field.required) s = s.refine((v: unknown) => v instanceof File, 'Selecione um arquivo')
        shape[key] = s
      }
      continue
    }

    let base = z.string()

    if (field.type === 'email') {
      base = base.email('E-mail inválido')
    }
    if (field.minLength) {
      base = base.min(field.minLength, `Mínimo ${field.minLength} caracteres`)
    }
    if (field.maxLength) {
      base = base.max(field.maxLength, `Máximo ${field.maxLength} caracteres`)
    }
    if (field.pattern) {
      base = base.regex(new RegExp(field.pattern), 'Formato inválido')
    }
    if (field.required) {
      base = base.min(1, 'Campo obrigatório')
    }

    if (field.isArray) {
      let arr = z.array(base)
      if (field.required) arr = arr.min(1, 'Adicione ao menos um item')
      shape[key] = arr
    } else {
      shape[key] = base
    }
  }

  return z.object(shape)
}
