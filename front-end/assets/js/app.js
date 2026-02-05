let CONTRATO_DADOS = {};
const VALOR_CONTRA_TURNO = 1800;

document.getElementById("cpf").addEventListener("input", e => {
    e.target.value = e.target.value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
});

// ================= UTIL =================
function formatBR(v){
    return v.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// ================= PARCELAMENTO =================
let parcelasSelecionadas = 12;

function criarParcelamentoUI() {
    if (document.getElementById('parcelamentoWrap')) return;

    const wrap = document.createElement('div');
    wrap.id = 'parcelamentoWrap';
    wrap.className = 'mt8';

    wrap.innerHTML = `
        <label>Forma de pagamento</label>
        <select id="parcelasSelect">
            <option value="1">À vista (5% de desconto)</option>
            <option value="2">2 parcelas</option>
            <option value="4">4 parcelas</option>
            <option value="6">6 parcelas</option>
            <option value="12" selected>12 parcelas</option>
        </select>
        <small class="muted">
            À vista recebe 5% de desconto automático.
        </small>
    `;

    document
        .getElementById('simular')
        .closest('.card')
        .insertBefore(wrap, document.getElementById('resultado'));

    document.getElementById('parcelasSelect')
        .addEventListener('change', e => {
            parcelasSelecionadas = parseInt(e.target.value);
            atualizarPreview();
        });
}

document.addEventListener('DOMContentLoaded', criarParcelamentoUI);


// ================= TABELA FIXA (VALORES BASE ANUAIS) =================
const VALORES = {
  // ================= ROTA DIURNA =================
  diurna: {
    Pauliceia: 2880,        // 12x 240
    VilaAlice: 3000,        // 12x 250
    VilaOriental: 3000,     // 12x 250
    Canhema: 3000,          // 12x 250
    SantaCruz: 3000,        // 12x 250
    JdTakebe: 3000,         // 12x 250
    JdABC: 3000,            // 12x 250
    VilaFlorida: 3000,      // 12x 250
    Borborema: 3000,        // 12x 250
    TaboaoDiadema: 3120,    // 12x 260
    TaboaoSBC: 3240,        // 12x 272,50
    Nacoes: 3360,            // 12x 283,33
    VilaSantaLuzia: 3240   // 12x 270
  },

  // ================= ROTA FAUSTO (14h às 21h) =================
  fausto: {
    Pauliceia: 3720,        // 12x 290
    Canhema: 3840,          // 12x 300
    JdABC: 3960,            // 12x 310
    JdTakebe: 3960,         // 12x 310
    VilaFlorida: 4080,      // 12x 320
    Borborema: 4080,        // 12x 320
    TaboaoDiadema: 4080     // 12x 320
  }
};

function handleServiceType() {
    const serviceType = document.getElementById('serviceType');
    const escolaDiv = document.getElementById('contraTurnoEscola');

    if (!serviceType || !escolaDiv) return;

    if (serviceType.value === 'contra_turno') {
        escolaDiv.style.display = 'block';
    } else {
        escolaDiv.style.display = 'none';
        const escolaSelect = document.getElementById('escolaContraTurno');
        if (escolaSelect) escolaSelect.value = '';
    }
}

// ve o biarro escolhido pelo user
function bairroPorNome(nomeBairro){
    if (!nomeBairro) return null;

    const bairros = {
        "Canhema/Taboão": "Canhema/Taboão",
        "Nacoes": "Nacoes",
        "VilaFlorida": "Vila Florida",
        "VilaOriental": "Vila Oriental",
        "Borborema": "Borborema",
        "VilaAlice": "Vila Alice",
        "Pauliceia": "Pauliceia",
        "SantaCruz": "Santa Cruz"
    };

    return bairros[nomeBairro] || null;
}


// ================= NOMES DAS CRIANÇAS =================
function obterCriancas() {
    const qtd = parseInt(
        document.getElementById('qtdCriancas')?.value || 1
    );

    return Array.from(document.querySelectorAll('.nome-crianca'))
        .slice(0, qtd) //pega a quantidade escolhida
        .map(input => input.value.trim())
        .filter(nome => nome !== '');
}

function validarCriancas() {
    const qtd = parseInt(
        document.getElementById('qtdCriancas')?.value || 1
    );

    const nomes = obterCriancas();

    if (nomes.length !== qtd) {
        alert(`Preencha o nome de ${qtd} criança(s).`);
        return false;
    }

    return true;
}

function atualizarCamposCriancas() {
    const qtd = parseInt(
        document.getElementById('qtdCriancas')?.value || 1
    );

    const inputs = document.querySelectorAll('.nome-crianca');

    inputs.forEach((input, index) => {
        if (index < qtd) {
            input.style.display = 'block';
        } else {
            input.style.display = 'none';
            input.value = ''; // limpa os extras
        }
    });

    controlarEscolasMultiplas();
}


function calcularValor() {
    const bairroIda = document.getElementById('bairroIda')?.value;
    const bairroVolta = document.getElementById('bairroVolta')?.value;
    const tipoServico = document.getElementById('serviceType')?.value || 'ida_volta';
    const tipoRota = document.getElementById('routeType')?.value || 'diurna';
    const escolaContraTurno = document.getElementById('escolaContraTurno')?.value;

    const criancas = obterCriancas();
    const qtdCriancas = criancas.length;

    let total = 0;

    // ================= BASE (ROTAS) =================
    const servicoBase = tipoServico === 'contra_turno' ? 'ida_volta' : tipoServico;

    // ================= IDA + VOLTA =================
    if (servicoBase === 'ida_volta') {
        if (!bairroIda || !bairroVolta) {
            alert("Selecione bairro de ida e de volta.");
            throw new Error('Bairros incompletos');
        }

        const valorIda = VALORES[tipoRota][bairroIda];
        const valorVolta = VALORES[tipoRota][bairroVolta];

        if (!valorIda || !valorVolta) {
            alert("Valor do bairro não encontrado.");
            throw new Error('Valor inválido');
        }

        total = (valorIda * 0.5) + (valorVolta * 0.5);
    }

    // ================= SÓ IDA =================
    if (servicoBase === 'so_ida') {
        if (!bairroIda) {
            alert("Selecione o bairro de ida.");
            throw new Error('Bairro ida ausente');
        }

        const valor = VALORES[tipoRota][bairroIda];
        if (!valor) {
            alert("Valor do bairro não encontrado.");
            throw new Error('Valor inválido');
        }

        total = valor * 0.7;
    }

    // ================= SÓ VOLTA =================
    if (servicoBase === 'so_volta') {
        if (!bairroVolta) {
            alert("Selecione o bairro de volta.");
            throw new Error('Bairro volta ausente');
        }

        const valor = VALORES[tipoRota][bairroVolta];
        if (!valor) {
            alert("Valor do bairro não encontrado.");
            throw new Error('Valor inválido');
        }

        total = valor * 0.7;
    }

    // ================= MULTIPLICA POR CRIANÇAS =================
    total *= qtdCriancas;

    // ================= DESCONTO POR IRMÃOS =================
    if (qtdCriancas >= 2) {
        total *= 0.90; // 10% de desconto
    }

    // ================= CONTRA TURNO =================
    if (tipoServico === 'contra_turno') {
        if (!escolaContraTurno) {
            alert("Selecione a escola do contra turno.");
            throw new Error('Escola contra turno ausente');
        }

        total += VALOR_CONTRA_TURNO;
        total *= 0.95; // 5% de desconto do contra turno
    }

    return {
        total,
        bairroIda: bairroIda || '—',
        bairroVolta: bairroVolta || '—',
        criancas,
        tipoServico,
        escolaContraTurno: escolaContraTurno || '—'
    };
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11) return false;

    // Elimina CPFs inválidos conhecidos
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    // Primeiro dígito
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;

    // Segundo dígito
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}


