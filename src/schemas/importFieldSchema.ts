import { z } from 'zod'

export const importedFieldSchema = z.object({
  label: z.string().min(1, 'label é obrigatório'),
  type: z.string().min(1, 'type é obrigatório'),
  required: z.boolean(),
  id: z.number().int().positive().optional(),
  isArray: z.boolean().optional(),
  default: z.union([z.string(), z.number(), z.boolean()]).optional(),
  placeholder: z.string().optional(),
  minLength: z.number().int().positive().optional(),
  maxLength: z.number().int().positive().optional(),
  min: z.union([z.number(), z.string()]).optional(),
  max: z.union([z.number(), z.string()]).optional(),
  pattern: z.string().optional(),
  options: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .optional(),
  name: z.string().optional(),
  dependsOn: z.string().optional(),
  disabled: z.boolean().optional(),
})

export const importArraySchema = z.array(importedFieldSchema)

export type ImportedField = z.infer<typeof importedFieldSchema>

export interface ImportResult {
  valid: boolean
  data?: ImportedField[]
  errors?: string
}
