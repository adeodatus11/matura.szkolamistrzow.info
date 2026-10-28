const events = [
  { start: "2026-09-01", end: "2027-09-10", display: "Cały rok", month: "2026/2027", title: "Odbierz dane do systemu ZIU-SIOEO", description: "Odbierz od dyrektora szkoły login i hasło. W systemie możesz złożyć deklarację elektronicznie.", category: "formalnosci", tag: "Formalności" },
  { start: "2027-01-18", end: "2027-01-31", display: "18–31 stycznia", month: "2027", title: "Ferie zimowe", description: "Przerwa zimowa w województwie dolnośląskim i opolskim.", category: "formalnosci", tag: "Organizacja roku", featured: false },
  { start: "2027-02-07", display: "do 7 lutego", month: "2027", title: "Złóż deklarację maturalną", description: "Przekaż dyrektorowi deklarację egzaminacyjną oraz dokumenty uprawniające do dostosowania warunków i form egzaminu.", category: "formalnosci", tag: "Ważny termin" },
  { start: "2027-02-15", end: "2027-02-28", display: "15–28 lutego", month: "2027", title: "Sprawdź dane przekazane do OKE", description: "Zweryfikuj poprawność danych z deklaracji i podpisz potwierdzenie ich zgodności.", category: "formalnosci", tag: "Formalności" },
  { start: "2027-03-04", display: "do 4 marca", month: "2027", title: "Harmonogram egzaminów ustnych", description: "Szkoła ogłasza własny harmonogram części ustnej egzaminu maturalnego.", category: "egzaminy", tag: "Harmonogram" },
  { start: "2027-04-20", display: "20 kwietnia", month: "2027", title: "Ostatnie zmiany i rezygnacje", description: "Termin zmiany przedmiotu po sukcesie w olimpiadzie oraz rezygnacji z dodatkowych rozszerzeń przez osoby z odpowiednim dyplomem zawodowym.", category: "formalnosci", tag: "Formalności" },
  { start: "2027-04-30", display: "30 kwietnia", month: "2027", title: "Zakończenie roku szkolnego", description: "Ostatni dzień zajęć w klasach maturalnych. Od teraz pełne skupienie na egzaminach.", category: "formalnosci", tag: "Koniec szkoły" },
  { start: "2027-05-04", end: "2027-05-24", display: "4–24 maja", month: "2027", title: "Pisemne egzaminy maturalne", description: "Część pisemna według szczegółowego harmonogramu ustalonego przez dyrektora CKE.", category: "egzaminy", tag: "Sesja główna" },
  { start: "2027-05-07", end: "2027-05-29", display: "7–29 maja", month: "2027", title: "Ustny egzamin z języka polskiego", description: "Egzaminy odbywają się 7–8, 10–13, 17–22, 24–26 oraz 28–29 maja według harmonogramu szkoły.", category: "egzaminy", tag: "Sesja główna" },
  { start: "2027-05-06", end: "2027-05-31", display: "6–31 maja", month: "2027", title: "Pozostałe egzaminy ustne", description: "Języki obce nowożytne, mniejszości narodowych, język łemkowski i kaszubski. Bez 9, 16, 23, 27 i 30 maja.", category: "egzaminy", tag: "Sesja główna" },
  { start: "2027-06-01", end: "2027-06-16", display: "1–16 czerwca", month: "2027", title: "Dodatkowe egzaminy pisemne", description: "Termin dla zdających, którzy otrzymali zgodę dyrektora OKE.", category: "egzaminy", tag: "Termin dodatkowy" },
  { start: "2027-06-07", end: "2027-06-09", display: "7–9 czerwca", month: "2027", title: "Dodatkowe egzaminy ustne", description: "Termin dla zdających, którzy otrzymali zgodę dyrektora OKE.", category: "egzaminy", tag: "Termin dodatkowy" },
  { start: "2027-07-09", display: "9 lipca", month: "2027", title: "Wyniki matur", description: "Odbierz świadectwo dojrzałości i sprawdź wyniki w serwisie maturzysty.", category: "wyniki", tag: "Wyniki" },
  { start: "2027-07-16", display: "do 16 lipca", month: "2027", title: "Zgłoszenie do poprawki", description: "Złóż dyrektorowi szkoły pisemne oświadczenie o przystąpieniu do egzaminu poprawkowego.", category: "wyniki", tag: "Poprawka" },
  { start: "2027-08-10", display: "do 10 sierpnia", month: "2027", title: "Miejsce egzaminu poprawkowego", description: "OKE publikuje informację o miejscu przeprowadzenia egzaminów poprawkowych.", category: "wyniki", tag: "Poprawka" },
  { start: "2027-08-23", display: "23 sierpnia", month: "2027", title: "Pisemny egzamin poprawkowy", description: "Termin pisemnej części egzaminu poprawkowego.", category: "wyniki", tag: "Poprawka" },
  { start: "2027-08-24", display: "24 sierpnia", month: "2027", title: "Ustny egzamin poprawkowy", description: "Termin ustnej części egzaminu poprawkowego.", category: "wyniki", tag: "Poprawka" },
  { start: "2027-09-10", display: "10 września", month: "2027", title: "Wyniki sesji poprawkowej", description: "Odbierz świadectwo dojrzałości i sprawdź wynik w serwisie maturzysty.", category: "wyniki", tag: "Wyniki" }
];

