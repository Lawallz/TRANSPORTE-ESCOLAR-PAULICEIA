# Arquitetura do front-end

## Objetivo

Migrar a apresentação para React, Vite, TypeScript e Tailwind sem alterar a regra matemática existente em `front-end/assets/js/app.js`.

## Estrutura

```text
front-end/
├── src/
│   ├── components/
│   │   ├── contract/       # Resumo e futura prévia/PDF do contrato
│   │   ├── forms/          # Campos visuais sem regra de preço
│   │   └── layout/         # Cabeçalho e estrutura global
│   ├── data/               # Escolas, bairros e tabela anual
│   ├── features/
│   │   └── pricing/        # Motor puro de cálculo + testes de compatibilidade
│   ├── pages/              # Home e simulador
│   ├── types/              # Tipos centrais do domínio
│   ├── App.tsx
│   └── main.tsx
├── assets/                 # Mídia e implementação legada mantidas como referência
├── contrato.html           # Tela legada mantida durante a migração
└── vite.config.ts
```

## Limites entre camadas

- `data`: contém somente cadastros e valores copiados do sistema atual.
- `features/pricing`: recebe dados tipados, calcula e devolve números; não acessa DOM ou componentes.
- `components/forms`: coleta dados e não conhece fórmulas.
- `pages`: coordena estado, validação e apresentação.
- `types`: contrato único entre as camadas.

## Regra de compatibilidade

Qualquer mudança em preços deve primeiro atualizar conscientemente os testes de `pricingEngine.test.ts`. A sequência preservada é: base da rota, multiplicação por alunos, desconto de irmãos, adicional e desconto de contraturno e, por último, desconto à vista.
