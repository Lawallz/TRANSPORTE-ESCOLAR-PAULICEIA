let CONTRATO_DADOS = {};

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


// ================= TABELA FIXA (VALORES MENSAIS BASE) =================
const VALORES = {
    diurna: {
        Pauliceia: 2880,
        TaboaoDiadema: 3200,
        Nacoes: 3000,
        Canhema: 3000,
        Borborema: 3000,
        VilaAlice: 3000,
        VilaFlorida: 3000,
        VilaOriental: 3000,
        SantaCruz: 3000,
        TaboaoSBC: 3200
    },
    // 🔥 ROTA FAUSTO ATUALIZADA com base no fator de 1.28 (28% de aumento)
    fausto: {
        // Valores que já existiam
        Pauliceia: 3730, // 2880 * 1.28 = 3686.4 
        Canhema: 3840,   // 3000 * 1.28 = 3840
        VilaAlice: 3840, // 3000 * 1.28 = 3840 
        TaboaoDiadema: Math.round(3200 * 1.28), // 4096
        Nacoes: Math.round(3000 * 1.28),        // 3840
        Borborema: Math.round(3000 * 1.28),     // 3840
        VilaFlorida: Math.round(3000 * 1.28),   // 3840
        VilaOriental: Math.round(3000 * 1.28),  // 3840
        SantaCruz: Math.round(3000 * 1.28),     // 3840
        TaboaoSBC: Math.round(3200 * 1.28)      // 4096
    }
};

// Atualizada para verificar o bairro diretamente
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
function obterCriancas(){
    const qtd = parseInt(
        document.getElementById('qtdCriancas')?.value || 1
    );

    return Array.from(document.querySelectorAll('.nome-crianca'))
        .slice(0, qtd)
        .map(i => i.value.trim())
        .filter(Boolean);
}

function validarCriancas(){
    const nomes = obterCriancas();
    const qtd = parseInt(
        document.getElementById('qtdCriancas')?.value || 1
    );

    if (nomes.length < qtd) {
        alert('Preencha o nome de todas as crianças.');
        return false;
    }
    return true;
}

// ================= CALCULO =================
function calcularValor() {
    const route = document.getElementById('routeType')?.value;
    const serviceType = document.getElementById('serviceType')?.value;

    // Agora vamos pegar os bairros diretamente dos selects
    const bairroIda = document.getElementById('bairroIda')?.value;
    const bairroVolta = document.getElementById('bairroVolta')?.value;

    // Verificando se os bairros foram corretamente selecionados
    if (!bairroIda || !bairroVolta) {
        alert(
            'Por favor, selecione os bairros para ambos os trajetos (ida e volta).'
        );
        throw new Error('Bairro inválido');
    }

    const qtdCriancas = parseInt(
        document.getElementById('qtdCriancas')?.value || 1
    );

    // fallback WhatsApp (continua funcionando)
    if (
        !VALORES[route] ||
        !VALORES[route][bairroIda] ||
        !VALORES[route][bairroVolta]
    ) {
        alert(
            'Este bairro exige confirmação manual.\n' +
            'Você será direcionado para o WhatsApp.'
        );

        window.open(
            'https://wa.me/5511940327711?text=' +
            encodeURIComponent(
                `Olá! Gostaria de confirmar o valor do transporte escolar.\n` +
                `Bairro ida: ${bairroIda}\nBairro volta: ${bairroVolta}`
            ),
            '_blank'
        );

        throw new Error('Valor manual');
    }

    let valorBase = 0;

    // 🔥 REGRA DE CÁLCULO POR TIPO DE SERVIÇO
    if (serviceType === 'ida_volta') {
        valorBase =
            (VALORES[route][bairroIda] * 0.5) +
            (VALORES[route][bairroVolta] * 0.5);
    }

    if (serviceType === 'so_ida') {
        valorBase = VALORES[route][bairroIda] * 0.5;
    }

    if (serviceType === 'so_volta') {
        valorBase = VALORES[route][bairroVolta] * 0.5;
    }

    let total = 0;

    // Cálculo do valor total considerando o número de crianças
    for (let i = 0; i < qtdCriancas; i++) {
        if (i === 0) total += valorBase;
        else if (i === 1) total += valorBase * 0.9;
        else total += valorBase * 0.85;
    }

    return {
        total,
        bairroIda,
        bairroVolta,
        criancas: obterCriancas()
    };
}

