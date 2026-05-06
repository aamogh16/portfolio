import { experience } from '../data/content'
import { SectionHeading } from '../components/SectionHeading'

export function ExperienceSection() {
  return (
    <section className="container-prose py-20 md:py-28">
      <SectionHeading id="experience" eyebrow="Experience" title="what I’ve been up to" />
      <ol className="space-y-12">
        {experience.map((job, i) => (
          <li key={i} className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-4 md:gap-10">
            <div className="font-mono text-sm text-ink-muted pt-1">{job.period}</div>
            <div>
              <h3 className="font-serif text-2xl tracking-tight">
                {job.role}{' '}
                <span className="text-ink-muted italic font-normal">@ </span>
                {job.href ? (
                  <a
                    href={job.href}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
                  >
                    {job.company}
                  </a>
                ) : (
                  <span>{job.company}</span>
                )}
              </h3>
              {job.location && (
                <div className="font-mono text-xs text-ink-faint mt-1">{job.location}</div>
              )}
              <ul className="mt-4 space-y-2 text-ink-soft">
                {job.bullets.map((b, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="font-mono text-ink-faint select-none">›</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              {job.stack && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.stack.map((s) => (
                    <span
                      key={s}
                      className="font-mono text-[11px] uppercase tracking-[0.15em] border border-ink/15 px-2 py-1 text-ink-muted"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