// Func para montar o contrato
function montarContrato() {

    // ================= VALIDAÇÃO =================
    if (!validarCriancas()) {
        throw new Error('Validação falhou');
    }

    const calc = calcularValor();
    if (!calc) {
        throw new Error('Cálculo inválido');
    }

    const parcelas = typeof parcelasSelecionadas === 'number'
        ? parcelasSelecionadas
        : 12;

    let valorFinal = calc.total;

    // ================= DESCONTO CONTRA TURNO =================
    if (calc.tipoServico === 'contra_turno') {
        valorFinal *= 0.95; // 5% de desconto
    }

    // Desconto à vista
    if (parcelas === 1) {
        valorFinal *= 0.95;
    }

    // ================= DADOS RESPONSÁVEL =================
    const resp = document.getElementById("resp")?.value || "—";
    const cpf = document.getElementById("cpf")?.value || "";
    const tel = document.getElementById("tel")?.value || "—";
    const endereco = document.getElementById("end")?.value || "—";

    // ================= VALIDA CPF =================
    if (!validarCPF(cpf)) {
        alert("CPF inválido. Verifique e tente novamente.");
        throw new Error("CPF inválido");
    }

    // ================= ESCOLA(S) =================
    // OBS: caso haja mais de um aluno em escolas diferentes,
    // o responsável informa uma das escolas, conforme aviso no formulário
    const escolasContrato = document.getElementById("escola")?.value || "—";

    const mesmaEscola =
    document.getElementById("mesmaEscola")?.value || "sim";

const mesmaEscolaLabel =
    mesmaEscola === 'sim'
        ? 'Sim'
        : 'Não (escolas distintas)';

    // ================= SERVIÇO =================
    const tipoServico = calc.tipoServico || '—';
    const escolaContraTurno = calc.escolaContraTurno || '—';

    // ================= SAÚDE =================
    const alergias = document.getElementById('alergias')?.value || 'Não informado';
    const comorbidades = document.getElementById('comorbidades')?.value || 'Não informado';
    const sindromes = document.getElementById('sindromes')?.value || 'Não informado';
    const transtornos = document.getElementById('transtornos')?.value || 'Não informado';
    const limitacoes = document.getElementById('limitacoes')?.value || 'Não informado';

    // ================= PLANILHA =================
    CONTRATO_DADOS = {
        nomeResp: resp,
        cpfResp: cpf,
        telResp: tel,
        escolasContrato,
        endereco,

        tipoServico,
        escolaContraTurno,

        bairroIda: calc.bairroIda || '—',
        bairroVolta: calc.bairroVolta || '—',

        alunos: calc.criancas.join(', '),

        parcelas,
        valorTotal: formatBR(valorFinal),
        valorParcela: formatBR(valorFinal / parcelas)
    };

    // ================= RETORNO PARA CONTRATO =================
    return {
        resp,
        cpf,
        tel,
        escolasContrato,
        mesmaEscola: mesmaEscolaLabel,
        endereco,

        tipoServico,
        escolaContraTurno,

        bairroIda: calc.bairroIda || '—',
        bairroVolta: calc.bairroVolta || '—',

        alunos: calc.criancas.join(', '),

        valorMensal: valorFinal,
        valorParcela: valorFinal / parcelas,
        parcelas,

        alergias,
        comorbidades,
        sindromes,
        transtornos,
        limitacoes,

        assinatura: resp
    };
}

