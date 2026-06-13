import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { newFieldSchema, type NewFieldSchema } from '../schemas/fieldSchema'
import { FIELD_TYPES } from '../constants/fields'
import type { FormField, FieldOption } from '../types/form'
import {
  Overlay,
  Modal,
  ModalHeader,
  ModalBody,
  ModalActions,
  SectionTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Select,
  Button,
  SecondaryButton,
  ErrorText,
  CheckboxWrapper,
  Row,
} from '../styles'

interface FieldEditDialogProps {
  field: FormField
  onSave: (id: number, data: {
    label: string
    type: string
    placeholder?: string
    required: boolean
    isArray?: boolean
    defaultValue?: string
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    pattern?: string
    options?: FieldOption[]
  }) => void
  onClose: () => void
}

export function FieldEditDialog({ field, onSave, onClose }: FieldEditDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<NewFieldSchema>({
    resolver: zodResolver(newFieldSchema),
  })

  const selectedType = useWatch({ control, name: 'type' })
  const showOptions = selectedType === 'select' || selectedType === 'radio'

  const [optionEntries, setOptionEntries] = useState<string[]>([])

  useEffect(() => {
    const options = field.options ?? []
    reset({
      label: field.label,
      type: field.type,
      placeholder: field.placeholder ?? '',
      required: field.required,
      isArray: field.isArray ?? false,
      defaultValue: typeof field.default === 'string' ? field.default : '',
      minLength: field.minLength?.toString() ?? '',
      maxLength: field.maxLength?.toString() ?? '',
      min: typeof field.min === 'string' ? field.min : field.min?.toString() ?? '',
      max: typeof field.max === 'string' ? field.max : field.max?.toString() ?? '',
      pattern: field.pattern ?? '',
    })
    setOptionEntries(options.map(o => `${o.value}, ${o.label}`))
  }, [field, reset])

  const onSubmit = (data: NewFieldSchema) => {
    const options: FieldOption[] = optionEntries
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const [value, ...labelParts] = line.split(',')
        return { value: value.trim(), label: labelParts.join(',').trim() || value.trim() }
      })

    onSave(field.id, {
      label: data.label,
      type: data.type,
      placeholder: data.placeholder || undefined,
      required: data.required ?? false,
      isArray: data.isArray ?? false,
      defaultValue: data.defaultValue || undefined,
      minLength: data.minLength ? Number(data.minLength) : undefined,
      maxLength: data.maxLength ? Number(data.maxLength) : undefined,
      min: data.min ? Number(data.min) : undefined,
      max: data.max ? Number(data.max) : undefined,
      pattern: data.pattern || undefined,
      options: options.length > 0 ? options : undefined,
    })

    onClose()
  }

  const addOptionEntry = () => setOptionEntries(prev => [...prev, ''])
  const updateOptionEntry = (index: number, value: string) =>
    setOptionEntries(prev => prev.map((e, i) => (i === index ? value : e)))
  const removeOptionEntry = (index: number) =>
    setOptionEntries(prev => prev.filter((_, i) => i !== index))

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <SectionTitle>Editar Campo</SectionTitle>
          <SecondaryButton
            type="button"
            onClick={onClose}
            style={{ padding: '0.25rem 0.5rem', border: 'none', fontSize: 18, lineHeight: 1 }}
          >
            &times;
          </SecondaryButton>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label htmlFor="editFieldLabel">Label do campo</Label>
              <Input id="editFieldLabel" type="text" placeholder="Ex: Sobrenome" {...register('label')} />
              {errors.label && <ErrorText>{errors.label.message}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="editFieldType">Tipo do campo</Label>
              <Select id="editFieldType" {...register('type')}>
                <option value="">Selecione um tipo...</option>
                {FIELD_TYPES.map(ft => (
                  <option key={ft.value} value={ft.value}>{ft.label}</option>
                ))}
              </Select>
              {errors.type && <ErrorText>{errors.type.message}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="editFieldPlaceholder">Placeholder (opcional)</Label>
              <Input id="editFieldPlaceholder" type="text" placeholder="Ex: Digite seu sobrenome" {...register('placeholder')} />
              {errors.placeholder && <ErrorText>{errors.placeholder.message}</ErrorText>}
            </FormGroup>

            <div style={{ display: 'flex', gap: 24 }}>
              <CheckboxWrapper>
                <input type="checkbox" id="editFieldRequired" {...register('required')} />
                <Label htmlFor="editFieldRequired" style={{ margin: 0 }}>Campo obrigatório</Label>
              </CheckboxWrapper>
              <CheckboxWrapper>
                <input type="checkbox" id="editFieldIsArray" {...register('isArray')} />
                <Label htmlFor="editFieldIsArray" style={{ margin: 0 }}>Coleção (múltiplos valores)</Label>
              </CheckboxWrapper>
            </div>

            <FormGroup>
              <Label htmlFor="editFieldDefault">Valor padrão (opcional)</Label>
              <Input id="editFieldDefault" type="text" placeholder="Ex: valor@padrao.com" {...register('defaultValue')} />
            </FormGroup>

            <Row>
              <FormGroup>
                <Label>Mín. caracteres</Label>
                <Input type="number" placeholder="Ex: 3" {...register('minLength')} />
              </FormGroup>
              <FormGroup>
                <Label>Máx. caracteres</Label>
                <Input type="number" placeholder="Ex: 50" {...register('maxLength')} />
              </FormGroup>
            </Row>

            <Row>
              <FormGroup>
                <Label>Valor mínimo</Label>
                <Input type="number" placeholder="Ex: 18" {...register('min')} />
              </FormGroup>
              <FormGroup>
                <Label>Valor máximo</Label>
                <Input type="number" placeholder="Ex: 120" {...register('max')} />
              </FormGroup>
            </Row>

            <FormGroup>
              <Label htmlFor="editFieldPattern">Regex de validação (opcional)</Label>
              <Input id="editFieldPattern" type="text" placeholder="Ex: ^\([0-9]{2}\) [0-9]{5}-[0-9]{4}$" style={{ fontFamily: 'monospace', fontSize: 12 }} {...register('pattern')} />
            </FormGroup>

            {showOptions && (
              <FormGroup>
                <Label>Opções (valor, Label)</Label>
                {optionEntries.map((entry, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8 }}>
                    <Input
                      type="text"
                      placeholder="Ex: M, Masculino"
                      value={entry}
                      onChange={e => updateOptionEntry(i, e.target.value)}
                    />
                    <Button type="button" onClick={() => removeOptionEntry(i)} style={{ flex: 0, padding: '0.5rem 0.75rem', background: '#ba1a1a' }}>X</Button>
                  </div>
                ))}
                <Button type="button" onClick={addOptionEntry} style={{ background: '#6b7280' }}>+ Adicionar opção</Button>
              </FormGroup>
            )}

            <ModalActions>
              <SecondaryButton type="button" onClick={onClose}>Cancelar</SecondaryButton>
              <Button type="submit">Salvar</Button>
            </ModalActions>
          </Form>
        </ModalBody>
      </Modal>
    </Overlay>
  )
}
