// Buduje wersję do druku (A3, gablota) z tych samych terminów co strona.
// Użycie: node tools/build-print.js  →  print/gablota-a3.html + documents/matura-2027-gablota-A3.pdf
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { chromium } = require("playwright");

const root = path.join(__dirname, "..");
const source = fs.readFileSync(path.join(root, "script.js"), "utf8");
const eventsCode = source.slice(source.indexOf("const events = ["), source.indexOf("];", source.indexOf("const events = [")) + 2);
const events = vm.runInNewContext(`${eventsCode.replace("const events", "var events")}; events`);
const qr = fs.readFileSync(path.join(root, "print", "qr-matura.svg"), "utf8").replace(/<\?xml[^>]*>\s*/, "").replace(/width="[^"]*" height="[^"]*"/, 'width="100%" height="100%"');

const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const rows = events.filter((event) => event.tag !== "Organizacja roku").map((event) => `
      <tr class="${event.school ? "school" : ""}">
        <td class="date"><strong>${escape(event.display)}</strong><span>${event.month}</span></td>
        <td><h3>${escape(event.title)}</h3><p>${escape(event.description)}</p></td>
        <td class="cke">${event.official ? escape(event.official.replace(/^(Ostateczny termin|Termin) CKE: /, "").replace(/\.$/, "")) : "—"}</td>
      </tr>`).join("");

const contact = `
    <div class="contact">
      <div class="contact-icon">i</div>
      <p><strong>Wszystkie sprawy związane z maturą</strong> załatwiasz u pani wicedyrektor <strong>Marzeny Filusz</strong> — gabinet 13, sekretariat dyrektora, I piętro.</p>
    </div>`;

const footer = (page) => `
    <footer>
      <div class="qr">${qr}</div>
      <div><strong>Wszystko online: matura.szkolamistrzow.info</strong><p>Zeskanuj kod telefonem — tam znajdziesz formularze, aktualne terminy i materiały do nauki.</p></div>
      <span>Szkoła Mistrzów · ZSZ nr 5 we Wrocławiu · strona ${page}/2</span>
    </footer>`;

