import { useState } from 'react'
import { projects } from '../data/content'
import { SectionHeading } from '../components/SectionHeading'
import { ProjectModal } from '../components/ProjectModal'

export function ProjectsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const active = openIndex !== null ? projects[openIndex] : null
  const goPrev = openIndex !== null && openIndex > 0 ? () => setOpenIndex(openIndex - 1) : undefined
  const goNext =
    openIndex !== null && openIndex < projects.length - 1
      ? () => setOpenIndex(openIndex + 1)
      : undefined

  return (
    <section className="container-prose py-20 md:py-28">
      <SectionHeading id="projects" eyebrow="Projects" title="things I made" />
      <ul className="divide-y divide-ink/10 border-y border-ink/10">
        {projects.map((p, i) => (
          <li key={p.name}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="grid grid-cols-1 md:grid-cols-[6rem_minmax(0,1fr)_minmax(0,14rem)] gap-4 md:gap-8 py-6 items-baseline w-full text-left hover:bg-cream-100/50 -mx-2 px-2 transition-colors"
            >
              <div className="font-mono text-sm text-ink-muted">{p.year}</div>
              <div>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h3 className="font-serif text-2xl tracking-tight group-hover:italic">
                    {p.name}
                  </h3>
                </div>
                <p className="mt-2 text-ink-soft max-w-prose">{p.blurb}</p>
              </div>
              {p.stack && (
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="font-mono text-[11px] uppercase tracking-[0.15em] border border-ink/15 px-2 py-1 text-ink-muted"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </button>
          </li>
        ))}
      </ul>

      <ProjectModal
        open={openIndex !== null}
        project={active}
        onClose={() => setOpenIndex(null)}
        onPrev={goPrev}
        onNext={goNext}
      />
    </section>
  )
}
