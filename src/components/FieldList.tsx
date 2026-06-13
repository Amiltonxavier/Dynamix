import { useState } from 'react'
import type { FormField, FieldOption } from '../types/form'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Card,
  SectionTitle,
  Badge,
  Table,
  Th,
  Td,
  TypeChip,
  RequiredBadge,
  IconButton,
  Button,
  TabGroup,
  TabButton,
  Pre,
} from '../styles'
import { FieldEditDialog } from './FieldEditDialog'

type ViewMode = 'table' | 'json'

interface FieldListProps {
  fields: FormField[]
  onRemove: (id: number) => void
  onReorder: (fromIndex: number, toIndex: number) => void
  onUpdate: (id: number, data: {
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
  onClearAll: () => void
}

function SortableRow({
  field,
  onEdit,
  onRemove,
}: {
  field: FormField
  onEdit: (field: FormField) => void
  onRemove: (id: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: 'grab',
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={e => { if (!isDragging) e.currentTarget.style.background = '#eff4ff33' }}
      onMouseLeave={e => { if (!isDragging) e.currentTarget.style.background = 'transparent' }}
    >
      <Td style={{ textAlign: 'center', color: '#454652', fontWeight: 500, width: 48 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#c5c5d4" style={{ verticalAlign: 'middle' }}>
            <circle cx="9" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" />
            <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
            <circle cx="9" cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
          </svg>
          {field.id}
        </span>
      </Td>
      <Td style={{ fontWeight: 600 }}>{field.label}</Td>
      <Td>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <TypeChip>{field.type}</TypeChip>
          {field.isArray && (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '1px 6px',
              borderRadius: 4, background: '#e0e7ff', color: '#3730a3',
              textTransform: 'uppercase', letterSpacing: '0.03em',
            }}>
              Coleção
            </span>
          )}
        </div>
      </Td>
      <Td style={{ textAlign: 'center' }}>
        <RequiredBadge $required={field.required}>
          {field.required ? 'Sim' : 'Não'}
        </RequiredBadge>
      </Td>
      <Td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
        <IconButton type="button" onClick={e => { e.stopPropagation(); onEdit(field) }} title="Editar" $color="#4c56af">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </IconButton>
        <IconButton type="button" onClick={e => { e.stopPropagation(); onRemove(field.id) }} title="Remover">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </IconButton>
      </Td>
    </tr>
  )
}

function JsonView({ fields }: { fields: FormField[] }) {
  const json = JSON.stringify(fields, null, 2)
  return <Pre>{json}</Pre>
}

export function FieldList({ fields, onRemove, onReorder, onUpdate, onClearAll }: FieldListProps) {
  const [editingField, setEditingField] = useState<FormField | null>(null)
  const [view, setView] = useState<ViewMode>('table')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = fields.findIndex(f => f.id === active.id)
    const newIndex = fields.findIndex(f => f.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) onReorder(oldIndex, newIndex)
  }

  return (
    <>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div
          style={{
            padding: '24px 32px 20px',
            borderBottom: '1px solid #c5c5d44D',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#eff4ff4D',
          }}
        >
          <SectionTitle style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Campos Cadastrados
            <Badge>{fields.length}</Badge>
            {fields.length > 0 && (
              <Button
                type="button"
                onClick={() => { if (window.confirm('Tem certeza que deseja apagar todos os campos?')) onClearAll() }}
                style={{ marginLeft: 12, padding: '2px 10px', fontSize: 12, background: '#991b1b', borderColor: '#991b1b' }}
              >
                Limpar tudo
              </Button>
            )}
          </SectionTitle>
          <TabGroup>
            <TabButton $active={view === 'table'} onClick={() => setView('table')}>
              Tabela
            </TabButton>
            <TabButton $active={view === 'json'} onClick={() => setView('json')}>
              JSON
            </TabButton>
          </TabGroup>
        </div>

        {fields.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#c5c5d4', fontSize: 14 }}>
            Nenhum campo cadastrado.
          </div>
        ) : view === 'json' ? (
          <JsonView fields={fields} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                <Table>
                  <thead>
                    <tr>
                      <Th style={{ textAlign: 'center', width: 48 }}>#</Th>
                      <Th>Label</Th>
                      <Th>Tipo</Th>
                      <Th style={{ textAlign: 'center' }}>Obrig.</Th>
                      <Th style={{ textAlign: 'right' }}>Ações</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map(field => (
                      <SortableRow key={field.id} field={field} onEdit={setEditingField} onRemove={onRemove} />
                    ))}
                  </tbody>
                </Table>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </Card>

      {editingField && (
        <FieldEditDialog field={editingField} onSave={onUpdate} onClose={() => setEditingField(null)} />
      )}
    </>
  )
}
