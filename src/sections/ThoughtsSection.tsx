import { thoughts } from '../data/content'
import { SectionHeading } from '../components/SectionHeading'

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

export function ThoughtsSection() {
  return (
    <section className="container-prose py-20 md:py-28">
      <SectionHeading id="thoughts" eyebrow="Thoughts" title="yapping, but written down" />
      <ul className="space-y-10">
        {thoughts.map((t) => (
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
    </section>
  )
}
