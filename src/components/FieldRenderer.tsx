import { useFormContext } from 'react-hook-form'
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
} from '../styles'

interface FieldRendererProps {
  field: FormField
  countryLoading: boolean
  onChange: (field: FormField, value: string) => void
}

export function FieldRenderer({ field, countryLoading, onChange }: FieldRendererProps) {
  const { register, formState: { errors } } = useFormContext()
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
        <TextArea
          id={fieldKey}
          placeholder={field.placeholder}
          {...register(fieldKey)}
          maxLength={field.maxLength}
        />
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
