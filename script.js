/* =========================================================
   O INTRUSO — config do jogo
   Cada rodada tem 6 itens: 5 com origem na guerra + 1 intruso
   (marcado com isIntruder: true). Pra trocar o intruso de uma
   rodada, mova a flag pra outro item. Pra trocar textos, edite
   "name" e "origin". Imagens ficam em /images.
   ========================================================= */

const ADMIN_EMAIL = "equipe@ointruso.app"; // login fixo da equipe
// O Firebase exige senha com 6+ caracteres, então o que a equipe digita
// (ex: "tuts") é completado com esse sufixo antes de mandar pro Firebase.
// Aviso: isso é só uma tela pra digitar menos, não segurança extra — o
// segredo de verdade continua sendo só o que a equipe digita.
const ADMIN_PASSWORD_SUFFIX = "1943";

const GAME_CONFIG = {
  maxErrosPorRodada: 1, // erros permitidos antes de a rodada ser considerada errada
  rounds: [
    {
      title: "Objetos do dia a dia",
      items: [
        {
          id: "isqueiro-zippo",
          name: "Isqueiro Zippo",
          img: "images/isqueiro-zippo.jpg",
          isIntruder: false,
          origin: "Criado em 1932, mas em 1943 a fábrica parou de vender pro público e passou a produzir só pras tropas americanas. Foi aí que ganhou aquele acabamento preto fosco: o metal cromado brilhante virou munição, e sobrou só um revestimento preto mais simples. Voltou a vender pra civis depois da guerra."
        },
        {
          id: "fanta",
          name: "Fanta",
          img: "images/fanta.jpg",
          isIntruder: false,
          origin: "Foi criada em 1940 na fábrica alemã da Coca-Cola, quando o embargo comercial da guerra impediu a importação do xarope original. A solução foi inventar um refrigerante novo com o que havia disponível na época, como soro de leite e polpa de maçã."
        },
        {
          id: "microondas",
          name: "Micro-ondas",
          img: "images/microondas.jpg",
          isIntruder: false,
          origin: "Foi descoberto por acidente em 1945: um engenheiro que trabalhava com radares militares (magnetron) percebeu que uma barra de chocolate no seu bolso derreteu perto do equipamento."
        },
        {
          id: "meia-nylon",
          name: "Meia de nylon",
          img: "images/meia-nylon.jpg",
          isIntruder: false,
          origin: "As meias de nylon fizeram sucesso quando chegaram às lojas em 1940, mas assim que a guerra começou a DuPont parou de vender pro público: toda a produção virou paraquedas, cordas e outros itens militares. Só voltaram a fazer meias depois que a guerra acabou."
        },
        {
          id: "ziper",
          name: "Zíper",
          img: "images/ziper.jpg",
          isIntruder: false,
          origin: "Já era conhecido antes da guerra, mas sua fabricação em larga escala decolou por causa da alta demanda por uniformes, botas e equipamentos militares que precisavam dele."
        },
        {
          id: "qrcode",
          name: "QR Code",
          img: "images/qrcode.png",
          isIntruder: true,
          origin: "É 100% moderno: foi criado em 1994, no Japão, para rastrear peças na indústria automotiva. Não tem nenhuma relação com a Segunda Guerra Mundial."
        }
      ]
    },
    {
      title: "Comida e consumo",
      items: [
        {
          id: "mms",
          name: "M&M's",
          img: "images/mms.jpg",
          isIntruder: false,
          origin: "Criado em 1941 por Forrest Mars, inspirado nos doces com casquinha de açúcar — feita pra não derreter no calor — que ele viu soldados comerem na Guerra Civil Espanhola. Viraram parte da ração militar americana e só chegaram ao mercado civil depois da guerra."
        },
        {
          id: "cafe-soluvel",
          name: "Café solúvel",
          img: "images/cafe-soluvel.jpg",
          isIntruder: false,
          origin: "A Nescafé (criada em 1938) teve a produção multiplicada durante a guerra pra abastecer os soldados americanos com café rápido no campo de batalha — foi isso que popularizou o café instantâneo no mundo todo."
        },
        {
          id: "spam",
          name: "Spam (carne enlatada)",
          img: "images/spam.jpg",
          isIntruder: false,
          origin: "Existia desde 1937, mas só ficou mundialmente famosa por causa da guerra: foram enviadas milhões de latas pras tropas aliadas, virando sinônimo de comida enlatada em vários países até hoje."
        },
        {
          id: "chiclete",
          name: "Chiclete",
          img: "images/chiclete.jpg",
          isIntruder: false,
          origin: "A goma de mascar já existia, mas os chicletes incluídos nas rações dos soldados americanos espalharam o hábito de mascar chiclete pelo mundo, principalmente na Europa e no Japão, durante e depois da guerra."
        },
        {
          id: "oculos-aviador",
          name: "Óculos aviador",
          img: "images/oculos-aviador.jpg",
          isIntruder: false,
          origin: "Desenvolvidos pela Ray-Ban em 1936–37 pros pilotos da força aérea americana se protegerem do sol em altitude. Ficaram famosos mundialmente por fotos de generais e pilotos usando eles durante a guerra."
        },
        {
          id: "energetico",
          name: "Bebida energética",
          img: "images/energetico.jpg",
          isIntruder: true,
          origin: "As bebidas energéticas modernas (tipo as que a gente bebe hoje) só surgiram em 1987, na Áustria — décadas depois da guerra, sem nenhuma relação com ela."
        }
      ]
    },
    {
      title: "Ciência e materiais",
      items: [
        {
          id: "fita-adesiva",
          name: "Fita adesiva (duct tape)",
          img: "images/fita-adesiva.jpg",
          isIntruder: false,
          origin: "Criada em 1942 por uma divisão da Johnson & Johnson para o exército americano vedar caixas de munição contra umidade. Depois da guerra virou item básico de qualquer caixa de ferramentas."
        },
        {
          id: "super-bonder",
          name: "Cola instantânea",
          img: "images/super-bonder.jpg",
          isIntruder: false,
          origin: "O cianoacrilato foi descoberto por acaso em 1942 por um cientista tentando criar miras de fuzil transparentes pra guerra. Só virou a cola instantânea que conhecemos anos depois."
        },
        {
          id: "walkie-talkie",
          name: "Walkie-talkie",
          img: "images/walkie-talkie.jpg",
          isIntruder: false,
          origin: "Desenvolvido durante a Segunda Guerra Mundial pra comunicação de infantaria em campo de batalha — a Motorola criou um dos primeiros modelos portáteis pro exército americano. Depois da guerra, virou item comum em segurança, no trabalho e até como brinquedo."
        },
        {
          id: "acrilico",
          name: "Acrílico",
          img: "images/acrilico.jpg",
          isIntruder: false,
          origin: "Já existia desde 1933, mas a Segunda Guerra multiplicou seu uso: virou para-brisa e cúpula de avião dos dois lados do conflito, além de janela de periscópio de submarino, por ser leve e mais resistente a estilhaços que o vidro comum."
        },
        {
          id: "slinky",
          name: "Mola brinquedo (Slinky)",
          img: "images/slinky.jpg",
          isIntruder: false,
          origin: "Inventada em 1943 por um engenheiro naval que testava molas pra estabilizar equipamentos sensíveis em navios de guerra. Uma mola caiu da mesa dele, ficou 'andando' e virou um dos brinquedos mais vendidos da história."
        },
        {
          id: "velcro",
          name: "Velcro",
          img: "images/velcro.jpg",
          isIntruder: true,
          origin: "Foi inventado em 1941 — bem na época da guerra — mas não tem nenhuma relação com ela: o suíço George de Mestral teve a ideia depois de tirar carrapichos do pelo do seu cachorro numa caminhada nos Alpes. Só foi patenteado em 1955."
        }
      ]
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

/* =========================================================
   Anti-replay por impressão digital do aparelho.
   Não usa localStorage/cookies (dá pra limpar); em vez disso,
   deriva um hash de características de hardware/navegador que
   não mudam ao limpar cache, e confere no Firestore se esse
   aparelho já jogou. Bloqueio é feito no servidor, não no
   navegador do jogador.
   ========================================================= */

async function computeFingerprint() {
  const parts = [];

  parts.push(navigator.userAgent || "");
  parts.push(navigator.platform || "");
  parts.push(String(navigator.hardwareConcurrency || ""));
  parts.push(String(navigator.deviceMemory || ""));
  parts.push(navigator.language || "");
  parts.push(String(navigator.maxTouchPoints || ""));
  parts.push(`${screen.width}x${screen.height}x${screen.colorDepth}`);
  try {
    parts.push(Intl.DateTimeFormat().resolvedOptions().timeZone || "");
  } catch (e) { /* ignora */ }

  try {
    const canvas = document.createElement("canvas");
    canvas.width = 220;
    canvas.height = 40;
    const ctx = canvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.font = "16px 'Courier New'";
    ctx.fillStyle = "#5c6b3d";
    ctx.fillText("O Intruso — 1939-1945", 2, 2);
    ctx.strokeStyle = "#8b3a2f";
    ctx.strokeRect(0, 0, 219, 39);
    parts.push(canvas.toDataURL());
  } catch (e) { /* ignora */ }

  try {
    const gl = document.createElement("canvas").getContext("webgl");
    const dbg = gl && gl.getExtension("WEBGL_debug_renderer_info");
    if (gl && dbg) {
      parts.push(gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || "");
      parts.push(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "");
    }
  } catch (e) { /* ignora */ }

  const raw = parts.join("||");
  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/* ========================================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore, doc, getDoc, updateDoc, deleteDoc, runTransaction, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import {
  getAuth, signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
const auth = getAuth(app);

const screens = {
  loading: document.getElementById("loading-screen"),
  blocked: document.getElementById("blocked-screen"),
  start: document.getElementById("start-screen"),
  game: document.getElementById("game-screen"),
  final: document.getElementById("final-screen"),
  ticket: document.getElementById("ticket-screen")
};

const loadingText = document.getElementById("loading-text");
const playBtn = document.getElementById("play-btn");

const showTicketBtn = document.getElementById("show-ticket-btn");
const replayFreeBtn = document.getElementById("replay-free-btn");
const adminPinInput = document.getElementById("admin-pin-input");
const adminUnlockBtn = document.getElementById("admin-unlock-btn");
const adminUnlockMsg = document.getElementById("admin-unlock-msg");

const roundIndicator = document.getElementById("round-indicator");
const roundTitle = document.getElementById("round-title");
const gameHint = document.getElementById("game-hint");
const grid = document.getElementById("grid");
const feedbackPanel = document.getElementById("feedback-panel");

const roundOverlay = document.getElementById("round-overlay");
const roundStamp = document.getElementById("round-stamp");
const roundResultTitle = document.getElementById("round-result-title");
const roundResultExplanation = document.getElementById("round-result-explanation");
const roundResultList = document.getElementById("round-result-list");
const nextRoundBtn = document.getElementById("next-round-btn");

const finalScoreEl = document.getElementById("final-score");
const finalBreakdown = document.getElementById("final-breakdown");
const finalNote = document.getElementById("final-note");
const finalReplayBtn = document.getElementById("final-replay-btn");
const ticketSerial = document.getElementById("ticket-serial");

let deviceRef = null;
let freePlay = false;
let currentRound = 0;
let score = 0;
let roundResults = [];
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
  showScreen("loading");
  let fingerprint;
  try {
    fingerprint = await computeFingerprint();
  } catch (e) {
    loadingText.textContent = "Não conseguimos verificar o aparelho. Recarregue a página.";
    return;
  }

  deviceRef = doc(db, "device_plays", fingerprint);

  let snap;
  try {
    snap = await getDoc(deviceRef);
  } catch (e) {
    loadingText.textContent = "Sem conexão. Verifique a internet e recarregue a página.";
    return;
  }

  if (snap.exists()) {
    showBlockedScreen(snap.data());
    return;
  }

  showScreen("start");
}

function showBlockedScreen(data) {
  showScreen("blocked");
  showTicketBtn.classList.toggle("hidden", data.resultado !== "ganhou");
  adminPinInput.value = "";
  adminUnlockMsg.classList.add("hidden");
}

async function claimDeviceAndStart() {
  playBtn.disabled = true;
  freePlay = false;
  try {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(deviceRef);
      if (snap.exists()) {
        throw new Error("ALREADY_PLAYED");
      }
      tx.set(deviceRef, { bloqueadoEm: serverTimestamp(), resultado: null });
    });
  } catch (e) {
    await refreshBlockedScreen();
    return;
  }
  playBtn.disabled = false;
  startGame();
}

async function refreshBlockedScreen() {
  try {
    const snap = await getDoc(deviceRef);
    showBlockedScreen(snap.exists() ? snap.data() : { resultado: null });
  } catch (e) {
    showScreen("blocked");
  }
}

function startFreePlay() {
  freePlay = true;
  startGame();
}

function startGame() {
  currentRound = 0;
  score = 0;
  roundResults = [];
  showScreen("game");
  startRound();
}

function startRound() {
  const round = GAME_CONFIG.rounds[currentRound];
  solved = false;
  wrongCount = 0;
  wrongIds.clear();
  feedbackPanel.classList.remove("show");
  feedbackPanel.textContent = "";

  roundIndicator.textContent = `Rodada ${currentRound + 1} de ${GAME_CONFIG.rounds.length}`;
  roundTitle.textContent = round.title;
  updateHint();
  renderGrid(round);
}

function updateHint() {
  const restantes = GAME_CONFIG.maxErrosPorRodada - wrongCount;
  gameHint.textContent = restantes <= 0
    ? "Última chance! Toque no objeto certo."
    : "Toque no objeto que não tem origem na guerra.";
}

function renderGrid(round) {
  grid.innerHTML = "";
  const shuffled = shuffle(round.items);

  shuffled.forEach((item) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.dataset.id = item.id;
    card.setAttribute("aria-label", item.name);
    card.innerHTML = `
      <span class="card-image-wrap"><img class="card-image" src="${item.img}" alt="${item.name}" loading="lazy"></span>
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
    score += 1;
    roundResults.push({ title: GAME_CONFIG.rounds[currentRound].title, acertou: true });
    setTimeout(() => showRoundOverlay(item, true), 400);
  } else {
    wrongCount += 1;
    wrongIds.add(item.id);
    cardEl.classList.add("wrong", "shake");
    setTimeout(() => cardEl.classList.remove("shake"), 400);

    if (wrongCount > GAME_CONFIG.maxErrosPorRodada) {
      solved = true;
      const intruderItem = GAME_CONFIG.rounds[currentRound].items.find((i) => i.isIntruder);
      roundResults.push({ title: GAME_CONFIG.rounds[currentRound].title, acertou: false });
      setTimeout(() => showRoundOverlay(intruderItem, false), 400);
    } else {
      updateHint();
      showWrongFeedback(item);
    }
  }
}

function showWrongFeedback(item) {
  feedbackPanel.innerHTML = `
    <strong>Quase! ${item.name} também tem origem na guerra:</strong><br>
    ${item.origin}
  `;
  feedbackPanel.classList.add("show");
}

function buildOtherItemsList(round) {
  roundResultList.innerHTML = "";
  round.items
    .filter((item) => !item.isIntruder)
    .forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${item.name}</strong>${item.origin}`;
      roundResultList.appendChild(li);
    });
}

function showRoundOverlay(intruderItem, acertou) {
  const round = GAME_CONFIG.rounds[currentRound];
  roundStamp.textContent = acertou ? "ACERTOU" : "ERA ESSE";
  roundStamp.className = acertou ? "stamp-badge stamp-badge-gold" : "stamp-badge stamp-badge-red";
  roundResultTitle.textContent = `${intruderItem.name} é o Intruso!`;
  roundResultExplanation.textContent = intruderItem.origin;
  buildOtherItemsList(round);

  const isLastRound = currentRound === GAME_CONFIG.rounds.length - 1;
  nextRoundBtn.textContent = isLastRound ? "VER RESULTADO FINAL" : "PRÓXIMA RODADA";

  roundOverlay.classList.remove("hidden");
  document.body.classList.add("overlay-open");
}

function goToNextRound() {
  roundOverlay.classList.add("hidden");
  document.body.classList.remove("overlay-open");
  const isLastRound = currentRound === GAME_CONFIG.rounds.length - 1;
  if (isLastRound) {
    finishGame();
  } else {
    currentRound += 1;
    startRound();
  }
}

async function finishGame() {
  const perfeito = score === GAME_CONFIG.rounds.length;

  if (freePlay) {
    // Modo sem prêmio: nunca grava nada e nunca mostra o ticket de verdade,
    // mesmo acertando tudo.
    showFinalScreen();
    return;
  }

  const resultado = perfeito ? "ganhou" : "perdeu";
  try {
    await updateDoc(deviceRef, { resultado, finalizadoEm: serverTimestamp() });
  } catch (e) {
    console.error("Falha ao salvar resultado:", e);
  }

  if (perfeito) {
    showTicketScreen();
  } else {
    showFinalScreen();
  }
}

function showFinalScreen() {
  showScreen("final");
  finalScoreEl.textContent = `${score} de ${GAME_CONFIG.rounds.length} rodadas certas`;
  finalBreakdown.innerHTML = roundResults.map((r, i) => `
    <li class="${r.acertou ? "breakdown-ok" : "breakdown-fail"}">
      Rodada ${i + 1} — ${r.title}: ${r.acertou ? "acertou" : "errou"}
    </li>
  `).join("");

  if (freePlay) {
    finalNote.classList.add("hidden");
  } else {
    finalNote.classList.remove("hidden");
    finalNote.textContent = "Pra ganhar o ticket, era preciso acertar as 3 rodadas. Obrigado por jogar!";
  }
  finalReplayBtn.classList.toggle("hidden", !freePlay);
}

function showTicketScreen() {
  showScreen("ticket");
  const serial = deviceRef.id.slice(0, 8).toUpperCase();
  ticketSerial.textContent = serial;
}

async function handleAdminUnlock() {
  adminUnlockMsg.classList.remove("hidden");
  const password = adminPinInput.value;

  if (!password) {
    adminUnlockMsg.textContent = "Escreve a senha.";
    adminUnlockMsg.className = "admin-unlock-msg admin-unlock-error";
    return;
  }

  adminUnlockBtn.disabled = true;
  try {
    // A conferência de verdade acontece no servidor do Firebase, não aqui.
    await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password + ADMIN_PASSWORD_SUFFIX);
    await deleteDoc(deviceRef);
    adminUnlockMsg.textContent = "Desbloqueado! Recarregando...";
    adminUnlockMsg.className = "admin-unlock-msg admin-unlock-ok";
    setTimeout(() => window.location.reload(), 800);
  } catch (e) {
    adminUnlockMsg.textContent = "Senha incorreta.";
    adminUnlockMsg.className = "admin-unlock-msg admin-unlock-error";
    adminUnlockBtn.disabled = false;
  }
}

playBtn.addEventListener("click", claimDeviceAndStart);
nextRoundBtn.addEventListener("click", goToNextRound);
showTicketBtn.addEventListener("click", showTicketScreen);
replayFreeBtn.addEventListener("click", startFreePlay);
finalReplayBtn.addEventListener("click", startFreePlay);
adminUnlockBtn.addEventListener("click", handleAdminUnlock);

init();
