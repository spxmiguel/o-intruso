/* =========================================================
   O INTRUSO — config do jogo
   Para trocar o intruso: mova "isIntruder: true" para outro item.
   Para trocar textos: edite "name" e "origin" à vontade.
   ========================================================= */

const GAME_CONFIG = {
  maxErros: 2, // quantas tentativas erradas são permitidas antes de perder (0 = só uma chance)
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
  error: document.getElementById("error-screen"),
  used: document.getElementById("used-screen"),
  start: document.getElementById("start-screen"),
  game: document.getElementById("game-screen")
};

const loadingText = document.getElementById("loading-text");
const errorMessage = document.getElementById("error-message");
const startTicketCode = document.getElementById("start-ticket-code");
const playBtn = document.getElementById("play-btn");

const grid = document.getElementById("grid");
const gameHint = document.getElementById("game-hint");
const feedbackPanel = document.getElementById("feedback-panel");

const winOverlay = document.getElementById("win-overlay");
const winTitle = document.getElementById("win-title");
const winExplanation = document.getElementById("win-explanation");
const winList = document.getElementById("win-list");
const winTicketCode = document.getElementById("win-ticket-code");

const loseOverlay = document.getElementById("lose-overlay");
const loseTitle = document.getElementById("lose-title");
const loseExplanation = document.getElementById("lose-explanation");
const loseList = document.getElementById("lose-list");

let ticketCode = null;
let ticketRef = null;
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
  ticketCode = (params.get("codigo") || "").trim().toUpperCase();

  if (!ticketCode) {
    errorMessage.textContent = "Escaneie o QR code do seu cupom pra jogar.";
    showScreen("error");
    return;
  }

  ticketRef = doc(db, "tickets", ticketCode);

  let ticketSnap;
  try {
    ticketSnap = await getDoc(ticketRef);
  } catch (err) {
    errorMessage.textContent = "Não conseguimos conectar. Verifique sua internet e recarregue a página.";
    showScreen("error");
    return;
  }

  if (!ticketSnap.exists()) {
    errorMessage.textContent = "Esse cupom não existe. Confira o código ou procure a equipe.";
    showScreen("error");
    return;
  }

  if (ticketSnap.data().usado) {
    showScreen("used");
    return;
  }

  // Reserva o cupom via transação: só o primeiro acesso simultâneo consegue.
  try {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ticketRef);
      if (!snap.exists() || snap.data().usado) {
        throw new Error("ALREADY_USED");
      }
      tx.update(ticketRef, { usado: true, jogadoEm: serverTimestamp() });
    });
  } catch (err) {
    showScreen("used");
    return;
  }

  startTicketCode.textContent = ticketCode;
  showScreen("start");
}

function startGame() {
  showScreen("game");
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

function buildOtherItemsList(listEl, excludeIntruder) {
  listEl.innerHTML = "";
  GAME_CONFIG.items
    .filter((item) => !item.isIntruder || !excludeIntruder)
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
  winTicketCode.textContent = ticketCode;
  buildOtherItemsList(winList, true);
  winOverlay.classList.remove("hidden");
}

function showLoseOverlay(lastWrongItem) {
  const intruderItem = GAME_CONFIG.items.find((item) => item.isIntruder);
  loseExplanation.textContent = `O intruso era ${intruderItem.emoji} ${intruderItem.name}: ${intruderItem.origin}`;
  buildOtherItemsList(loseList, true);
  loseOverlay.classList.remove("hidden");
}

playBtn.addEventListener("click", startGame);

init();
