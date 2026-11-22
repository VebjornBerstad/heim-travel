# Heim Travel

The homepage for Heim Travel, a destination management company in Norway: a single static page in English and Norwegian.

Live at **<https://heimtravel.no>**, served by GitHub Pages from this repository.

## Publishing

Every push to `main` publishes the site. The workflow in `.github/workflows/pages.yml` collects the page files and hands them to GitHub Pages; it usually takes about a minute. Progress and failures show under the repository's **Actions** tab, and a deploy can be re-run from there.

Only these are published:

- `index.html`
- `styles.css`
- `script.js`
- `assets/`

Everything else in the repository (this README, `tools/`) stays off the site. A new top-level file or folder that the page needs must be added to the copy step in the workflow.

### Domain

The custom domain is set under **Settings → Pages** in this repository, with HTTPS enforced. GitHub issues and renews the certificate.

DNS is managed at Domeneshop:

| Name | Type | Value |
| --- | --- | --- |
| `@` | A | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| `www` | CNAME | `vebjornberstad.github.io` |

`www.heimtravel.no` redirects to `heimtravel.no`. The other records on the domain belong to email and are not related to the site.

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
| `assets/` | The Heim Travel wordmark and icons, the photographs in `assets/photos/`, and the hero film in `assets/film/`. |
| `tools/build_hero_film.py` | The edit of the hero film: which clips, in what order, for how long. Needs `ffmpeg` and the source clips in `footage/` (not in the repository; sources in `assets/film/CREDITS.md`). |

The page loads its fonts from Google Fonts and the [Lenis](https://github.com/darkroomengineering/lenis) smooth-scroll library from jsDelivr.

## Editing the copy

English text lives in `index.html`. Each translatable element has a `data-i18n` key (or `data-i18n-alt` / `data-i18n-aria` for image and label text), and the Norwegian text for that key lives in the `NO` object at the top of `script.js`. When you change or add copy, update both places.

The language is chosen from the visitor's browser on the first visit and remembered after they switch.

## The brief form

GitHub Pages serves static files only, so the contact form does not send anything to a server. It composes an email in the visitor's own email app, addressed to `CONTACT_EMAIL` at the top of `script.js`.

## Stock material

- The hero film is cut from free stock clips (see `assets/film/CREDITS.md`).
- The four inspiration photographs in `assets/photos/` (`celebrate-table`, `decide-table`, `together-ridge`, `host-table`) and the story photograph (`story-rorbu`) are free stock from Unsplash, saved locally. The eagle photographs are Heim Travel's own and are not currently used on the page.
