let CONTRATO_DADOS = {};
const VALOR_CONTRA_TURNO = 1800;

document.getElementById("cpf").addEventListener("input", e => {
    e.target.value = e.target.value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
});

function formatBR(v){
    return v.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

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

const VALORES = {
  diurna: {
    Pauliceia: 2880,
    VilaAlice: 3000,
    VilaOriental: 3000,
    Canhema: 3000,
    SantaCruz: 3000,
    JdTakebe: 3000,
    JdABC: 3000,
    VilaFlorida: 3000,
    Borborema: 3000,
    TaboaoDiadema: 3120,
    TaboaoSBC: 3240,
    Nacoes: 3360,
    VilaSantaLuzia: 3240
  },
  fausto: {
    Pauliceia: 3720,
    Canhema: 3840,
    JdABC: 3960,
    JdTakebe: 3960,
    VilaFlorida: 4080,
    Borborema: 4080,
    TaboaoDiadema: 4080
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

function obterCriancas() {
    const qtd = parseInt(
        document.getElementById('qtdCriancas')?.value || 1
    );

    return Array.from(document.querySelectorAll('.nome-crianca'))
        .slice(0, qtd)
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
            input.value = '';
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
    const servicoBase = tipoServico === 'contra_turno' ? 'ida_volta' : tipoServico;

    if (servicoBase === 'ida_volta') {
        if (!bairroIda || !bairroVolta) {
            alert("Selecione bairro de ida e de volta.");
            throw new Error();
        }

        const valorIda = VALORES[tipoRota][bairroIda];
        const valorVolta = VALORES[tipoRota][bairroVolta];

        if (!valorIda || !valorVolta) {
            alert("Valor do bairro não encontrado.");
            throw new Error();
        }

        total = (valorIda * 0.5) + (valorVolta * 0.5);
    }

    if (servicoBase === 'so_ida') {
        if (!bairroIda) {
            alert("Selecione o bairro de ida.");
            throw new Error();
        }

        const valor = VALORES[tipoRota][bairroIda];
        if (!valor) {
            alert("Valor do bairro não encontrado.");
            throw new Error();
        }

        total = valor * 0.7;
    }

    if (servicoBase === 'so_volta') {
        if (!bairroVolta) {
            alert("Selecione o bairro de volta.");
            throw new Error();
        }

        const valor = VALORES[tipoRota][bairroVolta];
        if (!valor) {
            alert("Valor do bairro não encontrado.");
            throw new Error();
        }

        total = valor * 0.7;
    }

    total *= qtdCriancas;

    if (qtdCriancas >= 2) {
        total *= 0.90;
    }

    if (tipoServico === 'contra_turno') {
        if (!escolaContraTurno) {
            alert("Selecione a escola do contra turno.");
            throw new Error();
        }

        total += VALOR_CONTRA_TURNO;
        total *= 0.95;
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
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;

    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}