const html = `<!doctype html>
<html lang="pl">
<head>
<meta charset="UTF-8" />
<title>Matura 2027 — gablota A3</title>
<style>
  @page { size: A3 portrait; margin: 14mm; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; color: #111; font-family: "Inter", "Liberation Sans", sans-serif; font-size: 13.5pt; line-height: 1.35; }
  .page { display: flex; flex-direction: column; height: 391mm; overflow: hidden; page-break-after: always; }
  .page:last-child { page-break-after: auto; }
  header { display: flex; align-items: center; justify-content: space-between; gap: 10mm; padding-bottom: 4mm; border-bottom: 1.2mm solid #111; }
  header img { width: 112mm; }
  header h1 { margin: 0; font-size: 30pt; line-height: 1; letter-spacing: -.02em; text-align: right; }
  header h1 span { display: block; margin-top: 2mm; font-size: 15pt; font-weight: 600; letter-spacing: 0; }
  mark { padding: 0 1.5mm; background: #f5c400; color: #111; }
  .contact { display: flex; align-items: center; gap: 6mm; margin: 5mm 0 4mm; padding: 4mm 6mm; border: .8mm solid #111; border-radius: 4mm; background: #fff6cc; }
  .contact-icon { display: grid; flex: 0 0 auto; place-items: center; width: 13mm; height: 13mm; border: .6mm solid #111; border-radius: 50%; background: #f5c400; font-size: 20pt; font-weight: 800; }
  .contact p { margin: 0; font-size: 15pt; line-height: 1.35; }
  .note { margin: 0 0 2mm; font-size: 11.5pt; }
  table { width: 100%; border-collapse: collapse; }
  th { padding: 1.5mm 3mm; border-bottom: .6mm solid #111; font-size: 10.5pt; letter-spacing: .08em; text-align: left; text-transform: uppercase; }
  td { padding: 1.4mm 3mm; border-bottom: .25mm solid #c9bd86; vertical-align: top; }
  td h3 { margin: 0 0 .4mm; font-size: 12.5pt; line-height: 1.2; }
  td p { margin: 0; color: #2b2a26; font-size: 10pt; line-height: 1.27; }
  td.date { width: 40mm; }
  td.date strong { display: inline-block; font-size: 14pt; white-space: nowrap; }
  td.date span { display: block; color: #555; font-size: 10pt; }
  td.cke { width: 40mm; font-size: 11.5pt; font-weight: 700; }
  tr.school td.date strong { padding: .4mm 2mm; border-radius: 1.5mm; background: #f5c400; }
  tr.school td { background: #fffbe6; }
  .legend { display: flex; gap: 8mm; margin-top: 2mm; font-size: 11pt; }
  .legend b { padding: .3mm 2mm; border-radius: 1.5mm; background: #f5c400; }
  h2 { margin: 5mm 0 2.5mm; font-size: 22pt; letter-spacing: -.01em; }
  .docs { display: grid; gap: 2mm; }
  .doc { display: grid; grid-template-columns: 15mm 1fr 52mm; gap: 5mm; align-items: start; padding: 2.8mm 4mm; border: .35mm solid #c9bd86; border-radius: 3mm; }
  .doc-icon { display: grid; place-items: center; height: 15mm; border: .5mm solid #111; border-radius: 2mm; background: #f5c400; font-size: 15pt; font-weight: 800; }
  .doc h3 { margin: 0 0 1mm; font-size: 13.5pt; line-height: 1.25; }
  .doc p { margin: 0; color: #2b2a26; font-size: 11pt; line-height: 1.32; }
  .doc .when { text-align: right; font-size: 10.5pt; }
  .doc .when strong { display: inline-block; margin: .5mm 0; padding: .4mm 2mm; border-radius: 1.5mm; background: #f5c400; font-size: 12.5pt; }
  .adj { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5mm; }
  .adj div { padding: 2.5mm 4mm; border-radius: 3mm; background: #fff6cc; font-size: 11pt; line-height: 1.3; }
  .adj b { display: block; font-size: 12pt; }
  .adj-note { margin: 3mm 0 0; font-size: 11pt; }
  .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm; }
  .steps div { padding: 3.5mm 4mm; border: .5mm solid #111; border-radius: 3mm; background: #f5c400; font-size: 11pt; line-height: 1.3; }
  .steps b { display: block; margin-bottom: 1mm; font-size: 13pt; }
  footer { display: flex; align-items: center; gap: 6mm; margin-top: auto; padding-top: 4mm; border-top: .6mm solid #111; }
  .qr { flex: 0 0 auto; width: 30mm; height: 30mm; }
  .qr svg { display: block; }
  footer strong { font-size: 15pt; }
  footer p { margin: 1mm 0 0; font-size: 11.5pt; }
  footer > span { margin-left: auto; align-self: flex-end; color: #555; font-size: 9.5pt; white-space: nowrap; }
</style>
</head>
<body>
  <section class="page">
    <header>
      <img src="../assets/brand/logo-matura-2027.png" alt="Szkoła Mistrzów — Matura 2027" />
      <h1>Ważne <mark>terminy</mark><span>Matura 2027 w ZSZ5 — rok szkolny 2026/2027</span></h1>
    </header>
    ${contact}
    <p class="note"><strong>Terminy szkolne są wcześniejsze niż terminy CKE.</strong> Szkoła musi sprawdzić dokumenty, przygotować dostosowania i w razie potrzeby przekierować zdających do innej szkoły.</p>
    <table>
      <thead><tr><th>Kiedy</th><th>Co</th><th>Termin CKE</th></tr></thead>
      <tbody>${rows}
      </tbody>
    </table>
    <div class="legend"><span><b>żółte tło</b> = termin szkolny ZSZ5</span><span>Deklarację składasz tylko elektronicznie w ZIU.</span></div>
    ${footer(1)}
  </section>

  <section class="page">
    <header>
      <img src="../assets/brand/logo-matura-2027.png" alt="Szkoła Mistrzów — Matura 2027" />
      <h1>Dokumenty i <mark>dostosowania</mark><span>Formularze pobierzesz ze strony — zeskanuj kod QR</span></h1>
    </header>
    ${contact}
    <div class="docs">
      <div class="doc"><div class="doc-icon">1a</div><div><h3>Deklaracja przystąpienia do egzaminu maturalnego</h3><p>Składasz ją tylko elektronicznie w ZIU — nie składasz wersji papierowej. Potem wydrukuj z ZIU oświadczenie o złożeniu deklaracji i zanieś je do sekretariatu dyrektora; poproś o potwierdzenie dostarczenia.</p></div><div class="when">Termin w szkole<br /><strong>do 15 stycznia 2027</strong><br />CKE: 8 lutego 2027</div></div>
      <div class="doc"><div class="doc-icon">—</div><div><h3>Dokumenty uprawniające do dostosowań</h3><p>Składasz je razem z deklaracją, jeśli potrzebujesz zmiany warunków lub formy egzaminu.</p></div><div class="when">Termin w szkole<br /><strong>do 15 stycznia 2027</strong><br />CKE: 8 lutego 2027</div></div>
      <div class="doc"><div class="doc-icon">5c</div><div><h3>Informacja o rezygnacji z przystąpienia do egzaminu z przedmiotu dodatkowego</h3><p>Dla osób z dyplomem zawodowym na poziomie technika albo certyfikatami ze wszystkich kwalifikacji w zawodzie. Dotyczy także absolwentów z lat ubiegłych.</p></div><div class="when">Termin w szkole<br /><strong>do 9 kwietnia 2027</strong><br />CKE: 20 kwietnia 2027</div></div>
      <div class="doc"><div class="doc-icon">6</div><div><h3>Wniosek o termin dodatkowy</h3><p>Gdy ważna, udokumentowana przyczyna losowa lub zdrowotna uniemożliwia udział w egzaminie w terminie głównym. Zgłoś się do szkoły od razu.</p></div><div class="when">Termin<br /><strong>najpóźniej w dniu egzaminu</strong></div></div>
      <div class="doc"><div class="doc-icon">7</div><div><h3>Oświadczenie o przystąpieniu do egzaminu maturalnego w terminie poprawkowym</h3><p>Gdy nie zdasz egzaminu z jednego przedmiotu obowiązkowego. Nie czekaj do ostatniego dnia — trwają wakacje.</p></div><div class="when">Termin CKE<br /><strong>do 16 lipca 2027</strong></div></div>
    </div>

    <h2>Dostosowania — kto i na jakiej podstawie</h2>
    <div class="adj">
      <div><b>Orzeczenie o potrzebie kształcenia specjalnego</b>niepełnosprawność, niedostosowanie społeczne → orzeczenie poradni</div>
      <div><b>Indywidualne nauczanie</b>→ orzeczenie o potrzebie indywidualnego nauczania</div>
      <div><b>Choroba lub niesprawność czasowa</b>→ zaświadczenie lekarza</div>
      <div><b>Dysleksja, dysgrafia, dysortografia, dyskalkulia</b>→ opinia poradni psychologiczno-pedagogicznej</div>
      <div><b>Pomoc psychologiczno-pedagogiczna w szkole w 2026/2027</b>sytuacja kryzysowa, trudności po nauce za granicą, zaburzenia komunikacji → pozytywna opinia rady pedagogicznej</div>
      <div><b>Zaburzenie widzenia barw</b>→ zaświadczenie lekarza</div>
    </div>
    <p class="adj-note">Zaświadczenie lekarskie nie oznacza automatycznie np. wydłużenia czasu — decyzję podejmuje rada pedagogiczna. Indywidualne przypadki rozpatrujemy osobno.</p>

    <h2>Gdy na egzaminie masz pustkę w głowie</h2>
    <div class="steps">
      <div><b>1. STOP</b>Odłóż długopis na kilka sekund. Rozluźnij szczękę i barki.</div>
      <div><b>2. ODDECH</b>Trzy spokojne wydechy, każdy trochę dłuższy od wdechu.</div>
      <div><b>3. ŁATWY PUNKT</b>Przejdź do zadania, które umiesz rozpocząć.</div>
      <div><b>4. POWRÓT</b>Wróć później i zapisz choćby dane, wzór lub plan.</div>
    </div>
    ${footer(2)}
  </section>
</body>
</html>`;

const htmlPath = path.join(root, "print", "gablota-a3.html");
fs.writeFileSync(htmlPath, html);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`);
  await page.waitForLoadState("networkidle");
  await page.emulateMedia({ media: "print" });
  const fits = await page.$$eval(".page", (pages) => pages.map((p) => [p.scrollHeight, p.clientHeight]));
  fits.forEach(([content, box], i) => { if (content > box) console.warn(`Uwaga: strona ${i + 1} się nie mieści (${content}px > ${box}px)`); });
  await page.pdf({ path: path.join(root, "documents", "matura-2027-gablota-A3.pdf"), format: "A3", printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log("Gotowe: documents/matura-2027-gablota-A3.pdf");
})();
