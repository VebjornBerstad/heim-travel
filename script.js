// The brief form writes to this address.
const CONTACT_EMAIL = 'hei@heimtravel.no';

const NO = {
  'skip': 'Hopp til innhold',
  'nav.inspiration': 'Inspirasjon',
  'nav.story': 'Vår historie',
  'nav.contact': 'Kontakt',
  'h1.a': 'Heim er en følelse,',
  'h1.b': 'ikke et sted.',
  'lede': 'Heim Travel planlegger incentivreiser, møter og arrangementer for bedrifter. Vi begynner med hva dere vil oppnå og hvem dere tar med, og legger til rette for at alle skal føle seg heime.',
  'lede.note': 'Dere møter opp. Vi har tenkt på resten.',
  'cta': 'Start en samtale med oss',
  'film.alt': 'En kort film med norske landskap, middager og samlinger',
  'i.title': 'Inspirasjon, etter formål',
  'i.intro': 'Et bedriftsarrangement har en jobb å gjøre. Dette er utgangspunkter, sortert etter hva dere vil oppnå. Stedet kommer senere.',
  'i.a.alt': 'Et langbord dekket til middag inne i et drivhus',
  'i.a.t': 'For å feire',
  'i.a.p': 'Året er over, og de som bar det, skal merke at det ble sett.',
  'i.b.alt': 'Et rundt bord dekket med vinglass i skinnet fra en lav lampe, med stoler trukket inntil',
  'i.b.t': 'For å ta beslutninger',
  'i.b.p': 'En ledergruppe med spørsmål og nok tid til å svare på dem.',
  'i.c.alt': 'En gruppe sett bakfra, samlet på en rygg over et skyhav i solnedgang',
  'i.c.t': 'For å samle teamet',
  'i.c.p': 'Kolleger som vanligvis møtes på skjerm, med tid til å bli et lag.',
  'i.d.alt': 'Et langbord dekket til middag med blomster og levende lys, i et mørkt rom',
  'i.d.t': 'For å invitere kundene',
  'i.d.p': 'De viktigste kundene deres, tatt så godt imot at de husker hvem som inviterte.',
  's.alt': 'Et saueskinn på en benk under småruta vindu i et gammelt tømmerhus, med gårdshus i tømmer utenfor',
  's.title': 'Heim betyr hjem.',
  's.p1': 'Heim er ordet for hjem, og for følelsen av å være der: noen venter deg, noen har tenkt på hva du trenger, og du kan være deg selv.',
  's.p2': 'Den følelsen vil vi gi menneskene dere tar med. Vi tror at mennesker som føler seg hjemme, snakker mer åpent, blir sittende lenger ved bordet og husker hvem de var sammen med. Enten det er en kickoff, en incentivreise eller et kundearrangement, blir det bedre av det.',
  's.p3': 'Derfor starter vi hvert prosjekt med å lytte. Før noen velger sted, vil vi vite hvem som kommer, hvorfor dere samler dem, og hva som skal være annerledes etterpå. Norge er der vi bor og arbeider. Hvor vi tar dere med, avhenger av hva vi hører.',
  's.p4': 'Heim Travel er grunnlagt av Marie Salthella Fagerhaug og Oda Marie Buraas. Begge holder til i Oslo.',
  'c.title': 'Fortell oss om menneskene deres.',
  'c.intro': 'Noen få linjer holder. Legg merke til at vi ikke spør hvor.',
  'c.name': 'Navn',
  'c.company': 'Selskap',
  'c.occasion': 'Hva er anledningen?',
  'c.goal': 'Hva skal det oppnå?',
  'c.send': 'Skriv e-posten',
  'c.direct': 'Eller kontakt oss direkte',
  'c.email': 'E-post',
  'c.phone': 'Telefon',
  'c.address': 'Adresse',
  'c.addr': 'Rosenborggata 8, 0356 Oslo',
  'f.org': 'Org.nr. 938 650 896',
};