// ================= PREVIEW =================
function atualizarPreview() {
    const c = montarContrato();

    const tipoServicoLabel = {
        ida_volta: 'Ida e volta',
        so_ida: 'Somente ida',
        so_volta: 'Somente volta',
        contra_turno: 'Contra turno'
    }[c.tipoServico] || '—';

    const contraTurnoHTML = c.tipoServico === 'contra_turno'
        ? `<br><strong>Escola do contra turno:</strong> ${c.escolaContraTurno}`
        : '';

    const bairroVoltaHTML = c.bairroVolta && c.bairroVolta !== '—'
        ? `<br>Bairro de volta: <strong>${c.bairroVolta}</strong>`
        : '';

    const contratoHTML = `

<p>
Pelo presente instrumento particular, de um lado
<strong>Mirella S. Lawall</strong>, inscrita no cadastro municipal competente,
doravante denominada <strong>CONTRATADA</strong>, e de outro lado:
</p>

<p>
<strong>Responsável Legal:</strong> ${c.resp}<br>
<strong>CPF:</strong> ${c.cpf}<br>
<strong>Escola(s) do(s) Aluno(s):</strong> ${c.escolasContrato}<br>
<strong>Alunos estudam na mesma escola:</strong> ${c.mesmaEscola}<br>
<strong>Endereço:</strong> ${c.endereco}
</p>

<p>
<strong>Rota do Transporte Escolar:</strong><br>
Bairro de ida: <strong>${c.bairroIda}</strong>
${bairroVoltaHTML}
</p>

<p>
<strong>Tipo de serviço:</strong> ${tipoServicoLabel}
${contraTurnoHTML}
</p>

<p>
Doravante denominado <strong>CONTRATANTE</strong>, têm entre si justo e contratado
o que segue:
</p>

<h4>CLÁUSULA 1ª – DO OBJETO</h4>
<p>
O presente contrato tem por objeto a prestação de serviços de transporte escolar
do(s) aluno(s): <strong>${c.alunos}</strong>, no trajeto residência ⇄ escola,
em período regular de aulas.
</p>

<p>
Não estão incluídos neste contrato transportes para atividades extracurriculares,
passeios, excursões, reposições de aulas, sábados, domingos letivos, colônia de férias
ou quaisquer atividades fora do calendário escolar regular.
</p>

<h4>CLÁUSULA 2ª – DO ITINERÁRIO</h4>
<p>
A CONTRATADA compromete-se a permanecer no local de embarque/desembarque por até
<strong>5 (cinco) minutos de antecedência</strong>, não sendo obrigada a adentrar
em locais considerados insalubres ou que coloquem em risco a segurança e integridade
física da equipe e do veículo.
</p>

<p>
Não será permitido aguardar o aluno além do horário estipulado.
</p>

<p>
Em caso de atraso decorrente de informações incorretas ou ausência do aluno no local,
a CONTRATADA não será responsabilizada.
</p>

<p>
Em caso de <strong>alteração momentânea de endereço</strong>, o CONTRATANTE deverá
informar com antecedência mínima de <strong>24 horas</strong>, sujeito à
disponibilidade da CONTRATADA e mediante pagamento de taxa correspondente ao
<strong>dobro do valor diário</strong>, considerando 22 dias.
</p>

<p>
Em caso de <strong>alteração fixa de endereço</strong>, torna-se hábil a rescisão
do contrato caso a CONTRATADA não tenha possibilidade de atender a nova rota.
</p>

<h4>CLÁUSULA 3ª – DO VALOR, PAGAMENTO E DESCONTOS</h4>
<p>
O valor total do contrato é de <strong>${formatBR(c.valorMensal)}</strong>,
a ser pago em <strong>${c.parcelas}</strong> parcela(s) mensais de
<strong>${formatBR(c.valorParcela)}</strong>
</p>

<p>
O pagamento será realizado <strong>exclusivamente por boleto bancário</strong>.
</p>

<h4>DESCONTOS</h4>
<ul>
    <li>O desconto é aplicado somente para mais de um aluno no <strong>mesmo endereço</strong>.</li>
    <li>Mesmo endereço e mesmo horário: <strong>10%</strong>.</li>
    <li>Mesmo endereço e horário diferente: <strong>5%</strong>.</li>
    <li>Contraturno: Terceira Viagem: <strong>5%</strong>.</li>
</ul>

<p>
Os descontos serão aplicados exclusivamente com base no preenchimento correto
das informações no cadastro e refletidos no preview do contrato.
</p>

<h4>CLÁUSULA 4ª – DO ATRASO E INADIMPLÊNCIA</h4>
<p>
Em caso de atraso no pagamento, incidirá multa de <strong>10%</strong> sobre o valor
em aberto, acrescida de juros de <strong>0,33% ao dia</strong>.
</p>

<p>
Poderá ocorrer a <strong>suspensão do serviço</strong> em até
<strong>3 (três) dias corridos após o vencimento</strong>, até a regularização do débito.
</p>

<p>
A suspensão não isenta o CONTRATANTE do pagamento dos valores vencidos e vincendos.
Persistindo a inadimplência, a CONTRATADA poderá proceder com cobrança administrativa
e eventual encaminhamento do débito, sendo de responsabilidade do CONTRATANTE
todos os custos advocatícios.
</p>

<h4>CLÁUSULA 5ª – DA VIGÊNCIA</h4>
<p>
O presente contrato terá vigência a partir do <strong>mês e ano de início do serviço</strong>,
após a concordância das duas partes.
</p>

<h4>CLÁUSULA 6ª – DAS INFORMAÇÕES DE SAÚDE</h4>
<p>
O CONTRATANTE declara que o(s) aluno(s) possui(em) as seguintes condições de saúde:
</p>

<ul>
<li><strong>Alergias:</strong> ${c.alergias}</li>
<li><strong>Comorbidades:</strong> ${c.comorbidades}</li>
<li><strong>Síndromes:</strong> ${c.sindromes}</li>
<li><strong>Transtornos:</strong> ${c.transtornos}</li>
<li><strong>Limitações físicas:</strong> ${c.limitacoes}</li>
</ul>

<p>
O CONTRATANTE é integralmente responsável pela veracidade dessas informações.
</p>

<h4>CLÁUSULA 7ª – DO CANCELAMENTO</h4>
<p>
O contrato poderá ser rescindido em caso de cancelamento ou
<strong>descumprimento das regras estabelecidas neste contrato</strong>.
</p>

<h4>CLÁUSULA 8ª – DO REAJUSTE</h4>
<p>
Os valores poderão sofrer reajuste anual mediante comunicação prévia ao CONTRATANTE.
</p>

<h4>CLÁUSULA 9ª – DAS SITUAÇÕES FORA DO CALENDÁRIO</h4>
<p>
Não é obrigação da CONTRATADA realizar transporte em situações fora do calendário
padrão, incluindo férias escolares, greves, feriados locais ou eventos extraordinários.
</p>

<h4>CLÁUSULA 10ª – DO FORO</h4>
<p>
Fica eleito o foro da Comarca de São Bernardo do Campo/SP, para dirimir quaisquer
questões oriundas do presente contrato.
</p>

<h4>RESPONSABILIDADES DA CONTRATADA</h4>
<ul>
    <li>Atender integralmente à legislação vigente.</li>
    <li>Manter veículos devidamente regularizados e revisados.</li>
    <li>Manter comunicação hábil com o aluno e responsável legal.</li>
    <li>Entregar o aluno somente a pessoas previamente autorizadas.</li>
    <li>
        Em caso de condomínios, o CONTRATANTE deverá informar se a criança
        poderá ser entregue mesmo na ausência do responsável legal no local.
    </li>
</ul>

<br>

<p>
Considera-se inviável a operação quando o número de alunos transportados
no dia for insuficiente para cobrir os custos mínimos operacionais,
observado como referência percentual mínimo de <strong>2% do total de alunos</strong>.
</p>

<br>

<p>
<strong>Assinatura do responsável:</strong><br>
${c.assinatura}
</p>
`;

    document.getElementById('contratoConteudo').innerHTML = contratoHTML;
    document.getElementById('resultado').style.display = 'block';
}

