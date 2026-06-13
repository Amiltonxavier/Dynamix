import { useState, useMemo } from 'react'
import { importArraySchema } from '../schemas/importFieldSchema'
import {
  Overlay,
  Modal,
  ModalHeader,
  ModalBody,
  SectionTitle,
  FormGroup,
  Label,
  Button,
  SecondaryButton,
  TextArea,
  RadioLabel,
} from '../styles'

interface FieldImportDialogProps {
  onImport: (json: string, mode: 'replace' | 'append') => void
  onClose: () => void
}

const EXPECTED_FORMAT = `[
  {
    "label": "Nome",
    "type": "text",
    "required": true,
    "default": "",
    "placeholder": "Digite seu nome",
    "minLength": 3,
    "maxLength": 50
  },
  {
    "label": "Idade",
    "type": "number",
    "required": false,
    "min": 18,
    "max": 120
  },
  {
    "label": "Gênero",
    "type": "select",
    "required": true,
    "options": [
      { "value": "M", "label": "Masculino" },
      { "value": "F", "label": "Feminino" }
    ]
  }
]`

export function FieldImportDialog({ onImport, onClose }: FieldImportDialogProps) {
  const [rawJson, setRawJson] = useState('')
  const [mode, setMode] = useState<'replace' | 'append'>('append')
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null)

  const parsed = useMemo(() => {
    if (!rawJson.trim()) return null
    try {
      const parsed = JSON.parse(rawJson)
      const result = importArraySchema.safeParse(parsed)
      if (result.success) return { valid: true, data: result.data, error: null }
      return {
        valid: false,
        data: null,
        error: result.error.issues
          .map(i => `[${i.path.join('.')}] ${i.message}`)
          .join('\n'),
      }
    } catch {
      return { valid: false, data: null, error: 'JSON inválido. Verifique a sintaxe.' }
    }
  }, [rawJson])

  const handleValidate = () => {
    if (!parsed) {
      setFeedback({ ok: false, msg: 'Cole um JSON antes de validar.' })
      return
    }
    if (parsed.valid) {
      setFeedback({ ok: true, msg: `JSON válido! ${parsed.data!.length} campo(s) encontrado(s).` })
    } else {
      setFeedback({ ok: false, msg: parsed.error! })
    }
  }

  const handleImport = () => {
    if (!parsed?.valid) return
    onImport(rawJson, mode)
    onClose()
  }

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
        <ModalHeader>
          <SectionTitle>Importar Campos (JSON)</SectionTitle>
          <SecondaryButton type="button" onClick={onClose} style={{ padding: '0.25rem 0.5rem', border: 'none', fontSize: 18, lineHeight: 1 }}>
            &times;
          </SecondaryButton>
        </ModalHeader>
        <ModalBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FormGroup>
              <Label htmlFor="importJson">Cole o JSON dos campos</Label>
              <TextArea
                id="importJson"
                placeholder='[{ "label": "Nome", "type": "text", "required": true }]'
                rows={8}
                value={rawJson}
                onChange={e => { setRawJson(e.target.value); setFeedback(null) }}
                style={{ fontFamily: 'monospace', fontSize: 12, resize: 'vertical' }}
              />
            </FormGroup>

            <div style={{ display: 'flex', gap: 24 }}>
              <RadioLabel>
                <input
                  type="radio"
                  name="importMode"
                  value="append"
                  checked={mode === 'append'}
                  onChange={() => setMode('append')}
                />
                Adicionar aos campos existentes
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  name="importMode"
                  value="replace"
                  checked={mode === 'replace'}
                  onChange={() => setMode('replace')}
                />
                Substituir campos existentes
              </RadioLabel>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="button" onClick={handleValidate} style={{ flex: 1 }}>
                Validar JSON
              </Button>
              <Button
                type="button"
                onClick={handleImport}
                style={{ flex: 1 }}
                disabled={!parsed?.valid}
              >
                Importar
              </Button>
            </div>

            {feedback && (
              <div
                style={{
                  padding: 12,
                  borderRadius: 6,
                  fontSize: 13,
                  lineHeight: 1.5,
                  background: feedback.ok ? '#e6f7e6' : '#fff0f0',
                  color: feedback.ok ? '#166534' : '#991b1b',
                  whiteSpace: 'pre-wrap',
                  fontFamily: feedback.ok ? 'inherit' : 'monospace',
                }}
              >
                {feedback.msg}
              </div>
            )}

            {feedback?.ok && parsed?.data && (
              <details style={{ fontSize: 13, color: '#454652' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
                  Listar todos os campos ({parsed.data.length})
                </summary>
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {parsed.data.map((field, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex', gap: 8, alignItems: 'center',
                        padding: '6px 10px', borderRadius: 4,
                        background: i % 2 === 0 ? '#f8f9fc' : 'transparent',
                        fontSize: 12,
                      }}
                    >
                      <span style={{ fontWeight: 600, minWidth: 24, color: '#24389c' }}>{i + 1}.</span>
                      <span style={{ minWidth: 140, fontWeight: 500 }}>{field.label}</span>
                      <span style={{
                        padding: '1px 6px', borderRadius: 3, fontSize: 11,
                        background: '#eef2ff', color: '#24389c', fontWeight: 600,
                      }}>
                        {field.type}
                      </span>
                      {field.required && (
                        <span style={{ color: '#991b1b', fontSize: 11 }}>*obrigatório</span>
                      )}
                      {field.options && (
                        <span style={{ color: '#666', fontSize: 11 }}>
                          ({field.options.length} opções)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </details>
            )}

            <div style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>
              <strong>Obrigatórios:</strong> label, type, required &nbsp;|&nbsp;
              <strong>Opcionais:</strong> id, default, placeholder, minLength, maxLength, min, max, pattern, options, name, dependsOn, disabled
            </div>

            <details style={{ fontSize: 13, color: '#454652' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Exemplo completo</summary>
              <pre
                style={{
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: 12,
                  borderRadius: 6,
                  fontSize: 11,
                  lineHeight: 1.5,
                  overflowX: 'auto',
                  marginTop: 8,
                }}
              >
                {EXPECTED_FORMAT}
              </pre>
            </details>
          </div>
        </ModalBody>
      </Modal>
    </Overlay>
  )
}
