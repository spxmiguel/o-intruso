/* =========================================================
   Gerador de cupons — O Intruso
   Roda uma vez, antes da feira. Cria N códigos únicos no
   Firestore (coleção "tickets") e uma folha HTML pra imprimir,
   com QR code + código, em grade estilo cartão de visita.

   Uso:
     cd tools
     npm install
     node generate-tickets.js [quantidade]

   Variáveis de ambiente opcionais:
     SERVICE_ACCOUNT_PATH  caminho pro serviceAccountKey.json
     GAME_URL_BASE         URL base do jogo publicado
   ========================================================= */

const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
const QRCode = require("qrcode");

const QUANTIDADE = parseInt(process.argv[2], 10) || 150;
const GAME_URL_BASE = process.env.GAME_URL_BASE || "https://spxmiguel.github.io/o-intruso/";
const DISPLAY_URL = GAME_URL_BASE.replace(/^https?:\/\//, "").replace(/\/$/, "");
const SERVICE_ACCOUNT_PATH = process.env.SERVICE_ACCOUNT_PATH
  || path.join(__dirname, "..", "..", "o-intruso-admin-secrets", "serviceAccountKey.json");

// Sem 0/O, 1/I/L pra evitar confusão na hora de digitar o código à mão.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 6;

const OUTPUT_DIR = path.join(__dirname, "..", "..", "o-intruso-cupons-impressos");

function generateCode() {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

function generateUniqueCodes(count) {
  const codes = new Set();
  while (codes.size < count) {
    codes.add(generateCode());
  }
  return Array.from(codes);
}

async function validateTickets(db, codes) {
  console.log("Validando cada cupom gravado no Firestore...");
  const problems = [];
  const CHUNK_SIZE = 300; // limite do getAll/in-query fica seguro nesse tamanho
  for (let i = 0; i < codes.length; i += CHUNK_SIZE) {
    const chunk = codes.slice(i, i + CHUNK_SIZE);
    const refs = chunk.map((code) => db.collection("tickets").doc(code));
    const snaps = await db.getAll(...refs);
    snaps.forEach((snap, idx) => {
      const code = chunk[idx];
      if (!snap.exists) {
        problems.push(`${code}: documento não encontrado`);
        return;
      }
      const data = snap.data();
      if (data.usado !== false) {
        problems.push(`${code}: campo "usado" inesperado (${JSON.stringify(data.usado)})`);
      }
      if (data.resultado !== null) {
        problems.push(`${code}: campo "resultado" inesperado (${JSON.stringify(data.resultado)})`);
      }
    });
    console.log(`  ${Math.min(i + CHUNK_SIZE, codes.length)}/${codes.length} cupons validados...`);
  }
  return problems;
}

async function writeTicketsToFirestore(db, codes) {
  // Firestore permite no máximo 500 operações por batch.
  const CHUNK_SIZE = 400;
  for (let i = 0; i < codes.length; i += CHUNK_SIZE) {
    const chunk = codes.slice(i, i + CHUNK_SIZE);
    const batch = db.batch();
    chunk.forEach((code) => {
      const ref = db.collection("tickets").doc(code);
      batch.set(ref, {
        usado: false,
        resultado: null,
        criadoEm: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    await batch.commit();
    console.log(`  ${Math.min(i + CHUNK_SIZE, codes.length)}/${codes.length} cupons gravados no Firestore...`);
  }
}

async function buildPrintableSheet(codes) {
  const cardsHtml = [];

  for (const code of codes) {
    const url = `${GAME_URL_BASE}?codigo=${code}`;
    const qrDataUrl = await QRCode.toDataURL(url, {
      margin: 1,
      width: 220,
      color: { dark: "#3a2e1e", light: "#f4ead2" }
    });
    cardsHtml.push(`
      <div class="cupom">
        <div class="cupom-inner">
          <p class="cupom-selo">O INTRUSO</p>
          <img class="cupom-qr" src="${qrDataUrl}" alt="QR code do cupom ${code}">
          <p class="cupom-codigo">${code}</p>
          <p class="cupom-site">${DISPLAY_URL}</p>
          <p class="cupom-rodape">Feira de Ciências — escaneie ou digite o código</p>
        </div>
      </div>
    `);
  }

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Cupons — O Intruso (${codes.length})</title>
<style>
  @page { size: A4; margin: 10mm; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Courier New', Courier, monospace;
    background: #ecdfc0;
    margin: 0;
    padding: 10mm;
  }
  .info {
    margin: 0 0 10mm;
    color: #3a2e1e;
    font-size: 12px;
  }
  .info strong { color: #5c6b3d; }
  .folha {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5mm;
  }
  .cupom {
    border: 2px solid #3a2e1e;
    border-radius: 4mm;
    box-shadow: 0 0 0 2mm #d9c79c;
    background: #f4ead2;
    padding: 3mm;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .cupom-inner {
    border: 1px dashed #b8912f;
    border-radius: 2mm;
    padding: 3mm;
    text-align: center;
  }
  .cupom-selo {
    font-size: 8px;
    letter-spacing: 2px;
    color: #8b3a2f;
    border: 1px solid #8b3a2f;
    border-radius: 2mm;
    display: inline-block;
    padding: 1mm 3mm;
    margin: 0 0 2mm;
    transform: rotate(-2deg);
    font-weight: bold;
  }
  .cupom-qr {
    width: 28mm;
    height: 28mm;
    display: block;
    margin: 0 auto 2mm;
  }
  .cupom-codigo {
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 3px;
    color: #3e4a28;
    margin: 0 0 1mm;
  }
  .cupom-site {
    font-size: 8px;
    letter-spacing: 0.5px;
    color: #5c6b3d;
    margin: 0 0 1.5mm;
    font-weight: bold;
  }
  .cupom-rodape {
    font-size: 6px;
    letter-spacing: 0.5px;
    color: #6b5a3f;
    margin: 0;
    text-transform: uppercase;
  }
  @media print {
    body { background: white; }
    .info { display: none; }
  }
</style>
</head>
<body>
  <p class="info">
    <strong>${codes.length} cupons gerados</strong> — ${new Date().toLocaleString("pt-BR")}.
    Use Cmd/Ctrl+P para imprimir ou salvar como PDF. Cada retângulo é um cupom individual — recorte pela borda.
  </p>
  <div class="folha">
    ${cardsHtml.join("\n")}
  </div>
</body>
</html>`;

  return html;
}

async function main() {
  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error(`Não encontrei a chave de serviço em: ${SERVICE_ACCOUNT_PATH}`);
    console.error("Defina SERVICE_ACCOUNT_PATH ou coloque o arquivo no caminho padrão.");
    process.exit(1);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf8"));
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  const db = admin.firestore();

  console.log(`Gerando ${QUANTIDADE} códigos únicos...`);
  const codes = generateUniqueCodes(QUANTIDADE);

  console.log("Gravando cupons no Firestore...");
  await writeTicketsToFirestore(db, codes);

  const problems = await validateTickets(db, codes);
  if (problems.length > 0) {
    console.error(`\nEncontrei ${problems.length} problema(s) na validação:`);
    problems.forEach((p) => console.error(`  - ${p}`));
    console.error("\nAbortando antes de gerar a folha pra impressão. Nenhum arquivo foi criado.");
    process.exit(1);
  }
  console.log(`Validação ok: todos os ${codes.length} cupons existem no Firestore com "usado: false".`);

  console.log("Montando folha pra impressão (com QR codes)...");
  const html = await buildPrintableSheet(codes);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outputPath = path.join(OUTPUT_DIR, `cupons-${stamp}.html`);
  fs.writeFileSync(outputPath, html, "utf8");

  console.log("\nPronto!");
  console.log(`  ${QUANTIDADE} cupons criados no Firestore (coleção "tickets").`);
  console.log(`  Folha pra imprimir: ${outputPath}`);
  console.log("  Abra esse arquivo no navegador e use Cmd/Ctrl+P para imprimir ou salvar em PDF.");

  process.exit(0);
}

main().catch((err) => {
  console.error("Erro ao gerar cupons:", err);
  process.exit(1);
});
