# portfolio

Source for [amoghathimamula.com](https://amoghathimamula.com). Built with Vite + React + TypeScript + Tailwind. Cream and ink palette, Playfair Display serif, warm dark mode, and a working terminal you can drive with real commands.

## terminal

Open with the `>_` button, the `` ` `` key, or `⌘K` / `Ctrl+K`. Try:

```
help
ls
cd projects
cat about.md
open thoughts/serif-on-the-web.md
goto experience
theme dark
```

Tab completes paths and command names. ↑/↓ scroll history. Esc closes.

## stack

- **Vite + React + TypeScript** — single-page app
- **Tailwind CSS** — CSS variable tokens for light/dark theming
- **Sanity CMS** — thoughts and photos managed via Studio
- **Vercel** — deploys on push to `main`

## structure

```
src/
  App.tsx                    # one-page layout + global hotkeys
  components/                # nav, hero, footer, section heading
  sections/                  # about, experience, projects, thoughts, photos
  data/                      # site config + content
  lib/                       # sanity client + query hook
  terminal/                  # virtual filesystem + command runner + modal
schemas/                     # sanity schema types (thought, photo)
scripts/og.mjs               # generates public/og.png from SVG
```
