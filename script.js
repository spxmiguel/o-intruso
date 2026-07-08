/* =========================================================
   O INTRUSO — config do jogo
   Para trocar o intruso: mova "isIntruder: true" para outro item.
   Para trocar textos: edite "name" e "origin" à vontade.
   ========================================================= */

const GAME_CONFIG = {
  items: [
    {
      id: "relogio",
      emoji: "⌚",
      name: "Relógio de pulso",
      isIntruder: false,
      origin: "Antes da guerra, o relógio de bolso era o padrão. Nas trincheiras os soldados precisavam sincronizar ataques com as mãos livres, então passaram a usar relógios presos ao pulso — depois da guerra o hábito virou moda civil."
    },
    {
      id: "fanta",
      emoji: "🥤",
      name: "Fanta",
      isIntruder: false,
      origin: "Foi criada em 1940 na fábrica alemã da Coca-Cola, quando o embargo comercial da guerra impediu a importação do xarope original. A solução foi inventar um refrigerante novo com o que havia disponível na época, como soro de leite e polpa de maçã."
    },
    {
      id: "microondas",
      emoji: "📡",
      name: "Micro-ondas",
      isIntruder: false,
      origin: "Foi descoberto por acidente em 1945: um engenheiro que trabalhava com radares militares (magnetron) percebeu que uma barra de chocolate no seu bolso derreteu perto do equipamento."
    },
    {
      id: "meia-nylon",
      emoji: "🧦",
      name: "Meia de nylon",
      isIntruder: false,
      origin: "O nylon já existia, mas sua produção foi escalada pela DuPont para uso militar — paraquedas, cordas, coletes. Depois da guerra, sobrou material e a indústria têxtil o popularizou nas meias femininas."
    },
    {
      id: "ziper",
      emoji: "🤐",
      name: "Zíper",
      isIntruder: false,
      origin: "Já era conhecido antes da guerra, mas sua fabricação em larga escala decolou por causa da alta demanda por uniformes, botas e equipamentos militares que precisavam dele."
    },
    {
      id: "qrcode",
      emoji: "🔳",
      name: "QR Code",
      isIntruder: true,
      origin: "É 100% moderno: foi criado em 1994, no Japão, para rastrear peças na indústria automotiva. Não tem nenhuma relação com a Segunda Guerra Mundial — aliás, foi um QR code parecido com esse que você escaneou para jogar!"
    }
  ]
};

/* ========================================================= */

const startScreen   = document.getElementById("start-screen");
const gameScreen     = document.getElementById("game-screen");
const grid           = document.getElementById("grid");
const feedbackPanel  = document.getElementById("feedback-panel");
const winOverlay     = document.getElementById("win-overlay");
const winTitle       = document.getElementById("win-title");
const winExplanation = document.getElementById("win-explanation");
const winList        = document.getElementById("win-list");
const playBtn        = document.getElementById("play-btn");
const playAgainBtn   = document.getElementById("play-again-btn");

let solved = false;
let wrongIds = new Set();

function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startGame() {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  initGame();
}

function initGame() {
  solved = false;
  wrongIds = new Set();
  feedbackPanel.classList.remove("show");
  feedbackPanel.textContent = "";
  winOverlay.classList.add("hidden");
  renderGrid();
}

function renderGrid() {
  grid.innerHTML = "";
  const shuffled = shuffle(GAME_CONFIG.items);

  shuffled.forEach((item) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.dataset.id = item.id;
    card.setAttribute("aria-label", item.name);
    card.innerHTML = `
      <span class="card-emoji">${item.emoji}</span>
      <span class="card-name">${item.name}</span>
    `;
    card.addEventListener("click", () => handleCardClick(item, card));
    grid.appendChild(card);
  });
}

function handleCardClick(item, cardEl) {
  if (solved || wrongIds.has(item.id)) return;

  if (item.isIntruder) {
    solved = true;
    cardEl.classList.add("correct");
    feedbackPanel.classList.remove("show");
    setTimeout(() => showWinOverlay(item), 400);
  } else {
    wrongIds.add(item.id);
    cardEl.classList.add("wrong", "shake");
    setTimeout(() => cardEl.classList.remove("shake"), 400);
    showWrongFeedback(item);
  }
}

function showWrongFeedback(item) {
  feedbackPanel.innerHTML = `
    <strong>Quase! ${item.name} também tem origem na guerra:</strong><br>
    ${item.origin}
  `;
  feedbackPanel.classList.add("show");
}

function showWinOverlay(intruderItem) {
  winTitle.textContent = `${intruderItem.emoji} ${intruderItem.name} é o Intruso!`;
  winExplanation.textContent = intruderItem.origin;

  winList.innerHTML = "";
  GAME_CONFIG.items
    .filter((item) => !item.isIntruder)
    .forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong><span class="li-emoji">${item.emoji}</span>${item.name}</strong>
        ${item.origin}
      `;
      winList.appendChild(li);
    });

  winOverlay.classList.remove("hidden");
}

playBtn.addEventListener("click", startGame);
playAgainBtn.addEventListener("click", () => {
  winOverlay.classList.add("hidden");
  initGame();
});