const MSG = {
  en: {
    play: 'Play film',
    pause: 'Pause film',
    nameMissing: 'Please tell us your name.',
    occasionMissing: 'Please tell us what the occasion is.',
    opened: 'Your email app should now have your brief ready to send. If nothing opened, write to ',
    subject: 'A brief for Heim Travel',
    labels: { name: 'Name', company: 'Company', occasion: 'The occasion', goal: 'What it must achieve' },
    title: 'Heim Travel',
  },
  no: {
    play: 'Spill av filmen',
    pause: 'Stopp filmen',
    nameMissing: 'Fortell oss hva du heter.',
    occasionMissing: 'Fortell oss hva anledningen er.',
    opened: 'E-postprogrammet ditt skal nå ha briefen klar til sending. Hvis ingenting åpnet seg, skriv til ',
    subject: 'En brief til Heim Travel',
    labels: { name: 'Navn', company: 'Selskap', occasion: 'Anledningen', goal: 'Hva det skal oppnå' },
    title: 'Heim Travel',
  },
};

const root = document.documentElement;
const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (v) => Math.min(Math.max(v, 0), 1);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

// Language: English lives in the markup and is remembered on first read

const STORAGE_KEY = 'heim-lang';
const EN = {};
let lang = 'en';

const translated = [
  { data: 'i18n', get: (el) => el.textContent, set: (el, v) => { el.textContent = v; } },
  { data: 'i18nAlt', get: (el) => el.alt, set: (el, v) => { el.alt = v; } },
  { data: 'i18nAria', get: (el) => el.getAttribute('aria-label'), set: (el, v) => el.setAttribute('aria-label', v) },
].map((kind) => ({
  ...kind,
  elements: [...document.querySelectorAll(`[data-${kind.data.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())}]`)],
}));

const langButtons = document.querySelectorAll('.lang button');

function applyLanguage(next) {
  lang = next;
  root.lang = next === 'no' ? 'nb' : 'en';
  document.title = MSG[next].title;

  translated.forEach(({ data, get, set, elements }) => {
    elements.forEach((el) => {
      const key = el.dataset[data];
      if (!(key in EN)) EN[key] = get(el);
      set(el, (next === 'no' && NO[key]) || EN[key]);
    });
  });
  langButtons.forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.lang === next));
  });

  syncFilmLabel();
  brief.querySelectorAll('[aria-invalid]').forEach((input) => setError(input, ''));
  briefStatus.textContent = '';

  try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* storage unavailable */ }
}

langButtons.forEach((b) => {
  b.addEventListener('click', () => {
    if (b.dataset.lang === lang) return;
    if (calm.matches) { applyLanguage(b.dataset.lang); return; }
    document.body.classList.add('is-swapping');
    setTimeout(() => {
      applyLanguage(b.dataset.lang);
      document.body.classList.remove('is-swapping');
    }, 280);
  });
});

// Film

// The film is a set of short stories, one file each (built by tools/build_hero_film.py).
// Every visit plays them in a new random order, then the close, then reshuffles.
// The stories are appended to one another as a single stream, so the cuts between them
// are as clean as the cuts inside them.
const STORIES = ['fjord', 'hike', 'summit', 'arctic'];
const CLOSE = 'close';
const FILM_TYPE = 'video/mp4; codecs="avc1.640028"';
const FILM_AHEAD = 10; // seconds of film to keep loaded ahead of the playhead

const film = document.getElementById('film');
const filmToggle = document.getElementById('filmToggle');
const filmSize = window.matchMedia('(max-width: 800px)').matches ? '720' : '1080';
const storySrc = (story) => `assets/film/heim-${story}-${filmSize}.mp4`;

let filmQueue = [];
let filmLast = null;
let filmOn = false;

function nextStory() {
  if (!filmQueue.length) {
    const pool = [...STORIES];
    while (pool.length) filmQueue.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    // Never open a round on the story that ended the last one.
    if (filmQueue[0] === filmLast) filmQueue.push(filmQueue.shift());
    filmLast = filmQueue[filmQueue.length - 1];
    filmQueue.push(CLOSE);
  }
  return filmQueue.shift();
}

