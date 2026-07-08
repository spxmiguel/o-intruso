const FIREBASE_CONFIG = {
  projectId: "o-intruso-feira",
  appId: "1:484196629049:web:49ee632e5d2c2dcd0aabe8",
  storageBucket: "o-intruso-feira.firebasestorage.app",
  apiKey: "AIzaSyC7Pn6NgJDVMUaK6Rk3oQp33aceHZGb8gU",
  authDomain: "o-intruso-feira.firebaseapp.com",
  messagingSenderId: "484196629049"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore, collection, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const db = getFirestore(app);

const loginScreen = document.getElementById("login-screen");
const panelScreen = document.getElementById("panel-screen");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");
const searchInput = document.getElementById("search-input");
const filterSelect = document.getElementById("filter-select");
const ticketsBody = document.getElementById("tickets-body");
const statsEl = document.getElementById("admin-stats");

let allTickets = [];
let unsubscribeTickets = null;

function statusOf(ticket) {
  if (!ticket.usado) return "nao-usado";
  if (ticket.resultado === "ganhou") return "ganhou";
  if (ticket.resultado === "perdeu") return "perdeu";
  return "jogando";
}

const STATUS_LABEL = {
  "nao-usado": "Não usado",
  "jogando": "Jogando",
  "ganhou": "Ganhou",
  "perdeu": "Perdeu"
};

function formatTimestamp(ts) {
  if (!ts) return "—";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleString("pt-BR");
}

function render() {
  const searchTerm = searchInput.value.trim().toUpperCase();
  const filter = filterSelect.value;

  const filtered = allTickets.filter((t) => {
    const status = statusOf(t);
    if (filter !== "todos" && status !== filter) return false;
    if (searchTerm && !t.id.includes(searchTerm)) return false;
    return true;
  });

  ticketsBody.innerHTML = filtered.map((t) => {
    const status = statusOf(t);
    return `
      <tr>
        <td class="code-cell">${t.id}</td>
        <td><span class="status-badge status-${status}">${STATUS_LABEL[status]}</span></td>
        <td>${formatTimestamp(t.criadoEm)}</td>
        <td>${formatTimestamp(t.jogadoEm)}</td>
        <td>${formatTimestamp(t.finalizadoEm)}</td>
      </tr>
    `;
  }).join("");

  const counts = { "nao-usado": 0, "jogando": 0, "ganhou": 0, "perdeu": 0 };
  allTickets.forEach((t) => { counts[statusOf(t)] += 1; });

  statsEl.innerHTML = `
    <div class="stat-card"><span class="stat-value">${allTickets.length}</span><span class="stat-label">Total</span></div>
    <div class="stat-card"><span class="stat-value">${counts["nao-usado"]}</span><span class="stat-label">Não usados</span></div>
    <div class="stat-card"><span class="stat-value">${counts["jogando"]}</span><span class="stat-label">Jogando</span></div>
    <div class="stat-card"><span class="stat-value">${counts["ganhou"]}</span><span class="stat-label">Ganharam</span></div>
    <div class="stat-card"><span class="stat-value">${counts["perdeu"]}</span><span class="stat-label">Perderam</span></div>
  `;
}

function startListening() {
  unsubscribeTickets = onSnapshot(collection(db, "tickets"), (snap) => {
    allTickets = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => a.id.localeCompare(b.id));
    render();
  }, (err) => {
    console.error("Erro ao carregar cupons:", err);
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginScreen.classList.add("hidden");
    panelScreen.classList.remove("hidden");
    startListening();
  } else {
    panelScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
    if (unsubscribeTickets) {
      unsubscribeTickets();
      unsubscribeTickets = null;
    }
    allTickets = [];
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.classList.add("hidden");
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    loginError.textContent = "E-mail ou senha incorretos.";
    loginError.classList.remove("hidden");
  }
});

logoutBtn.addEventListener("click", () => signOut(auth));
searchInput.addEventListener("input", render);
filterSelect.addEventListener("change", render);
