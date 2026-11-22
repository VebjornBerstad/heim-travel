# Heim Travel

The homepage for Heim Travel, a destination management company in Norway. It is a single static page in English and Norwegian, built to make a corporate client want to start a conversation.

## Running it locally

There is no build step. Serve the folder with any static server, for example:

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Files

| File | What it holds |
| --- | --- |
| `index.html` | The page markup, with the English copy. |
| `styles.css` | All styling, including the motion and the small-screen layout. |
| `script.js` | The Norwegian copy, language switching, the brief form, and scroll motion. |
| `assets/` | The Heim Travel wordmark, the photographs in `assets/photos/`, and the hero film in `assets/film/`. |
| `tools/build_hero_film.py` | The edit of the hero film: which stock clips, in what order, for how long. Needs `ffmpeg` and the clips in `footage/pexels/` (not committed; sources in `assets/film/CREDITS.md`). |

The page loads its fonts from Google Fonts and the [Lenis](https://github.com/darkroomengineering/lenis) smooth-scroll library from jsDelivr.

## Publishing

Every push to `main` publishes the site with GitHub Pages (`.github/workflows/pages.yml`). Only `index.html`, `styles.css`, `script.js` and `assets/` are published.

## Editing the copy

English text lives in `index.html`. Each translatable element has a `data-i18n` key (or `data-i18n-alt` / `data-i18n-aria` for image and label text), and the Norwegian text for that key lives in the `NO` object at the top of `script.js`. When you change or add copy, update both places.

The language is chosen from the visitor's browser on the first visit and remembered after they switch.

## The brief form

The contact form does not send anything to a server. It composes an email in the visitor's own email app, addressed to `CONTACT_EMAIL` at the top of `script.js`.

## Stock material

- The hero film is cut from free stock clips (see `assets/film/CREDITS.md`).
- The four inspiration photographs in `assets/photos/` (`celebrate-table`, `decide-table`, `together-ridge`, `host-table`) and the story photograph (`story-rorbu`) are free stock from Unsplash, saved locally. The eagle photographs are Heim Travel's own and are not currently used on the page.