// ================= CONTROLE DE EXIBIÇÃO DOS CAMPOS DE ROTA =================
document.addEventListener('DOMContentLoaded', () => {
    const serviceSelect = document.getElementById('serviceType');
    const bairroIdaSelect = document.getElementById('bairroIda');
    const bairroVoltaSelect = document.getElementById('bairroVolta');

    if (!serviceSelect || !bairroIdaSelect || !bairroVoltaSelect) return;

    function atualizarCamposRota() {
        const tipo = serviceSelect.value;

        // Reset visual
        bairroIdaSelect.style.display = '';
        bairroVoltaSelect.style.display = '';

        // Só ida → esconde volta
        if (tipo === 'so_ida') {
            bairroVoltaSelect.style.display = 'none';
            bairroVoltaSelect.value = '';
        }

        // Só volta → esconde ida
        if (tipo === 'so_volta') {
            bairroIdaSelect.style.display = 'none';
            bairroIdaSelect.value = '';
        }
    }

    serviceSelect.addEventListener('change', atualizarCamposRota);
    atualizarCamposRota(); // executa ao carregar a página
});


// ================= EVENTOS =================

document.getElementById('limpar')?.addEventListener('click', () => {
    document.querySelectorAll('input').forEach(e => e.value = '');
    document.querySelectorAll('select').forEach(e => e.selectedIndex = 0);
    document.getElementById('resultado').style.display = 'none';
});

