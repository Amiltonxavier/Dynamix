import { useMemo } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { FormField } from '../types/form'
import { generateFieldSchema } from '../schemas/dynamicFieldSchema'
import { FieldRenderer } from './FieldRenderer'
import { Card, SectionTitle, Form, Button } from '../styles'

interface DynamicFormProps {
  fields: FormField[]
  countryLoading: boolean
  onFieldChange: (field: FormField, value: string) => void
}

export function DynamicForm({ fields, countryLoading, onFieldChange }: DynamicFormProps) {
  const fieldSchema = useMemo(() => generateFieldSchema(fields), [fields])

  const methods = useForm({
    resolver: zodResolver(fieldSchema),
    values: Object.fromEntries(
      fields.map(f => [
        `field-${f.id}`,
        f.type === 'checkbox' ? !!f.default
          : f.type === 'number' ? (f.default ? Number(f.default) : undefined)
            : f.type === 'file' ? (f.isArray ? [] : null)
              : f.isArray ? [] : (f.default as string ?? ''),
      ]),
    ),
  })

  const onSubmit = methods.handleSubmit(data => {
    console.log('Form Data:', data)
    alert('Formulário enviado com sucesso!\n' + JSON.stringify(data, null, 2))
  })

  const hasData = fields.length > 0

  return (
    <FormProvider {...methods}>
      <Card style={{ padding: 32 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 32,
          }}
        >
          <SectionTitle>Formulário Dinâmico</SectionTitle>
        </div>

        <Form onSubmit={onSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {fields.map(field => (
              <FieldRenderer
                key={field.id}
                field={field}
                countryLoading={countryLoading}
                onChange={onFieldChange}
              />
            ))}
          </div>
          {hasData && <Button type="submit" style={{ marginTop: 16, maxWidth: 300 }}>
            Enviar
          </Button>}
        </Form>
      </Card>
    </FormProvider>
  )
}