function syncFilmLabel() {
  filmToggle.setAttribute('aria-pressed', String(!filmOn));
  filmToggle.setAttribute('aria-label', filmOn ? MSG[lang].pause : MSG[lang].play);
}

function setFilm(on) {
  filmOn = on;
  if (on) film.play().catch(() => { filmOn = false; syncFilmLabel(); });
  else film.pause();
  syncFilmLabel();
}

// Fallback for browsers that cannot stream: play the files one after another.
// There is a short pause at each cut while the next file starts.
function playStoriesOneByOne(first) {
  film.addEventListener('ended', () => {
    film.src = storySrc(nextStory());
    if (filmOn) film.play().catch(() => {});
  });
  film.src = storySrc(first);
}

function streamStories(Source, first) {
  const source = new Source();
  film.disableRemotePlayback = true; // required by ManagedMediaSource on iPhone
  film.src = URL.createObjectURL(source);

  source.addEventListener('sourceopen', async () => {
    const buffer = source.addSourceBuffer(FILM_TYPE);
    buffer.mode = 'sequence'; // each story starts where the one before it ends
    const settle = () => new Promise((resolve, reject) => {
      buffer.addEventListener('updateend', resolve, { once: true });
      buffer.addEventListener('error', reject, { once: true });
    });
    const ahead = () => (film.buffered.length ? film.buffered.end(film.buffered.length - 1) - film.currentTime : 0);

    try {
      for (let story = first; ; story = nextStory()) {
        while (ahead() > FILM_AHEAD) await new Promise((resolve) => film.addEventListener('timeupdate', resolve, { once: true }));
        const response = await fetch(storySrc(story));
        if (!response.ok) throw new Error(`film: ${response.status}`);
        const reader = response.body.getReader();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer.appendBuffer(value);
          await settle();
        }
        // Drop what has already played, so a long visit does not keep the whole film in memory.
        if (film.currentTime > 30) {
          buffer.remove(0, film.currentTime - 10);
          await settle();
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, { once: true });
}

filmToggle.addEventListener('click', () => setFilm(!filmOn));

{
  const first = nextStory();
  const Source = window.ManagedMediaSource || window.MediaSource;
  film.poster = `assets/film/heim-${first}-poster.jpg`;
  if (Source && Source.isTypeSupported(FILM_TYPE)) streamStories(Source, first);
  else playStoriesOneByOne(first);
  setFilm(!calm.matches);
}

// Brief form: composes an email, never asks for a destination

const brief = document.getElementById('brief');
const briefStatus = document.getElementById('briefStatus');

function setError(input, message) {
  const existing = input.parentElement.querySelector('.field-error');
  if (existing) existing.remove();
  if (!message) {
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    return;
  }
  const note = document.createElement('span');
  note.className = 'field-error';
  note.id = `${input.id}-error`;
  note.textContent = message;
  input.setAttribute('aria-invalid', 'true');
  input.setAttribute('aria-describedby', note.id);
  input.parentElement.append(note);
}

brief.addEventListener('submit', (event) => {
  event.preventDefault();
  const m = MSG[lang];
  const data = Object.fromEntries(new FormData(brief));
  const name = brief.elements.name;
  const occasion = brief.elements.occasion;

  setError(name, data.name.trim() ? '' : m.nameMissing);
  setError(occasion, data.occasion.trim() ? '' : m.occasionMissing);

  const firstInvalid = brief.querySelector('[aria-invalid="true"]');
  if (firstInvalid) {
    briefStatus.textContent = '';
    firstInvalid.focus();
    return;
  }

  const lines = ['name', 'company', 'occasion', 'goal']
    .filter((key) => data[key].trim())
    .map((key) => `${m.labels[key]}: ${data[key].trim()}`);

  briefStatus.textContent = m.opened;
  const link = document.createElement('a');
  link.href = `mailto:${CONTACT_EMAIL}`;
  link.textContent = CONTACT_EMAIL;
  briefStatus.append(link, '.');

  window.location.href = `mailto:${CONTACT_EMAIL}`
    + `?subject=${encodeURIComponent(m.subject)}`
    + `&body=${encodeURIComponent(lines.join('\n\n'))}`;
});

brief.addEventListener('input', (event) => {
  if (event.target.getAttribute('aria-invalid') === 'true' && event.target.value.trim()) {
    setError(event.target, '');
  }
});

// Start in the visitor's language

let saved = null;
try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage unavailable */ }
applyLanguage(saved || (/^(nb|nn|no)\b/i.test(navigator.language || '') ? 'no' : 'en'));

// Arrival: the opening lines, then copy and frames as they are reached

requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-loaded')));

const arriving = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const arrive = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      arrive.unobserve(entry.target);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });
  arriving.forEach((el) => arrive.observe(el));
} else {
  arriving.forEach((el) => el.classList.add('is-in'));
}

