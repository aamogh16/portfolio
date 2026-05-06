import { projects } from '../data/content'
import { SectionHeading } from '../components/SectionHeading'

export function ProjectsSection() {
  return (
    <section className="container-prose py-20 md:py-28">
      <SectionHeading id="projects" eyebrow="Projects" title="things I made" />
      <ul className="divide-y divide-ink/10 border-y border-ink/10">
        {projects.map((p) => (
          <li key={p.name} className="grid grid-cols-1 md:grid-cols-[8rem_1fr_auto] gap-4 md:gap-8 py-6 items-baseline">
            <div className="font-mono text-sm text-ink-muted">{p.year}</div>
            <div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <h3 className="font-serif text-2xl tracking-tight">
                  {p.href ? (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
                    >
                      {p.name}
                    </a>
                  ) : (
                    p.name
                  )}
                </h3>
                {p.repo && (
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint hover:text-ink"
                  >
                    repo ↗
                  </a>
                )}
              </div>
              <p className="mt-2 text-ink-soft max-w-prose">{p.blurb}</p>
            </div>
            {p.stack && (
              <div className="flex flex-wrap gap-1.5 md:justify-end">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
