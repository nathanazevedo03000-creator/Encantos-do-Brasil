// Encantos do Brasil — Jogo da memória

// Cadastro das 12 lendas e suas respectivas imagens.
const lendas = [
  {
    id: "saci-perere",
    nome: "Saci-Pererê",
    imagem: "assets/cartas/saci-perere.png"
  },
  {
    id: "mapinguari",
    nome: "Mapinguari",
    imagem: "assets/cartas/mapinguari.png"
  },
  {
    id: "mula-sem-cabeca",
    nome: "Mula sem Cabeça",
    imagem: "assets/cartas/mula-sem-cabeca.png"
  },
  {
    id: "iara",
    nome: "Iara",
    imagem: "assets/cartas/iara.png"
  },
  {
    id: "boitata",
    nome: "Boitatá",
    imagem: "assets/cartas/boitata.png"
  },
  {
    id: "boto-cor-de-rosa",
    nome: "Boto-cor-de-rosa",
    imagem: "assets/cartas/boto-cor-de-rosa.png"
  },
  {
    id: "cuca",
    nome: "Cuca",
    imagem: "assets/cartas/cuca.png"
  },
  {
    id: "caipora",
    nome: "Caipora",
    imagem: "assets/cartas/caipora.png"
  },
  {
    id: "matinta-pereira",
    nome: "Matinta Pereira",
    imagem: "assets/cartas/matinta-pereira.png"
  },
  {
    id: "corpo-seco",
    nome: "Corpo-Seco",
    imagem: "assets/cartas/corpo-seco.png"
  },
  {
    id: "negrinho-do-pastoreio",
    nome: "Negrinho do Pastoreio",
    imagem: "assets/cartas/negrinho-do-pastoreio.png"
  },
  {
    id: "pisadeira",
    nome: "Pisadeira",
    imagem: "assets/cartas/pisadeira.png"
  }
];

// Imagem que aparece no verso das cartas fechadas.
const caminhoVerso = "assets/cartas/verso.png";

// Elementos da página.
const tabuleiro = document.getElementById("tabuleiro");
const contadorTentativas = document.getElementById("tentativas");
const contadorPares = document.getElementById("pares");
const mensagem = document.getElementById("mensagem");
const botaoReiniciar = document.getElementById("reiniciar");

// Variáveis de controle do jogo.
let primeiraCarta = null;
let segundaCarta = null;
let bloqueado = false;
let tentativas = 0;
let paresEncontrados = 0;

// Embaralha as cartas aleatoriamente.
function embaralhar(lista) {
  const copia = [...lista];

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
}

// Atualiza os números do placar.
function atualizarPlacar() {
  contadorTentativas.textContent = tentativas;

  contadorPares.textContent =
    `${paresEncontrados} / ${lendas.length}`;
}

// Controla a virada das cartas.
function virarCarta(carta) {
  if (
    bloqueado ||
    carta === primeiraCarta ||
    carta.classList.contains("virada") ||
    carta.classList.contains("encontrada")
  ) {
    return;
  }

  carta.classList.add("virada");

  carta.setAttribute(
    "aria-label",
    `Carta revelada: ${carta.dataset.nome}`
  );

  // Primeiro clique.
  if (primeiraCarta === null) {
    primeiraCarta = carta;

    mensagem.textContent =
      "Uma lenda foi revelada! Encontre seu par.";

    return;
  }

  // Segundo clique.
  segundaCarta = carta;

  tentativas++;

  atualizarPlacar();

  verificarPar();
}

// Verifica se as duas cartas são iguais.
function verificarPar() {
  if (
    primeiraCarta.dataset.lenda ===
    segundaCarta.dataset.lenda
  ) {
    // As cartas formam um par e permanecem reveladas.
primeiraCarta.classList.add("virada", "encontrada");
segundaCarta.classList.add("virada", "encontrada");

    primeiraCarta.disabled = true;
    segundaCarta.disabled = true;

    paresEncontrados++;

    atualizarPlacar();

    primeiraCarta = null;
    segundaCarta = null;

    // Verifica se todas as lendas foram descobertas.
    if (paresEncontrados === lendas.length) {
      mensagem.textContent =
        "Parabéns! Você desvendou as lendas do Brasil!";
    } else {
      mensagem.textContent =
        "Muito bem! Você descobriu uma lenda!";
    }

    return;
  }

  // As cartas não formam um par.
  bloqueado = true;

  mensagem.textContent =
    "Essas lendas não combinam. Tente novamente!";

  const cartaAnterior = primeiraCarta;
  const cartaAtual = segundaCarta;

  // Aguarda um segundo antes de fechar as cartas.
  setTimeout(() => {
    cartaAnterior.classList.remove("virada");
    cartaAtual.classList.remove("virada");

    cartaAnterior.setAttribute(
      "aria-label",
      "Carta fechada"
    );

    cartaAtual.setAttribute(
      "aria-label",
      "Carta fechada"
    );

    primeiraCarta = null;
    segundaCarta = null;
    bloqueado = false;

  }, 1000);
}

// Cria uma carta individual.
function criarCarta(lenda) {
  const carta = document.createElement("button");

  carta.type = "button";
  carta.classList.add("carta");

  carta.dataset.lenda = lenda.id;
  carta.dataset.nome = lenda.nome;

  carta.setAttribute("aria-label", "Carta fechada");

  carta.innerHTML = `
    <span class="carta-inner">

      <span class="face frente" aria-hidden="true">
        <img
          src="${caminhoVerso}"
          alt=""
          draggable="false"
        >
      </span>

      <span class="face verso" aria-hidden="true">
        <img
          src="${lenda.imagem}"
          alt=""
          draggable="false"
        >
      </span>

    </span>
  `;

  carta.addEventListener("click", () => {
    virarCarta(carta);
  });

  return carta;
}

// Inicia ou reinicia uma partida.
function iniciarJogo() {
  tabuleiro.replaceChildren();

  primeiraCarta = null;
  segundaCarta = null;
  bloqueado = false;

  tentativas = 0;
  paresEncontrados = 0;

  mensagem.textContent =
    "As lendas estão escondidas. Será que você consegue encontrá-las?";

  // Cria duas cartas de cada personagem e embaralha.
  const cartas = embaralhar([...lendas, ...lendas]);

  cartas.forEach((lenda) => {
    tabuleiro.appendChild(criarCarta(lenda));
  });

  atualizarPlacar();
}

// Botão para começar uma nova partida.
botaoReiniciar.addEventListener("click", iniciarJogo);

// Inicia o jogo automaticamente ao abrir a página.
iniciarJogo();