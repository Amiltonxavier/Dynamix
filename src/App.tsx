import { useDynamicForm } from './hooks/useDynamicForm'
import { DynamicForm } from './components/DynamicForm'
import { FieldBuilder } from './components/FieldBuilder'
import { FieldList } from './components/FieldList'
import { Container, LeftPanel, RightPanel } from './styles'
import type { ImportedField } from './schemas/importFieldSchema'

function App() {
  const { fields, countryLoading, handleFieldChange, addField, updateField, removeField, reorderFields, importFields, clearFields } = useDynamicForm()

  const handleImport = (json: string, mode: 'replace' | 'append') => {
    const parsed: ImportedField[] = JSON.parse(json)
    importFields(parsed, mode)
  }

  return (
    <Container>
      <LeftPanel>
        <FieldBuilder onAddField={addField} onImport={handleImport} />
      </LeftPanel>
      <RightPanel>
        <DynamicForm
          fields={fields}
          countryLoading={countryLoading}
          onFieldChange={handleFieldChange}
        />
        <FieldList
          fields={fields}
          onRemove={removeField}
          onReorder={reorderFields}
          onUpdate={updateField}
          onClearAll={clearFields}
        />
      </RightPanel>
    </Container>
  )
}

export default App
