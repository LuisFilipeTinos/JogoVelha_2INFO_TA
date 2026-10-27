const CHAVE_STORAGE = "jogo-da-velha";

const COMBINACOES_VITORIA = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], //Linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], //Colunas
    [0, 4, 8], [2, 4, 6]             //Diagonais
];

const tabuleiro = document.getElementById("tabuleiro");
const status = document.getElementById("status");
const inputNomeX = document.getElementById("nome-x");
const inputNomeO = document.getElementById("nome-o");
const placarX = document.getElementById("placar-x");
const placarO = document.getElementById("placar-o");
const placarEmpate = document.getElementById("placar-empate");
const placarNomeX = document.getElementById("placar-nome-x");
const placarNomeO = document.getElementById("placar-nome-o");
const listaHistorico = document.getElementById("lista-historico");
const btnNova = document.getElementById("btn-nova");
const btnApagar = document.getElementById("btn-apagar");

function estadoInicial() {
    return {
        nomes: { X: '', O: '' },
        placar: { X: 0, O: 0, empate: 0 },
        tabuleiro: Array(9).fill(""),
        vez: "X",
        fimDoJogo: false,
        linhaVencedora: [],
        historico: [],
        quemComeca: "X" //Alterna a cada partida
    };
}

let estado = carregarEstado();

//Armazenamento com localStorage:
function salvarEstado() {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(estado));
}

function carregarEstado() {
    const dados = localStorage.getItem(CHAVE_STORAGE);
    return dados ? JSON.parse(dados) : estadoInicial();
}

//Regras do jogo:
function nomeJogador(jogador) {
    return estado.nomes[jogador] || `Cavaleiro ${jogador}`;
}

function verificarVencedor() {
    for (const combinacao of COMBINACOES_VITORIA) {
        const [a, b, c] = combinacao;
        const estTabuleiro = estado.tabuleiro;

        if (estTabuleiro[a] !== "" 
            && estTabuleiro[a] === estTabuleiro[b] 
            && estTabuleiro[a] === estTabuleiro[c]) {
                return { vencedor: estTabuleiro[a], linha: combinacao };
        }
    }
    return null;
}

function jogar(posicao) {
    if (estado.tabuleiro[posicao] !== '' || estado.fimDoJogo) {
        return;
    }

    estado.tabuleiro[posicao] = estado.vez;

    const resultado = verificarVencedor();

    if (resultado) {
        estado.fimDoJogo = true;
        estado.linhaVencedora = resultado.linha;
        estado.placar[resultado.vencedor]++;
        //Fazer e chamar a função de histórico!
    }
    else if (!estado.tabuleiro.includes("")) {
        estado.fimDoJogo = true;
        estado.placar.empate++;
        //Fazer e chamar a função de histórico!
    }
    else {
        if (estado.vez == "X"){
            estado.vez = "O";
        }
        else {
            estado.vez = "X";
        }

        //estado.vez = estado.vez == "X" ? "O" : "X";
    }

    //Salvar o estado atualizado.
    //Renderizar a tela novamente.
}

function registrarHistorico(texto) {
    const hora = new Date().toLocaleTimeString(
        "pt-BR",
        {
            hour: "2-digit",
            minutes: "2-digit"
        }
    );

    estado.historico.unshift(`${hora} - ${texto}`);

    estado.historico = estado.historico.slice(0, 5);
}

function novaPartida() {
    estado.quemComeca = estado.quemComeca == "X" ? "O" : "X";
}