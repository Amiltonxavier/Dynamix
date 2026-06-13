<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/1.png">
  <img alt="Dynamix — Construtor de Formulários Dinâmicos" src="public/1.png">
</picture>

<br>

<div align="center">
  <h1>Dynamix</h1>
  <p><strong>Construtor de Formularios Dinamicos</strong></p>
  <p>
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript">
    <img alt="React" src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react">
    <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite">
    <img alt="Zod" src="https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod">
    <img alt="styled-components" src="https://img.shields.io/badge/styled--components-DB7093?style=flat-square&logo=styled-components">
  </p>
</div>

---

## Visao Geral

**Dynamix** e uma aplicacao web moderna para criacao, edicao e visualizacao de formularios dinamicos. Com uma interface limpa e responsiva, permite que desenvolvedores e analistas construam formularios complexos sem escrever uma linha de codigo HTML.

O painel esquerdo concentra as ferramentas de construcao (adicionar campos, importar JSON), enquanto o painel direito exibe a pre-visualizacao ao vivo do formulario e a lista de campos cadastrados com suporte a arrastar e soltar.

---

## Funcionalidades

### Construtor Visual de Campos
- Adicione campos de diversos tipos: texto, email, senha, numero, telefone, data, select, radio, checkbox e textarea
- Configure label, placeholder, valor padrao, validacoes (min/max length, min/max value, regex)
- Defina opcoes personalizadas para campos do tipo select e radio
- Marque campos como obrigatorios ou opcionais

### Reordenacao Drag & Drop
- Reordenar campos na tabela via arrastar e soltar com @dnd-kit
- Feedback visual durante o arrasto com opacidade e cursor personalizado

### Importacao de Campos via JSON
- Importe lotes de campos usando um JSON estruturado
- Dois modos de importacao: adicionar (append) ou substituir (replace)
- Validacao contra schema Zod com feedback visual (verde/vermelho)
- Pre-visualizacao dos campos parsed antes de importar
- Accordion com formato esperado e lista de campos obrigatorios/opcionais

### Edicao e Exclusao
- Edite qualquer campo existente via modal dedicado com os mesmos campos do construtor
- Exclua campos individualmente com botao de acao
- Limpar tudo com confirmacao para remover todos os campos de uma vez

### Pre-visualizacao em Tempo Real
- O formulario e renderizado ao vivo no painel direito
- Validacao dinamica com Zod + react-hook-form
- Mensagens de erro exibidas abaixo de cada campo
- Suporte a campos com dependencia (ex.: pais -> cidades) com loading simulado

### Visualizacao em Tabela / JSON
- Alterne entre visualizacao Tabela (com drag-and-drop) e JSON (codigo formatado)
- Badge com contagem total de campos
- Chips coloridos para identificar o tipo de cada campo

### Design System
- Tema com paleta de cores, tipografia (Manrope + Inter) e cantos arredondados consistentes
- Sistema de design gerenciado via Stitch, com tokens centralizados em styled-components
- Modal, Overlay, Tabs, Cards, Badges e todos os elementos seguem o mesmo guia de estilo

---

## Screenshots

| Construtor e Pre-visualizacao | Lista de Campos com Drag & Drop | Importacao JSON |
|---|---|---|
| ![Screenshot 1](public/1.png) | ![Screenshot 2](public/2.png) | ![Screenshot 3](public/3.png) |

## Demonstracao em Video

[veja o video de demonstracao](public/preview_app.webm)

---

## Tecnologias

| Categoria | Tecnologia | Versao |
|---|---|---|
| Linguagem | TypeScript | 6.0 |
| Framework | React | 19 |
| Bundler | Vite | 8 |
| Validacao | Zod | 4 |
| Formularios | react-hook-form | 7 |
| Estilizacao | styled-components | 6 |
| Drag & Drop | @dnd-kit | core/sortable/utilities |
| Design Tokens | Stitch | -- |

---

## Arquitetura

```
src/
  types/              Interfaces e tipos (FormField, FieldOption, etc.)
    form.ts
  constants/          Dados estaticos (FIELD_TYPES, INITIAL_FIELDS, CITY_DB)
    fields.ts
  schemas/            Schemas Zod para validacao
    fieldSchema.ts        Schema do formulario de adicionar campo
    dynamicFieldSchema.ts Schema dinamico gerado a partir dos campos
    importFieldSchema.ts  Schema para validacao de JSON importado
  hooks/              Logica de estado
    useDynamicForm.ts     Hook principal (CRUD, reorder, import)
  components/         Componentes React
    FieldBuilder.tsx      Formulario para adicionar novos campos
    FieldRenderer.tsx     Renderiza cada campo no preview
    DynamicForm.tsx       Formulario dinamico com validacao
    FieldList.tsx         Tabela com drag-and-drop e toggle JSON
    FieldEditDialog.tsx   Modal de edicao de campo
    FieldImportDialog.tsx Modal de importacao JSON
  styles.ts           Design tokens e styled-components
  App.tsx             Orquestrador principal
```

### Principios

- SOLID: tipos, constantes, schemas, hooks e componentes separados por responsabilidade
- Nomes em ingles para variaveis, objetos e propriedades (conforme regra do projeto)
- UI em portugues (publico-alvo brasileiro)
- Nenhum comentario em codigo de producao

---

## Como Executar

```bash
git clone https://github.com/amxxavier/dynamix.git
cd dynamix
npm install
npm run dev
```

Acesse em [http://localhost:5173](http://localhost:5173)

### Comandos Disponiveis

| Comando | Descricao |
|---|---|
| `npm run dev` | Inicia servidor de desenvolvimento Vite |
| `npm run build` | Compila TypeScript e faz o bundle de producao |
| `npm run preview` | Pre-visualiza o build de producao |
| `npm run lint` | Executa ESLint no projeto |

---

## Estrutura de Dados - Import JSON

```json
[
  {
    "label": "Nome",
    "type": "text",
    "required": true,
    "default": "",
    "placeholder": "Digite seu nome",
    "minLength": 3,
    "maxLength": 50
  }
]
```

**Campos obrigatorios:** `label`, `type`, `required`
**Campos opcionais:** `id`, `default`, `placeholder`, `minLength`, `maxLength`, `min`, `max`, `pattern`, `options`, `name`, `dependsOn`, `disabled`

---

## Licenca

Distribuido sob a licenca MIT. Veja `LICENSE` para mais informacoes.