// The story photograph only fades up once it has actually arrived

const storyImg = document.getElementById('storyImg');
const storyPhoto = storyImg.querySelector('img');
const showStoryPhoto = () => storyImg.classList.add('is-in');

if (storyPhoto.complete && storyPhoto.naturalWidth) {
  showStoryPhoto();
} else {
  storyPhoto.addEventListener('load', showStoryPhoto);
  storyPhoto.addEventListener('error', showStoryPhoto);
}

// Images travel slower than the page inside their frames

const growFrame = document.getElementById('growFrame');
const drifting = [...document.querySelectorAll('[data-parallax]')].map((img) => ({
  img,
  frame: img.parentElement,
  strength: parseFloat(img.dataset.parallax) || 1,
}));

function syncMotion() {
  if (calm.matches) return;
  const vh = window.innerHeight;
  drifting.forEach(({ img, frame, strength }) => {
    const box = frame.getBoundingClientRect();
    if (box.bottom < -80 || box.top > vh + 80) return;
    const through = clamp((vh - box.top) / (vh + box.height));
    const shift = (through - 0.5) * 2 * 0.1 * box.height * Math.min(strength, 1.1);
    img.style.transform = `translate3d(0,${shift.toFixed(1)}px,0)`;
  });

  const grow = growFrame.getBoundingClientRect();
  if (grow.bottom > 0 && grow.top < vh) {
    growFrame.style.setProperty('--g', easeOut(clamp((vh - grow.top) / (vh * 0.8))).toFixed(4));
  }
}

// Header: clear over the film, solid after it, out of the way while reading down

const head = document.getElementById('siteHead');
const hero = document.querySelector('.hero');
let lastY = window.scrollY;

function syncHead() {
  const y = window.scrollY;
  head.classList.toggle('is-solid', y > hero.offsetHeight - head.offsetHeight);
  // Only a deliberate change of direction moves the header; the last few
  // pixels of an easing scroll must not toggle it.
  if (y < hero.offsetHeight * 0.6) { head.classList.remove('is-away'); lastY = y; }
  else if (y - lastY > 48) { head.classList.add('is-away'); lastY = y; }
  else if (lastY - y > 48) { head.classList.remove('is-away'); lastY = y; }
  else if (head.classList.contains('is-away') ? y > lastY : y < lastY) { lastY = y; }
}

// Scroll work runs at most once per frame

let ticking = false;

function onScrollFrame() {
  ticking = false;
  syncHead();
  syncMotion();
}

window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(onScrollFrame); }
}, { passive: true });
window.addEventListener('resize', syncMotion);
window.addEventListener('load', syncMotion);
onScrollFrame();

// Weighted scrolling on wheel and trackpad; touch stays native

if (window.Lenis && !calm.matches) {
  const lenis = new window.Lenis({ duration: 1.15, anchors: true });
  const tick = (time) => { lenis.raf(time); requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
