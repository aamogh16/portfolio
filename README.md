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
  data/                      # site config + placeholder content (edit this!)
  terminal/                  # virtual filesystem + command runner + modal
```

## deploy

Pushes to `main` deploy via Vercel. `vercel.json` is already set up for SPA rewrites.
