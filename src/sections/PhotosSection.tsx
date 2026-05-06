import { photos as fallbackPhotos } from '../data/content'
import { SectionHeading } from '../components/SectionHeading'
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

export function PhotosSection() {
  const { data, loading } = useSanityQuery<SanityPhoto[]>(QUERY)
  const livePhotos = data ?? []
  const useLive = sanityEnabled && livePhotos.length > 0

  return (
    <section className="container-prose py-20 md:py-28">
      <SectionHeading id="photos" eyebrow="Photos" title="things I saw" />

      {loading ? (
        <Grid>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square w-full bg-ink/10 animate-pulse" />
          ))}
        </Grid>
      ) : useLive ? (
        <Grid>
          {livePhotos.map((p) => (
            <figure key={p._id} className="group">
              <img
                src={urlFor(p.image).width(1000).fit('max').auto('format').url()}
                alt={p.caption}
                loading="lazy"
                className={`${ratioClass[p.ratio ?? 'square']} w-full object-cover border border-ink/10`}
              />
              <figcaption className="mt-2 font-mono text-xs text-ink-faint lowercase">
                {p.caption}
              </figcaption>
            </figure>
          ))}
        </Grid>
      ) : (
        <Grid>
          {fallbackPhotos.map((p) => (
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
        </Grid>
      )}
    </section>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">{children}</div>
  )
}