// ================= CONTRATO =================
function montarContrato(){
    if (!validarCriancas()) {
        throw new Error('Validação falhou');
    }

    const calc = calcularValor();

    // garante valor padrão caso a UI ainda não tenha rodado
    const parcelas = typeof parcelasSelecionadas === 'number'
        ? parcelasSelecionadas
        : 12;

    let valorFinal = calc.total;

    // 5% de desconto à vista
    if (parcelas === 1) {
        valorFinal = valorFinal * 0.95;
    }

CONTRATO_DADOS = {
    nomeResp: document.getElementById("resp")?.value || "—",
    cpfResp: document.getElementById("cpf")?.value || "—",
    telResp: document.getElementById("tel")?.value || "—",
    escola: document.getElementById("escola")?.value || "—",

    endereco: document.getElementById("end")?.value || "—",
    cep: document.getElementById("cepIda")?.value || "—",

    valorTotal: formatBR(valorFinal),
    parcelas: parcelas,
    valorParcela: formatBR(valorFinal / parcelas),

    alunos: calc.criancas.join(", "),
};

    return {
        resp: document.getElementById('resp')?.value || '—',
        cpf: document.getElementById('cpf')?.value || '—',
        escola: document.getElementById('escola')?.value || '—',
        turno: document.getElementById('turno')?.value || '—',
        servico: document.getElementById('serviceType')?.value || '—',
        inicio: document.getElementById('data_inicio')?.value || '—',
        assinatura: document.getElementById('assinatura')?.value || '—',
        alergias: document.getElementById('alergias')?.value || 'Não informado',
        comorbidades: document.getElementById('comorbidades')?.value || 'Não informado',
        sindromes: document.getElementById('sindromes')?.value || 'Não informado',
        transtornos: document.getElementById('transtornos')?.value || 'Não informado',
        limitacoes: document.getElementById('limitacoes')?.value || 'Não informado',

        alunos: calc.criancas.join(', '),

        bairroTexto:
`CEP ida: ${calc.cepIda} (${calc.bairroIda})
CEP volta: ${calc.cepVolta} (${calc.bairroVolta})`,

        valorMensal: valorFinal,
        parcelas: parcelas,
        valorParcela: valorFinal / parcelas

    };
}

// ================= PREVIEW =================
function atualizarPreview(){
    const c = montarContrato();

    const contratoHTML = `

<p>
Pelo presente instrumento particular, de um lado
<strong>Mirella S. Lawall</strong>, inscrita no cadastro municipal competente,
doravante denominada <strong>CONTRATADA</strong>, e de outro lado:
</p>

<p>
<strong>Responsável Legal:</strong> ${c.resp}<br>
<strong>CPF:</strong> ${c.cpf}<br>
<strong>Escola:</strong> ${c.escola}
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
O valor anual do contrato é de <strong>${formatBR(c.valorMensal)}</strong>,
podendo ser pago em <strong>${c.parcelas}</strong> parcela(s) de
<strong>${formatBR(c.valorParcela)}</strong>.
</p>

<p>
O pagamento será realizado <strong>exclusivamente por boleto bancário</strong>.
</p>

<h4>DESCONTOS</h4>
<ul>
    <li>O desconto é aplicado somente para alunos no <strong>mesmo endereço</strong>.</li>
    <li>Mesmo endereço e mesmo horário: <strong>10%</strong>.</li>
    <li>Mesmo endereço e horário diferente: <strong>5%</strong>.</li>
    <li>Contraturno: <strong>5%</strong>.</li>
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
   (100% compatível com seu HTML e Apps Script)
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
