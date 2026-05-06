import { photos } from '../data/content'
import { SectionHeading } from '../components/SectionHeading'

const ratioClass = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
} as const

// Deterministic placeholder swatch so each tile has a different cream/ink shade.
const swatch = (key: string) => {
  const palette = [
    'linear-gradient(135deg,#e9dab7,#c9b78b)',
    'linear-gradient(135deg,#1f1f1f,#4a4a4a)',
    'linear-gradient(135deg,#f1e7cf,#d8c79a)',
    'linear-gradient(135deg,#7a7a7a,#1f1f1f)',
    'linear-gradient(135deg,#fbf7ee,#e9dab7)',
    'linear-gradient(135deg,#a16207,#1f1f1f)',
  ]
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0
  return palette[h % palette.length]
}

export function PhotosSection() {
  return (
    <section className="container-prose py-20 md:py-28">
      <SectionHeading id="photos" eyebrow="Photos" title="things I saw" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {photos.map((p) => (
          <figure key={p.src} className="group">
            <div
              className={`${ratioClass[p.ratio ?? 'square']} w-full border border-ink/10`}
              style={{ background: swatch(p.src) }}
              role="img"
              aria-label={p.caption}
            />
            <figcaption className="mt-2 font-mono text-xs text-ink-faint lowercase">
              {p.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
