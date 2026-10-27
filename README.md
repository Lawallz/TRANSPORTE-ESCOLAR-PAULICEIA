# Transporte Escolar Pauliceia — Web App & Sistema de Contratos

> Plataforma digital para gestão de rotas, eventos, passeios e simulação automatizada de contratos de transporte escolar.

Desenvolvido para otimizar a experiência dos responsáveis legais, o portal do **Transporte Escolar Pauliceia** combina uma interface informativa sobre os serviços, passeios e eventos da frota com um poderoso **simulador de contratos em tempo real**. O sistema calcula valores dinamicamente com base em rotas, bairros, quantidade de crianças, descontos para irmãos, turnos e formas de pagamento, gerando minutas contratuais prontas para impressão, exportação em PDF e integração direta com o Google Sheets.

---

## Funcionalidades do Sistema

* Apresentação de Serviços & Passeios: Vitrine institucional interativa para consulta de rotas regulares, serviços de contra-turno, além de informações detalhadas sobre eventos e passeios extracurriculares da frota.
* Simulador de Contratos Dinâmico: 
    * Cálculo por Bairros & Rotas: Tabelas integradas para rotas diurnas e noturnas cobrindo diversos bairros de São Bernardo do Campo e arredores.
    * Gestão de Múltiplos Alunos: Suporte para múltiplos irmãos com aplicação automática de regras de desconto.
    * Adicional de Contra-Turno: Gerenciamento automático de terceira viagem e tarifas específicas.
* Geração de Minuta Contratual: Criação instantânea de contratos personalizados contendo dados cadastrais, informações de saúde e limitações médicas dos alunos.
* Exportação & Integração: Ferramentas para cópia rápida de texto, exportação da minuta em PDF de alta qualidade e envio assíncrono dos dados gerados diretamente para uma planilha do Google Sheets via Webhook.

---

## Tecnologias Utilizadas

* React + Vite: interface componentizada e desenvolvimento rápido.
* TypeScript em modo estrito: contratos tipados para alunos, responsáveis, rotas, bairros e preços.
* Tailwind CSS: design responsivo e mobile-first.
* Lucide React: ícones acessíveis e consistentes.
* Vitest: testes que protegem a compatibilidade do cálculo com a versão legada.

Durante a migração, `contrato.html` e `assets/js/app.js` permanecem no repositório como implementação legada de referência.

---

## Como Executar Localmente

1. Clone ou baixe os arquivos do projeto na sua máquina.

2. Instale as dependências e inicie o Vite:
   ```bash
   cd front-end
   npm install
   npm run dev
   ```

3. Abra o endereço informado no terminal.

Antes de publicar, valide a base:

```bash
npm test
npm run build
```

## Organização dos arquivos

- [`front-end/src/`](front-end/src/): aplicação React e regras TypeScript.
- [`front-end/src/features/pricing/`](front-end/src/features/pricing/): motor de cálculo isolado e seus testes.
- [`front-end/contrato.html`](front-end/contrato.html): simulador legado mantido como referência temporária.
- [`front-end/assets/`](front-end/assets/): mídias e implementação legada.
- [`back-end/server/`](back-end/server/): código do servidor e persistência.
