# portfolio

Personal site. Vite + React + TypeScript + Tailwind. Cream and ink, serif (Playfair Display), with a working terminal modal you can drive with real commands.

## dev

```sh
npm install
npm run dev
```

## build

```sh
npm run build
npm run preview
```

## terminal

Open with the `terminal` button, the `` ` `` key, or `⌘K` / `Ctrl+K`. Try:

```
help
ls
cd projects
cat about.md
open thoughts/serif-on-the-web.md
goto experience
```

Tab completes paths and command names. ↑/↓ scroll history. Esc closes.

## structure

```
src/
  App.tsx                    # one-page layout + global hotkeys
  components/                # nav, hero, footer, section heading
  sections/                  # about, experience, projects, thoughts, photos
  data/                      # site config + placeholder content
  lib/                       # sanity client + query hook
  terminal/                  # virtual filesystem + command runner + modal
schemas/                     # sanity schema types (thought, photo)
sanity.config.ts             # studio config
```

## content (sanity studio)

Thoughts and photos live in Sanity. About / experience / projects stay in `src/data/content.ts`.

```sh
npm install
cp .env.example .env.local      # already created locally; safe to recreate
npm run studio                  # opens http://localhost:3333
```

Log in with the Sanity account you used to create the project, then add thoughts and photos. The site picks up changes on next refresh (CDN-cached, ~seconds).

To deploy the studio publicly so you can edit from anywhere:

```sh
npm run studio:deploy
```

It'll prompt for a hostname (e.g. `amogh-portfolio` → `amogh-portfolio.sanity.studio`).

If a section has no entries, the site falls back to the placeholder data in `src/data/content.ts` so it never looks empty.

## deploy

Pushes to `main` deploy via Vercel. `vercel.json` is already set up for SPA rewrites.

In Vercel **Project → Settings → Environment Variables**, add (Production + Preview + Development):

```
VITE_SANITY_PROJECT_ID=8jqyl8cp
VITE_SANITY_DATASET=production
```

In Sanity **Manage → API → CORS Origins**, add:

```
http://localhost:5173
https://<your-vercel-domain>
```
