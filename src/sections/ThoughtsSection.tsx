import { useState } from 'react'
import type { PortableTextBlock } from '@portabletext/react'
import { thoughts as fallbackThoughts, type Thought } from '../data/content'
import { SectionHeading } from '../components/SectionHeading'
import { ThoughtModal, type ModalThought } from '../components/ThoughtModal'
import { useSanityQuery } from '../lib/useSanityQuery'

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

type SanityThought = {
  _id: string
  title: string
  slug: { current: string }
  date: string
  preview: string
  body?: PortableTextBlock[]
}

const QUERY = `*[_type == "thought"] | order(coalesce(order, 9999) asc, date desc) {
  _id, title, slug, date, preview, body
}`

type DisplayThought = Thought & { _id?: string; portableBody?: PortableTextBlock[] }

function normalize(items: SanityThought[] | null): DisplayThought[] | null {
  if (!items) return null
  return items.map((t) => ({
    _id: t._id,
    slug: t.slug.current,
    title: t.title,
    date: t.date,
    preview: t.preview,
    portableBody: t.body,
  }))
}

export function ThoughtsSection() {
  const { data, loading } = useSanityQuery<SanityThought[]>(QUERY)
  const live = normalize(data)
  const items: DisplayThought[] = live && live.length > 0 ? live : fallbackThoughts

  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const activeIndex = openSlug ? items.findIndex((t) => t.slug === openSlug) : -1
  const active = activeIndex >= 0 ? items[activeIndex] : null

  const modalThought: ModalThought | null = active
    ? {
        slug: active.slug,
        title: active.title,
        date: active.date,
        preview: active.preview,
        body: active.portableBody ?? active.body,
      }
    : null

  const goPrev =
    activeIndex > 0 ? () => setOpenSlug(items[activeIndex - 1].slug) : undefined
  const goNext =
    activeIndex >= 0 && activeIndex < items.length - 1
      ? () => setOpenSlug(items[activeIndex + 1].slug)
      : undefined

  return (
    <section className="container-prose py-20 md:py-28">
      <SectionHeading id="thoughts" eyebrow="Thoughts" title="yapping, but written down" />

      {loading ? (
        <SkeletonList />
      ) : (
        <ul className="space-y-10">
          {items.map((t) => (
            <li key={t.slug} className="group">
              <button
                type="button"
                onClick={() => setOpenSlug(t.slug)}
                className="w-full text-left"
              >
                <div className="font-mono text-xs text-ink-faint">{fmt(t.date)}</div>
                <h3 className="mt-1 font-serif text-3xl tracking-tight group-hover:italic transition-all">
                  {t.title}
                </h3>
                <p className="mt-3 max-w-prose text-ink-soft">{t.preview}</p>
                <div className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint group-hover:text-ink">
                  read more →
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <ThoughtModal
        open={openSlug !== null}
        thought={modalThought}
        onClose={() => setOpenSlug(null)}
        onPrev={goPrev}
        onNext={goNext}
      />
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
