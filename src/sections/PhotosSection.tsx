import { useState } from 'react'
import { photos as fallbackPhotos } from '../data/content'
import { SectionHeading } from '../components/SectionHeading'
import { PhotoModal, type ModalPhoto } from '../components/PhotoModal'
import { useSanityQuery } from '../lib/useSanityQuery'
import { sanityEnabled, urlFor } from '../lib/sanity'

const ratioClass = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
} as const

type Ratio = keyof typeof ratioClass

type SanityPhoto = {
  _id: string
  caption: string
  ratio?: Ratio
  takenAt?: string
  image: { asset: { _ref: string }; hotspot?: unknown; crop?: unknown }
}

const QUERY = `*[_type == "photo" && defined(image)] | order(coalesce(order, 9999) asc, takenAt desc) {
  _id, caption, ratio, takenAt, image
}`

const swatchPalette = [
  'linear-gradient(135deg,#e9dab7,#c9b78b)',
  'linear-gradient(135deg,#1f1f1f,#4a4a4a)',
  'linear-gradient(135deg,#f1e7cf,#d8c79a)',
  'linear-gradient(135deg,#7a7a7a,#1f1f1f)',
  'linear-gradient(135deg,#fbf7ee,#e9dab7)',
  'linear-gradient(135deg,#a16207,#1f1f1f)',
]

const swatch = (key: string) => {
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0
  return swatchPalette[h % swatchPalette.length]
}

type Tile = ModalPhoto & { thumbSrc: string | null }

export function PhotosSection() {
  const { data, loading } = useSanityQuery<SanityPhoto[]>(QUERY)
  const livePhotos = data ?? []
  const useLive = sanityEnabled && livePhotos.length > 0

  const tiles: Tile[] = useLive
    ? livePhotos.map((p, i) => ({
        filename: `${String(i + 1).padStart(2, '0')}-${slugCaption(p.caption)}.jpg`,
        caption: p.caption,
        takenAt: p.takenAt,
        ratio: p.ratio ?? 'square',
        src: urlFor(p.image).width(2000).fit('max').auto('format').url(),
        thumbSrc: urlFor(p.image).width(900).fit('max').auto('format').url(),
      }))
    : fallbackPhotos.map((p, i) => ({
        filename: `${String(i + 1).padStart(2, '0')}-${slugCaption(p.caption)}.jpg`,
        caption: p.caption,
        ratio: (p.ratio ?? 'square') as Ratio,
        src: null,
        swatchBg: swatch(p.src),
        thumbSrc: null,
      }))

  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const active = openIndex !== null ? tiles[openIndex] : null
  const goPrev = openIndex !== null && openIndex > 0 ? () => setOpenIndex(openIndex - 1) : undefined
  const goNext =
    openIndex !== null && openIndex < tiles.length - 1
      ? () => setOpenIndex(openIndex + 1)
      : undefined

  return (
    <section className="container-prose py-20 md:py-28">
      <SectionHeading id="photos" eyebrow="Photos" title="things I saw" />

      {loading ? (
        <Masonry>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="mb-3 md:mb-4 aspect-square w-full bg-ink/10 animate-pulse"
            />
          ))}
        </Masonry>
      ) : (
        <Masonry>
          {tiles.map((p, i) => (
            <figure
              key={p.filename}
              className="group mb-3 md:mb-4 break-inside-avoid"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                className="block w-full"
                aria-label={`Open photo: ${p.caption}`}
              >
                {p.thumbSrc ? (
                  <img
                    src={p.thumbSrc}
                    alt={p.caption}
                    loading="lazy"
                    className={`${ratioClass[p.ratio ?? 'square']} w-full object-cover border border-ink/10 group-hover:opacity-90 transition-opacity`}
                  />
                ) : (
                  <div
                    className={`${ratioClass[p.ratio ?? 'square']} w-full border border-ink/10 group-hover:opacity-90 transition-opacity`}
                    style={{ background: p.swatchBg }}
                    role="img"
                    aria-label={p.caption}
                  />
                )}
              </button>
              <figcaption className="mt-2 font-mono text-xs text-ink-faint lowercase">
                {p.caption}
              </figcaption>
            </figure>
          ))}
        </Masonry>
      )}

      <PhotoModal
        open={openIndex !== null}
        photo={active}
        onClose={() => setOpenIndex(null)}
        onPrev={goPrev}
        onNext={goNext}
      />
    </section>
  )
}

function Masonry({ children }: { children: React.ReactNode }) {
  // CSS columns: tiles flow top-to-bottom, then wrap to next column.
  // Children must use break-inside-avoid + bottom margin to space cleanly.
  return (
    <div className="columns-2 md:columns-3 gap-3 md:gap-4 [&>*]:break-inside-avoid">
      {children}
    </div>
  )
}

function slugCaption(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24)
}
