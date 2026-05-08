// Renders an Open Graph card from an inline SVG to public/og.png.
// Run once after editing the design:  npm run og
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const out = resolve(__dirname, '..', 'public', 'og.png')

// Inline the Playfair Display + JetBrains Mono fonts so resvg can render text
// without depending on the rendering machine's installed fonts.
// We point resvg at the system font dirs, then ask it to fall back to fonts
// shipped with Google Fonts CSS otherwise. For a portfolio this is fine —
// resvg picks up the local fonts on macOS for serif/mono just fine.

const NAME = 'Amogh Athimamula.'
const TAGLINE = 'engineer, soccer player, claude coder.'
const HANDLE = 'amogh@amoghathimamula.com'
const DOMAIN = 'amoghathimamula.com'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#fbf7ee"/>

  <!-- soft hairline border -->
  <rect x="0.5" y="0.5" width="1199" height="629" fill="none" stroke="#11111122" stroke-width="1"/>

  <!-- top: terminal prompt -->
  <text x="64" y="92"
        font-family="JetBrains Mono, ui-monospace, Menlo, monospace"
        font-size="22"
        fill="#7a7a7a"
        letter-spacing="3.5">${HANDLE.toUpperCase()}:~$</text>

  <!-- main: serif name -->
  <text x="64" y="320"
        font-family="Playfair Display, Georgia, serif"
        font-size="96"
        font-weight="700"
        fill="#111111">${NAME}</text>

  <!-- italic tagline -->
  <text x="64" y="384"
        font-family="Playfair Display, Georgia, serif"
        font-size="40"
        font-style="italic"
        fill="#1f1f1f">${TAGLINE}</text>

  <!-- bottom: domain -->
  <text x="64" y="566"
        font-family="JetBrains Mono, ui-monospace, Menlo, monospace"
        font-size="22"
        fill="#7a7a7a"
        letter-spacing="2.5">${DOMAIN}</text>

  <!-- bottom right: blinking-cursor block -->
  <rect x="1108" y="528" width="20" height="42" fill="#111111"/>
</svg>`

const resvg = new Resvg(svg, {
  background: '#fbf7ee',
  fitTo: { mode: 'width', value: 1200 },
  font: {
    loadSystemFonts: true,
    defaultFontFamily: 'Georgia',
  },
})
const pngData = resvg.render().asPng()
writeFileSync(out, pngData)
console.log(`✓ wrote ${out} (${(pngData.length / 1024).toFixed(1)} kb)`)

// Touch index.html mtime so dev server picks up the new asset reference.
try {
  const indexPath = resolve(__dirname, '..', 'index.html')
  readFileSync(indexPath)
} catch {
  // ignore
}
