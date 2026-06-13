import { z } from 'zod'

export const newFieldSchema = z.object({
  label: z.string().min(1, 'O label do campo é obrigatório').max(50, 'Máximo 50 caracteres'),
  type: z.string().min(1, 'O tipo do campo é obrigatório'),
  placeholder: z.string().max(100, 'Máximo 100 caracteres').optional().or(z.literal('')),
  required: z.boolean().optional(),
  defaultValue: z.string().optional().or(z.literal('')),
  minLength: z.string().optional().or(z.literal('')),
  maxLength: z.string().optional().or(z.literal('')),
  min: z.string().optional().or(z.literal('')),
  max: z.string().optional().or(z.literal('')),
  pattern: z.string().optional().or(z.literal('')),
  optionsRaw: z.string().optional().or(z.literal('')),
})

export type NewFieldSchema = z.infer<typeof newFieldSchema>
