/* =========================================================
   O INTRUSO — config do jogo
   Para trocar o intruso: mova "isIntruder: true" para outro item.
   Para trocar textos: edite "name" e "origin" à vontade.
   ========================================================= */

const GAME_CONFIG = {
  maxErros: 2, // quantas tentativas erradas são permitidas antes de perder (0 = só uma chance)
  masterCode: "TESTTUTS", // cupom da equipe: ilimitado, nunca é marcado como usado
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

const FIREBASE_CONFIG = {
  projectId: "o-intruso-feira",
  appId: "1:484196629049:web:49ee632e5d2c2dcd0aabe8",
  storageBucket: "o-intruso-feira.firebasestorage.app",
  apiKey: "AIzaSyC7Pn6NgJDVMUaK6Rk3oQp33aceHZGb8gU",
  authDomain: "o-intruso-feira.firebaseapp.com",
  messagingSenderId: "484196629049"
};

/* ========================================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore, doc, getDoc, updateDoc, runTransaction, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

const screens = {
  loading: document.getElementById("loading-screen"),
  entry: document.getElementById("entry-screen"),
  used: document.getElementById("used-screen"),
  start: document.getElementById("start-screen"),
  game: document.getElementById("game-screen")
};

const entryForm = document.getElementById("entry-form");
const entryInput = document.getElementById("entry-input");
const entryError = document.getElementById("entry-error");
const freePlayBtn = document.getElementById("free-play-btn");

const startTicketCode = document.getElementById("start-ticket-code");
const playBtn = document.getElementById("play-btn");

const grid = document.getElementById("grid");
const gameHint = document.getElementById("game-hint");
const modeBadge = document.getElementById("mode-badge");
const feedbackPanel = document.getElementById("feedback-panel");

const winOverlay = document.getElementById("win-overlay");
const winStamp = document.getElementById("win-stamp");
const winTitle = document.getElementById("win-title");
const winExplanation = document.getElementById("win-explanation");
const winList = document.getElementById("win-list");
const prizeBox = document.getElementById("prize-box");
const winTicketCode = document.getElementById("win-ticket-code");

const loseOverlay = document.getElementById("lose-overlay");
const loseExplanation = document.getElementById("lose-explanation");
const loseList = document.getElementById("lose-list");
const loseFooter = document.getElementById("lose-footer");

let ticketCode = null;
let ticketRef = null;
let isMaster = false;
let freePlay = false;
let solved = false;
let wrongCount = 0;
const wrongIds = new Set();

function showScreen(name) {
  Object.values(screens).forEach((el) => el.classList.add("hidden"));
  screens[name].classList.remove("hidden");
}

function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const codeFromUrl = (params.get("codigo") || "").trim().toUpperCase();

  if (codeFromUrl) {
    await validateCode(codeFromUrl);
  } else {
    showScreen("entry");
  }
}

function showEntryError(message) {
  entryError.textContent = message;
  entryError.classList.remove("hidden");
  showScreen("entry");
}

async function validateCode(code) {
  showScreen("loading");

  if (code === GAME_CONFIG.masterCode) {
    ticketCode = code;
    ticketRef = null;
    isMaster = true;
    freePlay = false;
    startTicketCode.textContent = `${code} (ilimitado)`;
    showScreen("start");
    return;
  }

  const ref = doc(db, "tickets", code);
  let ticketSnap;
  try {
    ticketSnap = await getDoc(ref);
  } catch (err) {
    showEntryError("Não conseguimos conectar. Verifique sua internet e tente de novo.");
    return;
  }

  if (!ticketSnap.exists()) {
    showEntryError(`O cupom "${code}" não existe. Confira o código ou procure a equipe.`);
    return;
  }

  if (ticketSnap.data().usado) {
    showScreen("used");
    return;
  }

  // Reserva o cupom via transação: só o primeiro acesso simultâneo consegue.
  try {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists() || snap.data().usado) {
        throw new Error("ALREADY_USED");
      }
      tx.update(ref, { usado: true, jogadoEm: serverTimestamp() });
    });
  } catch (err) {
    showScreen("used");
    return;
  }

  ticketCode = code;
  ticketRef = ref;
  isMaster = false;
  freePlay = false;
  startTicketCode.textContent = code;
  showScreen("start");
}

function startGame() {
  showScreen("game");
  modeBadge.classList.toggle("hidden", !freePlay);
  solved = false;
  wrongCount = 0;
  wrongIds.clear();
  feedbackPanel.classList.remove("show");
  feedbackPanel.textContent = "";
  updateHint();
  renderGrid();
}

function updateHint() {
  const restantes = GAME_CONFIG.maxErros - wrongCount;
  gameHint.textContent = restantes <= 0
    ? "Última chance! Toque no objeto certo."
    : `Toque no objeto que não tem origem na guerra (${restantes + 1} tentativa${restantes + 1 === 1 ? "" : "s"} restante${restantes + 1 === 1 ? "" : "s"})`;
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
    finishTicket("ganhou");
    setTimeout(() => showWinOverlay(item), 400);
  } else {
    wrongCount += 1;
    wrongIds.add(item.id);
    cardEl.classList.add("wrong", "shake");
    setTimeout(() => cardEl.classList.remove("shake"), 400);

    if (wrongCount > GAME_CONFIG.maxErros) {
      solved = true;
      finishTicket("perdeu");
      setTimeout(() => showLoseOverlay(item), 400);
    } else {
      updateHint();
      showWrongFeedback(item);
    }
  }
}

async function finishTicket(resultado) {
  // Cupom mestre e modo sem cupom não gravam nada no Firestore.
  if (isMaster || freePlay || !ticketRef) return;
  try {
    await updateDoc(ticketRef, { resultado, finalizadoEm: serverTimestamp() });
  } catch (err) {
    // Se a gravação falhar (ex: sem internet), o jogador ainda vê o resultado na tela;
    // a equipe confere manualmente pelo painel /admin se precisar.
    console.error("Falha ao salvar resultado do cupom:", err);
  }
}

function showWrongFeedback(item) {
  feedbackPanel.innerHTML = `
    <strong>Quase! ${item.name} também tem origem na guerra:</strong><br>
    ${item.origin}
  `;
  feedbackPanel.classList.add("show");
}

function buildOtherItemsList(listEl) {
  listEl.innerHTML = "";
  GAME_CONFIG.items
    .filter((item) => !item.isIntruder)
    .forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong><span class="li-emoji">${item.emoji}</span>${item.name}</strong>
        ${item.origin}
      `;
      listEl.appendChild(li);
    });
}

function showWinOverlay(intruderItem) {
  winTitle.textContent = `${intruderItem.emoji} ${intruderItem.name} é o Intruso!`;
  winExplanation.textContent = intruderItem.origin;
  buildOtherItemsList(winList);

  if (freePlay) {
    winStamp.textContent = "PARABÉNS! 🎉";
    prizeBox.classList.add("prize-box-warning");
    prizeBox.innerHTML = `
      <p class="prize-text">⚠️ Modo sem cupom — essa partida não vale bala. Foi só um teste!</p>
    `;
  } else {
    winStamp.textContent = "GANHOU! 🎉";
    prizeBox.classList.remove("prize-box-warning");
    prizeBox.innerHTML = `
      <p class="prize-text">Mostra essa tela pra equipe e pega sua bala!</p>
      <p class="prize-code">Cupom: <strong id="win-ticket-code">${ticketCode}</strong></p>
    `;
  }

  winOverlay.classList.remove("hidden");
}

function showLoseOverlay() {
  const intruderItem = GAME_CONFIG.items.find((item) => item.isIntruder);
  loseExplanation.textContent = `O intruso era ${intruderItem.emoji} ${intruderItem.name}: ${intruderItem.origin}`;
  buildOtherItemsList(loseList);
  loseFooter.textContent = freePlay
    ? "Isso foi só um teste (modo sem cupom). Pega um cupom de verdade com a equipe pra jogar valendo!"
    : "Esse cupom já foi usado. Pega um cupom novo pra tentar de novo!";
  loseOverlay.classList.remove("hidden");
}

playBtn.addEventListener("click", startGame);

entryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const code = entryInput.value.trim().toUpperCase();
  if (!code) return;
  entryError.classList.add("hidden");
  history.replaceState(null, "", `?codigo=${encodeURIComponent(code)}`);
  await validateCode(code);
});

freePlayBtn.addEventListener("click", () => {
  ticketCode = null;
  ticketRef = null;
  isMaster = false;
  freePlay = true;
  history.replaceState(null, "", window.location.pathname);
  startTicketCode.textContent = "modo teste";
  showScreen("start");
});

init();
