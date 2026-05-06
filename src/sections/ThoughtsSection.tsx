import { thoughts as fallbackThoughts, type Thought } from '../data/content'
import { SectionHeading } from '../components/SectionHeading'
import { useSanityQuery } from '../lib/useSanityQuery'

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

type SanityThought = {
  _id: string
  title: string
  slug: { current: string }
  date: string
  preview: string
}

const QUERY = `*[_type == "thought"] | order(coalesce(order, 9999) asc, date desc) {
  _id, title, slug, date, preview
}`

function normalize(items: SanityThought[] | null): Thought[] | null {
  if (!items) return null
  return items.map((t) => ({
    slug: t.slug.current,
    title: t.title,
    date: t.date,
    preview: t.preview,
  }))
}

export function ThoughtsSection() {
  const { data, loading } = useSanityQuery<SanityThought[]>(QUERY)
  const live = normalize(data)
  // Fall back to placeholder content when Sanity is unconfigured or empty.
  const items = live && live.length > 0 ? live : fallbackThoughts

  return (
    <section className="container-prose py-20 md:py-28">
      <SectionHeading id="thoughts" eyebrow="Thoughts" title="yapping, but written down" />

      {loading ? (
        <SkeletonList />
      ) : (
        <ul className="space-y-10">
          {items.map((t) => (
            <li key={t.slug} className="group">
              <a href={`#${t.slug}`} className="block">
                <div className="font-mono text-xs text-ink-faint">{fmt(t.date)}</div>
                <h3 className="mt-1 font-serif text-3xl tracking-tight group-hover:italic transition-all">
                  {t.title}
                </h3>
                <p className="mt-3 max-w-prose text-ink-soft">{t.preview}</p>
                <div className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint group-hover:text-ink">
                  read more →
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function SkeletonList() {
  return (
    <ul className="space-y-10">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="animate-pulse">
          <div className="h-3 w-24 bg-ink/10" />
          <div className="mt-2 h-8 w-2/3 bg-ink/10" />
          <div className="mt-3 h-4 w-full max-w-prose bg-ink/5" />
          <div className="mt-1 h-4 w-3/4 max-w-prose bg-ink/5" />
        </li>
      ))}
    </ul>
  )
}
