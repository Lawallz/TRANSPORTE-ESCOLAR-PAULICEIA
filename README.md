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

* JavaScript (ES6+): Manipulação de DOM, formatação de moeda, validação de CPF e regras de negócio.
* UI Interativa: Event listeners reativos para manipulação dinâmica de campos de formulário e visibilidade condicional baseada na seleção do usuário.
* Bibliotecas Externas: html2canvas e jsPDF para renderização e download de documentos contratuais.
* APIs Externas: Integração via requisições POST com Google Apps Script para persistência de dados em planilha.

---

## Como Executar Localmente

1. Clone ou baixe os arquivos do projeto na sua máquina.

2. Sirva o projeto localmente utilizando um servidor estático:
   ```bash
   npx serve .
