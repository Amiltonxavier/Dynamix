import styled, { css } from 'styled-components'

/* ── Design Tokens (from Stitch "Clean UI Layout Refinement") ── */

const colors = {
  surface: '#f8f9ff',
  surfaceBright: '#f8f9ff',
  surfaceDim: '#ccdbf3',
  surfaceLowest: '#ffffff',
  surfaceLow: '#eff4ff',
  surfaceContainer: '#e6eeff',
  surfaceHigh: '#dce9ff',
  surfaceHighest: '#d5e3fc',
  onSurface: '#0d1c2e',
  onSurfaceVariant: '#454652',
  outline: '#757684',
  outlineVariant: '#c5c5d4',
  primary: '#24389c',
  primaryContainer: '#3f51b5',
  onPrimary: '#ffffff',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  tertiaryFixed: '#e0e3e6',
  onTertiaryFixed: '#191c1e',
  inverseSurface: '#233144',
  inverseOnSurface: '#eaf1ff',
}

/* ── Layout ── */

export const Container = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
  font-family: Inter, system-ui, -apple-system, sans-serif;
  background: ${colors.surfaceBright};
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 16px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
`

export const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
`

/* ── Typography ── */

export const Title = styled.h1`
  font-family: Manrope, sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  letter-spacing: -0.02em;
  color: ${colors.onSurface};
  margin: 0;
`

export const SectionTitle = styled.h2`
  font-family: Manrope, sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: -0.01em;
  color: ${colors.onSurface};
  margin: 0;
`

/* ── Card ── */

export const Card = styled.div`
  background: ${colors.surfaceLowest};
  border: 1px solid ${colors.outlineVariant};
  border-radius: 0.5rem;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01);
`

/* ── Form Elements ── */

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const labelBase = css`
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: ${colors.onSurfaceVariant};
`

export const Label = styled.label`
  ${labelBase}
`

export const RequiredLabel = styled.label<{ $required?: boolean }>`
  ${labelBase}

  &::after {
    content: ${({ $required }) => ($required ? "' *'" : 'none')};
    color: ${colors.error};
  }
`

const inputBase = css`
  width: 100%;
  background: ${colors.surfaceBright};
  border: 1px solid ${colors.outlineVariant};
  border-radius: 0.5rem;
  padding: 0.625rem 1rem;
  font-family: Inter, sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: ${colors.onSurface};
  outline: none;
  transition: all 0.15s;
  box-sizing: border-box;

  &::placeholder {
    color: ${colors.outlineVariant};
  }

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px ${colors.primary}33;
  }
`

export const Input = styled.input`
  ${inputBase}
`

export const Select = styled.select`
  ${inputBase}
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23757684' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
`

export const TextArea = styled.textarea`
  ${inputBase}
  resize: vertical;
  min-height: 80px;
`

/* ── Buttons ── */

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${colors.primary};
  color: ${colors.onPrimary};
  border: none;
  border-radius: 0.5rem;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    box-shadow: 0 4px 12px rgba(36, 56, 156, 0.25);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const IconButton = styled.button<{ $color?: string }>`
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  color: ${({ $color }) => $color || colors.error};
  cursor: pointer;
  transition: all 0.15s;
  line-height: 0;

  &:hover {
    background: ${colors.error}1a;
  }

  &:active {
    transform: scale(0.9);
  }
`

/* ── Error Text ── */

export const ErrorText = styled.span`
  color: ${colors.error};
  font-size: 0.75rem;
  line-height: 16px;
`

/* ── Radio & Checkbox ── */

export const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
`

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: Inter, sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: ${colors.onSurfaceVariant};
  cursor: pointer;

  input[type='radio'] {
    width: 16px;
    height: 16px;
    accent-color: ${colors.primary};
  }
`

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    accent-color: ${colors.primary};
    border-radius: 0.25rem;
  }
`

/* ── Row / Grid ── */

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`

/* ── Table ── */

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`

export const Th = styled.th`
  padding: 1rem 1.5rem;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${colors.outlineVariant};
  background: ${colors.surfaceLow}80;
  white-space: nowrap;

  &:first-child {
    padding-left: 2rem;
  }

  &:last-child {
    padding-right: 2rem;
  }
`

export const Td = styled.td`
  padding: 1rem 1.5rem;
  font-family: Inter, sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: ${colors.onSurface};
  border-bottom: 1px solid ${colors.outlineVariant}4D;

  &:first-child {
    padding-left: 2rem;
  }

  &:last-child {
    padding-right: 2rem;
  }
`

export const TypeChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  background: ${colors.tertiaryFixed};
  color: ${colors.onTertiaryFixed};
`

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  background: ${colors.primary}1a;
  color: ${colors.primary};
`

export const RequiredBadge = styled.span<{ $required: boolean }>`
  font-size: 12px;
  font-weight: 700;
  color: ${({ $required }) => ($required ? colors.primary : colors.outlineVariant)};
`

/* ── Modal / Overlay ── */

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`

export const Modal = styled.div`
  background: ${colors.surfaceLowest};
  border-radius: 0.5rem;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
`

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 0;
`

export const ModalBody = styled.div`
  padding: 20px 24px 24px;
`

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid ${colors.outlineVariant}4D;
`

export const TabGroup = styled.div`
  display: flex;
  background: ${colors.surfaceLow};
  border-radius: 0.375rem;
  padding: 2px;
`

export const TabButton = styled.button<{ $active: boolean }>`
  padding: 4px 12px;
  border: none;
  border-radius: 0.25rem;
  background: ${({ $active }) => ($active ? colors.surfaceLowest : 'transparent')};
  color: ${({ $active }) => ($active ? colors.primary : colors.onSurfaceVariant)};
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: ${({ $active }) => ($active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none')};

  &:hover {
    color: ${colors.primary};
  }
`

export const Pre = styled.pre`
  background: #1e293b;
  color: #e2e8f0;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 12px;
  line-height: 1.6;
  padding: 20px 24px;
  margin: 0;
  overflow-x: auto;
  white-space: pre;
  tab-size: 2;
`

export const SecondaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: ${colors.primary};
  border: 1px solid ${colors.outlineVariant};
  border-radius: 0.5rem;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: ${colors.surfaceLow};
  }
`