// ================= CRIANÇAS =================
function atualizarCamposCriancas() {
    const qtd = parseInt(
        document.getElementById('qtdCriancas')?.value || 1
    );

    document.querySelectorAll('.nome-crianca').forEach((input, index) => {
        input.style.display = index < qtd ? 'block' : 'none';
        if (index >= qtd) input.value = '';
    });
}

document
    .getElementById('qtdCriancas')
    ?.addEventListener('change', atualizarCamposCriancas);

document.addEventListener('DOMContentLoaded', atualizarCamposCriancas);

// ================= PDF =================
document.getElementById('baixarPdf')?.addEventListener('click', async () => {
    const element = document.getElementById('contractDoc');

    const canvas = await html2canvas(element, {
        scale: 2,              // melhora a qualidade
        useCORS: true,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jspdf.jsPDF('p', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }

    pdf.save('contrato-transporte-escolar.pdf');
});

// ================= COPIAR =================
document.getElementById('copiarTexto')?.addEventListener('click', () => {
    navigator.clipboard.writeText(
        document.getElementById('contractDoc').innerText
    );
    alert("Contrato copiado!");
});

/* =========================================================
   ENVIO DO CONTRATO PARA GOOGLE SHEETS
========================================================= */

document.getElementById("simular").addEventListener("click", function () {

    try {
        atualizarPreview(); // gera o contrato VISUAL
    } catch (e) {
        return;
    }

    const dados = new FormData();

    dados.append("nomeResp", CONTRATO_DADOS.nomeResp);
    dados.append("cpfResp", CONTRATO_DADOS.cpfResp);
    dados.append("telResp", CONTRATO_DADOS.telResp);
    dados.append("escola", CONTRATO_DADOS.escola);

    dados.append("endereco", CONTRATO_DADOS.endereco);
    dados.append("cep", CONTRATO_DADOS.cep);

    dados.append("valorTotal", CONTRATO_DADOS.valorTotal);
    dados.append("parcelamento", CONTRATO_DADOS.parcelas);
    dados.append("valorParcela", CONTRATO_DADOS.valorParcela);

    dados.append("alunosNomes", CONTRATO_DADOS.alunos);

    dados.append(
        "contratoTexto",
        document.getElementById("contratoConteudo")?.innerText || ""
    );

    fetch("https://script.google.com/macros/s/AKfycby9M_49QZOaFVjMLJ9LNs-qz4ROlKYZ0TjJOmtsFxGTnT0lm9dyjEY9Z7vqlVRH19vj/exec", {
        method: "POST",
        body: dados
    });
});

document.addEventListener('DOMContentLoaded', atualizarCamposCriancas);

function controlarEscolasMultiplas() {
    const qtd = Number(document.getElementById('qtdCriancas')?.value || 1);
    const bloco = document.getElementById('escolasMultiplas');

    if (qtd >= 2) {
        bloco.style.display = 'block';
    } else {
        bloco.style.display = 'none';
        document.getElementById('escola2Wrap').style.display = 'none';
    }
}

document.getElementById('qtdCriancas')
    ?.addEventListener('change', controlarEscolasMultiplas);

document.getElementById('mesmaEscola')
    ?.addEventListener('change', e => {
        document.getElementById('escola2Wrap').style.display =
            e.target.value === 'nao' ? 'block' : 'none';
    });
