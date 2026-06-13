import { useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import type { FormField } from '../types/form'
import {
  FormGroup,
  RequiredLabel,
  Input,
  Select,
  TextArea,
  RadioGroup,
  RadioLabel,
  CheckboxWrapper,
  ErrorText,
  Button,
} from '../styles'

interface FieldRendererProps {
  field: FormField
  countryLoading: boolean
  onChange: (field: FormField, value: string) => void
}

function ArrayItemChip({
  value,
  onRemove,
}: {
  value: string
  onRemove: () => void
}) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 8px', borderRadius: 4,
        background: '#eef2ff', color: '#24389c',
        fontSize: 13, lineHeight: '20px',
      }}
    >
      {value}
      <button
        type="button"
        onClick={onRemove}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#24389c', fontSize: 14, padding: 0, lineHeight: 1,
          opacity: 0.6,
        }}
      >
        &times;
      </button>
    </span>
  )
}

function ArrayFieldInput({ field }: { field: FormField }) {
  const { setValue } = useFormContext()
  const fieldKey = `field-${field.id}`
  const values: string[] = useWatch({ name: fieldKey }) ?? []
  const [inputValue, setInputValue] = useState('')

  const addItem = () => {
    if (!inputValue.trim()) return
    setValue(fieldKey, [...values, inputValue.trim()], { shouldValidate: true })
    setInputValue('')
  }

  const removeItem = (index: number) => {
    setValue(fieldKey, values.filter((_, i) => i !== index), { shouldValidate: true })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Input
          type={field.type === 'number' ? 'number' : field.type === 'password' ? 'password' : 'text'}
          placeholder={field.placeholder}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem() } }}
          style={{ flex: 1 }}
        />
        <Button type="button" onClick={addItem} style={{ padding: '0.5rem 1rem', flex: 0 }}>
          Adicionar
        </Button>
      </div>
      {values.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {values.map((v, i) => (
            <ArrayItemChip key={i} value={v} onRemove={() => removeItem(i)} />
          ))}
        </div>
      )}
    </div>
  )
}

function FileArrayInput({ field }: { field: FormField }) {
  const { setValue } = useFormContext()
  const fieldKey = `field-${field.id}`
  const files: File[] = useWatch({ name: fieldKey }) ?? []

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    setValue(fieldKey, [...files, ...selected], { shouldValidate: true })
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setValue(fieldKey, files.filter((_, i) => i !== index), { shouldValidate: true })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Input type="file" id={fieldKey} onChange={handleChange} multiple />
      {files.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {files.map((f, i) => (
            <ArrayItemChip key={i} value={f.name} onRemove={() => removeFile(i)} />
          ))}
        </div>
      )}
    </div>
  )
}

export function FieldRenderer({ field, countryLoading, onChange }: FieldRendererProps) {
  const { register, formState: { errors }, setValue } = useFormContext()
  const fieldKey = `field-${field.id}`
  const error = errors[fieldKey]
  const resolvedOptions = field.dynamicOptions ?? field.options
  const isNumber = field.type === 'number'

  if (field.type === 'checkbox') {
    return (
      <CheckboxWrapper style={{ gap: 12, paddingTop: 4 }}>
        <input
          type="checkbox"
          id={fieldKey}
          {...register(fieldKey)}
          style={{ width: 18, height: 18, accentColor: '#24389c' }}
        />
        <RequiredLabel htmlFor={fieldKey} $required={field.required} style={{ margin: 0 }}>
          {field.label}
        </RequiredLabel>
        {error && <ErrorText>{error.message as string}</ErrorText>}
      </CheckboxWrapper>
    )
  }

  return (
    <FormGroup key={field.id}>
      <RequiredLabel htmlFor={fieldKey} $required={field.required}>
        {field.label} {field.dependsOn && countryLoading && '(Carregando...)'}
      </RequiredLabel>

      {field.type === 'select' ? (
        <Select
          id={fieldKey}
          {...register(fieldKey, {
            onChange: e => onChange(field, e.target.value),
          })}
        >
          <option value="" disabled>{field.placeholder}</option>
          {resolvedOptions?.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Select>
      ) : field.type === 'radio' ? (
        <RadioGroup>
          {field.options?.map(option => (
            <RadioLabel key={option.value}>
              <input
                type="radio"
                id={`${fieldKey}-${option.value}`}
                value={option.value}
                {...register(fieldKey)}
              />
              {option.label}
            </RadioLabel>
          ))}
        </RadioGroup>
      ) : field.type === 'textarea' ? (
        field.isArray ? (
          <ArrayFieldInput field={field} />
        ) : (
          <TextArea
            id={fieldKey}
            placeholder={field.placeholder}
            {...register(fieldKey)}
            maxLength={field.maxLength}
          />
        )
      ) : field.type === 'file' ? (
        field.isArray ? (
          <FileArrayInput field={field} />
        ) : (
          <Input
            type="file"
            id={fieldKey}
            onChange={e => {
              const file = e.target.files?.[0] ?? null
              setValue(fieldKey, file, { shouldValidate: true })
            }}
          />
        )
      ) : field.isArray ? (
        <ArrayFieldInput field={field} />
      ) : (
        <Input
          type={field.type}
          id={fieldKey}
          placeholder={field.placeholder}
          {...register(fieldKey, isNumber ? { valueAsNumber: true } : undefined)}
          minLength={isNumber ? undefined : field.minLength}
          maxLength={isNumber ? undefined : field.maxLength}
        />
      )}

      {error && <ErrorText>{error.message as string}</ErrorText>}
    </FormGroup>
  )
}