const timeline = document.querySelector("#timeline");
const now = new Date();

function localDate(dateString, endOfDay = false) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0);
}

function renderTimeline() {
  timeline.innerHTML = events.map((event) => {
    const isPast = localDate(event.end || event.start, true) < now;
    const isCurrent = localDate(event.start) <= now && localDate(event.end || event.start, true) >= now;
    return `
      <article class="event${isPast ? " past" : ""}${isCurrent ? " current" : ""}" data-category="${event.category}">
        <div class="event-date"><strong>${event.display}</strong><span>${event.month}</span></div>
        <div class="event-node" aria-hidden="true"></div>
        <div class="event-content"><h3>${event.title}</h3><p>${event.description}</p><span class="event-tag">${event.tag}</span></div>
      </article>`;
  }).join("");
}

function getNextEvent() {
  const featuredEvents = events.filter((event) => event.featured !== false);
  return featuredEvents.find((event) => localDate(event.start) > now) || featuredEvents.find((event) => localDate(event.end || event.start, true) >= now) || featuredEvents[featuredEvents.length - 1];
}

const nextEvent = getNextEvent();
document.querySelector("#next-date").textContent = `${nextEvent.display} ${nextEvent.month}`;
document.querySelector("#next-title").textContent = nextEvent.title;
document.querySelector("#next-description").textContent = nextEvent.description;
document.querySelector("#next-badge").textContent = nextEvent.tag;

function updateCountdown() {
  const current = new Date();
  const target = localDate(nextEvent.start);
  const difference = Math.max(0, target - current);
  document.querySelector("#count-days").textContent = Math.floor(difference / 86400000);
  document.querySelector("#count-hours").textContent = Math.floor((difference % 86400000) / 3600000).toString().padStart(2, "0");
  document.querySelector("#count-minutes").textContent = Math.floor((difference % 3600000) / 60000).toString().padStart(2, "0");
}

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const selected = button.dataset.filter;
    let visible = 0;
    document.querySelectorAll(".event").forEach((event) => {
      event.hidden = selected !== "all" && event.dataset.category !== selected;
      if (!event.hidden) visible += 1;
    });
    document.querySelector("#empty-state").hidden = visible > 0;
  });
});

document.querySelector("#copy-next").addEventListener("click", async () => {
  const text = `${nextEvent.display} ${nextEvent.month} — ${nextEvent.title}: ${nextEvent.description}`;
  try {
    await navigator.clipboard.writeText(text);
    const toast = document.querySelector("#toast");
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
  } catch {
    window.prompt("Skopiuj termin:", text);
  }
});

renderTimeline();
updateCountdown();
setInterval(updateCountdown, 60000);
